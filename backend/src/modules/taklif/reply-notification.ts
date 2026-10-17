import type { BotLocale } from '../auth/bot-messages';

/** What the owner's Telegram says when a guest replies. */
export interface ReplyNotice {
  name: string;
  attending: boolean;
  guests: number;
  message: string | null;
  /** The owner's page with all replies. */
  link: string;
}

const TEXT: Record<
  BotLocale,
  {
    title: string;
    coming: (guests: number) => string;
    notComing: string;
    all: string;
  }
> = {
  uz: {
    title: '💌 Taklifnomangizga yangi javob',
    coming: (guests) => `✅ Keladi, ${guests} kishi`,
    notComing: '❌ Kela olmaydi',
    all: 'Barcha javoblar',
  },
  ru: {
    title: '💌 Новый ответ на ваше приглашение',
    coming: (guests) => `✅ Придёт, человек: ${guests}`,
    notComing: '❌ Не сможет прийти',
    all: 'Все ответы',
  },
  en: {
    title: '💌 New reply to your invitation',
    coming: (guests) =>
      `✅ Coming, ${guests} ${guests === 1 ? 'person' : 'people'}`,
    notComing: "❌ Can't come",
    all: 'All replies',
  },
};

/** Plain text (no Markdown), so guests' names and wishes need no escaping. */
export function replyNotification(locale: BotLocale, reply: ReplyNotice) {
  const t = TEXT[locale];
  return [
    t.title,
    '',
    `👤 ${reply.name}`,
    reply.attending ? t.coming(reply.guests) : t.notComing,
    ...(reply.message ? [`💬 ${reply.message}`] : []),
    '',
    `${t.all}: ${reply.link}`,
  ].join('\n');
}
