import { OPERATOR as O } from "./operator";
import type { LegalDoc } from "./types";

// Privacy policy. Lists what the product actually collects, who receives it
// (Telegram for login codes, storage and payment providers) and the real
// retention rules. Keep in sync when data handling changes. Not legal advice.

const uz: LegalDoc = {
  title: "Maxfiylik siyosati",
  intro: [
    `Ushbu siyosat ${O.name} (keyingi oʻrinlarda — «Operator») ${O.site} sayti foydalanuvchilari va mehmonlarining shaxsga doir maʼlumotlarini qanday yigʻishi, ishlatishi va himoya qilishini tushuntiradi.`,
    "Maʼlumotlar Oʻzbekiston Respublikasining «Shaxsga doir maʼlumotlar toʻgʻrisida»gi Qonuni va boshqa qonun hujjatlariga muvofiq qayta ishlanadi. Saytdan foydalanish orqali siz ushbu siyosatga rozilik bildirasiz.",
  ],
  sections: [
    {
      title: "Qanday maʼlumotlar yigʻiladi",
      body: [
        {
          list: [
            "Telefon raqami — roʻyxatdan oʻtish va kirish uchun.",
            "Tasdiqlash kodi — faqat shifrlangan koʻrinishda, 5 daqiqagacha saqlanadi.",
            "Taklifnoma maʼlumotlari — ismlar, tadbir sanasi, toʻyxona nomi va manzili, xarita havolasi, suratlar, tanlangan musiqa, ixtiyoriy ravishda karta raqami va aloqa telefoni.",
            "Texnik maʼlumotlar — IP manzil (xavfsizlik va suiisteʼmolning oldini olish uchun), brauzer soʻrovlari jurnallari.",
          ],
        },
        "Mehmonlardan shaxsiy maʼlumot soʻralmaydi; xavfsizlik uchun faqat IP manzil vaqtincha ishlatiladi. Saytda reklama yoki tahliliy kuzatuv vositalari ishlatilmaydi.",
      ],
    },
    {
      title: "Maʼlumotlar nima uchun ishlatiladi",
      body: [
        {
          list: [
            "Xizmatni koʻrsatish: hisobga kirish, taklifnomani yaratish, saqlash va mehmonlarga koʻrsatish.",
            "Toʻlovlarni qayta ishlash.",
            "Xavfsizlik: soʻrovlar sonini cheklash va suiisteʼmolning oldini olish.",
            "Foydalanuvchi murojaatlariga javob berish va qonun talablarini bajarish.",
          ],
        },
      ],
    },
    {
      title: "Maʼlumotlarni kim koʻradi",
      body: [
        "Eʼlon qilingan taklifnoma mazmuni (ismlar, sana, manzil, suratlar, karta raqami va telefon) havolaga ega har qanday shaxsga koʻrinadi. Havolani kimga yuborishni Foydalanuvchining oʻzi hal qiladi.",
        "Maʼlumotlar faqat xizmat koʻrsatish uchun zarur hollarda uzatiladi:",
        {
          list: [
            "Telegram — tasdiqlash kodini yetkazish uchun telefon raqami Telegram Gateway xizmatiga yuboriladi.",
            "Hosting va fayl saqlash provayderlari — saytni va suratlarni saqlash uchun.",
            "Toʻlov tizimlari — toʻlov amalga oshirilganda, toʻlov uchun zarur maʼlumotlar.",
            "Davlat organlari — faqat qonunda nazarda tutilgan hollarda.",
          ],
        },
        "Operator shaxsga doir maʼlumotlarni sotmaydi va reklama maqsadida uchinchi shaxslarga bermaydi.",
      ],
    },
    {
      title: "Saqlash muddatlari",
      body: [
        {
          list: [
            "Qoralamalar — oxirgi tahrirdan 24 soat oʻtgach suratlari bilan birga oʻchiriladi.",
            "Eʼlon qilingan taklifnomalar va ularning suratlari — tadbir sanasidan bir oy oʻtgach oʻchiriladi.",
            "Taklifnomaga biriktirilmagan suratlar — 24 soatdan soʻng oʻchiriladi.",
            "Telefon raqami (hisob) — hisobni oʻchirish soʻralguncha saqlanadi.",
            "Kirish sessiyasi — 30 kungacha amal qiladi.",
          ],
        },
      ],
    },
    {
      title: "Cookie fayllar",
      body: [
        "Sayt faqat ishlash uchun zarur cookie fayllardan foydalanadi:",
        {
          list: [
            "access_token va refresh_token — hisobga kirgan holatni saqlash uchun (httpOnly, JavaScript orqali oʻqib boʻlmaydi).",
            "NEXT_LOCALE — tanlangan til.",
          ],
        },
      ],
    },
    {
      title: "Maʼlumotlar xavfsizligi",
      body: [
        "Maʼlumotlar shifrlangan ulanish (HTTPS) orqali uzatiladi, tasdiqlash kodlari shifrlangan koʻrinishda saqlanadi, sessiya cookie fayllari skriptlardan himoyalangan, maʼlumotlarga kirish esa egasi va vakolatli administratorlar bilan cheklangan.",
        "Oʻzbekiston fuqarolarining shaxsga doir maʼlumotlari qonun talabiga muvofiq Oʻzbekiston Respublikasi hududidagi serverlarda saqlanadi.",
      ],
    },
    {
      title: "Sizning huquqlaringiz",
      body: [
        {
          list: [
            "Oʻz maʼlumotlaringiz haqida maʼlumot olish.",
            "Maʼlumotlarni tuzatish — taklifnomani kabinetda tahrirlash orqali.",
            "Maʼlumotlarni oʻchirish — qoralamalarni kabinetda oʻchirish yoki hisobni oʻchirishni soʻrash orqali.",
            "Maʼlumotlarni qayta ishlashga rozilikni qaytarib olish.",
          ],
        },
        `Soʻrovlarni ${O.email} yoki ${O.telegram} orqali yuboring.`,
      ],
    },
    {
      title: "Yosh chegarasi",
      body: [
        "Sayt 16 yoshga toʻlmagan shaxslar tomonidan hisob ochish uchun moʻljallanmagan.",
      ],
    },
    {
      title: "Siyosatning oʻzgarishi va aloqa",
      body: [
        "Operator ushbu siyosatni oʻzgartirishi mumkin; yangi tahrir Saytda eʼlon qilingan kundan kuchga kiradi.",
        {
          list: [
            O.name,
            `Manzil: ${O.address}`,
            `Email: ${O.email}`,
            `Telefon: ${O.phone}`,
            `Telegram: ${O.telegram}`,
          ],
        },
      ],
    },
  ],
};

