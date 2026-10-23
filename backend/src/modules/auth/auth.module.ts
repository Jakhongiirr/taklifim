import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TelegramModule } from '../telegram/telegram.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TelegramConnectController } from './telegram-connect.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { OtpService } from './otp.service';
import { TelegramLoginService } from './telegram-login.service';

@Module({
  imports: [JwtModule.register({}), UsersModule, TelegramModule],
  controllers: [AuthController, TelegramConnectController],
  providers: [
    AuthService,
    OtpService,
    TelegramLoginService,
    // Order matters: authenticate first, then check roles.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
