import type { ConfigService } from '@nestjs/config';
import type Redis from 'ioredis';
import {
  TelegramBotService,
  type TelegramUpdate,
} from './telegram-bot.service';

// Jest can't load @nestjs/config (ESM), which the bot service imports.
jest.mock('@nestjs/config', () => ({ ConfigService: class {} }));

const SECRET = 's'.repeat(32);

function setup(webhookSecret: string | null = SECRET) {
  const values: Record<string, string | undefined> = {
    'telegram.botToken': 'token',
    'telegram.webhookSecret': webhookSecret ?? undefined,
    siteUrl: 'https://taklifim.uz',
  };
  const config = {
    get: (key: string) => values[key],
    getOrThrow: (key: string) => values[key],
  };
  const seen = new Set<string>();
  const redis = {
    set: jest.fn((key: string) => {
      if (seen.has(key)) return Promise.resolve(null);
      seen.add(key);
      return Promise.resolve('OK');
    }),
  };
  const bot = new TelegramBotService(
    config as unknown as ConfigService,
    redis as unknown as Redis,
  );
  const handler = jest.fn<Promise<void>, [TelegramUpdate]>(() =>
    Promise.resolve(),
  );
  bot.onUpdate(handler);
  return { bot, handler };
}

const update: TelegramUpdate = {
  update_id: 7,
  message: { chat: { id: 1, type: 'private' }, text: '/start' },
};

describe('TelegramBotService webhook', () => {
  it('handles an update sent with the secret', async () => {
    const { bot, handler } = setup();
    await expect(bot.receive(update, SECRET)).resolves.toBe(true);
    expect(handler).toHaveBeenCalledWith(update);
  });

  it('refuses a wrong or missing secret', async () => {
    const { bot, handler } = setup();
    await expect(bot.receive(update, 'x'.repeat(32))).resolves.toBe(false);
    await expect(bot.receive(update)).resolves.toBe(false);
    expect(handler).not.toHaveBeenCalled();
  });

  it('refuses everything when polling', async () => {
    const { bot, handler } = setup(null);
    await expect(bot.receive(update, SECRET)).resolves.toBe(false);
    expect(handler).not.toHaveBeenCalled();
  });

  it('handles an update Telegram resends only once', async () => {
    const { bot, handler } = setup();
    await bot.receive(update, SECRET);
    await expect(bot.receive(update, SECRET)).resolves.toBe(true);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
