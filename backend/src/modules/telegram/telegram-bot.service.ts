import { createHash, timingSafeEqual } from 'crypto';
import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../redis/redis.constants';

const API_URL = 'https://api.telegram.org';
/** Seconds Telegram holds a getUpdates call open waiting for messages. */
const POLL_TIMEOUT = 25;
const RETRY_DELAY_MS = 5_000;
/** Consecutive failures before it's logged as an error (and alerted). */
const FAILURES_BEFORE_ERROR = 5;
/** Where Telegram sends updates in webhook mode (the site passes them on). */
const WEBHOOK_PATH = '/api/telegram';
/** Telegram retries an update for about a day; seen IDs are kept that long. */
const SEEN_UPDATE_TTL_SECONDS = 24 * 60 * 60;

const digest = (value: string) => createHash('sha256').update(value).digest();

/**
 * Undici reports every network error as just "fetch failed" and keeps the
 * real reason (ECONNRESET, ETIMEDOUT, ENOTFOUND...) in `cause`.
 */
function describe(err: unknown): string {
  const { message, cause } = err as Error & {
    cause?: { code?: string; message?: string };
  };
  const reason = cause?.code ?? cause?.message;
  return reason ? `${message} (${reason})` : message;
}

interface BotResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
}

/** The parts of Telegram's Update the login uses. */
export interface TelegramUpdate {
  update_id: number;
  message?: {
    chat: { id: number; type: string };
    from?: { id: number; language_code?: string };
    text?: string;
    contact?: { phone_number: string; user_id?: number };
  };
}

export type ReplyMarkup =
  | {
      keyboard: { text: string; request_contact?: boolean }[][];
      resize_keyboard?: boolean;
      one_time_keyboard?: boolean;
    }
  | { remove_keyboard: true };

/**
 * The site's Telegram bot (TELEGRAM_BOT_TOKEN), through the Bot API.
 *
 * With TELEGRAM_WEBHOOK_SECRET (production), Telegram posts each new message
 * to SITE_URL/api/telegram, which the site passes to `receive`; any number of
 * API instances can serve them. Without it (development), it fetches them by
 * long polling, which needs no public address but works on only one instance
 * per bot (Telegram refuses a second one).
 */
