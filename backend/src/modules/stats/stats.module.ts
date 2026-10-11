import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsDetailsService } from './stats-details.service';
import { StatsService } from './stats.service';

@Module({
  controllers: [StatsController],
  providers: [StatsService, StatsDetailsService],
})
export class StatsModule {}
