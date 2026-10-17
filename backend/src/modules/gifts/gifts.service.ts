import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';
import type { Order } from '../payments/order.entity';
import type { Taklif } from '../taklif/taklif.entity';
import { TelegramNotifyService } from '../telegram/telegram-notify.service';
import { Theme } from '../themes/theme.entity';
import { MyGiftsDto } from './dto/my-gifts.dto';
import { Gift } from './gift.entity';

/** The design gifts publish for free (its theme's `themeId`). */
export const GIFT_THEME_ID = 'plov';

const giftMessage = (cabinetUrl: string) =>
  `🎁 Sizga sovgʻa tayyorlab qoʻydik — osh taklifnomasi, olish uchun kabinetingizga oʻting: ${cabinetUrl}`;

/**
 * Free plov invitations: every paid invitation, once it goes from draft to
 * published, gives its owner one, announced on Telegram; publishing a plov
 * draft uses one up instead of paying.
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
   * Gives the owner a gift for an invitation going from draft to published,
   * inside the transaction that publishes it. Only paid invitations count:
   * nothing for a free design or one published with a gift, nor while the
   * plov design isn't active; and only once per invitation. `order` is the
   * Payme order that paid for it, if any. Returns the gift to announce once
   * the transaction commits.
   */
  async grantForPublish(
    manager: EntityManager,
    taklif: Pick<Taklif, 'id' | 'userId' | 'themeId'>,
    order?: Pick<Order, 'id' | 'amount'>,
  ): Promise<Gift | null> {
    if (order) {
      if (order.amount <= 0) return null;
    } else {
      const theme = await manager.findOne(Theme, {
        where: { id: taklif.themeId },
      });
      if (!theme || theme.price <= 0) return null;
    }
    if (await manager.exists(Gift, { where: { taklifId: taklif.id } })) {
      return null; // published with a gift
    }
    const plov = await manager.findOne(Theme, {
      where: { themeId: GIFT_THEME_ID, archivedAt: IsNull() },
    });
    if (!plov) return null;
    const result = await manager
      .createQueryBuilder()
      .insert()
      .into(Gift)
      .values({
        userId: taklif.userId,
        sourceTaklifId: taklif.id,
        orderId: order?.id ?? null,
      })
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
