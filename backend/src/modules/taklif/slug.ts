import { randomInt } from 'crypto';

// Lowercase letters and digits without look-alikes (0/o, 1/l/i).
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
export const SLUG_LENGTH = 8;

/** e.g. "k7m2xq9p": 31^8 ≈ 850 billion combinations. */
export function generateSlug() {
  let slug = '';
  for (let i = 0; i < SLUG_LENGTH; i++) {
    slug += ALPHABET[randomInt(ALPHABET.length)];
  }
  return slug;
}
