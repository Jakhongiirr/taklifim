import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ApiError } from './api-response';

type ErrorBody = Pick<ApiError['error'], 'code' | 'message' | 'details'>;

/** Turns every thrown error into the standard `ApiError` body. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const statusCode = statusOf(exception);
    const body =
      exception instanceof HttpException
        ? fromHttpException(exception, statusCode)
        : fromUnknown(exception, statusCode);

    if (statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.originalUrl} -> ${statusCode}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }
    if (response.headersSent) return;

    const payload: ApiError = {
      success: false,
      error: { statusCode, ...body },
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    };
    response.status(statusCode).json(payload);
  }
}

function statusOf(exception: unknown): number {
  if (exception instanceof HttpException) return exception.getStatus();
  // Errors raised by Express middleware (e.g. malformed JSON from body-parser).
  const status = (exception as { status?: unknown } | null)?.status;
  return typeof status === 'number' && status >= 400 && status < 600
    ? status
    : HttpStatus.INTERNAL_SERVER_ERROR;
}

function codeOf(statusCode: number): string {
  const name: string | undefined = HttpStatus[statusCode];
  return name ?? 'ERROR';
}

function fromHttpException(
  exception: HttpException,
  statusCode: number,
): ErrorBody {
  const res = exception.getResponse();
  if (typeof res === 'string') {
    return { code: codeOf(statusCode), message: res };
  }

  // Nest's default body is `{ statusCode, message, error: 'Not Found' }`;
  // anything else (e.g. `retryAfter`, Terminus' failed checks) is extra.
  const { message, error, ...rest } = res as Record<string, unknown>;
  const extra = Object.fromEntries(
    Object.entries({ ...rest, error }).filter(
      ([key, value]) =>
        key !== 'statusCode' &&
        value !== undefined &&
        typeof value !== 'string',
    ),
  );

  // ValidationPipe: one message per invalid field.
  if (Array.isArray(message)) {
    return {
      code: 'VALIDATION_FAILED',
      message: 'Validation failed',
      details: message,
    };
  }
  return {
    code: codeOf(statusCode),
    message:
      typeof message === 'string'
        ? message
        : typeof error === 'string'
          ? error
          : defaultMessage(statusCode),
    ...(Object.keys(extra).length && { details: extra }),
  };
}

function fromUnknown(exception: unknown, statusCode: number): ErrorBody {
  if (statusCode >= 500) {
    // Never leak internals.
    return { code: codeOf(statusCode), message: 'Internal server error' };
  }
  const message = exception instanceof Error ? exception.message : undefined;
  return {
    code: codeOf(statusCode),
    message: message || defaultMessage(statusCode),
  };
}

/** NOT_FOUND -> "Not found" */
function defaultMessage(statusCode: number): string {
  const words = codeOf(statusCode).toLowerCase().replaceAll('_', ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}
