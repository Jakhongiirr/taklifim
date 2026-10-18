import {
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import type { JwtPayload } from '../auth/auth.types';
import { GIFT_THEME_ID, GiftsService } from '../gifts/gifts.service';
import { TaklifStatus } from '../taklif/taklif-status.enum';
import { Taklif } from '../taklif/taklif.entity';
import { CheckoutDto, CheckoutResultDto } from './dto/checkout.dto';
import { ListOrdersQueryDto } from './dto/list-orders-query.dto';
import { AdminOrderPageDto } from './dto/order.dto';
import { Order, OrderStatus } from './order.entity';
import { PaymeTransaction } from './payme-transaction.entity';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Taklif) private readonly taklifs: Repository<Taklif>,
    @InjectRepository(PaymeTransaction)
    private readonly transactions: Repository<PaymeTransaction>,
    private readonly gifts: GiftsService,
  ) {}

  /**
   * Starts paying for the owner's draft: an order at the design's current
   * price and the Payme checkout link for it (an unpaid order for the same
   * design and price is reused). A free design is published right away,
   * and so is a plov draft while the owner has a free plov gift.
   */
  async checkout(
    taklifId: string,
    { lang }: CheckoutDto,
    user: JwtPayload,
  ): Promise<CheckoutResultDto> {
    const taklif = await this.taklifs.findOne({
      where: { id: taklifId },
      relations: { theme: true },
    });
    if (!taklif || taklif.userId !== user.sub) {
      throw new NotFoundException('Invitation not found');
    }
    if (taklif.paidAt) throw new ConflictException('Already paid');
    if (taklif.status !== TaklifStatus.Draft) {
      throw new ConflictException('Only drafts are paid for');
    }
    const amount = taklif.theme.price;
    const title = `Taklifnoma: ${taklif.groomName} & ${taklif.brideName}`;

    if (amount === 0) {
      await this.orders.manager.transaction(async (manager) => {
        if (await this.stillDraft(manager, taklif.id)) {
          await this.publishFree(manager, taklif, title);
        }
      });
      return { published: true };
    }
    if (taklif.theme.themeId === GIFT_THEME_ID) {
      const gifted = await this.orders.manager.transaction(async (manager) => {
        // Published meanwhile (a double tap): no second gift is used.
        if (!(await this.stillDraft(manager, taklif.id))) return true;
        if (!(await this.gifts.redeem(manager, user.sub, taklif.id))) {
          return false;
        }
        await this.publishFree(manager, taklif, title);
        return true;
      });
      if (gifted) return { published: true };
    }

    const merchantId = this.config.get<string>('payme.merchantId');
    if (!merchantId || !this.config.get<string>('payme.key')) {
      throw new ServiceUnavailableException('Payments are not configured');
    }
    const order =
      (await this.orders.findOne({
        where: {
          taklifId: taklif.id,
          themeId: taklif.themeId,
          amount,
          status: OrderStatus.Pending,
        },
        order: { createdAt: 'DESC' },
      })) ??
      (await this.orders.save(
        this.orders.create({
          taklifId: taklif.id,
          userId: user.sub,
          themeId: taklif.themeId,
          amount,
          title,
        }),
      ));
    if (order.title !== title) await this.orders.update(order.id, { title });

    // Back to the cabinet, which confirms the payment (a hash: Payme's
    // parameters are "key=value" pairs joined by ";").
    const site = this.config.get<string>('siteUrl') ?? '';
    const returnUrl = `${site}/${lang}/cabinet#paid-${taklif.slug}`;
    const params = [
      `m=${merchantId}`,
      `ac.order_id=${order.id}`,
      `a=${amount * 100}`,
      `c=${returnUrl}`,
      `l=${lang}`,
    ].join(';');
    const base = this.config.get<string>('payme.checkoutUrl');
    return {
      url: `${base}/${Buffer.from(params).toString('base64')}`,
      published: false,
    };
  }

  /**
   * Locks the invitation until the transaction ends, so concurrent checkouts
   * publish it (and use a gift) once; false if it's no longer an unpaid draft.
   */
  private async stillDraft(manager: EntityManager, id: string) {
    const taklif = await manager.findOne(Taklif, {
      where: { id },
      lock: { mode: 'pessimistic_write' },
    });
    return taklif?.status === TaklifStatus.Draft && !taklif.paidAt;
  }

  /** Publishes the draft with a paid 0 so'm order (nothing owed). */
  private async publishFree(
    manager: EntityManager,
    taklif: Taklif,
    title: string,
  ) {
    const now = new Date();
    await manager.save(
      manager.create(Order, {
        taklifId: taklif.id,
        userId: taklif.userId,
        themeId: taklif.themeId,
        amount: 0,
        title,
        status: OrderStatus.Paid,
        paidAt: now,
      }),
    );
    await manager.update(Taklif, taklif.id, {
      paidAt: now,
      status: TaklifStatus.Published,
      ...(!taklif.lockedEventAt && { lockedEventAt: taklif.eventAt }),
    });
  }

  /** Orders, newest first, with the latest Payme transaction of each. */
  async list(query: ListOrdersQueryDto): Promise<AdminOrderPageDto> {
    const { status, page, limit } = query;
    const [rows, total] = await this.orders.findAndCount({
      where: status ? { status } : {},
      relations: { taklif: true, user: true, theme: true },
      order: { createdAt: 'DESC', id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    const txs = rows.length
      ? await this.transactions.find({
          where: { orderId: In(rows.map((o) => o.id)) },
          order: { createTime: 'DESC' },
        })
      : [];
    const latest = new Map<string, PaymeTransaction>();
    for (const tx of txs)
      if (!latest.has(tx.orderId)) latest.set(tx.orderId, tx);
    return {
      items: rows.map((order) => {
        const tx = latest.get(order.id);
        return {
          id: order.id,
          title: order.title,
          amount: order.amount,
          status: order.status,
          paidAt: order.paidAt,
          createdAt: order.createdAt,
          taklif: order.taklif
            ? { id: order.taklif.id, slug: order.taklif.slug }
            : null,
          user: order.user
            ? { id: order.user.id, phone: order.user.phone }
            : null,
          themeId: order.theme?.themeId ?? null,
          payme: tx
            ? { id: tx.paymeId, state: tx.state, reason: tx.reason }
            : null,
        };
      }),
      total,
      page,
      limit,
    };
  }
}
