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
import type { Request } from 'express';
import {
  type InternalClient,
  internalClientReader,
} from '../http/internal-client';

/**
 * Rate limits per visitor. Browsers reach the API through the Next.js server,
 * which proves itself with INTERNAL_API_SECRET and names the visitor in
 * X-Client-IP; those requests are limited per that IP, and the server's own
 * requests (cached public pages) aren't limited. Anyone else is limited by
 * their connection IP (`req.ip`) and can't claim another one.
 */
@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  private readonly fromNextServer: (request: Request) => InternalClient;

  constructor(
    @InjectThrottlerOptions() options: ThrottlerModuleOptions,
    @InjectThrottlerStorage() storage: ThrottlerStorage,
    reflector: Reflector,
    config: ConfigService,
  ) {
    super(options, storage, reflector);
    this.fromNextServer = internalClientReader(
      config.get<string>('internalApiSecret'),
    );
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
}
