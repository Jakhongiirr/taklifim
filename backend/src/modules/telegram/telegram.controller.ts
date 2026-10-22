import {
  Body,
  Controller,
  ForbiddenException,
  Headers,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from '../auth/decorators/public.decorator';
import {
  TelegramBotService,
  type TelegramUpdate,
} from './telegram-bot.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly bot: TelegramBotService) {}

  /**
   * The bot's webhook: Telegram posts to SITE_URL/api/telegram, which the
   * site passes on here. Telegram proves itself with the secret it was given.
   */
  @Post('webhook')
  @Public()
  @SkipThrottle()
  @HttpCode(200)
  @ApiExcludeEndpoint()
  async webhook(
    @Body() update: TelegramUpdate,
    @Headers('x-telegram-bot-api-secret-token') secret?: string,
  ) {
    if (!(await this.bot.receive(update, secret))) {
      throw new ForbiddenException();
    }
  }
}
