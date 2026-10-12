import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import {
  AuthTokensDto,
  LoginResponseDto,
  OtpRequestedDto,
} from './dto/auth-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import {
  CheckTelegramLoginDto,
  DevConfirmTelegramLoginDto,
  StartTelegramLoginDto,
  TelegramLoginStartedDto,
  TelegramLoginStatusDto,
} from './dto/telegram-login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { TelegramLoginService } from './telegram-login.service';

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly telegramLogin: TelegramLoginService,
  ) {}

  @Post('telegram/start')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Start a login through the Telegram bot',
    description:
      'Open `url`, share the phone number with the bot, then poll /auth/telegram/check with `token` and `secret`.',
  })
  startTelegramLogin(
    @Body() dto: StartTelegramLoginDto,
  ): Promise<TelegramLoginStartedDto> {
    return this.telegramLogin.start(dto.locale);
  }

  @Post('telegram/check')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Poll a Telegram login',
    description:
      '"pending" until the number is shared in the bot; "done" logs in (once, creating the user on first login).',
  })
  @ApiBadRequestResponse({ description: 'Wrong secret' })
  checkTelegramLogin(
    @Body() dto: CheckTelegramLoginDto,
  ): Promise<TelegramLoginStatusDto> {
    return this.telegramLogin.check(dto.token, dto.secret);
  }

  /** Development without TELEGRAM_BOT_TOKEN only (404 otherwise). */
  @Post('telegram/dev-confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiExcludeEndpoint()
  devConfirmTelegramLogin(
    @Body() dto: DevConfirmTelegramLoginDto,
  ): Promise<void> {
    return this.telegramLogin.devConfirm(dto.token, dto.phone);
  }

  @Post('otp/request')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Send a login code to the phone via Telegram' })
  @ApiBadRequestResponse({ description: 'Invalid phone number' })
  @ApiTooManyRequestsResponse({
    description: 'Resend cooldown or hourly limit reached',
  })
  requestOtp(@Body() dto: RequestOtpDto): Promise<OtpRequestedDto> {
    return this.authService.requestOtp(dto.phone);
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Verify the code and log in',
    description: 'Creates the user on first login.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid, expired or already used code',
  })
  verifyOtp(@Body() dto: VerifyOtpDto): Promise<LoginResponseDto> {
    return this.authService.verifyOtp(dto.phone, dto.code);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a new token pair',
    description: 'The refresh token sent is revoked.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or revoked refresh token' })
  refresh(@Body() dto: RefreshTokenDto): Promise<AuthTokensDto> {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke the refresh token' })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  logout(@Body() dto: RefreshTokenDto): Promise<void> {
    return this.authService.logout(dto.refreshToken);
  }
}
