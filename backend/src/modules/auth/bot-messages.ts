/** The site's locales; uz-Cyrl is Uzbek in Cyrillic. */
export type BotLocale = 'uz' | 'uz-Cyrl' | 'ru' | 'en';

export const BOT_LOCALES: readonly BotLocale[] = ['uz', 'uz-Cyrl', 'ru', 'en'];

/** What the login bot says. `{site}` is the site's address. */
export const BOT_MESSAGES: Record<
  BotLocale,
  {
    askContact: string;
    shareButton: string;
    done: string;
    expired: string;
    notOwn: string;
    otherAccount: string;
    welcome: string;
  }
> = {
  uz: {
    askContact:
      'Siz {site} saytiga kiryapsiz. Telefon raqamingizni yuborish uchun quyidagi tugmani bosing.\n\nAgar bu havolani {site} saytida oʻzingiz ochmagan boʻlsangiz, raqamingizni yubormang.',
    shareButton: '📱 Raqamni yuborish',
    done: '✅ Tayyor! Saytga qayting — siz tizimga kirdingiz.',
    expired:
      'Bu kirish havolasining muddati tugagan. Saytga qaytib, «Telegram orqali kirish» tugmasini qayta bosing.',
    notOwn: 'Iltimos, quyidagi tugma orqali oʻz raqamingizni yuboring.',
    otherAccount:
      'Bu havola boshqa Telegram akkauntidan ochilgan. Saytda qaytadan boshlang.',
    welcome:
      'Bu bot orqali {site} saytiga kirasiz. Saytdagi kirish sahifasini oching va «Telegram orqali kirish» tugmasini bosing.',
  },
  'uz-Cyrl': {
    askContact:
      'Сиз {site} сайтига киряпсиз. Телефон рақамингизни юбориш учун қуйидаги тугмани босинг.\n\nАгар бу ҳаволани {site} сайтида ўзингиз очмаган бўлсангиз, рақамингизни юборманг.',
    shareButton: '📱 Рақамни юбориш',
    done: '✅ Тайёр! Сайтга қайтинг — сиз тизимга кирдингиз.',
    expired:
      'Бу кириш ҳаволасининг муддати тугаган. Сайтга қайтиб, «Телеграм орқали кириш» тугмасини қайта босинг.',
    notOwn: 'Илтимос, қуйидаги тугма орқали ўз рақамингизни юборинг.',
    otherAccount:
      'Бу ҳавола бошқа Телеграм аккаунтидан очилган. Сайтда қайтадан бошланг.',
    welcome:
      'Бу бот орқали {site} сайтига кирасиз. Сайтдаги кириш саҳифасини очинг ва «Телеграм орқали кириш» тугмасини босинг.',
  },
  ru: {
    askContact:
      'Вы входите на сайт {site}. Нажмите кнопку ниже, чтобы отправить свой номер телефона.\n\nЕсли вы не открывали эту ссылку сами на {site}, не отправляйте номер.',
    shareButton: '📱 Отправить номер',
    done: '✅ Готово! Вернитесь на сайт — вы вошли.',
    expired:
      'Срок действия ссылки для входа истёк. Вернитесь на сайт и снова нажмите «Войти через Telegram».',
    notOwn: 'Пожалуйста, отправьте свой номер кнопкой ниже.',
    otherAccount:
      'Эта ссылка уже открыта в другом аккаунте Telegram. Начните заново на сайте.',
    welcome:
      'Через этого бота выполняется вход на {site}. Откройте страницу входа на сайте и нажмите «Войти через Telegram».',
  },
  en: {
    askContact:
      "You're logging in to {site}. Tap the button below to share your phone number.\n\nIf you didn't open this link yourself on {site}, don't share your number.",
    shareButton: '📱 Share phone number',
    done: "✅ Done! Go back to the site — you're logged in.",
    expired:
      'This login link has expired. Go back to the site and tap “Log in with Telegram” again.',
    notOwn: 'Please share your own number with the button below.',
    otherAccount:
      'This link was opened from another Telegram account. Start again on the site.',
    welcome:
      'This bot logs you in to {site}. Open the login page there and tap “Log in with Telegram”.',
  },
};
