import type { ConfigService } from '@nestjs/config';
import type { Repository } from 'typeorm';
import type { BotLocale } from '../auth/bot-messages';
import type { TelegramNotifyService } from '../telegram/telegram-notify.service';
import type { TaklifGuest } from './taklif-guest.entity';
import type { TaklifResponse } from './taklif-response.entity';
import { TaklifResponsesService } from './taklif-responses.service';
import type { Taklif } from './taklif.entity';

// Jest can't load @nestjs/config (ESM); the service only reads a value.
jest.mock('@nestjs/config', () => ({ ConfigService: class {} }));

const taklif = { id: 't1', slug: 'abc123', userId: 'u1' } as Taklif;

function setup() {
  const taklifs = { findOneBy: jest.fn(() => Promise.resolve(taklif)) };
  const responses = {
    countBy: jest.fn(() => Promise.resolve(0)),
    existsBy: jest.fn(() => Promise.resolve(false)),
    create: jest.fn((r: Partial<TaklifResponse>) => r),
    save: jest.fn((r: Partial<TaklifResponse>) =>
      Promise.resolve({ ...r, id: 'r1' }),
    ),
  };
  const guests = {
    findOneBy: jest.fn(({ token }: { token: string }) =>
      Promise.resolve(token === 'g1token' ? { id: 'g1' } : null),
    ),
  };
  const telegram = {
    sendToUser: jest.fn<
      Promise<void>,
      [string, string | ((locale: BotLocale) => string)]
    >(() => Promise.resolve()),
  };
  const config = { getOrThrow: () => 'https://taklifim.uz/' };
  const service = new TaklifResponsesService(
    taklifs as unknown as Repository<Taklif>,
    responses as unknown as Repository<TaklifResponse>,
    guests as unknown as Repository<TaklifGuest>,
    telegram as unknown as TelegramNotifyService,
    config as unknown as ConfigService,
  );
  return { service, telegram, responses };
}

const reply = {
  name: 'Aziza',
  attending: true,
  guests: 3,
  message: 'Baxtli boʻlinglar!',
  elapsedMs: 10_000,
};

describe('TaklifResponsesService', () => {
  it("sends a guest's reply to the owner's Telegram", async () => {
    const { service, telegram } = setup();
    expect(await service.create('abc123', reply)).toEqual({ ok: true });
    const [userId, text] = telegram.sendToUser.mock.calls[0];
    expect(userId).toBe('u1');
    const ru = (text as (locale: BotLocale) => string)('ru');
    expect(ru).toContain('Aziza');
    expect(ru).toContain('Придёт, человек: 3');
    expect(ru).toContain('Baxtli boʻlinglar!');
    expect(ru).toContain('https://taklifim.uz/ru/cabinet/responses/abc123');
  });

  it('sends nothing for bot submissions', async () => {
    const { service, telegram } = setup();
    await service.create('abc123', { ...reply, elapsedMs: 100 });
    expect(telegram.sendToUser).not.toHaveBeenCalled();
  });

  it('links a reply from a personal link to its guest', async () => {
    const { service, responses } = setup();
    await service.create('abc123', { ...reply, guestToken: 'g1token' });
    expect(responses.create).toHaveBeenCalledWith(
      expect.objectContaining({ guestId: 'g1' }),
    );
  });

  it('keeps a reply with an unknown token, unlinked', async () => {
    const { service, responses } = setup();
    expect(
      await service.create('abc123', { ...reply, guestToken: 'nope' }),
    ).toEqual({ ok: true });
    expect(responses.create).toHaveBeenCalledWith(
      expect.objectContaining({ guestId: null }),
    );
  });
});
