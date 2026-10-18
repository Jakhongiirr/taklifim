import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { createHash, timingSafeEqual } from 'crypto';
import { Between, EntityManager, Repository } from 'typeorm';
import { Gift } from '../gifts/gift.entity';
import { GiftsService } from '../gifts/gifts.service';
import { TaklifStatus } from '../taklif/taklif-status.enum';
import { Taklif } from '../taklif/taklif.entity';
import { Order, OrderStatus } from './order.entity';
import { PaymeState, PaymeTransaction } from './payme-transaction.entity';

/** Payme cancels transactions not performed within 12 hours. */
const TIMEOUT_MS = 12 * 60 * 60 * 1000;
/** Payme's cancel reason for a timed-out transaction. */
const REASON_TIMEOUT = 4;
const ACCOUNT_FIELD = 'order_id';

type Message = { ru: string; uz: string; en: string };

/** A Merchant API error, sent back as JSON-RPC `error`. */
class PaymeError extends Error {
  constructor(
    readonly code: number,
    readonly localized: Message,
    readonly data?: string,
  ) {
    super(localized.en);
  }
}

const errors = {
  auth: () =>
    new PaymeError(-32504, {
      ru: 'Недостаточно привилегий',
      uz: 'Ruxsat yetarli emas',
      en: 'Insufficient privileges',
    }),
  invalidRequest: (field: string) =>
    new PaymeError(
      -32600,
      {
        ru: 'Неверный запрос',
        uz: 'Notoʻgʻri soʻrov',
        en: 'Invalid request',
      },
      field,
    ),
  method: (method: string) =>
    new PaymeError(
      -32601,
      { ru: 'Метод не найден', uz: 'Metod topilmadi', en: 'Method not found' },
      method,
    ),
  amount: () =>
    new PaymeError(-31001, {
      ru: 'Неверная сумма',
      uz: 'Notoʻgʻri summa',
      en: 'Invalid amount',
    }),
  notFound: () =>
    new PaymeError(-31003, {
      ru: 'Транзакция не найдена',
      uz: 'Tranzaksiya topilmadi',
      en: 'Transaction not found',
    }),
  cannotCancel: () =>
    new PaymeError(-31007, {
      ru: 'Заказ выполнен, отмена невозможна',
      uz: 'Buyurtma bajarilgan, bekor qilib boʻlmaydi',
      en: 'The order is fulfilled and can’t be cancelled',
    }),
  cannotPerform: () =>
    new PaymeError(-31008, {
      ru: 'Невозможно выполнить операцию',
      uz: 'Amalni bajarib boʻlmaydi',
      en: 'The operation can’t be performed',
    }),
  // -31050..-31099: problems with the order the buyer is paying for.
  orderNotFound: () =>
    new PaymeError(
      -31050,
      {
        ru: 'Заказ не найден',
        uz: 'Buyurtma topilmadi',
        en: 'Order not found',
      },
      ACCOUNT_FIELD,
    ),
  orderPaid: () =>
    new PaymeError(
      -31051,
      {
        ru: 'Заказ уже оплачен',
        uz: 'Buyurtma allaqachon toʻlangan',
        en: 'The order is already paid',
      },
      ACCOUNT_FIELD,
    ),
  invitationGone: () =>
    new PaymeError(
      -31052,
      {
        ru: 'Приглашение удалено',
        uz: 'Taklifnoma oʻchirilgan',
        en: 'The invitation was deleted',
      },
      ACCOUNT_FIELD,
    ),
  orderOutdated: () =>
    new PaymeError(
      -31053,
      {
        ru: 'Заказ устарел: дизайн приглашения изменён',
        uz: 'Buyurtma eskirgan: taklifnoma dizayni oʻzgargan',
        en: 'The order is out of date: the invitation’s design changed',
      },
      ACCOUNT_FIELD,
    ),
  orderBusy: () =>
    new PaymeError(
      -31099,
      {
        ru: 'Заказ ожидает другую оплату',
        uz: 'Buyurtma boshqa toʻlovni kutmoqda',
        en: 'The order is waiting for another payment',
      },
      ACCOUNT_FIELD,
    ),
};

