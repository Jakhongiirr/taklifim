import { IsNotEmpty, IsString } from 'class-validator';
import { ToE164 } from './phone.transform';

export class RequestOtpDto {
  /**
   * Phone number. Numbers without a country code are treated as Uzbek.
   * @example "+998901234567"
   */
  @ToE164()
  @IsString({ message: 'phone must be a valid phone number' })
  @IsNotEmpty()
  phone: string;
}
