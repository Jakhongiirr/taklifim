import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomInt, timingSafeEqual } from 'crypto';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../redis/redis.constants';
import { TelegramGatewayService } from '../telegram/telegram-gateway.service';

const MAX_VERIFY_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_SENDS_PER_HOUR = 5;

const hash = (code: string) => createHash('sha256').update(code).digest();

@Injectable()
export class OtpService {
  private readonly ttl: number;
  private readonly length: number;

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly telegram: TelegramGatewayService,
    config: ConfigService,
  ) {
    this.ttl = config.getOrThrow<number>('otp.ttlSeconds');
    this.length = config.getOrThrow<number>('otp.length');
  }

  async send(phone: string) {
    const cooldownKey = `otp:cooldown:${phone}`;
    const hourlyKey = `otp:hourly:${phone}`;

    const cooldownSet = await this.redis.set(
      cooldownKey,
      '1',
      'EX',
      RESEND_COOLDOWN_SECONDS,
      'NX',
    );
    if (!cooldownSet) {
      const retryAfter = await this.redis.ttl(cooldownKey);
      throw new HttpException(
        { message: 'Please wait before requesting a new code', retryAfter },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const sends = await this.redis.incr(hourlyKey);
    if (sends === 1) await this.redis.expire(hourlyKey, 3600);
    if (sends > MAX_SENDS_PER_HOUR) {
      throw new HttpException(
        'Too many codes requested, try again later',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const code = randomInt(0, 10 ** this.length)
      .toString()
      .padStart(this.length, '0');

    try {
      await this.telegram.sendCode(phone, code, this.ttl);
    } catch (err) {
      // Delivery failed: let the user retry right away.
      await this.redis.del(cooldownKey);
      throw err;
    }

    await this.redis
      .multi()
      .set(`otp:code:${phone}`, hash(code).toString('hex'), 'EX', this.ttl)
      .del(`otp:attempts:${phone}`)
      .exec();

    return { expiresIn: this.ttl, retryAfter: RESEND_COOLDOWN_SECONDS };
  }

  /** Verifies and consumes the code. Throws if invalid. */
  async verify(phone: string, code: string) {
    const codeKey = `otp:code:${phone}`;
    const attemptsKey = `otp:attempts:${phone}`;

    const stored = await this.redis.get(codeKey);
    if (!stored) throw new BadRequestException('Code expired or not requested');

    const attempts = await this.redis.incr(attemptsKey);
    if (attempts === 1) await this.redis.expire(attemptsKey, this.ttl);
    if (attempts > MAX_VERIFY_ATTEMPTS) {
      await this.redis.del(codeKey, attemptsKey);
      throw new BadRequestException('Too many attempts, request a new code');
    }

    const expected = Buffer.from(stored, 'hex');
    if (!timingSafeEqual(expected, hash(code))) {
      throw new BadRequestException('Invalid code');
    }

    // Only one concurrent request can consume the code.
    const deleted = await this.redis.del(codeKey);
    await this.redis.del(attemptsKey);
    if (deleted === 0) throw new BadRequestException('Code already used');
  }
}