const ru: LegalDoc = {
  title: "Политика конфиденциальности",
  intro: [
    `Настоящая политика объясняет, как ${O.name} (далее — «Оператор») собирает, использует и защищает персональные данные пользователей и гостей сайта ${O.site}.`,
    "Данные обрабатываются в соответствии с Законом Республики Узбекистан «О персональных данных» и иными актами законодательства. Используя Сайт, вы соглашаетесь с настоящей политикой.",
  ],
  sections: [
    {
      title: "Какие данные собираются",
      body: [
        {
          list: [
            "Номер телефона — для регистрации и входа.",
            "Код подтверждения — хранится только в зашифрованном виде, до 5 минут.",
            "Данные приглашения — имена, дата торжества, название и адрес заведения, ссылка на карту, фотографии, выбранная музыка, по желанию номер карты и контактный телефон.",
            "Технические данные — IP-адрес (для безопасности и предотвращения злоупотреблений), журналы запросов.",
          ],
        },
        "У гостей личные данные не запрашиваются; для безопасности временно используется только IP-адрес. Рекламные и аналитические трекеры на Сайте не используются.",
      ],
    },
    {
      title: "Для чего используются данные",
      body: [
        {
          list: [
            "Оказание услуги: вход в учётную запись, создание, хранение и показ приглашения гостям.",
            "Обработка платежей.",
            "Безопасность: ограничение числа запросов и предотвращение злоупотреблений.",
            "Ответы на обращения пользователей и выполнение требований закона.",
          ],
        },
      ],
    },
    {
      title: "Кто видит данные",
      body: [
        "Содержимое опубликованного приглашения (имена, дата, адрес, фотографии, номер карты и телефон) видно любому, у кого есть ссылка. Кому отправлять ссылку, решает сам Пользователь.",
        "Данные передаются только когда это необходимо для оказания услуги:",
        {
          list: [
            "Telegram — для доставки кода подтверждения номер телефона передаётся в сервис Telegram Gateway.",
            "Провайдеры хостинга и хранения файлов — для работы сайта и хранения фотографий.",
            "Платёжные системы — при оплате, данные, необходимые для платежа.",
            "Государственные органы — только в случаях, предусмотренных законом.",
          ],
        },
        "Оператор не продаёт персональные данные и не передаёт их третьим лицам в рекламных целях.",
      ],
    },
    {
      title: "Сроки хранения",
      body: [
        {
          list: [
            "Черновики — удаляются вместе с фотографиями через 24 часа после последнего редактирования.",
            "Опубликованные приглашения и их фотографии — удаляются через месяц после даты торжества.",
            "Фотографии, не прикреплённые к приглашению, — удаляются через 24 часа.",
            "Номер телефона (учётная запись) — хранится до запроса на удаление учётной записи.",
            "Сессия входа — действует до 30 дней.",
          ],
        },
      ],
    },
    {
      title: "Файлы cookie",
      body: [
        "Сайт использует только необходимые для работы файлы cookie:",
        {
          list: [
            "access_token и refresh_token — чтобы сохранять вход в учётную запись (httpOnly, недоступны для JavaScript).",
            "NEXT_LOCALE — выбранный язык.",
          ],
        },
      ],
    },
    {
      title: "Безопасность данных",
      body: [
        "Данные передаются по защищённому соединению (HTTPS), коды подтверждения хранятся в зашифрованном виде, cookie сессии защищены от скриптов, а доступ к данным ограничен их владельцем и уполномоченными администраторами.",
        "Персональные данные граждан Узбекистана в соответствии с требованием закона хранятся на серверах на территории Республики Узбекистан.",
      ],
    },
    {
      title: "Ваши права",
      body: [
        {
          list: [
            "Получать сведения о своих данных.",
            "Исправлять данные — через редактирование приглашения в кабинете.",
            "Удалять данные — удаляя черновики в кабинете или запросив удаление учётной записи.",
            "Отозвать согласие на обработку данных.",
          ],
        },
        `Запросы направляйте на ${O.email} или в ${O.telegram}.`,
      ],
    },
    {
      title: "Возрастное ограничение",
      body: [
        "Сайт не предназначен для создания учётных записей лицами младше 16 лет.",
      ],
    },
    {
      title: "Изменения политики и контакты",
      body: [
        "Оператор вправе изменять настоящую политику; новая редакция вступает в силу с момента публикации на Сайте.",
        {
          list: [
            O.name,
            `Адрес: ${O.address}`,
            `Email: ${O.email}`,
            `Телефон: ${O.phone}`,
            `Telegram: ${O.telegram}`,
          ],
        },
      ],
    },
  ],
};

