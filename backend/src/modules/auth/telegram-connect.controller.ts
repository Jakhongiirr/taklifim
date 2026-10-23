import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { JwtPayload } from './auth.types';
import { CurrentUser } from './decorators/current-user.decorator';
import {
  StartTelegramLoginDto,
  TelegramConnectStartedDto,
} from './dto/telegram-login.dto';
import { TelegramLoginService } from './telegram-login.service';

@ApiTags('auth')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@Controller('auth/telegram/connect')
export class TelegramConnectController {
  constructor(private readonly telegramLogin: TelegramLoginService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Connect Telegram to the current user',
    description:
      'For users without a saved Telegram account (logged in before it was saved, or with a code). Open `url` and press Start: the bot can then send them guests’ replies.',
  })
  start(
    @CurrentUser() user: JwtPayload,
    @Body() dto: StartTelegramLoginDto,
  ): Promise<TelegramConnectStartedDto> {
    return this.telegramLogin.startConnect(user.sub, dto.locale);
  }
}
