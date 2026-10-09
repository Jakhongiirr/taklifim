import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import {
  InjectThrottlerOptions,
  InjectThrottlerStorage,
  ThrottlerGuard,
  type ThrottlerModuleOptions,
  type ThrottlerStorage,
} from '@nestjs/throttler';
import { createHash, timingSafeEqual } from 'crypto';
import type { Request } from 'express';
import { isIP } from 'net';

export const INTERNAL_SECRET_HEADER = 'x-internal-secret';
export const CLIENT_IP_HEADER = 'x-client-ip';

const digest = (value: string) => createHash('sha256').update(value).digest();

/**
 * Rate limits per visitor. Browsers reach the API through the Next.js server,
 * which proves itself with INTERNAL_API_SECRET and names the visitor in
 * X-Client-IP; those requests are limited per that IP, and the server's own
 * requests (cached public pages) aren't limited. Anyone else is limited by
 * their connection IP (`req.ip`) and can't claim another one.
 */
@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  private readonly secret?: Buffer;

  constructor(
    @InjectThrottlerOptions() options: ThrottlerModuleOptions,
    @InjectThrottlerStorage() storage: ThrottlerStorage,
    reflector: Reflector,
    config: ConfigService,
  ) {
    super(options, storage, reflector);
    const secret = config.get<string>('internalApiSecret');
    if (secret) this.secret = digest(secret);
  }

  protected shouldSkip(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const internal = this.fromNextServer(request);
    return Promise.resolve(internal.trusted && !internal.clientIp);
  }

  protected getTracker(request: Request): Promise<string> {
    const internal = this.fromNextServer(request);
    return Promise.resolve(internal.clientIp ?? request.ip ?? 'unknown');
  }

  private fromNextServer(request: Request): {
    trusted: boolean;
    clientIp?: string;
  } {
    const sent = request.headers[INTERNAL_SECRET_HEADER];
    if (!this.secret || typeof sent !== 'string') return { trusted: false };
    // Fixed-length digests, so the comparison can't leak the secret's length.
    if (!timingSafeEqual(digest(sent), this.secret)) return { trusted: false };
    const ip = request.headers[CLIENT_IP_HEADER];
    return {
      trusted: true,
      clientIp: typeof ip === 'string' && isIP(ip) ? ip : undefined,
    };
  }
}
