import type { ConfigService } from '@nestjs/config';
import type { EntityManager, Repository } from 'typeorm';
import type { Order } from '../payments/order.entity';
import type { TelegramNotifyService } from '../telegram/telegram-notify.service';
import type { Theme } from '../themes/theme.entity';
import type { Gift } from './gift.entity';
import { GiftsService } from './gifts.service';

// Jest can't load @nestjs/config (ESM); the service only needs get.
jest.mock('@nestjs/config', () => ({ ConfigService: class {} }));

function setup({ plovTheme = true } = {}) {
  const gift = { id: 'gift-1', userId: 'user-1', orderId: 'order-1' };
  const insert: Record<string, jest.Mock> = {
    execute: jest.fn(() => Promise.resolve({ raw: [gift] })),
  };
  for (const step of ['insert', 'into', 'values', 'orIgnore', 'returning']) {
    insert[step] = jest.fn(() => insert);
  }
  const manager = {
    findOne: jest.fn(() => Promise.resolve(plovTheme ? { id: 'plov' } : null)),
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

const order = (amount: number) =>
  ({ id: 'order-1', userId: 'user-1', amount }) as Order;

describe('GiftsService', () => {
  it('gives a plov gift for a paid order', async () => {
    const { service, manager, insert, gift } = setup();
    await expect(service.grant(manager, order(150_000))).resolves.toBe(gift);
    expect(insert.values).toHaveBeenCalledWith({
      userId: 'user-1',
      orderId: 'order-1',
    });
  });

  it('gives nothing for a free order', async () => {
    const { service, manager, insert } = setup();
    await expect(service.grant(manager, order(0))).resolves.toBeNull();
    expect(insert.execute).not.toHaveBeenCalled();
  });

  it('gives nothing while the plov design is not active', async () => {
    const { service, manager, insert } = setup({ plovTheme: false });
    await expect(service.grant(manager, order(150_000))).resolves.toBeNull();
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
