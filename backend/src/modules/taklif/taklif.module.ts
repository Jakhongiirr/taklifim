import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '../files/file.entity';
import { FilesModule } from '../files/files.module';
import { Music } from '../music/music.entity';
import { MusicModule } from '../music/music.module';
import { Theme } from '../themes/theme.entity';
import { ThemesModule } from '../themes/themes.module';
import { TaklifCleanupService } from './taklif-cleanup.service';
import { TaklifPhoto } from './taklif-photo.entity';
import { TaklifController } from './taklif.controller';
import { Taklif } from './taklif.entity';
import { TaklifService } from './taklif.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Taklif, TaklifPhoto, Music, Theme, File]),
    FilesModule,
    MusicModule,
    ThemesModule,
  ],
  controllers: [TaklifController],
  providers: [TaklifService, TaklifCleanupService],
})
export class TaklifModule {}
