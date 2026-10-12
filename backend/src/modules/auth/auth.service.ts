import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../redis/redis.constants';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import type { JwtPayload, RefreshPayload } from './auth.types';
import { OtpService } from './otp.service';

const refreshKey = (jti: string) => `auth:refresh:${jti}`;

@Injectable()
export class AuthService {
  private readonly accessSecret: string;
  private readonly accessTtl: number;
  private readonly refreshSecret: string;
  private readonly refreshTtl: number;

  constructor(
    private readonly otp: OtpService,
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    config: ConfigService,
  ) {
    this.accessSecret = config.getOrThrow('jwt.accessSecret');
    this.accessTtl = config.getOrThrow('jwt.accessTtl');
    this.refreshSecret = config.getOrThrow('jwt.refreshSecret');
    this.refreshTtl = config.getOrThrow('jwt.refreshTtl');
  }

  requestOtp(phone: string) {
    return this.otp.send(phone);
  }

  async verifyOtp(phone: string, code: string) {
    await this.otp.verify(phone, code);
    return this.loginWithPhone(phone);
  }

  /**
   * Logs in the account with this (already verified) number, creating it
   * on first login.
   */
  async loginWithPhone(phone: string) {
    const user = await this.users.findOrCreateByPhone(phone);
    return { user, ...(await this.issueTokens(user)) };
  }

  /** Rotates the refresh token: the old one is revoked, a new pair is issued. */
  async refresh(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);
    const userId = await this.redis.getdel(refreshKey(payload.jti));
    if (userId !== payload.sub) throw new UnauthorizedException();

    // Reload so role changes made in the database take effect.
    const user = await this.users.findById(payload.sub).catch(() => {
      throw new UnauthorizedException();
    });
    return this.issueTokens(user);
  }

  async logout(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);
    await this.redis.del(refreshKey(payload.jti));
  }

  private async issueTokens(user: User) {
    const jti = randomUUID();
    const accessPayload: JwtPayload = { sub: user.id, role: user.role };
    const refreshPayload: RefreshPayload = { sub: user.id, jti };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(accessPayload, {
        secret: this.accessSecret,
        expiresIn: this.accessTtl,
      }),
      this.jwt.signAsync(refreshPayload, {
        secret: this.refreshSecret,
        expiresIn: this.refreshTtl,
      }),
    ]);
    await this.redis.set(refreshKey(jti), user.id, 'EX', this.refreshTtl);

    return { accessToken, refreshToken, expiresIn: this.accessTtl };
  }

  private async verifyRefreshToken(token: string) {
    try {
      return await this.jwt.verifyAsync<RefreshPayload>(token, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException();
    }
  }
}
