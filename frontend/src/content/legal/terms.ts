import { OPERATOR as O } from "./operator";
import type { LegalDoc } from "./types";

// Public offer (terms of service). Mirrors how the product actually works:
// free drafts, payment (Payme) publishing the invitation, a paid design
// being locked, retention and postponement rules.
// Not legal advice: have it reviewed by a lawyer before launch.

const uz: LegalDoc = {
  title: "Ommaviy oferta",
  intro: [
    `Ushbu hujjat ${O.name} (keyingi oʻrinlarda — «Operator») tomonidan ${O.site} sayti (keyingi oʻrinlarda — «Sayt») orqali elektron taklifnoma yaratish xizmatini koʻrsatish boʻyicha ommaviy taklif (oferta) hisoblanadi.`,
    "Saytda roʻyxatdan oʻtish, undan foydalanish yoki xizmat uchun toʻlov qilish ushbu oferta shartlarini toʻliq va soʻzsiz qabul qilinganini (aksept) bildiradi.",
  ],
  sections: [
    {
      title: "Atamalar",
      body: [
        {
          list: [
            "Foydalanuvchi — Saytda telefon raqami orqali roʻyxatdan oʻtgan va taklifnoma yaratuvchi shaxs.",
            "Mehmon — taklifnoma havolasini olgan va uni ochgan shaxs.",
            "Taklifnoma — Foydalanuvchi tanlagan dizayn asosida yaratilgan elektron sahifa.",
            "Dizayn — Saytda taqdim etilgan taklifnoma shabloni.",
            "Qoralama — hali eʼlon qilinmagan taklifnoma.",
          ],
        },
      ],
    },
    {
      title: "Xizmat tavsifi",
      body: [
        "Foydalanuvchi taklifnomani bepul yaratishi, tahrirlashi va oldindan koʻrishi mumkin. Taklifnoma toʻlovdan soʻng eʼlon qilinadi va shaxsiy havola orqali mehmonlarga ochiq boʻladi.",
        "Eʼlon qilingan taklifnomani Foydalanuvchi istalgan vaqtda tahrirlashi, yashirishi va qayta eʼlon qilishi mumkin.",
      ],
    },
    {
      title: "Narx va toʻlov",
      body: [
        "Xizmat narxi tanlangan dizaynga bogʻliq va Saytda soʻmda koʻrsatiladi. Toʻlov paytida koʻrsatilgan narx amal qiladi; keyingi narx oʻzgarishlari toʻlangan taklifnomaga taʼsir qilmaydi.",
        "Toʻlov Payme toʻlov tizimi orqali amalga oshiriladi. Toʻlov tasdiqlangach, taklifnoma avtomatik ravishda eʼlon qilinadi; xizmat shu paytdan boshlab koʻrsatilgan hisoblanadi.",
        "Toʻlovdan soʻng Foydalanuvchi taklifnomani istalgancha yashirishi va qayta eʼlon qilishi mumkin, qoʻshimcha toʻlov olinmaydi. Toʻlangan taklifnomaning dizaynini oʻzgartirib boʻlmaydi.",
      ],
    },
    {
      title: "Saqlash muddatlari",
      body: [
        {
          list: [
            "Oxirgi tahrirdan 7 kundan keyin qoralamaning suratlari avtomatik oʻchiriladi, qoralamaning oʻzi saqlanadi. Bir vaqtda 30 tagacha qoralama saqlash mumkin.",
            "Eʼlon qilingan taklifnoma tadbirdan keyin ham ochiq qoladi; tadbir sanasidan bir yil oʻtgach uning suratlari oʻchiriladi.",
            "Eʼlon qilingandan soʻng tadbir sanasini birinchi eʼlon qilingan sanadan koʻpi bilan 30 kun keyinga surish mumkin.",
            "Taklifnomaga biriktirilmagan suratlar 24 soatdan soʻng oʻchiriladi.",
          ],
        },
      ],
    },
    {
      title: "Toʻlovni qaytarish",
      body: [
        "Toʻlov amalga oshirilib, taklifnoma Operator aybi yoki texnik nosozlik tufayli eʼlon qilinmagan boʻlsa, toʻlangan mablagʻ toʻliq qaytariladi.",
        `Qaytarish soʻrovi toʻlovdan soʻng 14 kun ichida ${O.email} yoki ${O.telegram} orqali yuboriladi. Taklifnoma eʼlon qilingach, xizmat koʻrsatilgan hisoblanadi va mablagʻ qaytarilmaydi, qonunchilikda nazarda tutilgan hollar bundan mustasno.`,
      ],
    },
    {
      title: "Foydalanuvchi majburiyatlari",
      body: [
        {
          list: [
            "Toʻgʻri maʼlumot kiritish va telefon raqamiga kirishni boshqalarga bermaslik.",
            "Faqat oʻziga tegishli yoki foydalanishga ruxsat olingan suratlarni yuklash; suratdagi shaxslarning roziligini olish.",
            "Qonunga zid, haqoratli, boshqalarning huquqlarini buzuvchi, reklama yoki spam mazmunini joylashtirmaslik.",
            "Taklifnomaga qoʻshilgan karta raqami va telefon raqami havolaga ega har qanday shaxsga koʻrinishini hisobga olish.",
          ],
        },
      ],
    },
    {
      title: "Operator huquqlari",
      body: [
        "Operator ushbu shartlarni buzuvchi taklifnomalarni yashirish yoki oʻchirish, takroriy buzilishlarda esa hisobni bloklash huquqiga ega.",
        "Operator dizaynlar roʻyxati va narxlarni oʻzgartirishi mumkin; bu allaqachon toʻlangan taklifnomalarga taʼsir qilmaydi.",
      ],
    },
    {
      title: "Javobgarlik",
      body: [
        "Sayt «boricha» taqdim etiladi. Operator xizmatning uzluksiz ishlashi uchun oqilona choralar koʻradi, ammo mehmonlarning harakatlari, uchinchi tomon xizmatlari (xaritalar, messenjerlar, toʻlov tizimlari) ishi va Foydalanuvchi kiritgan maʼlumotlar uchun javobgar emas.",
        "Operatorning javobgarligi har qanday holatda tegishli taklifnoma uchun toʻlangan summa bilan cheklanadi.",
      ],
    },
    {
      title: "Intellektual mulk",
      body: [
        "Dizaynlar, Sayt va uning tarkibi Operatorga tegishli. Foydalanuvchi yuklagan suratlar va matnlar Foydalanuvchiga tegishli boʻlib qoladi; Foydalanuvchi ularni xizmat koʻrsatish uchun saqlash va koʻrsatishga ruxsat beradi.",
      ],
    },
    {
      title: "Ofertaning oʻzgarishi va nizolar",
      body: [
        "Operator ushbu ofertani oʻzgartirishi mumkin; yangi tahrir Saytda eʼlon qilingan kundan kuchga kiradi.",
        "Nizolar muzokaralar yoʻli bilan hal qilinadi, kelishuvga erishilmasa — Oʻzbekiston Respublikasi qonunchiligiga muvofiq sudda koʻriladi.",
      ],
    },
    {
      title: "Operator rekvizitlari",
      body: [
        {
          list: [
            O.name,
            `STIR: ${O.tin}`,
            `Email: ${O.email}`,
            `Telegram: ${O.telegram}`,
          ],
        },
      ],
    },
  ],
};

