import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from '../files/files.module';
import { Theme } from '../themes/theme.entity';
import { ThemesModule } from '../themes/themes.module';
import { DemosController } from './demos.controller';
import { Demo } from './demo.entity';
import { DemosService } from './demos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Demo, Theme]), FilesModule, ThemesModule],
  controllers: [DemosController],
  providers: [DemosService],
})
export class DemosModule {}
