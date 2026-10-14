import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import Redis from 'ioredis';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { maskPhone } from '../../common/logging/mask-phone';
import { REDIS_CLIENT } from '../../redis/redis.constants';
import {
  TelegramBotService,
  type TelegramUpdate,
} from '../telegram/telegram-bot.service';
import { AuthService } from './auth.service';
import { BOT_LOCALES, BOT_MESSAGES, type BotLocale } from './bot-messages';

/** Seconds a login link stays usable. */
const LOGIN_TTL = 300;

const loginKey = (token: string) => `auth:tg:${token}`;
/** Which login a Telegram user is in the middle of (between /start and contact). */
const userKey = (telegramUserId: number) => `auth:tg:user:${telegramUserId}`;
const hash = (value: string) => createHash('sha256').update(value).digest();

/** A login in Redis (a hash). */
interface PendingLogin {
  secret: string;
  locale: BotLocale;
  /** The Telegram user who opened the link (the first one to). */
  telegramUserId?: string;
  /** Set once that user shared their own number. */
  phone?: string;
}

/**
 * Logging in through the site's Telegram bot, for free:
 *
 * 1. The site calls start(): a one-time token (in the bot link) and a secret
 *    (kept by the browser, never in the link).
 * 2. The user opens t.me/<bot>?start=<token>; the bot asks for their number
 *    with Telegram's "share contact" button.
 * 3. The bot accepts only the sender's own contact: Telegram has verified
 *    that number, so it proves the user owns it.
 * 4. The site polls check() with token + secret until the number is in, and
 *    gets a session for the account with that number (created if new).
 */
@Injectable()
export class TelegramLoginService implements OnModuleInit {
  private readonly logger = new Logger(TelegramLoginService.name);
  private readonly site: string;
  private readonly siteUrl: string;
  private readonly devMode: boolean;

  constructor(
    private readonly bot: TelegramBotService,
    private readonly auth: AuthService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    config: ConfigService,
  ) {
    this.siteUrl = config.getOrThrow<string>('siteUrl');
    this.site = new URL(this.siteUrl).host;
    this.devMode =
      config.get<string>('nodeEnv') !== 'production' && !this.bot.enabled;
  }

  onModuleInit() {
    this.bot.onUpdate((update) => this.handleUpdate(update));
  }

  async start(locale: BotLocale) {
    const token = randomBytes(24).toString('base64url');
    const secret = randomBytes(32).toString('base64url');
    const login: PendingLogin = {
      secret: hash(secret).toString('hex'),
      locale,
    };
    await this.redis
      .multi()
      .hset(loginKey(token), login)
      .expire(loginKey(token), LOGIN_TTL)
      .exec();

    let url: string;
    if (this.devMode) {
      this.logger.warn(
        `[dev] TELEGRAM_BOT_TOKEN not set. Confirm login ${token} with: ` +
          `curl -X POST localhost:3000/auth/telegram/dev-confirm -H 'Content-Type: application/json' ` +
          `-d '{"token":"${token}","phone":"+998901234567"}'`,
      );
      url = `https://t.me/dev_bot?start=${token}`;
    } else {
      url = this.bot.startLink(token);
    }
    return { token, secret, url, expiresIn: LOGIN_TTL };
  }

  /**
   * "pending" until the number is shared, then logs in once: the login is
   * used up, so a second check finds it gone ("expired").
   */
  async check(token: string, secret: string) {
    const login = await this.find(token);
    if (!login) return { status: 'expired' as const };
    if (!timingSafeEqual(Buffer.from(login.secret, 'hex'), hash(secret))) {
      throw new BadRequestException('Invalid login');
    }
    if (!login.phone) return { status: 'pending' as const };

    // Only one check can use it.
    if (!(await this.redis.del(loginKey(token)))) {
      return { status: 'expired' as const };
    }
    return {
      status: 'done' as const,
      ...(await this.auth.loginWithPhone(login.phone)),
    };
  }

  /** Development without a bot: confirms a login as if the bot had. */
  async devConfirm(token: string, phone: string) {
    if (!this.devMode) throw new NotFoundException();
    if (!(await this.find(token))) throw new NotFoundException('No such login');
    await this.redis.hset(loginKey(token), { phone });
  }

