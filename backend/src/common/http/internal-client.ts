import { createHash, timingSafeEqual } from 'crypto';
import type { IncomingMessage } from 'http';
import { isIP } from 'net';

export const INTERNAL_SECRET_HEADER = 'x-internal-secret';
export const CLIENT_IP_HEADER = 'x-client-ip';
export const REQUEST_ID_HEADER = 'x-request-id';

export interface InternalClient {
  /** Sent by our Next.js server (it knows INTERNAL_API_SECRET). */
  trusted: boolean;
  /** The visitor it's calling for, if any. */
  clientIp?: string;
  /** Its request ID, to follow one request through Caddy, Next.js and here. */
  requestId?: string;
}

const digest = (value: string) => createHash('sha256').update(value).digest();
const REQUEST_ID = /^[\w-]{8,64}$/;

/**
 * Reads what the Next.js server says about a request: who the visitor is and
 * its request ID. Only believed with the right secret, since anyone else
 * could send the same headers.
 */
export function internalClientReader(secret?: string) {
  const expected = secret ? digest(secret) : undefined;
  return (request: IncomingMessage): InternalClient => {
    const sent = request.headers[INTERNAL_SECRET_HEADER];
    if (!expected || typeof sent !== 'string') return { trusted: false };
    // Fixed-length digests, so the comparison can't leak the secret's length.
    if (!timingSafeEqual(digest(sent), expected)) return { trusted: false };
    const ip = request.headers[CLIENT_IP_HEADER];
    const id = request.headers[REQUEST_ID_HEADER];
    return {
      trusted: true,
      clientIp: typeof ip === 'string' && isIP(ip) ? ip : undefined,
      requestId: typeof id === 'string' && REQUEST_ID.test(id) ? id : undefined,
    };
  };
}
