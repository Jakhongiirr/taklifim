import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '../files/file.entity';
import { FilesModule } from '../files/files.module';
import { Music } from '../music/music.entity';
import { MusicModule } from '../music/music.module';
import { TelegramModule } from '../telegram/telegram.module';
import { Theme } from '../themes/theme.entity';
import { ThemesModule } from '../themes/themes.module';
import { User } from '../users/user.entity';
import { TaklifCleanupService } from './taklif-cleanup.service';
import { TaklifPhoto } from './taklif-photo.entity';
import { TaklifResponse } from './taklif-response.entity';
import { TaklifResponsesController } from './taklif-responses.controller';
import { TaklifResponsesService } from './taklif-responses.service';
import { TaklifController } from './taklif.controller';
import { Taklif } from './taklif.entity';
import { TaklifService } from './taklif.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Taklif,
      TaklifPhoto,
      TaklifResponse,
      Music,
      Theme,
      File,
      User,
    ]),
    FilesModule,
    MusicModule,
    ThemesModule,
    TelegramModule,
  ],
  controllers: [TaklifController, TaklifResponsesController],
  providers: [TaklifService, TaklifCleanupService, TaklifResponsesService],
})
export class TaklifModule {}
