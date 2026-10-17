import type { ConfigService } from '@nestjs/config';
import type { EntityManager, Repository } from 'typeorm';
import type { TelegramNotifyService } from '../telegram/telegram-notify.service';
import type { Theme } from '../themes/theme.entity';
import type { Gift } from './gift.entity';
import { GiftsService } from './gifts.service';

// Jest can't load @nestjs/config (ESM); the service only needs get.
jest.mock('@nestjs/config', () => ({ ConfigService: class {} }));

function setup({ plovTheme = true, price = 150_000, gifted = false } = {}) {
  const gift = { id: 'gift-1', userId: 'user-1', orderId: 'order-1' };
  const insert: Record<string, jest.Mock> = {
    execute: jest.fn(() => Promise.resolve({ raw: [gift] })),
  };
  for (const step of ['insert', 'into', 'values', 'orIgnore', 'returning']) {
    insert[step] = jest.fn(() => insert);
  }
  const manager = {
    findOne: jest.fn((_: unknown, { where }: { where: { id?: string } }) =>
      Promise.resolve(
        where.id ? { id: where.id, price } : plovTheme ? { id: 'plov' } : null,
      ),
    ),
    exists: jest.fn(() => Promise.resolve(gifted)),
    createQueryBuilder: () => insert,
  } as unknown as EntityManager;
  const telegram = { sendToUser: jest.fn(() => Promise.resolve()) };
  const service = new GiftsService(
    { get: () => 'https://taklifim.uz' } as unknown as ConfigService,
    {} as Repository<Gift>,
    {} as Repository<Theme>,
    telegram as unknown as TelegramNotifyService,
  );
  return { service, manager, insert, telegram, gift };
}

const taklif = { id: 'taklif-1', userId: 'user-1', themeId: 'theme-1' };
const order = (amount: number) => ({ id: 'order-1', amount });

describe('GiftsService', () => {
  it('gives a plov gift when a paid invitation is published', async () => {
    const { service, manager, insert, gift } = setup();
    await expect(
      service.grantForPublish(manager, taklif, order(150_000)),
    ).resolves.toBe(gift);
    expect(insert.values).toHaveBeenCalledWith({
      userId: 'user-1',
      sourceTaklifId: 'taklif-1',
      orderId: 'order-1',
    });
  });

  it('gives one when an admin publishes a paid design', async () => {
    const { service, manager, insert, gift } = setup();
    await expect(service.grantForPublish(manager, taklif)).resolves.toBe(gift);
    expect(insert.values).toHaveBeenCalledWith(
      expect.objectContaining({ sourceTaklifId: 'taklif-1', orderId: null }),
    );
  });

  it('gives nothing for a free design', async () => {
    const { service, manager, insert } = setup({ price: 0 });
    await expect(service.grantForPublish(manager, taklif)).resolves.toBeNull();
    await expect(
      service.grantForPublish(manager, taklif, order(0)),
    ).resolves.toBeNull();
    expect(insert.execute).not.toHaveBeenCalled();
  });

  it('gives nothing for an invitation published with a gift', async () => {
    const { service, manager, insert } = setup({ gifted: true });
    await expect(service.grantForPublish(manager, taklif)).resolves.toBeNull();
    expect(insert.execute).not.toHaveBeenCalled();
  });

  it('gives nothing while the plov design is not active', async () => {
    const { service, manager, insert } = setup({ plovTheme: false });
    await expect(
      service.grantForPublish(manager, taklif, order(150_000)),
    ).resolves.toBeNull();
    expect(insert.execute).not.toHaveBeenCalled();
  });

  it('tells the owner on Telegram, pointing to the cabinet', async () => {
    const { service, telegram, gift } = setup();
    await service.announce(gift as Gift);
    expect(telegram.sendToUser).toHaveBeenCalledWith(
      'user-1',
      expect.stringContaining('https://taklifim.uz/uz/cabinet'),
    );
  });
});
