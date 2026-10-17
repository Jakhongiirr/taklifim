import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import Redis from 'ioredis';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { AllExceptionsFilter } from './common/http/all-exceptions.filter';
import { loggerConfig } from './common/logging/logger.config';
import { AppThrottlerGuard } from './common/throttle/app-throttler.guard';
import { ResponseInterceptor } from './common/http/response.interceptor';
import configuration from './config/configuration';
import { envValidationSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './modules/health/health.module';
import { RedisThrottlerStorage } from './redis/redis-throttler.storage';
import { REDIS_CLIENT } from './redis/redis.constants';
import { RedisModule } from './redis/redis.module';
import { DemosModule } from './modules/demos/demos.module';
import { GiftsModule } from './modules/gifts/gifts.module';
import { FilesModule } from './modules/files/files.module';
import { MusicModule } from './modules/music/music.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { TaklifModule } from './modules/taklif/taklif.module';
import { ThemesModule } from './modules/themes/themes.module';
import { StatsModule } from './modules/stats/stats.module';
import { StorageModule } from './modules/storage/storage.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: loggerConfig,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      inject: [REDIS_CLIENT],
      useFactory: (redis: Redis) => ({
        throttlers: [{ ttl: 60_000, limit: 100 }],
        errorMessage: 'Too many requests, try again later',
        storage: new RedisThrottlerStorage(redis),
      }),
    }),
    DatabaseModule,
    RedisModule,
    StorageModule,
    HealthModule,
    UsersModule,
    AuthModule,
    FilesModule,
    MusicModule,
    ThemesModule,
    TaklifModule,
    DemosModule,
    StatsModule,
    PaymentsModule,
    GiftsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AppThrottlerGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