@Injectable()
export class TelegramBotService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(TelegramBotService.name);
  private readonly token?: string;
  private readonly webhookSecret?: string;
  private readonly webhookUrl: string;
  private readonly stop = new AbortController();
  private handler?: (update: TelegramUpdate) => Promise<void>;
  private username?: string;

  constructor(
    config: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {
    this.token = config.get<string>('telegram.botToken');
    this.webhookSecret = config.get<string>('telegram.webhookSecret');
    this.webhookUrl = new URL(
      WEBHOOK_PATH,
      config.getOrThrow<string>('siteUrl'),
    ).toString();
  }

  get enabled() {
    return !!this.token;
  }

  /** The bot's t.me link, with a /start parameter. */
  startLink(parameter: string) {
    if (!this.username) {
      throw new ServiceUnavailableException('Telegram bot is not ready');
    }
    return `https://t.me/${this.username}?start=${parameter}`;
  }

  /** Receives every new message. Errors are logged, not retried. */
  onUpdate(handler: (update: TelegramUpdate) => Promise<void>) {
    this.handler = handler;
  }

  async sendMessage(
    chatId: number | string,
    text: string,
    markup?: ReplyMarkup,
  ) {
    await this.call('sendMessage', {
      chat_id: chatId,
      text,
      ...(markup && { reply_markup: markup }),
    });
  }

  /**
   * A message the site sends on its own (not a reply): best effort, so it
   * never fails the caller. Telegram refuses it if the user blocked the bot
   * or never opened it; that's logged and dropped. Does nothing without a
   * bot (development).
   */
  async notify(chatId: number | string, text: string) {
    if (!this.token) {
      this.logger.debug(`[dev] Would send to ${chatId}: ${text}`);
      return false;
    }
    try {
      await this.sendMessage(chatId, text);
      return true;
    } catch (err) {
      this.logger.warn(
        `Notifying Telegram chat ${chatId} failed: ${(err as Error).message}`,
      );
      return false;
    }
  }

  /**
   * An update Telegram posted to the webhook, with the secret it was given
   * (X-Telegram-Bot-Api-Secret-Token). False if the secret is wrong. Handled
   * in the background: Telegram resends an update it doesn't get an answer
   * to quickly, and one it already sent is skipped.
   */
  async receive(update: TelegramUpdate, secret?: string) {
    if (!this.token || !this.webhookSecret || typeof secret !== 'string') {
      return false;
    }
    // Fixed-length digests, so the comparison can't leak the secret's length.
    if (!timingSafeEqual(digest(secret), digest(this.webhookSecret))) {
      return false;
    }
    if (!Number.isSafeInteger(update?.update_id)) return true;

    const first = await this.redis.set(
      `telegram:update:${update.update_id}`,
      '1',
      'EX',
      SEEN_UPDATE_TTL_SECONDS,
      'NX',
    );
    if (first) void this.handle(update);
    return true;
  }

  onApplicationBootstrap() {
    if (!this.token) return;
    if (this.webhookSecret) void this.setWebhook();
    else void this.poll();
  }

  onApplicationShutdown() {
    this.stop.abort();
  }

  private async handle(update: TelegramUpdate) {
    await this.handler?.(update).catch((err: Error) =>
      this.logger.error(`Handling an update failed`, err.stack),
    );
  }

  /** Points Telegram at the webhook, retrying until it's done. */
  private async setWebhook() {
    let failures = 0;
    while (!this.stop.signal.aborted) {
      try {
        this.username ??= (
          await this.call<{ username: string }>('getMe')
        ).username;
        // Every instance sets the same webhook, so it doesn't matter which
        // starts first; updates sent while none was running still arrive.
        await this.call('setWebhook', {
          url: this.webhookUrl,
          secret_token: this.webhookSecret,
          allowed_updates: ['message'],
        });
        this.logger.log(`Webhook for @${this.username}: ${this.webhookUrl}`);
        return;
      } catch (err) {
        if (this.stop.signal.aborted) return;
        failures++;
        const message = `Setting the Telegram webhook failed (${failures}x): ${describe(err)}`;
        if (failures === FAILURES_BEFORE_ERROR) this.logger.error(message);
        else this.logger.warn(message);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  private async poll() {
    let offset = 0;
    let failures = 0;
    while (!this.stop.signal.aborted) {
      try {
        if (!this.username) {
          this.username = (
            await this.call<{ username: string }>('getMe')
          ).username;
          // Long polling doesn't work while a webhook is set.
          await this.call('deleteWebhook');
          this.logger.log(`Polling as @${this.username}`);
        }
        const updates = await this.call<TelegramUpdate[]>(
          'getUpdates',
          { offset, timeout: POLL_TIMEOUT, allowed_updates: ['message'] },
          (POLL_TIMEOUT + 10) * 1000,
        );
        failures = 0;
        for (const update of updates) {
          offset = update.update_id + 1;
          await this.handle(update);
        }
      } catch (err) {
        if (this.stop.signal.aborted) break;
        failures++;
        const message = `Telegram polling failed (${failures}x): ${describe(err)}`;
        if (failures === FAILURES_BEFORE_ERROR) this.logger.error(message);
        else this.logger.warn(message);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  private async call<T = unknown>(
    method: string,
    body: object = {},
    timeoutMs = 10_000,
  ): Promise<T> {
    const res = await fetch(`${API_URL}/bot${this.token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.any([
        this.stop.signal,
        AbortSignal.timeout(timeoutMs),
      ]),
    });
    const data = (await res.json()) as BotResponse<T>;
    if (!data.ok) {
      throw new Error(`${method}: ${data.description ?? res.status}`);
    }
    return data.result as T;
  }
}
