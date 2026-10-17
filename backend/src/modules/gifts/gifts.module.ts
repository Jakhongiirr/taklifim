import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramModule } from '../telegram/telegram.module';
import { Theme } from '../themes/theme.entity';
import { Gift } from './gift.entity';
import { GiftsController } from './gifts.controller';
import { GiftsService } from './gifts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Gift, Theme]), TelegramModule],
  controllers: [GiftsController],
  providers: [GiftsService],
  exports: [GiftsService],
})
export class GiftsModule {}
