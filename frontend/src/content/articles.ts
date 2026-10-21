// Articles about online invitations (/[locale]/articles/<id>), written for
// each site language rather than translated, so they read naturally and use
// the words people search for in that language. Every article leads readers
// to the home page and the designs. In paragraphs and list items,
// [label](/path) is a link inside the site (no locale prefix).

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  /** Shown after the paragraphs. */
  list?: string[];
}

export interface ArticleFaq {
  q: string;
  a: string;
}

export interface ArticleText {
  /** In lists, cards and breadcrumbs. */
  name: string;
  /** The page's h1. */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** The search words the article is written around. */
  keywords: string[];
  /** Under the h1 and on the article's card. */
  lead: string;
  sections: ArticleSection[];
  faq: ArticleFaq[];
}

export interface Article {
  /** ISO date, for the sitemap and structured data. */
  published: string;
  text: Record<string, ArticleText>;
}

export const ARTICLES: Record<string, Article> = {
  "electronic-invitation": {
    published: "2026-10-21",
    text: {
      uz: {
        name: "Elektron taklifnoma nima?",
        title: "Elektron taklifnoma: nima u va onlayn qanday yaratiladi",
        metaTitle:
          "Elektron taklifnoma yaratish — onlayn toʻy taklifnomasi | Taklifim",
        metaDescription:
          "Elektron taklifnoma nima, u qogʻoz taklifnomadan nimasi bilan qulay va telefonda bir necha daqiqada videoli, musiqali onlayn toʻy taklifnomasini qanday yaratish mumkin.",
        keywords: [
          "elektron taklifnoma",
          "onlayn taklifnoma",
          "elektron taklifnoma yaratish",
          "toʻy taklifnomasi",
          "taklifnoma yaratish",
          "videoli taklifnoma",
          "taklifnoma online",
          "электрон таклифнома",
          "тўй таклифномаси",
        ],
        lead: "Elektron taklifnoma — mehmonlarga bitta havola bilan yuboriladigan zamonaviy toʻy taklifnomasi. Unda ismlar, sana, toʻyxona xaritasi, suratlar va musiqa bor, mehmon esa uni telefonida bir bosishda ochadi.",
        sections: [
          {
            heading: "Elektron taklifnoma nima?",
            paragraphs: [
              "Elektron taklifnoma (onlayn taklifnoma, raqamli taklifnoma) — bu internetdagi alohida sahifa boʻlib, uni mehmonlarga Telegram, WhatsApp yoki SMS orqali havola qilib yuborasiz. Mehmon havolani bosadi va taklifnoma telefonida ochiladi: hech qanday ilova oʻrnatish shart emas.",
              "Qogʻoz taklifnomadan farqli oʻlaroq, elektron taklifnoma «jonli»: u video bilan ochiladi, siz tanlagan qoʻshiq yangraydi, toʻygacha qolgan kunlar sanaladi, toʻyxona esa xaritada koʻrsatiladi. Bugun Toshkent, Samarqand, Fargʻona va butun Oʻzbekiston boʻylab koʻp oilalar toʻy taklifnomasini aynan shunday yubormoqda.",
            ],
          },
          {
            heading: "Nega koʻpchilik onlayn taklifnoma tanlayapti?",
            paragraphs: [
              "Toʻy tashvishlari koʻp, taklifnoma esa ularni kamaytirishi kerak. Elektron taklifnoma aynan shu ishni qiladi:",
            ],
            list: [
              "Tez: taklifnoma bir necha daqiqada tayyor boʻladi, mehmonlarga esa bir zumda yetib boradi.",
              "Arzon: bosmaxona, qogʻoz va uyma-uy tarqatish xarajati yoʻq.",
              "Uzoqdagilarga ham yetadi: chet eldagi qarindosh va doʻstlar ham taklifnomani oʻsha kuni oladi.",
              "Xato tuzatiladi: vaqt yoki manzil oʻzgarsa, matnni oʻzgartirasiz — havola oʻsha-oʻsha qoladi.",
              "Mehmon adashmaydi: toʻyxona xaritada, bir bosishda yoʻl topiladi.",
              "Kim kelishini bilasiz: mehmonlar taklifnomaning oʻzida javob beradi.",
            ],
          },
          {
            heading: "Elektron taklifnoma qanday yaratiladi: 3 qadam",
            paragraphs: [
              "[Taklifim.uz](/) saytida toʻy taklifnomasini yaratish uchun dizayner yoki dasturchi boʻlish shart emas. Hammasi telefonda qilinadi:",
            ],
            list: [
              "[Dizaynni tanlang](/designs): har bir dizaynning oʻz ochilish videosi, ranglari va shriftlari bor — oldindan jonli koʻrib chiqish mumkin.",
              "Maʼlumotlarni kiriting: kelin va kuyov ismlari, sana, vaqt, toʻyxona manzili, suratlar va musiqa.",
              "Havolani ulashing: eʼlon qilgach, taklifnoma havolasini mehmonlarga Telegram yoki istalgan messenjer orqali yuboring.",
            ],
          },
          {
            heading: "Yaxshi toʻy taklifnomasida nima boʻlishi kerak?",
            paragraphs: [
              "Taklifnoma qanchalik chiroyli boʻlmasin, mehmonga eng avvalo aniq maʼlumot kerak. Quyidagilarni albatta qoʻshing:",
            ],
            list: [
              "Kelin va kuyovning ismlari (yoki taklif qiluvchi oila nomi).",
              "Toʻy sanasi, hafta kuni va boshlanish vaqti.",
              "Toʻyxona nomi va xaritadagi aniq manzili.",
              "Iliq, hurmatli taklif matni — tayyor [matn namunalari](/wording) yordam beradi.",
              "Kelish-kelmaslikni bildirish imkoniyati.",
            ],
          },
          {
            heading: "Taklifim.uz taklifnomasida nimalar bor",
            paragraphs: [
              "Taklifim — oʻzbek toʻylari uchun yaratilgan elektron taklifnoma xizmati. Har bir taklifnomada:",
            ],
            list: [
              "Video bilan ochilish: darvozalar, ravoqlar, saroylar.",
              "Siz tanlagan musiqa yoki oʻzingiz yuklagan qoʻshiq.",
              "Toʻygacha qolgan kun, soat va daqiqalarni sanovchi taymer.",
              "6 tagacha surat chiroyli ramkalarda.",
              "Toʻyxona xaritada — mehmon bir bosishda yoʻl topadi.",
              "Ismli taklifnomalar: har bir mehmon uchun alohida havola, taklifnoma uni ismi bilan kutib oladi.",
              "Mehmonlar javobi va tilaklari — har biri Telegramingizga keladi.",
              "Taklifnomani PNG rasm yoki QR kod sifatida yuklab olish.",
              "Uch til: oʻzbek, rus va ingliz tillari.",
            ],
          },
          {
            heading: "Bugunoq boshlang",
            paragraphs: [
              "Taklifnomani yaratish va koʻrib chiqish bepul — toʻlov faqat eʼlon qilishda. [Taklifim.uz](/) saytiga kiring, oʻzingizga yoqqan dizaynni tanlang va birinchi elektron taklifnomangizni bir necha daqiqada tayyorlang.",
            ],
          },
        ],
        faq: [
          {
            q: "Elektron taklifnoma yaratish pullimi?",
            a: "Taklifim.uz’da taklifnomani yaratish va koʻrib chiqish bepul. Toʻlov faqat eʼlon qilishda, tanlangan dizayn narxida olinadi.",
          },
          {
            q: "Mehmonlar biror ilova oʻrnatishi kerakmi?",
            a: "Yoʻq. Taklifnoma oddiy havola: u istalgan telefon brauzerida, Telegram yoki WhatsApp ichida ochiladi.",
          },
          {
            q: "Eʼlon qilgandan keyin oʻzgartirsa boʻladimi?",
            a: "Ha. Vaqt, manzil yoki suratlarni istalgan payt oʻzgartirasiz, havola esa oʻzgarmaydi.",
          },
        ],
      },
      ru: {
        name: "Что такое электронное приглашение",
        title:
          "Электронное приглашение на свадьбу: что это и как создать онлайн",
        metaTitle:
          "Электронное приглашение на свадьбу — создать онлайн | Taklifim",
        metaDescription:
          "Что такое электронное приглашение, чем оно удобнее бумажного и как за несколько минут создать онлайн-приглашение на свадьбу с видео и музыкой прямо с телефона.",
        keywords: [
          "электронное приглашение",
          "электронное приглашение на свадьбу",
          "онлайн приглашение",
          "создать приглашение онлайн",
          "приглашение на свадьбу",
          "видео приглашение на свадьбу",
          "электронные пригласительные",
          "приглашение на свадьбу Ташкент",
        ],
        lead: "Электронное приглашение — это современное приглашение на свадьбу, которое гости получают одной ссылкой. В нём имена, дата, карта ресторана, фото и музыка, а открывается оно на телефоне в одно касание.",
        sections: [
          {
            heading: "Что такое электронное приглашение?",
            paragraphs: [
              "Электронное приглашение (онлайн-приглашение, цифровое пригласительное) — это отдельная страница в интернете, ссылку на которую вы отправляете гостям в Telegram, WhatsApp или по SMS. Гость нажимает на ссылку, и приглашение открывается у него на телефоне: ничего устанавливать не нужно.",
              "В отличие от бумажного, электронное приглашение «живое»: оно открывается видео, играет выбранная вами песня, идёт обратный отсчёт до свадьбы, а ресторан показан на карте. Сегодня так приглашают на свадьбу всё больше семей в Ташкенте, Самарканде, Фергане и по всему Узбекистану.",
            ],
          },
          {
            heading: "Почему выбирают онлайн-приглашения",
            paragraphs: [
              "Перед свадьбой и так много хлопот, и приглашение должно их убавлять. Электронное приглашение так и делает:",
            ],
            list: [
              "Быстро: приглашение готово за несколько минут и доходит до гостей мгновенно.",
              "Недорого: никакой типографии, бумаги и развоза по адресам.",
              "Доходит до всех: родственники и друзья за границей получат его в тот же день.",
              "Ошибку легко исправить: поменялись время или адрес — правите текст, ссылка остаётся прежней.",
              "Гости не заблудятся: ресторан на карте, маршрут в одно касание.",
              "Вы знаете, кто придёт: гости отвечают прямо в приглашении.",
            ],
          },
          {
            heading: "Как создать электронное приглашение: 3 шага",
            paragraphs: [
              "Чтобы сделать приглашение на свадьбу на [Taklifim.uz](/), не нужно быть дизайнером или программистом. Всё делается с телефона:",
            ],
            list: [
              "[Выберите дизайн](/designs): у каждого своё видео-открытие, цвета и шрифты — посмотрите живое превью заранее.",
              "Заполните данные: имена жениха и невесты, дату, время, адрес ресторана, фото и музыку.",
              "Поделитесь ссылкой: после публикации отправьте ссылку гостям в Telegram или любом мессенджере.",
            ],
          },
          {
            heading: "Что должно быть в хорошем приглашении на свадьбу",
            paragraphs: [
              "Каким бы красивым ни было приглашение, гостю прежде всего нужна точная информация. Обязательно укажите:",
            ],
            list: [
              "Имена жениха и невесты (или семьи, которая приглашает).",
              "Дату свадьбы, день недели и время начала.",
              "Название ресторана или тойханы и точный адрес на карте.",
              "Тёплый, уважительный текст — помогут готовые [тексты приглашений](/wording).",
              "Возможность ответить, придёт ли гость.",
            ],
          },
          {
            heading: "Что есть в приглашении Taklifim.uz",
            paragraphs: [
              "Taklifim — сервис электронных приглашений, созданный для узбекских свадеб. В каждом приглашении:",
            ],
            list: [
              "Открытие видео: ворота, арки, дворцы.",
              "Музыка на ваш выбор или ваша собственная песня.",
              "Обратный отсчёт дней, часов и минут до торжества.",
              "До 6 фотографий в красивых рамках.",
              "Ресторан на карте — гость найдёт дорогу в одно касание.",
              "Именные приглашения: своя ссылка для каждого гостя, приглашение обращается к нему по имени.",
              "Ответы и пожелания гостей — каждый приходит вам в Telegram.",
              "Скачивание приглашения картинкой PNG или QR-кодом.",
              "Три языка: узбекский, русский и английский.",
            ],
          },
          {
            heading: "Начните уже сегодня",
            paragraphs: [
              "Создать и посмотреть приглашение можно бесплатно — оплата только при публикации. Зайдите на [Taklifim.uz](/), выберите понравившийся дизайн и подготовьте своё первое электронное приглашение за несколько минут.",
            ],
          },
        ],
        faq: [
          {
            q: "Создание электронного приглашения платное?",
            a: "На Taklifim.uz создать и посмотреть приглашение можно бесплатно. Оплата — только при публикации, по цене выбранного дизайна.",
          },
          {
            q: "Гостям нужно что-то устанавливать?",
            a: "Нет. Приглашение — это обычная ссылка: оно открывается в любом браузере телефона, в Telegram или WhatsApp.",
          },
          {
            q: "Можно ли изменить приглашение после публикации?",
            a: "Да. Время, адрес или фото меняются в любой момент, а ссылка остаётся прежней.",
          },
        ],
      },
      en: {
        name: "What is an online invitation?",
        title: "Online wedding invitations: what they are and how to make one",
        metaTitle:
          "Online Wedding Invitation — Create a Digital Invitation | Taklifim",
        metaDescription:
          "What an online invitation is, why it beats paper and how to create a digital wedding invitation with video and music on your phone in a few minutes.",
        keywords: [
          "online wedding invitation",
          "digital wedding invitation",
          "electronic invitation",
          "e-invitation",
          "create invitation online",
          "video wedding invitation",
          "wedding invitation Uzbekistan",
          "online invitation maker",
        ],
        lead: "An online invitation is a modern wedding invitation your guests receive as a single link. It holds your names, the date, a map to the venue, photos and music, and opens on any phone in one tap.",
        sections: [
          {
            heading: "What is an online invitation?",
            paragraphs: [
              "An online invitation (also called a digital invitation or e-invitation) is a web page of its own that you send to guests as a link on Telegram, WhatsApp or by text message. A guest taps the link and the invitation opens on their phone, with nothing to install.",
              "Unlike paper, a digital invitation feels alive: it opens with a video, your chosen song plays, a countdown ticks towards the big day and the venue is pinned on a map. More and more families in Tashkent, Samarkand, Fergana and all over Uzbekistan now invite their wedding guests this way.",
            ],
          },
          {
            heading: "Why couples choose online invitations",
            paragraphs: [
              "A wedding comes with plenty of jobs already, and the invitation should take some away. A digital invitation does exactly that:",
            ],
            list: [
              "Fast: it's ready in minutes and reaches guests instantly.",
              "Affordable: no printing, no paper and no delivering cards door to door.",
              "Reaches everyone: relatives and friends abroad get it the same day.",
              "Easy to fix: if the time or venue changes, edit it and the link stays the same.",
              "Guests don't get lost: the venue is on a map, with directions in one tap.",
              "You know who's coming: guests reply right inside the invitation.",
            ],
          },
          {
            heading: "How to create an online invitation in 3 steps",
            paragraphs: [
              "You don't need to be a designer or a developer to make a wedding invitation on [Taklifim.uz](/). It all happens on your phone:",
            ],
            list: [
              "[Pick a design](/designs): each has its own opening video, colours and lettering, with a live preview.",
              "Fill in the details: the couple's names, the date and time, the venue, your photos and music.",
              "Share the link: once published, send it to guests on Telegram or any messenger.",
            ],
          },
          {
            heading: "What a good wedding invitation includes",
            paragraphs: [
              "However beautiful an invitation is, guests need clear information first. Make sure you include:",
            ],
            list: [
              "The bride's and groom's names (or the hosting family's).",
              "The wedding date, the day of the week and the start time.",
              "The venue's name and its exact location on a map.",
              "A warm, respectful message — our [wording samples](/wording) can help.",
              "A way for guests to say whether they're coming.",
            ],
          },
          {
            heading: "What's inside a Taklifim.uz invitation",
            paragraphs: [
              "Taklifim is an online invitation service made for Uzbek weddings. Every invitation has:",
            ],
            list: [
              "A video opening: gates, arches and palaces.",
              "Music of your choice, or a song you upload yourself.",
              "A live countdown of days, hours and minutes.",
              "Up to 6 photos in beautiful frames.",
              "The venue on a map, so guests find it in one tap.",
              "Named invitations: a personal link for each guest that greets them by name.",
              "Guest replies and wishes, each delivered to your Telegram.",
              "Downloads as a PNG image or a QR code.",
              "Three languages: Uzbek, Russian and English.",
            ],
          },
          {
            heading: "Start today",
            paragraphs: [
              "Creating and previewing an invitation is free; you only pay when you publish. Head to [Taklifim.uz](/), choose a design you love and have your first digital wedding invitation ready in minutes.",
            ],
          },
        ],
        faq: [
          {
            q: "Is creating an online invitation free?",
            a: "On Taklifim.uz, creating and previewing are free. You pay when you publish, at the price of the design you chose.",
          },
          {
            q: "Do guests need to install an app?",
            a: "No. The invitation is a plain link that opens in any phone browser, or inside Telegram and WhatsApp.",
          },
          {
            q: "Can I change it after publishing?",
            a: "Yes. Change the time, venue or photos at any time; the link stays the same.",
          },
        ],
      },
    },
  },

  "online-vs-paper": {
    published: "2026-10-21",
    text: {
      uz: {
        name: "Elektron yoki qogʻoz taklifnoma?",
        title: "Elektron taklifnoma yoki qogʻoz taklifnoma: qaysi biri yaxshi?",
        metaTitle:
          "Elektron yoki qogʻoz toʻy taklifnomasi — qaysi biri yaxshi? | Taklifim",
        metaDescription:
          "Elektron taklifnoma va qogʻoz taklifnomani narx, vaqt, qulaylik va anʼanalar boʻyicha solishtiramiz. Toʻy taklifnomasini qanday tanlash va ikkalasini birga ishlatish yoʻli.",
        keywords: [
          "elektron taklifnoma",
          "qogʻoz taklifnoma",
          "toʻy taklifnomasi narxi",
          "taklifnoma buyurtma",
          "onlayn taklifnoma",
          "taklifnoma chop etish",
          "toʻy taklifnomasi",
          "таклифнома",
        ],
        lead: "Toʻyga tayyorgarlikda koʻp oilalar bir savolga duch keladi: taklifnomani bosmaxonada chop ettirish kerakmi yoki elektron taklifnoma yuborish yetarlimi? Keling, ikkalasini halol solishtiramiz.",
        sections: [
          {
            heading: "Narx: qaysi taklifnoma arzonroq?",
            paragraphs: [
              "Qogʻoz taklifnomaning narxi har bir dona uchun hisoblanadi: dizayn, qogʻoz, chop etish, konvert. Toʻyga 300–500 mehmon chaqirilishini hisobga olsak, bu katta summa boʻladi — ustiga uyma-uy tarqatishga ketadigan vaqt va yoʻl xarajati qoʻshiladi.",
              "Elektron taklifnoma uchun esa bir marta toʻlaysiz, mehmonlar soni qancha boʻlishidan qatʼi nazar. [Taklifim.uz](/)’da yaratish va koʻrib chiqish bepul, toʻlov faqat eʼlon qilishda.",
            ],
          },
          {
            heading: "Vaqt va qulaylik",
            paragraphs: [
              "Qogʻoz taklifnomani buyurtma qilish, chop etilishini kutish va tarqatish bir necha hafta oladi. Elektron taklifnoma esa bir necha daqiqada tayyor boʻladi va mehmonlarga oʻsha zahoti yetadi.",
              "Eng muhimi — oʻzgartirish imkoniyati. Qogʻozda xato ketsa yoki toʻy vaqti surilsa, hammasini qaytadan chop etishga toʻgʻri keladi. Onlayn taklifnomada esa matnni tuzatasiz va barcha mehmonlar yangilangan maʼlumotni koʻradi.",
            ],
          },
          {
            heading: "Mehmon uchun qaysi biri qulay?",
            paragraphs: [
              "Qogʻoz taklifnoma koʻpincha stol ustida yoki tortmada yoʻqolib qoladi. Elektron taklifnoma doim telefonda — Telegram chatida turadi. Unda mehmon uchun foydali narsalar bor:",
            ],
            list: [
              "Toʻyxona xaritada — taksi chaqirish yoki yoʻl topish bir bosishda.",
              "Toʻygacha qolgan vaqtni koʻrsatuvchi taymer.",
              "«Kelaman / kela olmayman» deb javob berish formasi.",
              "Kelin-kuyovga tilak yozish imkoniyati.",
            ],
          },
          {
            heading: "Anʼanalar haqida nima deysiz?",
            paragraphs: [
              "Baʼzi oilalarda keksa qarindoshlarga taklifnomani qoʻlda topshirish hurmat belgisi hisoblanadi — bu juda toʻgʻri anʼana. Yaxshi xabar: elektron taklifnoma bunga xalaqit bermaydi.",
              "Taklifim’da taklifnomani PNG rasm sifatida yuklab olib chop etishingiz yoki QR kodini kartochkaga qoʻyishingiz mumkin. Shunda buvi-bobolar qogʻoz taklifnomani qoʻlga oladi, yoshlar esa QR kodni skanerlab, videoli taklifnomani ochadi.",
            ],
          },
          {
            heading: "Xulosa: zamonaviy toʻy — zamonaviy taklifnoma",
            paragraphs: [
              "Koʻpchilik mehmonlar uchun elektron taklifnoma arzonroq, tezroq va qulayroq. Qogʻozni esa faqat kerakli joyda — hurmatli qariyalar uchun ishlating.",
              "[Taklifim.uz](/) saytida [dizaynlarni koʻrib chiqing](/designs) va toʻyingiz uchun videoli, musiqali elektron taklifnoma yarating.",
            ],
          },
        ],
        faq: [
          {
            q: "Elektron taklifnoma hurmatsizlik emasmi?",
            a: "Yoʻq. Bugun koʻp oilalar taklifnomani Telegram orqali yuboradi. Mehmonga ismi bilan murojaat qiladigan ismli taklifnoma va hurmatli matn bilan u qogʻozdan kam boʻlmaydi.",
          },
          {
            q: "Elektron taklifnomani chop etsa boʻladimi?",
            a: "Ha. Taklifnomani PNG rasm yoki QR kod sifatida yuklab olib, istalgan joyda chop etishingiz mumkin.",
          },
        ],
      },
      ru: {
        name: "Электронное или бумажное приглашение?",
        title: "Электронное или бумажное приглашение на свадьбу: что выбрать?",
        metaTitle:
          "Электронное или бумажное приглашение на свадьбу — что лучше | Taklifim",
        metaDescription:
          "Сравниваем электронные и бумажные приглашения на свадьбу по цене, времени, удобству и традициям. Как выбрать пригласительные и совместить оба варианта.",
        keywords: [
          "электронное приглашение",
          "бумажные пригласительные",
          "пригласительные на свадьбу цена",
          "заказать приглашения на свадьбу",
          "онлайн приглашение на свадьбу",
          "печать приглашений",
          "приглашение на свадьбу Узбекистан",
        ],
        lead: "Готовясь к свадьбе, многие семьи задаются вопросом: печатать пригласительные в типографии или достаточно отправить электронное приглашение? Давайте честно сравним оба варианта.",
        sections: [
          {
            heading: "Цена: какое приглашение дешевле?",
            paragraphs: [
              "Бумажные пригласительные считаются поштучно: дизайн, бумага, печать, конверты. А на узбекскую свадьбу зовут 300–500 гостей — сумма выходит немалая, и к ней добавляются время и дорога на развоз приглашений.",
              "За электронное приглашение вы платите один раз, сколько бы ни было гостей. На [Taklifim.uz](/) создать и посмотреть приглашение можно бесплатно, оплата только при публикации.",
            ],
          },
          {
            heading: "Время и удобство",
            paragraphs: [
              "Заказать бумажные приглашения, дождаться печати и развезти их — это несколько недель. Электронное приглашение готово за несколько минут и сразу доходит до гостей.",
              "А главное — его можно изменить. Ошибка в тексте или перенос времени на бумаге означают новую печать. В онлайн-приглашении вы просто правите текст, и все гости видят свежие данные.",
            ],
          },
          {
            heading: "Что удобнее для гостей?",
            paragraphs: [
              "Бумажное приглашение часто теряется на столе или в ящике. Электронное всегда под рукой — в чате Telegram. И в нём есть полезные для гостя вещи:",
            ],
            list: [
              "Ресторан на карте — вызвать такси или построить маршрут в одно касание.",
              "Таймер обратного отсчёта до торжества.",
              "Форма ответа «Приду / Не смогу».",
              "Возможность написать пожелание молодожёнам.",
            ],
          },
          {
            heading: "А как же традиции?",
            paragraphs: [
              "Во многих семьях принято лично вручать приглашение старшим родственникам — и это прекрасная традиция. Хорошая новость: электронное приглашение ей не мешает.",
              "На Taklifim приглашение можно скачать картинкой PNG и распечатать или поставить его QR-код на открытку. Бабушки и дедушки получат приглашение в руки, а молодёжь отсканирует QR-код и откроет приглашение с видео.",
            ],
          },
          {
            heading: "Вывод: современной свадьбе — современное приглашение",
            paragraphs: [
              "Для большинства гостей электронное приглашение дешевле, быстрее и удобнее. Бумагу оставьте там, где она действительно важна, — для уважаемых старших.",
              "[Посмотрите дизайны](/designs) на [Taklifim.uz](/) и создайте приглашение на свадьбу с видео и музыкой.",
            ],
          },
        ],
        faq: [
          {
            q: "Не будет ли электронное приглашение неуважительным?",
            a: "Нет. Сегодня многие семьи приглашают на свадьбу через Telegram. Именное приглашение, которое обращается к гостю по имени, и уважительный текст ничем не уступают бумаге.",
          },
          {
            q: "Можно ли распечатать электронное приглашение?",
            a: "Да. Скачайте приглашение картинкой PNG или QR-кодом и распечатайте где угодно.",
          },
        ],
      },
      en: {
        name: "Online or paper invitations?",
        title: "Online vs paper wedding invitations: which is better?",
        metaTitle:
          "Online vs Paper Wedding Invitations — Which Is Better? | Taklifim",
        metaDescription:
          "We compare digital and printed wedding invitations on cost, time, convenience and tradition, and show how to use both together.",
        keywords: [
          "online vs paper invitations",
          "digital wedding invitation",
          "printed wedding invitations",
          "wedding invitation cost",
          "e-invitation",
          "eco-friendly wedding invitation",
          "wedding invitation Uzbekistan",
        ],
        lead: "Planning a wedding, many families ask the same question: should we print invitations, or is an online invitation enough? Here's an honest comparison of both.",
        sections: [
          {
            heading: "Cost: which invitation is cheaper?",
            paragraphs: [
              "Printed invitations are priced per card: design, paper, printing and envelopes. With 300–500 guests at a typical Uzbek wedding, that adds up fast, before counting the time and travel spent delivering them.",
              "A digital invitation is paid for once, however many guests you invite. On [Taklifim.uz](/), creating and previewing are free; you only pay when you publish.",
            ],
          },
          {
            heading: "Time and convenience",
            paragraphs: [
              "Ordering paper invitations, waiting for the print run and handing them out takes weeks. An online invitation is ready in minutes and reaches guests straight away.",
              "Best of all, you can change it. A typo or a new start time on paper means printing again. Online, you edit the details and every guest sees the update.",
            ],
          },
          {
            heading: "Which is easier for guests?",
            paragraphs: [
              "A paper card often gets lost on a table or in a drawer. A digital invitation stays on the guest's phone in their Telegram chat, and it comes with useful extras:",
            ],
            list: [
              "The venue on a map, for a taxi or directions in one tap.",
              "A countdown to the celebration.",
              "A form to reply that they'll be there or can't make it.",
              "A place to write wishes to the couple.",
            ],
          },
          {
            heading: "What about tradition?",
            paragraphs: [
              "In many families, handing an invitation to elder relatives in person is a sign of respect, and it's a lovely tradition. The good news is that a digital invitation doesn't get in its way.",
              "On Taklifim you can download your invitation as a PNG image to print, or put its QR code on a card. Grandparents get an invitation to hold, and younger guests scan the code to open the video invitation.",
            ],
          },
          {
            heading:
              "The verdict: a modern wedding deserves a modern invitation",
            paragraphs: [
              "For most guests, an online invitation is cheaper, faster and more convenient. Keep paper for where it matters most: your respected elders.",
              "[Browse the designs](/designs) on [Taklifim.uz](/) and create a wedding invitation with video and music.",
            ],
          },
        ],
        faq: [
          {
            q: "Isn't an online invitation less respectful?",
            a: "Not at all. Many families now send wedding invitations on Telegram. A named invitation that greets each guest personally, with a respectful message, is every bit as thoughtful as paper.",
          },
          {
            q: "Can I print a digital invitation?",
            a: "Yes. Download it as a PNG image or a QR code and print it anywhere.",
          },
        ],
      },
    },
  },

  "send-invitation-telegram": {
    published: "2026-10-21",
    text: {
      uz: {
        name: "Taklifnomani Telegramda yuborish",
        title: "Toʻy taklifnomasini Telegram orqali qanday yuborish kerak",
        metaTitle:
          "Taklifnomani Telegram orqali yuborish — maslahatlar | Taklifim",
        metaDescription:
          "Toʻy taklifnomasini Telegram va WhatsApp orqali chiroyli va hurmat bilan yuborish: qachon yuborish, qanday matn yozish, ismli havolalar va QR kod.",
        keywords: [
          "taklifnoma Telegram",
          "toʻyga taklif qilish",
          "elektron taklifnoma yuborish",
          "taklifnoma havolasi",
          "ismli taklifnoma",
          "toʻy taklifnomasi",
          "onlayn taklifnoma",
          "QR kod taklifnoma",
        ],
        lead: "Oʻzbekistonda toʻyga taklif qilishning eng tez yoʻli — Telegram. Lekin havolani shunchaki tashlab qoʻyish yetarli emas: taklif hurmat bilan yetib borishi kerak. Mana bir necha amaliy maslahat.",
        sections: [
          {
            heading: "Nega aynan Telegram?",
            paragraphs: [
              "Telegram deyarli har bir oilada bor: ota-onalar, qarindoshlar, hamkasblar — hammasi shu yerda. Elektron taklifnoma havolasi Telegramda chiroyli koʻrinadi: chatda taklifnoma rasmi va sarlavhasi chiqadi, mehmon uni bosib, darhol ochadi.",
              "WhatsApp, Instagram yoki SMS’da ham xuddi shunday ishlaydi — [taklifim.uz](/) taklifnomasi istalgan messenjerda ochiladi.",
            ],
          },
          {
            heading: "Havolani matn bilan yuboring",
            paragraphs: [
              "Yalangʻoch havola biroz sovuq koʻrinadi. Uning oldidan ikki-uch qator iliq soʻz yozing: mehmonga ismi bilan murojaat qiling, toʻy sanasini ayting va taklifnomani ochishni soʻrang.",
              "Tayyor matnlar kerakmi? [Telegram uchun qisqa taklif matnlari](/wording/messengers) va boshqa [matn namunalari](/wording)dan nusxa oling.",
            ],
          },
          {
            heading: "Har bir mehmonga — ismli taklifnoma",
            paragraphs: [
              "Taklifim’da mehmonlar roʻyxatini kiritsangiz, har biri uchun alohida havola yaratiladi. Mehmon uni ochganda taklifnoma «Hurmatli Aziz aka!» deb uni ismi bilan kutib oladi. Bu kichik narsa, lekin mehmon oʻzini chindan qadrli his qiladi.",
              "Ismli havolalar yana bir foyda beradi: kabinetda har bir mehmon kelishi, kelmasligi yoki hali javob bermagani koʻrinib turadi.",
            ],
          },
          {
            heading: "Qachon yuborish kerak?",
            paragraphs: ["Toʻy taklifnomasini yuborish uchun qulay vaqt:"],
            list: [
              "Toʻydan 3–4 hafta oldin — asosiy taklif.",
              "Chet eldagi qarindoshlarga — undan ham oldinroq, chipta olishga ulgurishsin.",
              "Toʻydan 1–2 kun oldin — qisqa eslatma bilan havolani yana bir bor yuboring.",
            ],
          },
          {
            heading: "Telefoni boʻlmaganlar uchun — QR kod",
            paragraphs: [
              "Taklifnomani QR kod sifatida yuklab olib, chop etilgan kartochkaga qoʻyishingiz mumkin. Mehmon kamerani tutadi — va videoli taklifnoma ochiladi. Taklifnomani PNG rasm sifatida ham yuklab, istalgan joyda ulashsa boʻladi.",
            ],
          },
          {
            heading: "Birinchi qadam",
            paragraphs: [
              "[Taklifim.uz](/) saytida elektron taklifnoma yarating, mehmonlar roʻyxatini kiriting va har biriga Telegramda ismli taklifnoma yuboring — javoblar ham Telegramingizga keladi.",
            ],
          },
        ],
        faq: [
          {
            q: "Taklifnomani guruhga yuborsa boʻladimi?",
            a: "Boʻladi, lekin yaqinlarga shaxsiy xabar bilan yuborgan maʼqul — bu hurmatliroq. Guruhlar uchun umumiy havola, yaqinlar uchun ismli havola ishlating.",
          },
          {
            q: "Mehmon javobini qayerdan koʻraman?",
            a: "Har bir javob Telegramingizga xabar boʻlib keladi, toʻliq roʻyxat esa kabinetda turadi.",
          },
        ],
      },
      ru: {
        name: "Как отправить приглашение в Telegram",
        title: "Как отправить приглашение на свадьбу в Telegram",
        metaTitle:
          "Как отправить приглашение на свадьбу в Telegram — советы | Taklifim",
        metaDescription:
          "Как красиво и уважительно отправить электронное приглашение на свадьбу в Telegram и WhatsApp: когда отправлять, какой текст написать, именные ссылки и QR-код.",
        keywords: [
          "приглашение на свадьбу в Telegram",
          "как пригласить на свадьбу",
          "отправить электронное приглашение",
          "ссылка на приглашение",
          "именное приглашение",
          "онлайн приглашение",
          "QR-код приглашение",
        ],
        lead: "Самый быстрый способ пригласить на свадьбу в Узбекистане — Telegram. Но просто кинуть ссылку мало: приглашение должно прийти с уважением. Несколько практических советов.",
        sections: [
          {
            heading: "Почему именно Telegram?",
            paragraphs: [
              "Telegram есть почти в каждой семье: родители, родственники, коллеги — все там. Ссылка на электронное приглашение красиво выглядит в Telegram: в чате появляется картинка и заголовок, гость нажимает и сразу открывает приглашение.",
              "В WhatsApp, Instagram и по SMS всё работает так же — приглашение [Taklifim.uz](/) открывается в любом мессенджере.",
            ],
          },
          {
            heading: "Отправляйте ссылку вместе с текстом",
            paragraphs: [
              "Одна ссылка без слов выглядит холодно. Напишите перед ней пару тёплых строк: обратитесь к гостю по имени, назовите дату свадьбы и попросите открыть приглашение.",
              "Нужны готовые тексты? Скопируйте [короткие тексты для Telegram](/wording/messengers) или другие [тексты приглашений](/wording).",
            ],
          },
          {
            heading: "Каждому гостю — именное приглашение",
            paragraphs: [
              "Добавьте на Taklifim список гостей, и для каждого появится своя ссылка. Открыв её, гость увидит обращение по имени: «Дорогой Азиз-ака!». Мелочь, но гость чувствует, что его действительно ждут.",
              "У именных ссылок есть ещё один плюс: в кабинете видно, кто из гостей придёт, кто не сможет, а кто ещё не ответил.",
            ],
          },
          {
            heading: "Когда отправлять?",
            paragraphs: ["Удобные сроки для приглашения на свадьбу:"],
            list: [
              "За 3–4 недели до свадьбы — основное приглашение.",
              "Родственникам за границей — ещё раньше, чтобы успели купить билеты.",
              "За 1–2 дня до свадьбы — ещё раз отправьте ссылку с коротким напоминанием.",
            ],
          },
          {
            heading: "Для тех, кто без смартфона, — QR-код",
            paragraphs: [
              "Скачайте QR-код приглашения и поставьте его на распечатанную открытку. Гость наводит камеру — и открывается приглашение с видео. А картинкой PNG приглашением можно поделиться где угодно.",
            ],
          },
          {
            heading: "Первый шаг",
            paragraphs: [
              "Создайте электронное приглашение на [Taklifim.uz](/), добавьте список гостей и отправьте каждому именное приглашение в Telegram — ответы тоже придут вам в Telegram.",
            ],
          },
        ],
        faq: [
          {
            q: "Можно ли отправить приглашение в группу?",
            a: "Можно, но близким лучше написать лично — так уважительнее. Для групп используйте общую ссылку, для близких — именную.",
          },
          {
            q: "Где смотреть ответы гостей?",
            a: "Каждый ответ приходит вам сообщением в Telegram, а полный список хранится в кабинете.",
          },
        ],
      },
      en: {
        name: "Sending invitations on Telegram",
        title: "How to send a wedding invitation on Telegram",
        metaTitle:
          "How to Send a Wedding Invitation on Telegram — Tips | Taklifim",
        metaDescription:
          "How to send an online wedding invitation on Telegram and WhatsApp with care: when to send it, what to write, personal links for each guest and QR codes.",
        keywords: [
          "send wedding invitation Telegram",
          "how to invite wedding guests",
          "online invitation link",
          "personalised wedding invitation",
          "digital invitation",
          "QR code invitation",
          "WhatsApp wedding invitation",
        ],
        lead: "In Uzbekistan, the quickest way to invite wedding guests is Telegram. But dropping a bare link isn't quite enough: an invitation should arrive with respect. Here are a few practical tips.",
        sections: [
          {
            heading: "Why Telegram?",
            paragraphs: [
              "Almost every family is on Telegram: parents, relatives and colleagues alike. An online invitation link looks great there, showing a picture and a title right in the chat, and guests open it with one tap.",
              "It works just as well on WhatsApp, Instagram or by text: a [Taklifim.uz](/) invitation opens in any messenger.",
            ],
          },
          {
            heading: "Send the link with a message",
            paragraphs: [
              "A link on its own can feel cold. Add a couple of warm lines before it: greet the guest by name, mention the wedding date and ask them to open the invitation.",
              "Need ready-made text? Copy one of our [short messages for Telegram](/wording/messengers) or other [wording samples](/wording).",
            ],
          },
          {
            heading: "A named invitation for every guest",
            paragraphs: [
              "Add your guest list on Taklifim and each guest gets a link of their own. When they open it, the invitation greets them by name. It's a small touch, but it makes guests feel truly expected.",
              "Named links have another benefit: your account shows which guests are coming, which can't make it and who hasn't replied yet.",
            ],
          },
          {
            heading: "When to send it",
            paragraphs: ["Good timing for wedding invitations:"],
            list: [
              "3–4 weeks before the wedding: the main invitation.",
              "Relatives abroad: even earlier, so they have time to book tickets.",
              "1–2 days before: send the link again with a short reminder.",
            ],
          },
          {
            heading: "A QR code for guests without a smartphone",
            paragraphs: [
              "Download your invitation's QR code and put it on a printed card. Guests point their camera at it and the video invitation opens. You can also download the invitation as a PNG image to share anywhere.",
            ],
          },
          {
            heading: "Your first step",
            paragraphs: [
              "Create an online invitation on [Taklifim.uz](/), add your guest list and send each guest a named invitation on Telegram. Their replies come back to your Telegram too.",
            ],
          },
        ],
        faq: [
          {
            q: "Can I send the invitation to a group chat?",
            a: "You can, but close family and friends deserve a personal message. Use the shared link for groups and named links for the people closest to you.",
          },
          {
            q: "Where do I see guests' replies?",
            a: "Each reply arrives as a Telegram message, and the full list is in your account.",
          },
        ],
      },
    },
  },

  "guest-replies": {
    published: "2026-10-21",
    text: {
      uz: {
        name: "Mehmonlar sonini bilish",
        title: "Toʻyga necha mehmon keladi? Onlayn javob yigʻish",
        metaTitle:
          "Toʻyga keladigan mehmonlar sonini bilish — onlayn javob | Taklifim",
        metaDescription:
          "Elektron taklifnoma orqali mehmonlarning javobini qanday yigʻish mumkin: kim keladi, necha kishi keladi, tilaklar va Telegramga keladigan bildirishnomalar.",
        keywords: [
          "toʻy mehmonlari soni",
          "mehmonlar roʻyxati",
          "taklifnoma javob",
          "RSVP",
          "elektron taklifnoma",
          "toʻyga tayyorgarlik",
          "onlayn taklifnoma",
        ],
        lead: "Toʻyxona bilan kelishish, dasturxon va joylarni tayyorlash uchun mehmonlar sonini oldindan bilish kerak. Elektron taklifnoma bu savolni qoʻngʻiroqlarsiz hal qiladi.",
        sections: [
          {
            heading: "Nega mehmonlar sonini bilish muhim?",
            paragraphs: [
              "Toʻy xarajatining katta qismi mehmonlar soniga bogʻliq: toʻyxonadagi stollar, taomlar, dasturxon. Har bir mehmonga qoʻngʻiroq qilib soʻrash esa koʻp vaqt oladi va noqulay.",
            ],
          },
          {
            heading: "Taklifnomaning oʻzida javob",
            paragraphs: [
              "[Taklifim.uz](/) taklifnomasida «Taklifga javob» formasi bor. Mehmon kelish-kelmasligini va oʻzi bilan necha kishi kelishini belgilaydi, xohlasa kelin-kuyovga tilak yozadi. Hammasi bir daqiqa.",
              "Har bir javob darhol Telegramingizga xabar boʻlib keladi, toʻliq roʻyxat va jami mehmonlar soni esa kabinetda turadi.",
            ],
          },
          {
            heading: "Ismli taklifnomalar bilan aniqroq",
            paragraphs: [
              "Mehmonlar roʻyxatini kiritib, har biriga ismli havola yuborsangiz, javoblar aynan shu mehmonga bogʻlanadi. Kim kelishi, kim kela olmasligi va kim hali javob bermagani koʻrinadi — kimga eslatish kerakligini bilasiz.",
            ],
          },
          {
            heading: "Koʻproq javob olish uchun maslahatlar",
            paragraphs: [],
            list: [
              "Taklif matnida qachongacha javob kutayotganingizni yozing.",
              "Toʻydan bir hafta oldin javob bermaganlarga qisqa eslatma yuboring.",
              "Javob soʻraladigan tayyor [matn namunalari](/wording/wedding)dan foydalaning.",
            ],
          },
          {
            heading: "Tilaklar — faqat sizga",
            paragraphs: [
              "Mehmonlar yozgan tilaklar boshqalarga koʻrinmaydi, ular faqat sizga keladi. Yoqqanlarini belgilab qoʻyasiz — toʻydan keyin ham ularni qayta oʻqish yoqimli.",
              "Toʻyingizni rejalashtirishni [taklifim.uz](/) bilan boshlang: [dizayn tanlang](/designs), taklifnoma yarating va mehmonlar javobini bir joyda yigʻing.",
            ],
          },
        ],
        faq: [
          {
            q: "Mehmon javobini oʻzgartira oladimi?",
            a: "Ha. Mehmon qayta javob yuborishi mumkin, yangi javobi ham Telegramingizga keladi.",
          },
          {
            q: "Javoblar uchun alohida toʻlov bormi?",
            a: "Yoʻq. Javoblar va tilaklar har bir eʼlon qilingan taklifnomada bor.",
          },
        ],
      },
      ru: {
        name: "Сколько гостей придёт",
        title: "Сколько гостей придёт на свадьбу? Ответы гостей онлайн",
        metaTitle:
          "Как узнать, сколько гостей придёт на свадьбу — онлайн RSVP | Taklifim",
        metaDescription:
          "Как собрать ответы гостей через электронное приглашение: кто придёт, сколько человек, пожелания молодожёнам и уведомления в Telegram.",
        keywords: [
          "сколько гостей на свадьбу",
          "список гостей на свадьбу",
          "ответ на приглашение",
          "RSVP",
          "электронное приглашение",
          "подготовка к свадьбе",
          "онлайн приглашение",
        ],
        lead: "Чтобы договориться с рестораном, рассчитать угощение и рассадку, нужно заранее знать число гостей. Электронное приглашение решает этот вопрос без звонков.",
        sections: [
          {
            heading: "Зачем знать число гостей?",
            paragraphs: [
              "Большая часть свадебного бюджета зависит от количества гостей: столы в ресторане, блюда, дастархан. А обзванивать каждого гостя долго и неловко.",
            ],
          },
          {
            heading: "Ответ прямо в приглашении",
            paragraphs: [
              "В приглашении [Taklifim.uz](/) есть форма ответа. Гость отмечает, придёт ли он и сколько человек будет с ним, а при желании пишет пожелание молодожёнам. Это занимает минуту.",
              "Каждый ответ сразу приходит вам сообщением в Telegram, а полный список и общее число гостей — в кабинете.",
            ],
          },
          {
            heading: "Точнее — с именными приглашениями",
            paragraphs: [
              "Добавьте список гостей и отправьте каждому именную ссылку — тогда ответы привязываются к конкретному гостю. Видно, кто придёт, кто не сможет, а кто пока молчит, — и вы знаете, кому напомнить.",
            ],
          },
          {
            heading: "Как получить больше ответов",
            paragraphs: [],
            list: [
              "Укажите в тексте приглашения, до какого числа ждёте ответа.",
              "За неделю до свадьбы напомните тем, кто ещё не ответил.",
              "Используйте готовые [тексты приглашений](/wording/wedding) с просьбой ответить.",
            ],
          },
          {
            heading: "Пожелания — только вам",
            paragraphs: [
              "Пожелания гостей не видны другим, они приходят только вам. Отмечайте самые тёплые — их приятно перечитать и после свадьбы.",
              "Начните подготовку со [Taklifim.uz](/): [выберите дизайн](/designs), создайте приглашение и собирайте ответы гостей в одном месте.",
            ],
          },
        ],
        faq: [
          {
            q: "Может ли гость изменить ответ?",
            a: "Да. Гость может ответить ещё раз, и новый ответ тоже придёт вам в Telegram.",
          },
          {
            q: "Ответы гостей оплачиваются отдельно?",
            a: "Нет. Ответы и пожелания есть в каждом опубликованном приглашении.",
          },
        ],
      },
      en: {
        name: "Knowing who's coming",
        title: "How many guests are coming? Collecting RSVPs online",
        metaTitle:
          "Wedding RSVP Online — Know How Many Guests Are Coming | Taklifim",
        metaDescription:
          "How to collect wedding RSVPs with an online invitation: who's coming, how many people, wishes for the couple and replies sent straight to Telegram.",
        keywords: [
          "wedding RSVP online",
          "wedding guest list",
          "how many wedding guests",
          "digital invitation RSVP",
          "online wedding invitation",
          "wedding planning",
        ],
        lead: "To book the venue, plan the food and set the tables, you need to know how many guests are coming. An online invitation answers that without a single phone call.",
        sections: [
          {
            heading: "Why the guest count matters",
            paragraphs: [
              "Much of a wedding budget depends on the number of guests: tables, dishes and the whole dastarkhan. Calling every guest to ask takes ages and feels awkward.",
            ],
          },
          {
            heading: "Replies right inside the invitation",
            paragraphs: [
              "Every [Taklifim.uz](/) invitation has a reply form. Guests say whether they're coming and how many people they're bringing, and can leave wishes for the couple. It takes a minute.",
              "Each reply arrives in your Telegram straight away, and the full list with the total guest count is in your account.",
            ],
          },
          {
            heading: "More precise with named invitations",
            paragraphs: [
              "Add your guest list and send each guest a named link, and every reply is matched to that guest. You can see who's coming, who can't and who hasn't answered yet, so you know whom to remind.",
            ],
          },
          {
            heading: "Tips for getting more replies",
            paragraphs: [],
            list: [
              "Say in your message by when you'd like a reply.",
              "A week before the wedding, remind those who haven't answered.",
              "Use our ready-made [wording samples](/wording/wedding) that ask guests to reply.",
            ],
          },
          {
            heading: "Wishes just for you",
            paragraphs: [
              "Guests' wishes aren't shown to anyone else; they come to you alone. Mark your favourites, and enjoy reading them again after the wedding.",
              "Start planning with [Taklifim.uz](/): [choose a design](/designs), create your invitation and collect every reply in one place.",
            ],
          },
        ],
        faq: [
          {
            q: "Can a guest change their reply?",
            a: "Yes. A guest can reply again, and the new reply reaches your Telegram too.",
          },
          {
            q: "Do RSVPs cost extra?",
            a: "No. Replies and wishes come with every published invitation.",
          },
        ],
      },
    },
  },

  "plov-invitation": {
    published: "2026-10-21",
    text: {
      uz: {
        name: "Nahorgi osh taklifnomasi",
        title: "Nahorgi osh taklifnomasi: elektron osh taklifnomasi",
        metaTitle:
          "Nahorgi osh taklifnomasi — elektron osh taklifnomasi | Taklifim",
        metaDescription:
          "Nahorgi oshga elektron taklifnoma: unda nima boʻlishi kerak, osh vaqtini qanday yozish va Taklifim’da osh taklifnomasini qanday bepul olish mumkin.",
        keywords: [
          "nahorgi osh taklifnomasi",
          "osh taklifnomasi",
          "nahor oshi",
          "oshga taklif",
          "elektron taklifnoma",
          "toʻy oshi taklifnomasi",
          "ош таклифномаси",
        ],
        lead: "Nahorgi osh — oʻzbek toʻyining fayzli boshlanishi. Unga mehmonlarni ham chiroyli taklif qilish kerak. Elektron osh taklifnomasi buni oson va tez qiladi.",
        sections: [
          {
            heading: "Osh taklifnomasining oʻziga xosligi",
            paragraphs: [
              "Nahorgi osh erta tongda boshlanadi va tez tugaydi, shuning uchun taklifnomada eng muhimi — aniq vaqt. Mehmon osh qachon tortilishini bilishi kerak, aks holda kechikib qolishi mumkin.",
              "Odatda oshga mahalla, qoʻni-qoʻshnilar, ota-onaning doʻstlari va hamkasblari chaqiriladi. Ularning koʻpchiligi Telegramda, shuning uchun elektron taklifnoma ayni muddao.",
            ],
          },
          {
            heading: "Osh taklifnomasida nima boʻlishi kerak",
            paragraphs: [],
            list: [
              "Kimning toʻyi munosabati bilan osh berilayotgani.",
              "Sana va osh tortiladigan aniq vaqt (masalan, soat 6:00).",
              "Manzil va xarita: choyxona, toʻyxona yoki xonadon.",
              "Taklif qiluvchi oila nomi.",
            ],
          },
          {
            heading: "Taklifim’da osh taklifnomasi — sovgʻa",
            paragraphs: [
              "[Taklifim.uz](/)’da sotib olingan har bir toʻy taklifnomasi uchun nahorgi osh taklifnomasini bepul sovgʻa qilamiz. Uning dizayni ham oʻzbekona: oltin naqshli lagan qopqogʻi koʻtariladi va ostidan bugʻi chiqib turgan osh koʻrinadi, osh vaqti esa alohida koʻrsatiladi.",
              "Osh taklifnomasida ham xarita, taymer va mehmonlar javobi bor.",
            ],
          },
          {
            heading: "Qanday olish mumkin",
            paragraphs: [],
            list: [
              "[Toʻy taklifnomasi uchun dizayn tanlang](/designs) va uni yarating.",
              "Taklifnomani eʼlon qiling.",
              "Kabinetda bepul osh taklifnomasini toʻldirib, mehmonlarga yuboring.",
            ],
          },
          {
            heading: "Ikki taklifnoma — bitta joyda",
            paragraphs: [
              "Toʻy va osh taklifnomalari kabinetingizda yonma-yon turadi, javoblar esa Telegramingizga keladi. [Taklifim.uz](/) saytida bugunoq boshlang.",
            ],
          },
        ],
        faq: [
          {
            q: "Osh taklifnomasini alohida sotib olsa boʻladimi?",
            a: "Hozircha osh taklifnomasi faqat sotib olingan toʻy taklifnomasiga sovgʻa sifatida beriladi.",
          },
          {
            q: "Osh taklifnomasini ham ismli qilsa boʻladimi?",
            a: "Ha, osh taklifnomasi ham boshqa taklifnomalar kabi ishlaydi: havola, xarita va javoblar bor.",
          },
        ],
      },
      ru: {
        name: "Приглашение на утренний плов",
        title: "Приглашение на утренний плов (нахорги ош) онлайн",
        metaTitle:
          "Приглашение на утренний плов — электронное приглашение на ош | Taklifim",
        metaDescription:
          "Электронное приглашение на утренний плов: что в нём указать, как написать время ош и как получить приглашение на плов бесплатно на Taklifim.",
        keywords: [
          "приглашение на плов",
          "приглашение на утренний плов",
          "нахорги ош",
          "приглашение на ош",
          "электронное приглашение",
          "свадебный плов",
        ],
        lead: "Утренний плов — душевное начало узбекской свадьбы. Гостей на него тоже стоит пригласить красиво, и электронное приглашение на ош делает это просто и быстро.",
        sections: [
          {
            heading: "Чем особенно приглашение на плов",
            paragraphs: [
              "Утренний плов начинается на рассвете и быстро заканчивается, поэтому главное в приглашении — точное время. Гость должен знать, когда подадут плов, иначе может опоздать.",
              "На ош обычно зовут махаллю, соседей, друзей и коллег родителей. Почти все они в Telegram, так что электронное приглашение — то, что нужно.",
            ],
          },
          {
            heading: "Что указать в приглашении на плов",
            paragraphs: [],
            list: [
              "По какому поводу — чья свадьба.",
              "Дату и точное время подачи плова (например, 6:00).",
              "Адрес и карту: чайхана, тойхана или дом.",
              "Имя приглашающей семьи.",
            ],
          },
          {
            heading: "Приглашение на плов от Taklifim — в подарок",
            paragraphs: [
              "За каждое купленное свадебное приглашение на [Taklifim.uz](/) мы дарим бесплатное приглашение на утренний плов. Его дизайн по-узбекски тёплый: крышка ляган с золотыми узорами поднимается, и под ней дымится плов, а время подачи показано отдельно.",
              "В приглашении на плов тоже есть карта, таймер и ответы гостей.",
            ],
          },
          {
            heading: "Как получить",
            paragraphs: [],
            list: [
              "[Выберите дизайн свадебного приглашения](/designs) и создайте его.",
              "Опубликуйте приглашение.",
              "Заполните в кабинете бесплатное приглашение на плов и отправьте гостям.",
            ],
          },
          {
            heading: "Два приглашения в одном месте",
            paragraphs: [
              "Приглашения на свадьбу и на плов лежат в кабинете рядом, а ответы приходят в ваш Telegram. Начните сегодня на [Taklifim.uz](/).",
            ],
          },
        ],
        faq: [
          {
            q: "Можно ли купить приглашение на плов отдельно?",
            a: "Пока приглашение на плов дарится только к купленному свадебному приглашению.",
          },
          {
            q: "Работает ли приглашение на плов как обычное?",
            a: "Да: у него есть ссылка, карта и ответы гостей, как у других приглашений.",
          },
        ],
      },
      en: {
        name: "Morning plov invitations",
        title: "Morning plov invitations: an online invitation to osh",
        metaTitle:
          "Morning Plov Invitation — Online Invitation to Osh | Taklifim",
        metaDescription:
          "An online invitation to a morning plov: what to include, how to show the serving time and how to get a plov invitation free on Taklifim.",
        keywords: [
          "plov invitation",
          "morning plov invitation",
          "nahorgi osh",
          "osh invitation",
          "Uzbek wedding traditions",
          "online invitation",
        ],
        lead: "The morning plov is the heartfelt start of an Uzbek wedding, and its guests deserve a lovely invitation too. An online plov invitation makes that quick and easy.",
        sections: [
          {
            heading: "What makes a plov invitation different",
            paragraphs: [
              "A morning plov starts at dawn and wraps up quickly, so the most important detail is the exact time. Guests need to know when the plov is served, or they may arrive too late.",
              "The guests are usually the neighbourhood (mahalla), neighbours, and the parents' friends and colleagues. Nearly all of them are on Telegram, which makes an online invitation a natural fit.",
            ],
          },
          {
            heading: "What to include",
            paragraphs: [],
            list: [
              "Whose wedding the plov celebrates.",
              "The date and the exact serving time (for example, 6:00 AM).",
              "The address with a map: a teahouse, a wedding hall or a family home.",
              "The hosting family's name.",
            ],
          },
          {
            heading: "A plov invitation from Taklifim, as a gift",
            paragraphs: [
              "For every wedding invitation you buy on [Taklifim.uz](/), we give you a free morning plov invitation. Its design is warmly Uzbek: the gold-patterned lid of a lagan platter lifts to reveal steaming plov, with the serving time set apart.",
              "The plov invitation has a map, a countdown and guest replies too.",
            ],
          },
          {
            heading: "How to get one",
            paragraphs: [],
            list: [
              "[Choose a wedding invitation design](/designs) and create it.",
              "Publish your invitation.",
              "Fill in your free plov invitation in your account and send it to guests.",
            ],
          },
          {
            heading: "Two invitations in one place",
            paragraphs: [
              "Your wedding and plov invitations sit side by side in your account, and replies arrive in your Telegram. Start today on [Taklifim.uz](/).",
            ],
          },
        ],
        faq: [
          {
            q: "Can I buy a plov invitation on its own?",
            a: "For now, the plov invitation comes only as a gift with a purchased wedding invitation.",
          },
          {
            q: "Does the plov invitation work like the others?",
            a: "Yes: it has its own link, a map and guest replies, just like other invitations.",
          },
        ],
      },
    },
  },
};

/** The articles with a page, in the order they're listed. */
export const ARTICLE_IDS = Object.keys(ARTICLES);

/** About how long the article takes to read, at ~180 words a minute. */
export function readingMinutes(article: ArticleText) {
  const text = [
    article.lead,
    ...article.sections.flatMap((s) => [
      s.heading,
      ...s.paragraphs,
      ...(s.list ?? []),
    ]),
    ...article.faq.flatMap((f) => [f.q, f.a]),
  ].join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).length / 180));
}
