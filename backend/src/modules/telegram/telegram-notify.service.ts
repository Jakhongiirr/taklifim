import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BOT_LOCALES, type BotLocale } from '../auth/bot-messages';
import { User } from '../users/user.entity';
import { TelegramBotService } from './telegram-bot.service';

/**
 * Messages from the site to a user, through the login bot. Users get them
 * once they've logged in with Telegram (that's when their chat is saved).
 */
@Injectable()
export class TelegramNotifyService {
  private readonly logger = new Logger(TelegramNotifyService.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly bot: TelegramBotService,
  ) {}

  /**
   * Best effort: never throws. Skips users without a saved Telegram chat.
   * `text` can be a function of the user's language.
   */
  async sendToUser(
    userId: string,
    text: string | ((locale: BotLocale) => string),
  ): Promise<void> {
    try {
      const user = await this.users.findOneBy({ id: userId });
      if (!user?.telegramId) return;
      const locale = BOT_LOCALES.includes(user.locale as BotLocale)
        ? (user.locale as BotLocale)
        : 'uz';
      await this.bot.notify(
        user.telegramId,
        typeof text === 'string' ? text : text(locale),
      );
    } catch (err) {
      this.logger.error(
        `Notifying user ${userId} failed`,
        (err as Error).stack,
      );
    }
  }
}
