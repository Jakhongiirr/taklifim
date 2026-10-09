import { User } from '../../users/user.entity';

export class OtpRequestedDto {
  /**
   * Seconds until the code expires.
   * @example 300
   */
  expiresIn: number;

  /**
   * Seconds until a new code can be requested.
   * @example 60
   */
  retryAfter: number;
}

export class AuthTokensDto {
  /** Send as `Authorization: Bearer <accessToken>`. */
  accessToken: string;

  /** Exchange at /auth/refresh for a new token pair. Single use. */
  refreshToken: string;

  /**
   * Access token lifetime in seconds.
   * @example 900
   */
  expiresIn: number;
}

export class LoginResponseDto extends AuthTokensDto {
  user: User;
}