const ru: LegalDoc = {
  title: "Публичная оферта",
  intro: [
    `Настоящий документ является публичной офертой ${O.name} (далее — «Оператор») на оказание услуги создания электронных приглашений через сайт ${O.site} (далее — «Сайт»).`,
    "Регистрация на Сайте, его использование или оплата услуги означают полное и безоговорочное принятие (акцепт) условий настоящей оферты.",
  ],
  sections: [
    {
      title: "Термины",
      body: [
        {
          list: [
            "Пользователь — лицо, зарегистрированное на Сайте по номеру телефона и создающее приглашение.",
            "Гость — лицо, получившее ссылку на приглашение и открывшее его.",
            "Приглашение — электронная страница, созданная на основе выбранного Пользователем дизайна.",
            "Дизайн — шаблон приглашения, представленный на Сайте.",
            "Черновик — ещё не опубликованное приглашение.",
          ],
        },
      ],
    },
    {
      title: "Описание услуги",
      body: [
        "Пользователь может бесплатно создавать, редактировать и просматривать приглашение. Приглашение публикуется после оплаты и становится доступным гостям по личной ссылке.",
        "Опубликованное приглашение Пользователь может в любой момент редактировать, скрывать и публиковать снова.",
      ],
    },
    {
      title: "Стоимость и оплата",
      body: [
        "Стоимость услуги зависит от выбранного дизайна и указана на Сайте в сумах. Действует цена на момент оплаты; последующие изменения цен не влияют на оплаченное приглашение.",
        "Оплата производится через платёжную систему Payme. После подтверждения оплаты приглашение публикуется автоматически; с этого момента услуга считается оказанной.",
        "После оплаты Пользователь может скрывать и снова публиковать приглашение без ограничений и доплат. Дизайн оплаченного приглашения изменить нельзя.",
      ],
    },
    {
      title: "Сроки хранения",
      body: [
        {
          list: [
            "У черновиков, не редактировавшихся 7 дней, автоматически удаляются фотографии; сам черновик сохраняется. Одновременно можно хранить до 30 черновиков.",
            "Опубликованное приглашение остаётся доступным и после торжества; через год после даты торжества его фотографии удаляются.",
            "После публикации дату торжества можно перенести не более чем на 30 дней позже даты первой публикации.",
            "Фотографии, не прикреплённые к приглашению, удаляются через 24 часа.",
          ],
        },
      ],
    },
    {
      title: "Возврат средств",
      body: [
        "Если оплата произведена, а приглашение не опубликовано по вине Оператора или из-за технического сбоя, средства возвращаются полностью.",
        `Запрос на возврат направляется в течение 14 дней после оплаты на ${O.email} или в ${O.telegram}. После публикации приглашения услуга считается оказанной и средства не возвращаются, за исключением случаев, предусмотренных законодательством.`,
      ],
    },
    {
      title: "Обязанности Пользователя",
      body: [
        {
          list: [
            "Указывать достоверные данные и не передавать доступ к своему номеру телефона третьим лицам.",
            "Загружать только свои фотографии или фотографии, на использование которых получено разрешение; получать согласие изображённых лиц.",
            "Не размещать противоправные, оскорбительные, нарушающие права других лиц, рекламные или спам-материалы.",
            "Учитывать, что номер карты и телефон, добавленные в приглашение, видны любому, у кого есть ссылка.",
          ],
        },
      ],
    },
    {
      title: "Права Оператора",
      body: [
        "Оператор вправе скрывать или удалять приглашения, нарушающие эти условия, а при повторных нарушениях — блокировать учётную запись.",
        "Оператор может менять набор дизайнов и цены; это не влияет на уже оплаченные приглашения.",
      ],
    },
    {
      title: "Ответственность",
      body: [
        "Сайт предоставляется «как есть». Оператор принимает разумные меры для бесперебойной работы, но не отвечает за действия гостей, работу сторонних сервисов (карт, мессенджеров, платёжных систем) и данные, введённые Пользователем.",
        "Ответственность Оператора в любом случае ограничена суммой, оплаченной за соответствующее приглашение.",
      ],
    },
    {
      title: "Интеллектуальная собственность",
      body: [
        "Дизайны, Сайт и его содержимое принадлежат Оператору. Загруженные Пользователем фотографии и тексты остаются его собственностью; Пользователь разрешает хранить и показывать их для оказания услуги.",
      ],
    },
    {
      title: "Изменение оферты и споры",
      body: [
        "Оператор вправе изменять настоящую оферту; новая редакция вступает в силу с момента публикации на Сайте.",
        "Споры решаются путём переговоров, а при недостижении согласия — в суде в соответствии с законодательством Республики Узбекистан.",
      ],
    },
    {
      title: "Реквизиты Оператора",
      body: [
        {
          list: [
            O.name,
            `ИНН: ${O.tin}`,
            `Email: ${O.email}`,
            `Telegram: ${O.telegram}`,
          ],
        },
      ],
    },
  ],
};