type Params = Record<string, unknown>;
export type RpcResponse =
  | { jsonrpc: '2.0'; id: unknown; result: unknown }
  | {
      jsonrpc: '2.0';
      id: unknown;
      error: { code: number; message: Message; data?: string };
    };

/**
 * Payme's Merchant API (JSON-RPC over POST, Basic auth "Paycom:<key>"):
 * Payme's server checks and creates a transaction for an order, then
 * performs (the money is taken) or cancels it. Performing marks the order
 * and its invitation paid and publishes the invitation (a draft going live
 * also gives a free plov invitation, announced on Telegram). Paid transactions
 * can't be cancelled: payments aren't refundable.
 */
@Injectable()
export class PaymeService {
  private readonly logger = new Logger(PaymeService.name);
  private readonly expectedAuth?: Buffer;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(PaymeTransaction)
    private readonly transactions: Repository<PaymeTransaction>,
    private readonly gifts: GiftsService,
  ) {
    const key = config.get<string>('payme.key');
    if (key) {
      this.expectedAuth = digest(
        `Basic ${Buffer.from(`Paycom:${key}`).toString('base64')}`,
      );
    }
  }

  /** Answers one JSON-RPC request; never throws (Payme expects HTTP 200). */
  async handle(body: unknown, authorization?: string): Promise<RpcResponse> {
    const request = (body ?? {}) as { id?: unknown; method?: unknown };
    const id = request.id ?? null;
    try {
      if (!this.authorized(authorization)) throw errors.auth();
      const { method, params } = body as { method?: unknown; params?: unknown };
      if (typeof method !== 'string') throw errors.invalidRequest('method');
      if (typeof params !== 'object' || params === null) {
        throw errors.invalidRequest('params');
      }
      const result = await this.dispatch(method, params as Params);
      return { jsonrpc: '2.0', id, result };
    } catch (err) {
      if (err instanceof PaymeError) {
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: err.code,
            message: err.localized,
            ...(err.data !== undefined && { data: err.data }),
          },
        };
      }
      this.logger.error(
        'Payme request failed',
        err instanceof Error ? err.stack : String(err),
      );
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32400,
          message: {
            ru: 'Системная ошибка',
            uz: 'Tizim xatosi',
            en: 'System error',
          },
        },
      };
    }
  }

  private authorized(header?: string) {
    if (!this.expectedAuth || !header) return false;
    return timingSafeEqual(digest(header), this.expectedAuth);
  }

  private dispatch(method: string, params: Params) {
    switch (method) {
      case 'CheckPerformTransaction':
        return this.checkPerform(params);
      case 'CreateTransaction':
        return this.create(params);
      case 'PerformTransaction':
        return this.perform(params);
      case 'CancelTransaction':
        return this.cancel(params);
      case 'CheckTransaction':
        return this.check(params);
      case 'GetStatement':
        return this.statement(params);
      default:
        throw errors.method(method);
    }
  }

  private async checkPerform(params: Params) {
    const amount = number(params, 'amount');
    return this.transactions.manager.transaction(async (manager) => {
      const { order } = await this.payableOrder(manager, params.account);
      assertAmount(order, amount);
      const detail = this.receipt(order);
      return { allow: true, ...(detail && { detail }) };
    });
  }

  private async create(params: Params) {
    const paymeId = string(params, 'id');
    const time = number(params, 'time');
    const amount = number(params, 'amount');

    // A timed-out transaction is cancelled (and that is saved) before the
    // error is sent, so the error is thrown after the commit.
    let timedOut = false;
    const result = await this.transactions.manager.transaction(
      async (manager) => {
        const existing = await manager.findOne(PaymeTransaction, {
          where: { paymeId },
          lock: { mode: 'pessimistic_write' },
        });
        if (existing) {
          if (existing.state !== PaymeState.Created)
            throw errors.cannotPerform();
          if (expired(existing)) {
            await this.expire(manager, existing);
            timedOut = true;
            return null;
          }
          return createResult(existing);
        }

        // Locks the order: one active transaction per order at a time.
        const { order } = await this.payableOrder(manager, params.account);
        assertAmount(order, amount);
        const active = await manager.findOneBy(PaymeTransaction, {
          orderId: order.id,
          state: PaymeState.Created,
        });
        if (active) {
          if (!expired(active)) throw errors.orderBusy();
          await this.expire(manager, active);
        }

        const created = await manager.save(
          manager.create(PaymeTransaction, {
            paymeId,
            orderId: order.id,
            amount,
            state: PaymeState.Created,
            reason: null,
            paymeTime: time,
            createTime: Date.now(),
            performTime: 0,
            cancelTime: 0,
          }),
        );
        return createResult(created);
      },
    );
    if (timedOut) throw errors.cannotPerform();
    return result;
  }

  private async perform(params: Params) {
    const paymeId = string(params, 'id');
    // A timed-out transaction is cancelled (and that is saved) before the
    // error is sent, so it's done outside the transaction that rolls back.
    let timedOut = false;
    let gift: Gift | null = null;
    const result = await this.transactions.manager.transaction(
      async (manager) => {
        const tx = await this.lockTransaction(manager, paymeId);
        if (tx.state === PaymeState.Performed) return performResult(tx);
        if (tx.state !== PaymeState.Created) throw errors.cannotPerform();
        if (expired(tx)) {
          await this.expire(manager, tx);
          timedOut = true;
          return null;
        }

        const order = await manager.findOne(Order, {
          where: { id: tx.orderId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!order || order.status === OrderStatus.Paid) {
          throw errors.cannotPerform();
        }
        const taklif = order.taklifId
          ? await manager.findOne(Taklif, {
              where: { id: order.taklifId },
              lock: { mode: 'pessimistic_write' },
            })
          : null;
        if (!taklif) throw errors.invitationGone();
        // Created before the invitation was paid through another order, or
        // before its design changed: Payme cancels it, nothing is taken.
        if (taklif.paidAt || taklif.themeId !== order.themeId) {
          throw errors.cannotPerform();
        }

        const now = new Date();
        tx.state = PaymeState.Performed;
        tx.performTime = now.getTime();
        await manager.save(tx);
        await manager.update(Order, order.id, {
          status: OrderStatus.Paid,
          paidAt: now,
        });
        // Paying publishes it; the date later postponements count from is
        // fixed at the first publish.
        const wasDraft = taklif.status === TaklifStatus.Draft;
        await manager.update(Taklif, taklif.id, {
          paidAt: now,
          status: TaklifStatus.Published,
          ...(!taklif.lockedEventAt && { lockedEventAt: taklif.eventAt }),
        });
        if (wasDraft) {
          gift = await this.gifts.grantForPublish(manager, taklif, order);
        }
        this.logger.log(
          `Order ${order.id} paid (${order.amount} so'm), invitation ${taklif.slug} published`,
        );
        return performResult(tx);
      },
    );
    if (timedOut) throw errors.cannotPerform();
    // Only once committed; Payme isn't kept waiting for Telegram.
    if (gift) void this.gifts.announce(gift);
    return result;
  }

  private async cancel(params: Params) {
    const paymeId = string(params, 'id');
    const reason = number(params, 'reason');
    return this.transactions.manager.transaction(async (manager) => {
      const tx = await this.lockTransaction(manager, paymeId);
      if (tx.state === PaymeState.Created) {
        tx.state = PaymeState.CancelledBeforePerform;
        tx.reason = reason;
        tx.cancelTime = Date.now();
        await manager.save(tx);
      } else if (tx.state === PaymeState.Performed) {
        // The invitation is published: payments aren't refundable.
        throw errors.cannotCancel();
      }
      return {
        transaction: tx.id,
        cancel_time: tx.cancelTime,
        state: tx.state,
      };
    });
  }

  private async check(params: Params) {
    const tx = await this.transactions.findOneBy({
      paymeId: string(params, 'id'),
    });
    if (!tx) throw errors.notFound();
    return {
      create_time: tx.createTime,
      perform_time: tx.performTime,
      cancel_time: tx.cancelTime,
      transaction: tx.id,
      state: tx.state,
      reason: tx.reason,
    };
  }

  private async statement(params: Params) {
    const from = number(params, 'from');
    const to = number(params, 'to');
    const rows = await this.transactions.find({
      where: { paymeTime: Between(from, to) },
      order: { paymeTime: 'ASC' },
    });
    return {
      transactions: rows.map((tx) => ({
        id: tx.paymeId,
        time: tx.paymeTime,
        amount: tx.amount,
        account: { [ACCOUNT_FIELD]: tx.orderId },
        create_time: tx.createTime,
        perform_time: tx.performTime,
        cancel_time: tx.cancelTime,
        transaction: tx.id,
        state: tx.state,
        reason: tx.reason,
        receivers: null,
      })),
    };
  }

  /**
   * The order the buyer pays for, locked for the rest of the transaction;
   * fails with an account error (-31050..-31099) when it can't be paid.
   */
  private async payableOrder(manager: EntityManager, account: unknown) {
    const orderId =
      typeof account === 'object' && account !== null
        ? (account as Record<string, unknown>)[ACCOUNT_FIELD]
        : undefined;
    if (typeof orderId !== 'string' || !isUUID(orderId)) {
      throw errors.orderNotFound();
    }
    const order = await manager.findOne(Order, {
      where: { id: orderId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!order) throw errors.orderNotFound();
    if (order.status === OrderStatus.Paid) throw errors.orderPaid();
    const taklif = order.taklifId
      ? await manager.findOneBy(Taklif, { id: order.taklifId })
      : null;
    if (!taklif) throw errors.invitationGone();
    // Paid through another order meanwhile.
    if (taklif.paidAt) throw errors.orderPaid();
    // The price was for this design; a changed design needs a new order.
    if (taklif.themeId !== order.themeId) throw errors.orderOutdated();
    return { order, taklif };
  }

  private async lockTransaction(manager: EntityManager, paymeId: string) {
    const tx = await manager.findOne(PaymeTransaction, {
      where: { paymeId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!tx) throw errors.notFound();
    return tx;
  }

  private async expire(manager: EntityManager, tx: PaymeTransaction) {
    tx.state = PaymeState.CancelledBeforePerform;
    tx.reason = REASON_TIMEOUT;
    tx.cancelTime = Date.now();
    await manager.save(tx);
  }

  /** Fiscal receipt lines, once the service's IKPU and package code are set. */
  private receipt(order: Order) {
    const code = this.config.get<string>('payme.ikpu');
    const packageCode = this.config.get<string>('payme.packageCode');
    if (!code || !packageCode) return null;
    return {
      receipt_type: 0,
      items: [
        {
          title: order.title.slice(0, 128),
          price: order.amount * 100,
          count: 1,
          code,
          package_code: packageCode,
          vat_percent: this.config.get<number>('payme.vatPercent') ?? 0,
        },
      ],
    };
  }
}

const digest = (value: string) => createHash('sha256').update(value).digest();

const expired = (tx: PaymeTransaction) =>
  Date.now() - tx.createTime > TIMEOUT_MS;

/** Payme sends tiyin; orders are in whole so'm. */
function assertAmount(order: Order, amount: number) {
  if (amount !== order.amount * 100) throw errors.amount();
}

function number(params: Params, field: string) {
  const value = params[field];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw errors.invalidRequest(field);
  }
  return value;
}

function string(params: Params, field: string) {
  const value = params[field];
  if (typeof value !== 'string' || !value || value.length > 25) {
    throw errors.invalidRequest(field);
  }
  return value;
}

const createResult = (tx: PaymeTransaction) => ({
  create_time: tx.createTime,
  transaction: tx.id,
  state: tx.state,
});

const performResult = (tx: PaymeTransaction) => ({
  transaction: tx.id,
  perform_time: tx.performTime,
  state: tx.state,
});