const en: LegalDoc = {
  title: "Privacy Policy",
  intro: [
    `This policy explains how ${O.name} (the "Operator") collects, uses and protects the personal data of users and guests of the ${O.site} website.`,
    'Data is processed in accordance with the Law of the Republic of Uzbekistan "On Personal Data" and other legislation. By using the Site you agree to this policy.',
  ],
  sections: [
    {
      title: "What we collect",
      body: [
        {
          list: [
            "Phone number — to register and log in.",
            "Confirmation code — stored only in encrypted form, for up to 5 minutes.",
            "Invitation data — names, event date, venue name and address, map link, photos, chosen music, and optionally a card number and contact phone.",
            "Technical data — IP address (for security and abuse prevention) and request logs.",
          ],
        },
        "Guests are not asked for personal data; only their IP address is used temporarily for security. The Site uses no advertising or analytics trackers.",
      ],
    },
    {
      title: "Why we use it",
      body: [
        {
          list: [
            "To provide the service: logging in, creating, storing and showing invitations to guests.",
            "To process payments.",
            "For security: rate limiting and abuse prevention.",
            "To answer user requests and meet legal obligations.",
          ],
        },
      ],
    },
    {
      title: "Who sees your data",
      body: [
        "The content of a published invitation (names, date, address, photos, card number and phone) is visible to anyone with the link. The User decides whom to send the link to.",
        "Data is shared only where needed to provide the service:",
        {
          list: [
            "Telegram — the phone number is sent to the Telegram Gateway service to deliver the confirmation code.",
            "Hosting and file storage providers — to run the site and store photos.",
            "Payment systems — when paying, the data required for the payment.",
            "Government authorities — only where required by law.",
          ],
        },
        "The Operator does not sell personal data or share it with third parties for advertising.",
      ],
    },
    {
      title: "How long we keep it",
      body: [
        {
          list: [
            "Drafts — deleted with their photos 24 hours after the last edit.",
            "Published invitations and their photos — deleted one month after the event date.",
            "Photos not attached to an invitation — deleted after 24 hours.",
            "Phone number (account) — kept until you ask for the account to be deleted.",
            "Login session — valid for up to 30 days.",
          ],
        },
      ],
    },
    {
      title: "Cookies",
      body: [
        "The Site uses only the cookies it needs to work:",
        {
          list: [
            "access_token and refresh_token — to keep you logged in (httpOnly, not readable by JavaScript).",
            "NEXT_LOCALE — your chosen language.",
          ],
        },
      ],
    },
    {
      title: "Security",
      body: [
        "Data travels over an encrypted connection (HTTPS), confirmation codes are stored encrypted, session cookies are protected from scripts, and access to data is limited to its owner and authorized administrators.",
        "As required by law, the personal data of citizens of Uzbekistan is stored on servers located in the Republic of Uzbekistan.",
      ],
    },
    {
      title: "Your rights",
      body: [
        {
          list: [
            "To get information about your data.",
            "To correct your data — by editing your invitation in your account.",
            "To delete your data — by deleting drafts in your account or asking for your account to be deleted.",
            "To withdraw your consent to processing.",
          ],
        },
        `Send requests to ${O.email} or ${O.telegram}.`,
      ],
    },
    {
      title: "Age limit",
      body: ["The Site is not intended for accounts of people under 16."],
    },
    {
      title: "Changes and contact",
      body: [
        "The Operator may change this policy; a new version takes effect once published on the Site.",
        {
          list: [
            O.name,
            `Address: ${O.address}`,
            `Email: ${O.email}`,
            `Phone: ${O.phone}`,
            `Telegram: ${O.telegram}`,
          ],
        },
      ],
    },
  ],
};

export const PRIVACY: Record<string, LegalDoc> = { uz, ru, en };
