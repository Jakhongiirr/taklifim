import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramGatewayService } from './telegram-gateway.service';
import { TelegramNotifyService } from './telegram-notify.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    TelegramGatewayService,
    TelegramBotService,
    TelegramNotifyService,
  ],
  exports: [TelegramGatewayService, TelegramBotService, TelegramNotifyService],
})
export class TelegramModule {}
