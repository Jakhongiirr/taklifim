import { OPERATOR as O } from "./operator";
import type { LegalDoc } from "./types";

// Privacy policy. Lists what the product actually collects (accounts,
// invitations, guests' replies, payments), who receives it (Telegram for
// the login bot, hosting and storage, Payme for payments) and the real
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
            "Telegram akkaunt identifikatori — faqat kirish jarayonida, 5 daqiqagacha saqlanadi.",
            "Taklifnoma maʼlumotlari — ismlar, tadbir sanasi, toʻyxona nomi va manzili, suratlar, tanlangan musiqa, ixtiyoriy ravishda xarita havolasi, karta raqami va aloqa telefoni.",
            "Mehmonlarning javoblari — ism, kelish yoki kelmasligi, mehmonlar soni va ixtiyoriy tilak.",
            "Toʻlov maʼlumotlari — buyurtma (summa, dizayn, taklifnoma), Payme tranzaksiya raqami va vaqtlari. Bank kartasi maʼlumotlari faqat Payme sahifasida kiritiladi; Operator ularni olmaydi va saqlamaydi.",
            "Texnik maʼlumotlar — IP manzil (xavfsizlik va suiisteʼmolning oldini olish uchun), brauzer soʻrovlari jurnallari.",
          ],
        },
        "Mehmonlardan maʼlumot faqat ular oʻz xohishi bilan taklifnomaga javob yuborganda olinadi; xavfsizlik uchun IP manzil vaqtincha ishlatiladi. Saytda reklama yoki tahliliy kuzatuv vositalari ishlatilmaydi.",
      ],
    },
    {
      title: "Maʼlumotlar nima uchun ishlatiladi",
      body: [
        {
          list: [
            "Xizmatni koʻrsatish: hisobga kirish, taklifnomani yaratish, saqlash va mehmonlarga koʻrsatish.",
            "Mehmonlarning javoblarini taklifnoma egasiga yetkazish va tilaklarni taklifnomada koʻrsatish.",
            "Toʻlovlarni qayta ishlash va buxgalteriya hisobini yuritish.",
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
        "Mehmon qoldirgan tilak uning ismi bilan taklifnomada barcha mehmonlarga koʻrinadi. Javoblarning toʻliq roʻyxatini (kelish yoki kelmaslik, mehmonlar soni) faqat taklifnoma egasi va administratorlar koʻradi.",
        "Maʼlumotlar faqat xizmat koʻrsatish uchun zarur hollarda uzatiladi:",
        {
          list: [
            "Telegram — kirish uchun telefon raqamingizni Telegramdagi botimizga oʻzingiz yuborasiz; Telegram bu yozishmani oʻz qoidalariga koʻra saqlaydi.",
            "Hosting va fayl saqlash provayderlari — saytni va suratlarni saqlash uchun.",
            "Payme toʻlov tizimi — toʻlov uchun buyurtma raqami va summasi, chek uchun esa xizmat nomi (kelin-kuyov ismlari bilan). Karta maʼlumotlarini Payme oʻzi qabul qiladi.",
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
            "Qoralamalar — saqlanadi; ularning suratlari oxirgi tahrirdan 7 kun oʻtgach oʻchiriladi.",
            "Taklifnomalar (matni: ismlar, sana, manzil, karta va telefon raqami) — qoralamalarini egasi kabinetda oʻchirishi mumkin; eʼlon qilinganlari hisobni yoki taklifnomani oʻchirish soʻralguncha saqlanadi; suratlari tadbir sanasidan bir yil oʻtgach oʻchiriladi.",
            "Mehmonlarning javoblari — taklifnoma bilan birga oʻchiriladi; taklifnoma egasi ularni istalgan payt oʻchirishi mumkin.",
            "Toʻlov maʼlumotlari — buxgalteriya va soliq hisobi uchun qonunchilikda belgilangan muddat davomida, taklifnoma yoki hisob oʻchirilganidan keyin ham saqlanadi.",
            "Taklifnomaga biriktirilmagan suratlar — 24 soatdan soʻng oʻchiriladi.",
            "Telefon raqami (hisob) — hisobni oʻchirish soʻralguncha saqlanadi.",
            "Kirish sessiyasi — 30 kungacha amal qiladi.",
            "Soʻrovlar jurnallari (IP manzil, ochilgan sahifa, vaqt) — 30 kun saqlanadi, soʻng avtomatik oʻchiriladi.",
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
        "Bundan tashqari, mehmon javob yuborganda bu brauzer xotirasida (localStorage) eslab qolinadi, javob qayta-qayta yuborilmasligi uchun. U faqat mehmonning qurilmasida qoladi.",
      ],
    },
    {
      title: "Maʼlumotlar xavfsizligi",
      body: [
        "Maʼlumotlar shifrlangan ulanish (HTTPS) orqali uzatiladi, sessiya cookie fayllari skriptlardan himoyalangan, maʼlumotlarga kirish esa egasi va vakolatli administratorlar bilan cheklangan.",
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
            "Maʼlumotlarni oʻchirish — qoralamalarni kabinetda oʻchirish, eʼlon qilingan taklifnomalarni yoki hisobni esa oʻchirishni soʻrash orqali.",
            "Maʼlumotlarni qayta ishlashga rozilikni qaytarib olish.",
            "Mehmonlar oʻz javobi yoki tilagini oʻchirishni taklifnoma egasidan yoki Operatordan soʻrashi mumkin.",
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
            `Email: ${O.email}`,
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
            "Идентификатор аккаунта Telegram — только на время входа, до 5 минут.",
            "Данные приглашения — имена, дата торжества, название и адрес заведения, фотографии, выбранная музыка, по желанию ссылка на карту, номер карты и контактный телефон.",
            "Ответы гостей — имя, придёт ли гость, количество человек и пожелание (по желанию).",
            "Платёжные данные — заказ (сумма, дизайн, приглашение), номер и время транзакции Payme. Данные банковской карты вводятся только на странице Payme; Оператор их не получает и не хранит.",
            "Технические данные — IP-адрес (для безопасности и предотвращения злоупотреблений), журналы запросов.",
          ],
        },
        "Данные гостей поступают, только когда гость сам отправляет ответ на приглашение; для безопасности временно используется IP-адрес. Рекламные и аналитические трекеры на Сайте не используются.",
      ],
    },
    {
      title: "Для чего используются данные",
      body: [
        {
          list: [
            "Оказание услуги: вход в учётную запись, создание, хранение и показ приглашения гостям.",
            "Передача ответов гостей владельцу приглашения и показ пожеланий на приглашении.",
            "Обработка платежей и ведение бухгалтерского учёта.",
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
        "Пожелание гостя вместе с его именем видно на приглашении всем гостям. Полный список ответов (придёт ли гость, количество человек) видят только владелец приглашения и администраторы.",
        "Данные передаются только когда это необходимо для оказания услуги:",
        {
          list: [
            "Telegram — для входа вы сами отправляете номер телефона нашему боту в Telegram; Telegram хранит эту переписку по своим правилам.",
            "Провайдеры хостинга и хранения файлов — для работы сайта и хранения фотографий.",
            "Платёжная система Payme — номер заказа и сумма для оплаты, а для чека — название услуги (с именами молодожёнов). Данные карты Payme принимает сама.",
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
            "Черновики — хранятся; их фотографии удаляются через 7 дней после последнего редактирования.",
            "Приглашения (текст: имена, дата, место, номера карты и телефона) — черновики владелец может удалить в личном кабинете; опубликованные хранятся до запроса на удаление приглашения или учётной записи; их фотографии удаляются через год после даты торжества.",
            "Ответы гостей — удаляются вместе с приглашением; владелец приглашения может удалить их в любой момент.",
            "Платёжные данные — хранятся в течение срока, установленного законодательством для бухгалтерского и налогового учёта, в том числе после удаления приглашения или учётной записи.",
            "Фотографии, не прикреплённые к приглашению, — удаляются через 24 часа.",
            "Номер телефона (учётная запись) — хранится до запроса на удаление учётной записи.",
            "Сессия входа — действует до 30 дней.",
            "Журналы запросов (IP-адрес, открытая страница, время) — хранятся 30 дней, затем удаляются автоматически.",
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
        "Кроме того, когда гость отправляет ответ, это запоминается в памяти браузера (localStorage), чтобы ответ не отправлялся повторно. Эти данные остаются только на устройстве гостя.",
      ],
    },
    {
      title: "Безопасность данных",
      body: [
        "Данные передаются по защищённому соединению (HTTPS), cookie сессии защищены от скриптов, а доступ к данным ограничен их владельцем и уполномоченными администраторами.",
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
            "Удалять данные — удаляя черновики в личном кабинете, а опубликованные приглашения или учётную запись — по запросу.",
            "Отозвать согласие на обработку данных.",
            "Гости могут попросить владельца приглашения или Оператора удалить свой ответ или пожелание.",
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
            `Email: ${O.email}`,
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
            "Telegram account ID — only during login, for up to 5 minutes.",
            "Invitation data — names, event date, venue name and address, photos, chosen music, and optionally a map link, card number and contact phone.",
            "Guests' replies — name, whether they're coming, how many people, and an optional wish.",
            "Payment data — the order (amount, design, invitation) and the Payme transaction number and times. Bank card details are entered only on Payme's page; the Operator never receives or stores them.",
            "Technical data — IP address (for security and abuse prevention) and request logs.",
          ],
        },
        "Guests share data only when they choose to reply to an invitation; their IP address is used temporarily for security. The Site uses no advertising or analytics trackers.",
      ],
    },
    {
      title: "Why we use it",
      body: [
        {
          list: [
            "To provide the service: logging in, creating, storing and showing invitations to guests.",
            "To pass guests' replies to the invitation's owner and show their wishes on the invitation.",
            "To process payments and keep accounting records.",
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
        "A guest's wish is shown on the invitation with their name, to all guests. The full list of replies (who's coming, how many people) is seen only by the invitation's owner and administrators.",
        "Data is shared only where needed to provide the service:",
        {
          list: [
            "Telegram — to log in, you share your phone number with our Telegram bot yourself; Telegram keeps that chat under its own rules.",
            "Hosting and file storage providers — to run the site and store photos.",
            "Payme — the order number and amount for the payment, and for the receipt the service name (with the couple's names). Card details are taken by Payme itself.",
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
            "Drafts — kept; their photos are deleted 7 days after the last edit.",
            "Invitations (text: names, date, venue, card and phone numbers) — drafts you can delete in your account; published ones are kept until you ask for the invitation or the account to be deleted; their photos are deleted one year after the event date.",
            "Guests' replies — deleted together with the invitation; its owner can delete them at any time.",
            "Payment data — kept for the period the law requires for accounting and tax records, including after the invitation or account is deleted.",
            "Photos not attached to an invitation — deleted after 24 hours.",
            "Phone number (account) — kept until you ask for the account to be deleted.",
            "Login session — valid for up to 30 days.",
            "Request logs (IP address, page requested, time) — kept for 30 days, then deleted automatically.",
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
        "Also, when a guest sends a reply, their browser remembers it (localStorage) so it isn't sent twice. This stays only on the guest's device.",
      ],
    },
    {
      title: "Security",
      body: [
        "Data travels over an encrypted connection (HTTPS), session cookies are protected from scripts, and access to data is limited to its owner and authorized administrators.",
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
            "To delete your data — by deleting drafts in your account, or by asking us to delete published invitations or your account.",
            "To withdraw your consent to processing.",
            "Guests can ask the invitation's owner or the Operator to delete their reply or wish.",
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
            `Email: ${O.email}`,
            `Telegram: ${O.telegram}`,
          ],
        },
      ],
    },
  ],
};

export const PRIVACY: Record<string, LegalDoc> = { uz, ru, en };
