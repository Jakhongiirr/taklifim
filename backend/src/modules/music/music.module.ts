import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from '../files/files.module';
import { MusicController } from './music.controller';
import { Music } from './music.entity';
import { MusicService } from './music.service';

@Module({
  imports: [TypeOrmModule.forFeature([Music]), FilesModule],
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicService],
})
export class MusicModule {}
