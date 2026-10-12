import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Params } from 'nestjs-pino';
import pino, { type DestinationStream } from 'pino';
import type { Options } from 'pino-http';
import type { JwtPayload } from '../../modules/auth/auth.types';
import {
  internalClientReader,
  REQUEST_ID_HEADER,
} from '../http/internal-client';
import { telegramAlertStream } from './telegram-alerts';

type Req = IncomingMessage & { id?: string; user?: JwtPayload };

/**
 * Logging. Production: one JSON line per event on stdout (Docker keeps
 * them), errors also to a Telegram chat when ALERT_TELEGRAM_* are set.
 * Development: readable single lines.
 *
 * One line per request: method, path (no query string), status, time, user
 * and visitor IP, under the request ID Next.js passed along. Headers and
 * bodies are never logged: they hold tokens, cookies, names and card numbers.
 */
export function loggerConfig(config: ConfigService): Params {
  const production = config.get<string>('nodeEnv') === 'production';
  const level = config.get<string>('logLevel') ?? 'info';
  const fromNextServer = internalClientReader(
    config.get<string>('internalApiSecret'),
  );

  const options: Options<Req, ServerResponse> = {
    level,
    base: production ? { service: 'api' } : undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
    // Logs inside a request carry its ID only, not the whole request.
    quietReqLogger: true,
    genReqId: (req, res) => {
      const id = fromNextServer(req).requestId ?? randomUUID();
      res.setHeader(REQUEST_ID_HEADER, id);
      return id;
    },
    autoLogging: { ignore: (req) => req.url === '/health' },
    customLogLevel: (_req, res, err) =>
      err || res.statusCode >= 500 ? 'error' : 'info',
    customSuccessMessage: (req, res, ms) =>
      `${req.method} ${pathOf(req.url)} ${res.statusCode} ${Math.round(ms)}ms`,
    customErrorMessage: (req, res) =>
      `${req.method} ${pathOf(req.url)} ${res.statusCode}`,
    // pino-http makes up an error for 5xx responses; the real one is
    // logged with its stack by AllExceptionsFilter.
    customErrorObject: (_req, _res, _err, line: object) => ({
      ...line,
      err: undefined,
    }),
    // Read when the response is done, so the user (set by the auth guard)
    // is known by then.
    customProps: (req) => ({
      userId: req.user?.sub,
      ip: fromNextServer(req).clientIp,
    }),
    serializers: {
      // The ID is already on every line as reqId.
      req: (req: { method: string; url: string }) => ({
        method: req.method,
        path: pathOf(req.url),
      }),
      res: (res: { statusCode: number }) => ({ statusCode: res.statusCode }),
    },
    ...(!production && {
      transport: {
        target: 'pino-pretty',
        options: {
          singleLine: true,
          translateTime: 'SYS:HH:MM:ss',
          ignore: 'pid,hostname,req,res,responseTime',
        },
      },
    }),
  };

  const alerts = alertStream(config);
  return {
    pinoHttp: alerts
      ? [
          options,
          pino.multistream([
            { level, stream: process.stdout },
            { level: 'error', stream: alerts },
          ]),
        ]
      : options,
  };
}

function alertStream(config: ConfigService): DestinationStream | undefined {
  const botToken = config.get<string>('alerts.telegramBotToken');
  const chatId = config.get<string>('alerts.telegramChatId');
  // Pretty output in development goes through a worker, not a stream.
  if (!botToken || !chatId || config.get('nodeEnv') !== 'production') {
    return undefined;
  }
  const site = new URL(config.get<string>('siteUrl')!).host;
  return telegramAlertStream({ botToken, chatId, source: `${site} api` });
}

/** The path without its query string (searches can hold names). */
function pathOf(url = '') {
  const end = url.indexOf('?');
  return end === -1 ? url : url.slice(0, end);
}
