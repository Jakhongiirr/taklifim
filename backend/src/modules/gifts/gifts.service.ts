import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';
import type { Order } from '../payments/order.entity';
import { TelegramNotifyService } from '../telegram/telegram-notify.service';
import { Theme } from '../themes/theme.entity';
import { MyGiftsDto } from './dto/my-gifts.dto';
import { Gift } from './gift.entity';

/** The design gifts publish for free (its theme's `themeId`). */
export const GIFT_THEME_ID = 'plov';

const giftMessage = (cabinetUrl: string) =>
  `🎁 Sizga sovgʻa tayyorlab qoʻydik — osh taklifnomasi, olish uchun kabinetingizga oʻting: ${cabinetUrl}`;

/**
 * Free plov invitations: every paid order (above 0 so'm) gives its buyer
 * one, announced on Telegram, and publishing a plov draft uses one up
 * instead of paying.
 */
@Injectable()
export class GiftsService {
  private readonly logger = new Logger(GiftsService.name);

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(Gift) private readonly gifts: Repository<Gift>,
    @InjectRepository(Theme) private readonly themes: Repository<Theme>,
    private readonly telegram: TelegramNotifyService,
  ) {}

  /**
   * Gives the order's buyer a gift, inside the transaction that marks the
   * order paid. Nothing for free orders or while the plov design isn't
   * active. Returns the gift to announce once the transaction commits.
   */
  async grant(manager: EntityManager, order: Order): Promise<Gift | null> {
    if (order.amount <= 0 || !order.userId) return null;
    const theme = await manager.findOne(Theme, {
      where: { themeId: GIFT_THEME_ID, archivedAt: IsNull() },
    });
    if (!theme) return null;
    const result = await manager
      .createQueryBuilder()
      .insert()
      .into(Gift)
      .values({ userId: order.userId, orderId: order.id })
      .orIgnore()
      .returning('*')
      .execute();
    return (result.raw as Gift[])[0] ?? null;
  }

  /** Tells the gift's owner on Telegram. Never throws. */
  async announce(gift: Gift) {
    const site = this.config.get<string>('siteUrl') ?? '';
    await this.telegram
      .sendToUser(gift.userId, giftMessage(`${site}/uz/cabinet`))
      .catch((err: Error) =>
        this.logger.warn(`Gift notice for ${gift.id} failed: ${err.message}`),
      );
  }

  /**
   * Uses one of the user's gifts for the invitation, inside the
   * transaction that publishes it. False when they have none left.
   */
  async redeem(
    manager: EntityManager,
    userId: string,
    taklifId: string,
  ): Promise<boolean> {
    const gift = await manager
      .getRepository(Gift)
      .createQueryBuilder('gift')
      .where('gift.userId = :userId AND gift.usedAt IS NULL', { userId })
      .orderBy('gift.createdAt', 'ASC')
      .setLock('pessimistic_write')
      .setOnLocked('skip_locked')
      .getOne();
    if (!gift) return false;
    await manager.update(Gift, gift.id, { taklifId, usedAt: new Date() });
    return true;
  }

  async mine(userId: string): Promise<MyGiftsDto> {
    const [available, theme] = await Promise.all([
      this.gifts.count({ where: { userId, usedAt: IsNull() } }),
      this.themes.findOne({
        where: { themeId: GIFT_THEME_ID, archivedAt: IsNull() },
      }),
    ]);
    return { available, themeId: theme?.id ?? null };
  }
}
