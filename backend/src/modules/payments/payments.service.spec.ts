import type { ConfigService } from '@nestjs/config';
import type { Repository } from 'typeorm';
import type { JwtPayload } from '../auth/auth.types';
import { TaklifStatus } from '../taklif/taklif-status.enum';
import type { Taklif } from '../taklif/taklif.entity';
import type { Order } from './order.entity';
import { OrderStatus } from './order.entity';
import type { PaymeTransaction } from './payme-transaction.entity';
import { PaymentsService } from './payments.service';

// Jest can't load @nestjs/config (ESM); the service only needs get.
jest.mock('@nestjs/config', () => ({ ConfigService: class {} }));

const user = { sub: 'user-1' } as JwtPayload;

function setup(price: number) {
  const taklif = {
    id: 'taklif-1',
    userId: user.sub,
    slug: 'a-b',
    status: TaklifStatus.Draft,
    paidAt: null,
    themeId: 'theme-1',
    theme: { price },
    groomName: 'A',
    brideName: 'B',
    eventAt: new Date('2027-01-01'),
    lockedEventAt: null,
  } as unknown as Taklif;
  const manager = {
    create: jest.fn((_: unknown, data: object) => data),
    save: jest.fn((data: object) => Promise.resolve(data)),
    update: jest.fn(() => Promise.resolve()),
  };
  const orders = {
    manager: {
      transaction: (run: (m: typeof manager) => Promise<void>) => run(manager),
    },
    findOne: jest.fn(() => Promise.resolve(null)),
    create: jest.fn((data: object) => data),
    save: jest.fn((data: object) =>
      Promise.resolve({ id: 'order-1', ...data }),
    ),
    update: jest.fn(),
  };
  const taklifs = { findOne: jest.fn(() => Promise.resolve(taklif)) };
  const config = {
    get: (key: string) =>
      ({
        'payme.merchantId': 'merchant',
        'payme.key': 'key',
        'payme.checkoutUrl': 'https://checkout.paycom.uz',
        siteUrl: 'https://taklifim.uz',
      })[key],
  };
  const service = new PaymentsService(
    config as unknown as ConfigService,
    orders as unknown as Repository<Order>,
    taklifs as unknown as Repository<Taklif>,
    {} as Repository<PaymeTransaction>,
  );
  return { service, manager, orders };
}

describe('PaymentsService.checkout', () => {
  it('publishes a free design at once, with a paid 0 so‘m order', async () => {
    const { service, manager, orders } = setup(0);
    await expect(
      service.checkout('taklif-1', { lang: 'uz' }, user),
    ).resolves.toEqual({ published: true });
    expect(manager.save).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 0, status: OrderStatus.Paid }),
    );
    expect(manager.update).toHaveBeenCalledWith(
      expect.anything(),
      'taklif-1',
      expect.objectContaining({ status: TaklifStatus.Published }),
    );
    expect(orders.save).not.toHaveBeenCalled();
  });

  it('sends a paid design to Payme without publishing it', async () => {
    const { service, manager, orders } = setup(150_000);
    const result = await service.checkout('taklif-1', { lang: 'uz' }, user);
    expect(result.published).toBe(false);
    expect(result.url).toMatch(/^https:\/\/checkout\.paycom\.uz\//);
    expect(orders.save).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 150_000 }),
    );
    expect(manager.update).not.toHaveBeenCalled();
  });
});
