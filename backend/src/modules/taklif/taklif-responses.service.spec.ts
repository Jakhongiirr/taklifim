import type { ConfigService } from '@nestjs/config';
import type { Repository } from 'typeorm';
import type { TelegramBotService } from '../telegram/telegram-bot.service';
import type { User } from '../users/user.entity';
import type { TaklifResponse } from './taklif-response.entity';
import { TaklifResponsesService } from './taklif-responses.service';
import type { Taklif } from './taklif.entity';

// Jest can't load @nestjs/config (ESM); the service only reads a value.
jest.mock('@nestjs/config', () => ({ ConfigService: class {} }));

const taklif = { id: 't1', slug: 'abc123', userId: 'u1' } as Taklif;

function setup(owner: Partial<User> | null) {
  const taklifs = { findOneBy: jest.fn(() => Promise.resolve(taklif)) };
  const responses = {
    countBy: jest.fn(() => Promise.resolve(0)),
    existsBy: jest.fn(() => Promise.resolve(false)),
    create: jest.fn((r: Partial<TaklifResponse>) => r),
    save: jest.fn((r: Partial<TaklifResponse>) =>
      Promise.resolve({ ...r, id: 'r1' }),
    ),
  };
  const users = { findOneBy: jest.fn(() => Promise.resolve(owner)) };
  const bot = {
    notify: jest.fn<Promise<boolean>, [string, string]>(() =>
      Promise.resolve(true),
    ),
  };
  const config = { getOrThrow: () => 'https://taklifim.uz/' };
  const service = new TaklifResponsesService(
    taklifs as unknown as Repository<Taklif>,
    responses as unknown as Repository<TaklifResponse>,
    users as unknown as Repository<User>,
    bot as unknown as TelegramBotService,
    config as unknown as ConfigService,
  );
  return { service, bot };
}

const reply = {
  name: 'Aziza',
  attending: true,
  guests: 3,
  message: 'Baxtli boʻlinglar!',
  elapsedMs: 10_000,
};
const flush = () => new Promise((resolve) => setImmediate(resolve));

describe('TaklifResponsesService', () => {
  it("sends a guest's reply to the owner's Telegram in their language", async () => {
    const { service, bot } = setup({ telegramId: '42', locale: 'ru' });
    expect(await service.create('abc123', reply)).toEqual({ ok: true });
    await flush();
    const [chat, text] = bot.notify.mock.calls[0];
    expect(chat).toBe('42');
    expect(text).toContain('Aziza');
    expect(text).toContain('Придёт, человек: 3');
    expect(text).toContain('Baxtli boʻlinglar!');
    expect(text).toContain('https://taklifim.uz/ru/cabinet/responses/abc123');
  });

  it("skips owners who haven't logged in with Telegram", async () => {
    const { service, bot } = setup({ telegramId: null, locale: null });
    await service.create('abc123', reply);
    await flush();
    expect(bot.notify).not.toHaveBeenCalled();
  });

  it('sends nothing for bot submissions', async () => {
    const { service, bot } = setup({ telegramId: '42', locale: 'uz' });
    await service.create('abc123', { ...reply, elapsedMs: 100 });
    await flush();
    expect(bot.notify).not.toHaveBeenCalled();
  });
});
