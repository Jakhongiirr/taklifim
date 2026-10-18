import type { ConfigService } from '@nestjs/config';
import type { Repository } from 'typeorm';
import type { GiftsService } from '../gifts/gifts.service';
import { TaklifStatus } from '../taklif/taklif-status.enum';
import { Taklif } from '../taklif/taklif.entity';
import { Order, OrderStatus } from './order.entity';
import { PaymeState, PaymeTransaction } from './payme-transaction.entity';
import { PaymeService } from './payme.service';

// Jest can't load @nestjs/config (ESM); the service only needs get.
jest.mock('@nestjs/config', () => ({ ConfigService: class {} }));

const auth = `Basic ${Buffer.from('Paycom:key').toString('base64')}`;

function setup(taklif: Partial<Taklif>) {
  const tx = {
    id: 'tx-1',
    paymeId: 'p1',
    orderId: 'order-1',
    state: PaymeState.Created,
    createTime: Date.now(),
  } as PaymeTransaction;
  const order = {
    id: 'order-1',
    taklifId: 'taklif-1',
    themeId: 'theme-1',
    amount: 150_000,
    status: OrderStatus.Pending,
  } as Order;
  const rows = new Map<unknown, unknown>([
    [PaymeTransaction, tx],
    [Order, order],
    [
      Taklif,
      {
        id: 'taklif-1',
        themeId: 'theme-1',
        status: TaklifStatus.Draft,
        paidAt: null,
        ...taklif,
      },
    ],
  ]);
  const manager = {
    findOne: jest.fn((entity: unknown) => Promise.resolve(rows.get(entity))),
    save: jest.fn((data: object) => Promise.resolve(data)),
    update: jest.fn(() => Promise.resolve()),
  };
  const transactions = {
    manager: {
      transaction: (run: (m: typeof manager) => Promise<unknown>) =>
        run(manager),
    },
  };
  const gifts = { grantForPublish: jest.fn(() => Promise.resolve(null)) };
  const service = new PaymeService(
    {
      get: (key: string) => (key === 'payme.key' ? 'key' : undefined),
    } as unknown as ConfigService,
    transactions as unknown as Repository<PaymeTransaction>,
    gifts as unknown as GiftsService,
  );
  const perform = () =>
    service.handle(
      { id: 1, method: 'PerformTransaction', params: { id: 'p1' } },
      auth,
    );
  return { perform, manager };
}

describe('PaymeService.PerformTransaction', () => {
  it('marks the order paid and publishes the invitation', async () => {
    const { perform, manager } = setup({});
    const res = await perform();
    expect(res).toMatchObject({ result: { state: PaymeState.Performed } });
    expect(manager.update).toHaveBeenCalledWith(
      Taklif,
      'taklif-1',
      expect.objectContaining({ status: TaklifStatus.Published }),
    );
  });

  it('refuses when the invitation was paid through another order', async () => {
    const { perform, manager } = setup({ paidAt: new Date() });
    expect(await perform()).toMatchObject({ error: { code: -31008 } });
    expect(manager.update).not.toHaveBeenCalled();
  });

  it('refuses when the design changed after the order', async () => {
    const { perform, manager } = setup({ themeId: 'theme-2' });
    expect(await perform()).toMatchObject({ error: { code: -31008 } });
    expect(manager.update).not.toHaveBeenCalled();
  });
});
