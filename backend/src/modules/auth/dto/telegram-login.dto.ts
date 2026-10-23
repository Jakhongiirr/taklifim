import { IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';
import { User } from '../../users/user.entity';
import { BOT_LOCALES, type BotLocale } from '../bot-messages';
import { ToE164 } from './phone.transform';

export class StartTelegramLoginDto {
  /**
   * Language the bot talks in.
   * @example "uz"
   */
  @IsIn(BOT_LOCALES)
  locale: BotLocale;
}

export class TelegramLoginStartedDto {
  /** Identifies the login; it's in the bot link. */
  token: string;

  /** Proves the browser that started it. Keep it out of URLs. */
  secret: string;

  /**
   * The bot link to open.
   * @example "https://t.me/TaklifimBot?start=Xy3..."
   */
  url: string;

  /**
   * Seconds the link stays usable.
   * @example 300
   */
  expiresIn: number;
}

export class CheckTelegramLoginDto {
  @IsString()
  @Matches(/^[\w-]{16,64}$/)
  token: string;

  @IsString()
  @IsNotEmpty()
  secret: string;
}

export class TelegramLoginStatusDto {
  /** "done" carries the session; "expired" means start again. */
  status: 'pending' | 'done' | 'expired';

  user?: User;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export class DevConfirmTelegramLoginDto {
  @IsString()
  @Matches(/^[\w-]{16,64}$/)
  token: string;

  /** @example "+998901234567" */
  @ToE164()
  @IsString({ message: 'phone must be a valid phone number' })
  @IsNotEmpty()
  phone: string;
}

export class TelegramConnectStartedDto {
  /**
   * The bot link to open; pressing Start there connects the account.
   * @example "https://t.me/TaklifimBot?start=connect_Xy3..."
   */
  url: string;

  /**
   * Seconds the link stays usable.
   * @example 3600
   */
  expiresIn: number;
}