const en: LegalDoc = {
  title: "Terms of Service (Public Offer)",
  intro: [
    `This document is a public offer by ${O.name} (the "Operator") to provide a service for creating digital invitations through the ${O.site} website (the "Site").`,
    "Registering on the Site, using it or paying for the service means full and unconditional acceptance of these terms.",
  ],
  sections: [
    {
      title: "Definitions",
      body: [
        {
          list: [
            "User — a person registered on the Site with a phone number who creates an invitation.",
            "Guest — a person who received an invitation link and opened it.",
            "Invitation — a web page created from the design the User chose.",
            "Design — an invitation template offered on the Site.",
            "Draft — an invitation that has not been published yet.",
          ],
        },
      ],
    },
    {
      title: "The service",
      body: [
        "Users can create, edit and preview invitations for free. An invitation is published after payment and becomes available to guests through its personal link.",
        "Users can edit, hide and republish a published invitation at any time.",
      ],
    },
    {
      title: "Prices and payment",
      body: [
        "The price depends on the chosen design and is shown on the Site in Uzbek so'm. The price at the time of payment applies; later price changes don't affect a paid invitation.",
        "Payment is made through the Payme payment system. Once the payment is confirmed, the invitation is published automatically, and the service is deemed provided from then on.",
        "After payment, the User may hide and republish the invitation any number of times at no extra cost. The design of a paid invitation can't be changed.",
      ],
    },
    {
      title: "Retention",
      body: [
        {
          list: [
            "Drafts not edited for 7 days automatically lose their photos; the draft itself is kept. Up to 30 drafts can be kept at a time.",
            "A published invitation stays online after the event; one year after the event date its photos are deleted.",
            "After publishing, the event date can be moved at most 30 days later than the date at first publication.",
            "Photos not attached to any invitation are deleted after 24 hours.",
          ],
        },
      ],
    },
    {
      title: "Refunds",
      body: [
        "If payment was made but the invitation was not published through the Operator's fault or a technical failure, the payment is refunded in full.",
        `Refund requests are sent within 14 days of payment to ${O.email} or ${O.telegram}. Once an invitation is published, the service is deemed provided and payments are not refunded, except where the law requires otherwise.`,
      ],
    },
    {
      title: "User obligations",
      body: [
        {
          list: [
            "Provide accurate information and don't give others access to your phone number.",
            "Only upload photos you own or are permitted to use, with the consent of the people pictured.",
            "Don't post unlawful, offensive, rights-infringing, advertising or spam content.",
            "Keep in mind that a card number and phone number added to an invitation are visible to anyone with the link.",
          ],
        },
      ],
    },
    {
      title: "Operator rights",
      body: [
        "The Operator may hide or delete invitations that violate these terms and, for repeated violations, block the account.",
        "The Operator may change the available designs and prices; this does not affect invitations already paid for.",
      ],
    },
    {
      title: "Liability",
      body: [
        'The Site is provided "as is". The Operator takes reasonable measures to keep it running, but is not responsible for guests\' actions, third-party services (maps, messengers, payment systems) or information entered by Users.',
        "In any case, the Operator's liability is limited to the amount paid for the invitation concerned.",
      ],
    },
    {
      title: "Intellectual property",
      body: [
        "The designs, the Site and its content belong to the Operator. Photos and texts uploaded by a User remain theirs; the User allows them to be stored and displayed to provide the service.",
      ],
    },
    {
      title: "Changes and disputes",
      body: [
        "The Operator may change these terms; a new version takes effect once published on the Site.",
        "Disputes are settled by negotiation and, failing agreement, in court under the laws of the Republic of Uzbekistan.",
      ],
    },
    {
      title: "Operator details",
      body: [
        {
          list: [
            O.name,
            `Taxpayer ID: ${O.tin}`,
            `Email: ${O.email}`,
            `Telegram: ${O.telegram}`,
          ],
        },
      ],
    },
  ],
};

export const TERMS: Record<string, LegalDoc> = { uz, ru, en };
