import { Transform } from 'class-transformer';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Normalizes a phone number to E.164 (+998901234567).
 * Numbers without a country code are treated as Uzbek.
 * Invalid numbers become null so @IsNotEmpty rejects them.
 */
export const ToE164 = () =>
  Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') return null;
    const parsed = parsePhoneNumberFromString(value, 'UZ');
    return parsed?.isValid() ? parsed.number : null;
  });
