import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { ToE164 } from './phone.transform';

export class VerifyOtpDto {
  /**
   * The same phone number the code was requested for.
   * @example "+998901234567"
   */
  @ToE164()
  @IsString({ message: 'phone must be a valid phone number' })
  @IsNotEmpty()
  phone: string;

  /**
   * Code received in Telegram.
   * @example "123456"
   */
  @IsNumberString({ no_symbols: true })
  code: string;
}
