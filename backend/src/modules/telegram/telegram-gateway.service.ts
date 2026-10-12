import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { maskPhone } from '../../common/logging/mask-phone';

const GATEWAY_URL = 'https://gatewayapi.telegram.org';

interface GatewayResponse<T> {
  ok: boolean;
  result?: T;
  error?: string;
}

interface RequestStatus {
  request_id: string;
  phone_number: string;
  request_cost: number;
}

/**
 * Telegram Gateway API client (https://core.telegram.org/gateway/api).
 * Delivers verification codes to a phone number's Telegram account.
 */
@Injectable()
export class TelegramGatewayService {
  private readonly logger = new Logger(TelegramGatewayService.name);
  private readonly token?: string;
  private readonly isProduction: boolean;

  constructor(config: ConfigService) {
    this.token = config.get<string>('telegram.gatewayToken');
    this.isProduction = config.get<string>('nodeEnv') === 'production';
  }

  async sendCode(phone: string, code: string, ttlSeconds: number) {
    if (!this.token) {
      if (this.isProduction) {
        throw new ServiceUnavailableException('OTP delivery is not configured');
      }
      this.logger.warn(
        `[dev] TELEGRAM_GATEWAY_TOKEN not set. OTP for ${phone}: ${code}`,
      );
      return;
    }

    const result = await this.call<RequestStatus>('sendVerificationMessage', {
      phone_number: phone,
      code,
      ttl: ttlSeconds,
    });
    this.logger.log(
      `Sent OTP to ${maskPhone(phone)} (request ${result.request_id}, cost ${result.request_cost})`,
    );
  }

  private async call<T>(method: string, body: object): Promise<T> {
    let data: GatewayResponse<T>;
    try {
      const res = await fetch(`${GATEWAY_URL}/${method}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10_000),
      });
      data = (await res.json()) as GatewayResponse<T>;
    } catch (err) {
      this.logger.error(
        `Telegram Gateway ${method} failed: ${(err as Error).message}`,
      );
      throw new ServiceUnavailableException('Could not send code via Telegram');
    }

    if (!data.ok || !data.result) {
      this.logger.error(`Telegram Gateway ${method} error: ${data.error}`);
      throw new ServiceUnavailableException('Could not send code via Telegram');
    }
    return data.result;
  }
}
