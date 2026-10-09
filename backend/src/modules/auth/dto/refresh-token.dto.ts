import { IsJWT } from 'class-validator';

export class RefreshTokenDto {
  /** Refresh token from the last login or refresh. */
  @IsJWT()
  refreshToken: string;
}
