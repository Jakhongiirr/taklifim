import type { Repository } from 'typeorm';
import type { User } from '../users/user.entity';
import type { TelegramBotService } from './telegram-bot.service';
import { TelegramNotifyService } from './telegram-notify.service';

// Jest can't load @nestjs/config (ESM), which the bot service imports.
jest.mock('@nestjs/config', () => ({ ConfigService: class {} }));

function setup(user: Partial<User> | null) {
  const users = { findOneBy: jest.fn(() => Promise.resolve(user)) };
  const bot = {
    notify: jest.fn<Promise<boolean>, [string, string]>(() =>
      Promise.resolve(true),
    ),
  };
  const service = new TelegramNotifyService(
    users as unknown as Repository<User>,
    bot as unknown as TelegramBotService,
  );
  return { service, bot, users };
}

describe('TelegramNotifyService', () => {
  it("writes to the user's chat in their language", async () => {
    const { service, bot } = setup({ telegramId: '42', locale: 'ru' });
    await service.sendToUser('u1', (locale) => `hi ${locale}`);
    expect(bot.notify).toHaveBeenCalledWith('42', 'hi ru');
  });

  it('falls back to Uzbek', async () => {
    const { service, bot } = setup({ telegramId: '42', locale: null });
    await service.sendToUser('u1', (locale) => locale);
    expect(bot.notify).toHaveBeenCalledWith('42', 'uz');
  });

  it("skips users who haven't logged in with Telegram", async () => {
    const { service, bot } = setup({ telegramId: null, locale: null });
    await service.sendToUser('u1', 'hi');
    expect(bot.notify).not.toHaveBeenCalled();
  });

  it('never throws', async () => {
    const { service, users } = setup(null);
    users.findOneBy.mockRejectedValueOnce(new Error('db'));
    await expect(service.sendToUser('u1', 'hi')).resolves.toBeUndefined();
  });
});