  private async handleUpdate(update: TelegramUpdate) {
    const message = update.message;
    // Private chats only: a contact shared in a group isn't proof of anything.
    if (!message?.from || message.chat.type !== 'private') return;
    const from = message.from.id;
    const chat = message.chat.id;

    const language = this.localeOf(message.from.language_code);
    if (message.contact) {
      return this.onContact(chat, from, message.contact, language);
    }

    const token = /^\/start(?:\s+([\w-]+))?/.exec(message.text ?? '')?.[1];
    if (!token) return this.reply(chat, language, 'welcome');
    const login = await this.find(token);
    if (!login) return this.reply(chat, language, 'expired');
    if (login.telegramUserId && login.telegramUserId !== String(from)) {
      return this.reply(chat, login.locale, 'otherAccount');
    }
    if (login.phone) return this.done(chat, login.locale);

    await this.redis
      .multi()
      .hset(loginKey(token), { telegramUserId: String(from) })
      .set(userKey(from), token, 'EX', LOGIN_TTL)
      .exec();
    const text = BOT_MESSAGES[login.locale];
    await this.bot.sendMessage(chat, this.fill(text.askContact), {
      keyboard: [[{ text: text.shareButton, request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    });
  }

  private async onContact(
    chat: number,
    from: number,
    contact: { phone_number: string; user_id?: number },
    language: BotLocale,
  ) {
    const token = await this.redis.get(userKey(from));
    const login = token ? await this.find(token) : undefined;
    if (!token || !login || login.telegramUserId !== String(from)) {
      return this.reply(chat, language, 'expired', true);
    }
    // A forwarded or typed-in contact isn't the sender's verified number.
    if (contact.user_id !== from) {
      return this.reply(chat, login.locale, 'notOwn');
    }
    const phone = parsePhoneNumberFromString(
      contact.phone_number.startsWith('+')
        ? contact.phone_number
        : `+${contact.phone_number}`,
    );
    if (!phone?.isValid()) return this.reply(chat, login.locale, 'notOwn');

    await this.redis
      .multi()
      .hset(loginKey(token), { phone: phone.number })
      .del(userKey(from))
      .exec();
    this.logger.log(`Telegram login confirmed for ${maskPhone(phone.number)}`);
    await this.done(chat, login.locale);
  }

  /** "You're logged in", with a button back to the cabinet. */
  private done(chat: number, locale: BotLocale) {
    const text = BOT_MESSAGES[locale];
    // Telegram refuses buttons linking to localhost, so dev gets none. The
    // contact keyboard was one-time, so it's already hidden.
    const local = ['localhost', '127.0.0.1'].includes(
      new URL(this.siteUrl).hostname,
    );
    return this.bot.sendMessage(
      chat,
      this.fill(text.done),
      local
        ? { remove_keyboard: true }
        : {
            inline_keyboard: [
              [
                {
                  text: text.backButton,
                  url: `${this.siteUrl}/${locale}/cabinet`,
                },
              ],
            ],
          },
    );
  }

  private async find(token: string): Promise<PendingLogin | undefined> {
    const login = (await this.redis.hgetall(
      loginKey(token),
    )) as Partial<PendingLogin>;
    return login.secret ? (login as PendingLogin) : undefined;
  }

  private reply(
    chat: number,
    locale: BotLocale,
    key: Exclude<
      keyof (typeof BOT_MESSAGES)['uz'],
      'shareButton' | 'backButton' | 'done'
    >,
    removeKeyboard = false,
  ) {
    return this.bot.sendMessage(
      chat,
      this.fill(BOT_MESSAGES[locale][key]),
      removeKeyboard ? { remove_keyboard: true } : undefined,
    );
  }

  private localeOf(languageCode?: string): BotLocale {
    const code = languageCode?.slice(0, 2) as BotLocale | undefined;
    return code && BOT_LOCALES.includes(code) ? code : 'uz';
  }

  private fill(text: string) {
    return text.replaceAll('{site}', this.site);
  }
}
