import { Module } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramGatewayService } from './telegram-gateway.service';

@Module({
  providers: [TelegramGatewayService, TelegramBotService],
  exports: [TelegramGatewayService, TelegramBotService],
})
export class TelegramModule {}
