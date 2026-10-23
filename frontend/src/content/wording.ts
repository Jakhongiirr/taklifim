// Invitation wording samples (/[locale]/wording/<topic>), written for each
// site language rather than translated, so they read naturally. Samples are
// for sending with the invitation link or anywhere else; the invitation's own
// greeting is part of its design. Placeholders go in [square brackets].
// Intro, tips and the "why" section may link to pages of the site with
// [label](/path), like articles do.

export interface WordingSample {
  /** Short label: the sample's tone or use. */
  title: string;
  /** The text itself; \n starts a new line. */
  text: string;
}

export interface WordingFaq {
  q: string;
  a: string;
}

export interface WordingTopic {
  /** In lists and breadcrumbs. */
  name: string;
  /** The page's h1. */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** The search words the page is written around. */
  keywords: string[];
  intro: string[];
  /** What to include, how to word it. */
  tips: string[];
  samples: WordingSample[];
  /** Why send the text with an online invitation; under the samples. */
  why: { heading: string; paragraphs: string[]; list: string[] };
  faq: WordingFaq[];
}

export const WORDING: Record<string, Record<string, WordingTopic>> = {
  wedding: {
    uz: {
      name: "Toʻy taklifnomasi",
      title: "Toʻy taklifnomasi matni: 6 ta tayyor namuna",
      metaTitle:
        "Toʻy taklifnomasi matni — tayyor namunalar, onlayn taklifnoma | Taklifim",
      metaDescription:
        "Toʻyga taklif matni: rasmiy, samimiy, tantanavor va qisqa namunalar. Nusxa oling, ismlarni qoʻying va Taklifim.uz’da videoli onlayn toʻy taklifnomasi bilan yuboring.",
      keywords: [
        "toʻy taklifnomasi matni",
        "toʻyga taklif matni",
        "taklifnoma matni",
        "taklifnoma namunalari",
        "toʻy taklifnomasi",
        "onlayn taklifnoma",
        "elektron taklifnoma",
        "тўй таклифномаси матни",
      ],
      intro: [
        "Toʻy taklifnomasi matni — mehmon toʻyingiz haqida birinchi oʻqiydigan soʻzlar. Yaxshi taklif matni hurmatli, aniq va qisqa boʻladi: kimning toʻyi, qachon va qayerda.",
        "Quyida turli uslubdagi tayyor toʻyga taklif matnlari bor. Yoqqanidan nusxa oling, kvadrat qavslardagi joylarni oʻzingiznikiga almashtiring va matnni [onlayn toʻy taklifnomasi](/designs) havolasi bilan yuboring — mehmonlar sana, xarita va musiqani bir bosishda koʻradi.",
      ],
      tips: [
        "Kelin va kuyovning ismlarini, sana, vaqt va toʻyxona manzilini albatta yozing.",
        "Mehmonga ismi bilan murojaat qiling — bu hurmat belgisi. Taklifim.uz’dagi ismli taklifnoma har bir mehmonni oʻz ismi bilan kutib oladi.",
        "Matnni qisqa tuting: xarita, dastur va suratlar elektron taklifnomaning oʻzida boʻladi.",
        "Kelish-kelmasligini qachongacha bildirishni soʻrasangiz, sanasini yozing — javoblar Telegramingizga keladi.",
      ],
      samples: [
        {
          title: "Rasmiy",
          text: "Hurmatli [mehmon ismi]!\nHayotimizning eng quvonchli kunida yonimizda boʻlishingizni istaymiz. Sizni [kuyov ismi] va [kelin ismi]ning nikoh toʻyiga bagʻishlangan tantanaga taklif qilamiz.\nSana: [sana], soat [vaqt]\nManzil: [toʻyxona nomi], [manzil]\nHurmat bilan, [oila nomi] oilasi",
        },
        {
          title: "Samimiy",
          text: "Aziz [mehmon ismi]!\nBiz turmush quryapmiz! Bu quvonchli kunni siz bilan birga nishonlashni juda istaymiz.\n[sana] kuni soat [vaqt]da [toʻyxona nomi]da sizni kutamiz.\nMehr bilan, [kuyov ismi] va [kelin ismi]",
        },
        {
          title: "Tantanavor",
          text: "Muhtaram [mehmon ismi]!\nIkki qalb va ikki oila birlashayotgan bu qutlugʻ kunda sizni oramizda koʻrishdan mamnun boʻlamiz. [kuyov ismi] va [kelin ismi]ning toʻy tantanasi [sana] kuni soat [vaqt]da [toʻyxona nomi]da boʻlib oʻtadi.\nDasturxonimiz fayzi — sizning tashrifingiz.",
        },
        {
          title: "Qisqa",
          text: "[kuyov ismi] va [kelin ismi]ning toʻyiga marhamat!\n[sana], soat [vaqt], [toʻyxona nomi].\nTashrifingiz biz uchun katta sharaf.",
        },
        {
          title: "Javob soʻralgan",
          text: "Hurmatli [mehmon ismi]!\nSizni [sana] kuni soat [vaqt]da [toʻyxona nomi]da boʻladigan [kuyov ismi] va [kelin ismi]ning toʻyiga taklif qilamiz.\nIltimos, kelishingizni [javob sanasi]gacha taklifnomadagi «Javob berish» tugmasi orqali bildiring — joylarni tayyorlashimizga yordam beradi.",
        },
        {
          title: "Onlayn taklifnoma bilan",
          text: "Assalomu alaykum, hurmatli [mehmon ismi]!\n[kuyov ismi] va [kelin ismi]ning toʻyiga sizni chin dildan taklif qilamiz. Toʻy [sana] kuni soat [vaqt]da.\nTaklifnomamizni oching — manzil, xarita va toʻygacha qolgan kunlar shu yerda: [havola]",
        },
      ],
      why: {
        heading: "Toʻy taklifnomasini onlayn yuborish nega qulay",
        paragraphs: [
          "Qogʻoz taklifnomani chop etish, tarqatish va mehmonlarni birma-bir aylanib chiqish koʻp vaqt oladi. Elektron toʻy taklifnomasini esa telefoningizda bir necha daqiqada yaratib, bitta havola bilan hammaga yuborasiz. Batafsil: [elektron taklifnoma yoki qogʻoz taklifnoma](/articles/online-vs-paper).",
          "Taklifim.uz’da yuqoridagi matnni chiroyli videoli taklifnoma bilan birga yuborasiz — mehmon havolani ochganda musiqa yangraydi, toʻyxona xaritada koʻrinadi, «Javob berish» tugmasi esa kim kelishini sizga aytadi.",
        ],
        list: [
          "Har bir dizayn oʻz videosi bilan ochiladi, tanlagan kuyingiz yangraydi.",
          "Toʻyxona manzili Yandex xaritada — mehmonlar adashmaydi.",
          "Mehmonlar javobi va tilaklari darhol Telegramingizga keladi.",
          "Ismli havolalar: taklifnoma har bir mehmonni ismi bilan kutib oladi.",
          "Yaratish va koʻrib chiqish bepul, toʻlov faqat eʼlon qilganda.",
        ],
      },
      faq: [
        {
          q: "Toʻy taklifnomasiga qanday matn yozish kerak?",
          a: "Mehmonga ism bilan murojaat, kelin-kuyovning ismlari, sana, vaqt va toʻyxona manzili — shu yetarli. Qolgan tafsilotlarni (xarita, suratlar, dastur) elektron taklifnomaga joylang, matn esa qisqa va hurmatli boʻlsin.",
        },
        {
          q: "Bu matnlardan bepul foydalansa boʻladimi?",
          a: "Ha, barcha namunalar bepul. Nusxa oling, oʻzgartiring va istalgan joyga yuboring. Taklifim.uz’da onlayn taklifnoma yaratish va uni koʻrib chiqish ham bepul.",
        },
        {
          q: "Taklif matnini qanday yuboraman?",
          a: "Matnni Taklifim.uz’da yaratilgan taklifnoma havolasi bilan Telegram, WhatsApp yoki SMS orqali yuboring. Mehmon hech narsa oʻrnatmaydi — havolani bossa, taklifnoma ochiladi.",
        },
      ],
    },
    ru: {
      name: "Приглашение на свадьбу",
      title: "Текст приглашения на свадьбу: 6 готовых примеров",
      metaTitle:
        "Текст приглашения на свадьбу — примеры, онлайн-приглашение | Taklifim",
      metaDescription:
        "Готовые тексты приглашений на свадьбу: официальные, тёплые, торжественные и короткие. Скопируйте, добавьте имена и отправьте с электронным приглашением с видео на Taklifim.uz.",
      keywords: [
        "текст приглашения на свадьбу",
        "приглашение на свадьбу",
        "приглашение на свадьбу текст",
        "электронное приглашение на свадьбу",
        "онлайн приглашение на свадьбу",
        "пригласительные на свадьбу",
        "toʻy taklifnomasi",
      ],
      intro: [
        "Текст приглашения на свадьбу — первое, что гости узнают о вашем празднике. Хорошее приглашение уважительное, понятное и короткое: чья свадьба, когда и где.",
        "Ниже — готовые тексты в разном стиле. Скопируйте подходящий, замените то, что в квадратных скобках, на свои данные и отправьте вместе со ссылкой на [онлайн-приглашение на свадьбу](/designs) — гости увидят дату, карту и услышат музыку в один клик.",
      ],
      tips: [
        "Обязательно укажите имена жениха и невесты, дату, время и адрес зала.",
        "Обращайтесь к гостю по имени — это знак уважения. Именное приглашение на Taklifim.uz встречает каждого гостя по имени.",
        "Текст держите коротким: карта, программа и фото будут в самом электронном приглашении.",
        "Если просите подтвердить приход, укажите, до какой даты, — ответы придут вам в Telegram.",
      ],
      samples: [
        {
          title: "Официальный",
          text: "Уважаемый(ая) [имя гостя]!\nМы будем рады видеть вас рядом в самый счастливый день нашей жизни. Приглашаем вас на торжество в честь бракосочетания [имя жениха] и [имя невесты].\nДата: [дата], в [время]\nМесто: [название зала], [адрес]\nС уважением, семья [фамилия]",
        },
        {
          title: "Тёплый",
          text: "Дорогой(ая) [имя гостя]!\nМы женимся! Нам очень хочется разделить этот радостный день с вами.\nЖдём вас [дата] в [время] в [название зала].\nС любовью, [имя жениха] и [имя невесты]",
        },
        {
          title: "Торжественный",
          text: "Дорогой(ая) [имя гостя]!\nВ этот благословенный день соединяются два сердца и две семьи, и мы будем счастливы видеть вас среди самых близких. Свадебное торжество [имя жениха] и [имя невесты] состоится [дата] в [время] в [название зала].\nВаше присутствие — лучшее украшение нашего праздника.",
        },
        {
          title: "Короткий",
          text: "Приглашаем на свадьбу [имя жениха] и [имя невесты]!\n[дата], [время], [название зала].\nБудем рады вас видеть.",
        },
        {
          title: "С просьбой ответить",
          text: "Уважаемый(ая) [имя гостя]!\nПриглашаем вас на свадьбу [имя жениха] и [имя невесты], которая пройдёт [дата] в [время] в [название зала].\nПожалуйста, подтвердите участие до [дата ответа] кнопкой «Ответить» в приглашении — так нам будет проще подготовиться.",
        },
        {
          title: "С онлайн-приглашением",
          text: "Здравствуйте, [имя гостя]!\nОт всего сердца приглашаем вас на свадьбу [имя жениха] и [имя невесты]. Торжество — [дата] в [время].\nОткройте наше приглашение: там адрес, карта и сколько дней осталось до свадьбы: [ссылка]",
        },
      ],
      why: {
        heading: "Почему приглашение на свадьбу удобнее отправить онлайн",
        paragraphs: [
          "Бумажные пригласительные нужно печатать, подписывать и развозить гостям. Электронное приглашение на свадьбу создаётся с телефона за несколько минут и отправляется всем одной ссылкой. Подробнее: [электронное или бумажное приглашение](/articles/online-vs-paper).",
          "На Taklifim.uz вы отправляете этот текст вместе с красивым приглашением с видео: гость открывает ссылку, звучит музыка, зал видно на карте, а кнопка «Ответить» сообщает вам, кто придёт.",
        ],
        list: [
          "Каждый дизайн открывается своим видео, звучит выбранная вами мелодия.",
          "Адрес зала на Яндекс Картах — гости не заблудятся.",
          "Ответы и пожелания гостей сразу приходят вам в Telegram.",
          "Именные ссылки: приглашение встречает каждого гостя по имени.",
          "Создать и посмотреть — бесплатно, оплата только при публикации.",
        ],
      },
      faq: [
        {
          q: "Что написать в приглашении на свадьбу?",
          a: "Обращение к гостю по имени, имена жениха и невесты, дату, время и адрес зала — этого достаточно. Карту, фото и программу разместите в электронном приглашении, а текст оставьте коротким и тёплым.",
        },
        {
          q: "Можно ли пользоваться этими текстами бесплатно?",
          a: "Да, все примеры бесплатные. Копируйте, меняйте и отправляйте куда угодно. Создать онлайн-приглашение на Taklifim.uz и посмотреть его тоже бесплатно.",
        },
        {
          q: "Как отправить текст приглашения гостям?",
          a: "Отправьте текст вместе со ссылкой на приглашение, созданное на Taklifim.uz, в Telegram, WhatsApp или по SMS. Гостю ничего не нужно устанавливать — приглашение открывается по ссылке.",
        },
      ],
    },
    en: {
      name: "Wedding invitation",
      title: "Wedding invitation wording: 6 ready-made examples",
      metaTitle:
        "Wedding Invitation Wording — Examples & Online Invitations | Taklifim",
      metaDescription:
        "Ready-made wedding invitation wording: formal, warm, festive and short. Copy one, add your names and send it with an online wedding invitation with video from Taklifim.uz.",
      keywords: [
        "wedding invitation wording",
        "wedding invitation text",
        "wedding invitation message",
        "online wedding invitation",
        "digital wedding invitation",
        "wedding invitation examples",
        "wedding invitation Uzbekistan",
      ],
      intro: [
        "Your wedding invitation wording is the first thing guests read about your big day. Good wording is respectful, clear and short: whose wedding, when and where.",
        "Below are ready-made texts in different tones. Copy the one you like, replace what's in square brackets with your own details and send it with an [online wedding invitation](/designs) link — guests see the date and map and hear your music in one tap.",
      ],
      tips: [
        "Always include both names, the date, the time and the venue.",
        "Address each guest by name — it shows respect. A named invitation on Taklifim.uz greets every guest by name.",
        "Keep it short: the map, schedule and photos are inside the digital invitation.",
        "If you'd like guests to reply, say by when — the replies come straight to your Telegram.",
      ],
      samples: [
        {
          title: "Formal",
          text: "Dear [guest's name],\nWe would be honoured to have you with us on the happiest day of our lives. Please join us to celebrate the marriage of [groom's name] and [bride's name].\nDate: [date] at [time]\nVenue: [venue name], [address]\nWith respect, the [family name] family",
        },
        {
          title: "Warm",
          text: "Dear [guest's name],\nWe're getting married! We'd love to share this joyful day with you.\nWe'll be waiting for you on [date] at [time] at [venue name].\nWith love, [groom's name] and [bride's name]",
        },
        {
          title: "Festive",
          text: "Dear [guest's name],\nOn this blessed day two hearts and two families become one, and we would be delighted to see you among us. The wedding of [groom's name] and [bride's name] will be held on [date] at [time] at [venue name].\nYour presence is the best gift to our celebration.",
        },
        {
          title: "Short",
          text: "You're invited to the wedding of [groom's name] and [bride's name]!\n[date], [time], [venue name].\nWe'd be glad to see you there.",
        },
        {
          title: "With a reply request",
          text: "Dear [guest's name],\nWe invite you to the wedding of [groom's name] and [bride's name] on [date] at [time] at [venue name].\nPlease let us know whether you can come by [reply date] with the “Reply” button in the invitation — it helps us prepare.",
        },
        {
          title: "With an online invitation",
          text: "Hello, [guest's name]!\nWe warmly invite you to the wedding of [groom's name] and [bride's name] on [date] at [time].\nOpen our invitation for the address, the map and a countdown to the big day: [link]",
        },
      ],
      why: {
        heading: "Why send your wedding invitation online",
        paragraphs: [
          "Paper invitations have to be printed, signed and delivered one by one. A digital wedding invitation takes a few minutes to make on your phone and reaches everyone with a single link. More on this: [online vs paper invitations](/articles/online-vs-paper).",
          "On Taklifim.uz you send this wording together with a beautiful video invitation: guests open the link, your music plays, the venue shows on a map and the “Reply” button tells you who's coming.",
        ],
        list: [
          "Every design opens with its own video and plays the song you choose.",
          "The venue is on Yandex Maps, so nobody gets lost.",
          "Guests' replies and wishes arrive in your Telegram right away.",
          "Named links: the invitation greets each guest by name.",
          "Creating and previewing is free; you only pay to publish.",
        ],
      },
      faq: [
        {
          q: "What should a wedding invitation say?",
          a: "The guest's name, both of your names, the date, the time and the venue are enough. Put the map, photos and schedule in the online invitation and keep the message short and warm.",
        },
        {
          q: "Can I use these texts for free?",
          a: "Yes, every example is free to copy, change and send anywhere. Creating and previewing an online invitation on Taklifim.uz is free too.",
        },
        {
          q: "How do I send the wording to my guests?",
          a: "Send it with the link to your Taklifim.uz invitation on Telegram, WhatsApp or by SMS. Guests don't need to install anything — the invitation opens from the link.",
        },
      ],
    },
  },
  "from-parents": {
    uz: {
      name: "Ota-ona nomidan",
      title: "Ota-ona nomidan toʻy taklifnomasi matni",
      metaTitle:
        "Ota-ona nomidan toʻy taklifnomasi matni — oʻgʻil toʻyi, qiz uzatish | Taklifim",
      metaDescription:
        "Ota-ona nomidan toʻyga taklif matnlari: oʻgʻil toʻyi, qiz uzatish, qarindoshlarga va duo bilan. Nusxa oling va Taklifim.uz’da onlayn toʻy taklifnomasi bilan yuboring.",
      keywords: [
        "ota-ona nomidan taklifnoma",
        "oʻgʻil toʻyi taklifnomasi",
        "qiz uzatish taklifnomasi",
        "toʻy taklifnomasi matni",
        "toʻyga taklif matni",
        "onlayn toʻy taklifnomasi",
        "elektron taklifnoma",
      ],
      intro: [
        "Oʻzbek toʻylarida mehmonlarni koʻpincha ota-ona taklif qiladi. Ota-ona nomidan toʻy taklifnomasi matnida farzandlarning ismi, oilaning nomi va mehmonga hurmat bilan murojaat boʻladi.",
        "Quyidagi namunalarda oʻgʻil toʻyi va qiz uzatish uchun tayyor matnlar bor. Kvadrat qavslardagi joylarni almashtiring va matnni farzandlaringiz uchun yaratilgan [elektron toʻy taklifnomasi](/designs) havolasi bilan yuboring.",
      ],
      tips: [
        "Imzoda ota-onaning ismini yoki oila nomini yozing.",
        "Oʻgʻil toʻyida «oʻgʻlimiz va kelinimiz», qiz uzatishda «qizimiz» deb yozish odatiy.",
        "Keksa qarindoshlarga «Siz» bilan, hurmat soʻzlari bilan murojaat qiling.",
        "Duo va yaxshi niyatlar bilan yakunlash oʻzbekona ohang beradi.",
        "Mehmonlar koʻp boʻlsa, ismli onlayn taklifnoma vaqtni tejaydi: har bir qarindoshga oʻz havolasi, oʻz ismi bilan.",
      ],
      samples: [
        {
          title: "Oʻgʻil toʻyi",
          text: "Hurmatli [mehmon ismi]!\nOʻgʻlimiz [kuyov ismi] va kelinimiz [kelin ismi]ning nikoh toʻyi munosabati bilan oʻtkaziladigan tantanamizga sizni taklif qilamiz.\n[sana] kuni soat [vaqt]da, [toʻyxona nomi]da.\nHurmat bilan, [ota ismi] va [ona ismi]",
        },
        {
          title: "Qiz uzatish",
          text: "Hurmatli [mehmon ismi]!\nQizimiz [kelin ismi]ni [kuyov ismi]ga uzatish marosimiga sizni taklif qilamiz. Bu quvonchli kunda duolaringiz va tashrifingiz biz uchun aziz.\n[sana], soat [vaqt], [toʻyxona nomi].\nHurmat bilan, [oila nomi] oilasi",
        },
        {
          title: "Duo bilan",
          text: "Assalomu alaykum, hurmatli [mehmon ismi]!\nAlloh nasib etsa, [sana] kuni oʻgʻlimiz [kuyov ismi]ning toʻyini oʻtkazmoqchimiz. Tashrifingiz va duolaringiz bilan bizni xursand qilasiz degan umiddamiz.\nToʻy soat [vaqt]da [toʻyxona nomi]da boʻladi.\nHurmat bilan, [oila nomi] oilasi",
        },
        {
          title: "Qarindoshlarga",
          text: "Aziz qarindoshlarimiz!\nOilamizda katta quvonch: [sana] kuni farzandlarimiz [kuyov ismi] va [kelin ismi]ning toʻyi boʻladi. Bu kunni sizlarsiz tasavvur qila olmaymiz.\nSoat [vaqt]da [toʻyxona nomi]da kutamiz.\nSizlarni sogʻingan, [ota ismi] va [ona ismi]",
        },
        {
          title: "Qisqa",
          text: "[oila nomi] oilasi sizni oʻgʻli [kuyov ismi]ning toʻyiga taklif etadi.\n[sana], soat [vaqt], [toʻyxona nomi].\nMarhamat!",
        },
        {
          title: "Havola bilan",
          text: "Assalomu alaykum, hurmatli [mehmon ismi]!\nFarzandlarimiz [kuyov ismi] va [kelin ismi]ning toʻyiga sizni taklif qilamiz. Toʻyxona manzili va xaritasi taklifnomada: [havola]\nHurmat bilan, [oila nomi] oilasi",
        },
      ],
      why: {
        heading: "Ota-onalar uchun onlayn taklifnoma",
        paragraphs: [
          "Yuzlab mehmonga qogʻoz taklifnoma tarqatish ota-onaga eng koʻp vaqt oladigan ishlardan biri. Onlayn toʻy taklifnomasini esa bir marta yaratasiz va qarindoshlar, qoʻshnilar, hamkasblarga bir zumda yuborasiz.",
          "Taklifim.uz’dagi taklifnoma keksa mehmonlar uchun ham qulay: hech narsa oʻrnatish shart emas, havolani bosish kifoya. Mehmonlar oʻzbek (lotin yoki kirill), rus yoki ingliz tilini tanlaydi, toʻyxona esa xaritada koʻrinadi.",
        ],
        list: [
          "Har bir mehmonga ismli havola — «Hurmatli Karim aka» deb kutib oladi.",
          "Kim kelishi va necha kishi boʻlishi Telegramingizga keladi.",
          "Vaqt yoki manzil oʻzgarsa, tahrirlaysiz — havola oʻsha-oʻsha.",
          "Har bir sotib olingan taklifnomaga nahorgi osh taklifnomasi sovgʻa.",
        ],
      },
      faq: [
        {
          q: "Ota-ona nomidan taklifnomaga kim imzo qoʻyadi?",
          a: "Odatda ota va onaning ismi yoki «[oila nomi] oilasi» deb yoziladi. Taklifim.uz’da imzoni taklifnomaning oʻziga ham qoʻshishingiz mumkin.",
        },
        {
          q: "Keksa qarindoshlar elektron taklifnomani ocha oladimi?",
          a: "Ha. Taklifnoma oddiy havola: Telegram yoki SMS’dagi havolani bossa, telefonda darhol ochiladi. Hech qanday ilova yoki roʻyxatdan oʻtish kerak emas.",
        },
        {
          q: "Nahorgi osh uchun ham taklifnoma boʻladimi?",
          a: "Ha. Taklifim.uz’da har bir sotib olingan toʻy taklifnomasiga nahorgi osh taklifnomasini bepul sovgʻa qilamiz.",
        },
      ],
    },
    ru: {
      name: "От имени родителей",
      title: "Текст приглашения на свадьбу от родителей",
      metaTitle:
        "Приглашение на свадьбу от родителей — тексты для свадьбы сына и дочери | Taklifim",
      metaDescription:
        "Тексты приглашений на свадьбу от имени родителей: свадьба сына, проводы дочери, родственникам и с пожеланиями. Скопируйте и отправьте с онлайн-приглашением Taklifim.uz.",
      keywords: [
        "приглашение на свадьбу от родителей",
        "текст приглашения на свадьбу сына",
        "приглашение на свадьбу дочери",
        "текст приглашения на свадьбу",
        "онлайн приглашение на свадьбу",
        "электронное приглашение",
      ],
      intro: [
        "На узбекской свадьбе гостей часто приглашают родители. В тексте приглашения на свадьбу от родителей называют детей, фамилию семьи и уважительно обращаются к гостю.",
        "Ниже — готовые тексты для свадьбы сына и проводов дочери. Замените то, что в квадратных скобках, и отправьте текст со ссылкой на [электронное приглашение на свадьбу](/designs) ваших детей.",
      ],
      tips: [
        "В подписи укажите имена родителей или фамилию семьи.",
        "Для свадьбы сына принято «наш сын и невестка», для проводов дочери — «наша дочь».",
        "К старшим родственникам обращайтесь на «Вы» и с уважением.",
        "Добрые пожелания в конце делают текст теплее.",
        "Если гостей много, именное онлайн-приглашение экономит время: у каждого родственника своя ссылка со своим именем.",
      ],
      samples: [
        {
          title: "Свадьба сына",
          text: "Уважаемый(ая) [имя гостя]!\nПриглашаем вас на торжество по случаю бракосочетания нашего сына [имя жениха] и невестки [имя невесты].\n[дата] в [время], [название зала].\nС уважением, [имя отца] и [имя матери]",
        },
        {
          title: "Проводы дочери",
          text: "Уважаемый(ая) [имя гостя]!\nПриглашаем вас на проводы нашей дочери [имя невесты], которая выходит замуж за [имя жениха]. В этот радостный день ваши добрые пожелания очень дороги нам.\n[дата], [время], [название зала].\nС уважением, семья [фамилия]",
        },
        {
          title: "С пожеланиями",
          text: "Уважаемый(ая) [имя гостя]!\nДаст Бог, [дата] мы празднуем свадьбу нашего сына [имя жениха]. Надеемся, что вы порадуете нас своим присутствием и добрыми словами.\nТоржество начнётся в [время] в [название зала].\nС уважением, семья [фамилия]",
        },
        {
          title: "Родственникам",
          text: "Дорогие наши родные!\nВ нашей семье большая радость: [дата] свадьба наших детей [имя жениха] и [имя невесты]. Мы не представляем этот день без вас.\nЖдём вас в [время] в [название зала].\nС любовью, [имя отца] и [имя матери]",
        },
        {
          title: "Короткий",
          text: "Семья [фамилия] приглашает вас на свадьбу сына [имя жениха].\n[дата], [время], [название зала].\nДобро пожаловать!",
        },
        {
          title: "Со ссылкой",
          text: "Здравствуйте, уважаемый(ая) [имя гостя]!\nПриглашаем вас на свадьбу наших детей [имя жениха] и [имя невесты]. Адрес зала и карта — в приглашении: [ссылка]\nС уважением, семья [фамилия]",
        },
      ],
      why: {
        heading: "Онлайн-приглашение для родителей",
        paragraphs: [
          "Раздать бумажные пригласительные сотням гостей — одна из самых долгих забот родителей. Онлайн-приглашение на свадьбу создаётся один раз и за минуту уходит родственникам, соседям и коллегам.",
          "Приглашение на Taklifim.uz удобно и старшим гостям: ничего не нужно устанавливать, достаточно нажать на ссылку. Гости выбирают узбекский (латиница или кириллица), русский или английский язык, а зал видно на карте.",
        ],
        list: [
          "Именная ссылка для каждого гостя — приглашение обращается к нему по имени.",
          "Кто придёт и сколько будет человек — приходит вам в Telegram.",
          "Изменилось время или адрес — поправите, ссылка останется прежней.",
          "К каждому купленному приглашению — приглашение на утренний плов в подарок.",
        ],
      },
      faq: [
        {
          q: "Кто подписывает приглашение от родителей?",
          a: "Обычно пишут имена отца и матери или «семья [фамилия]». На Taklifim.uz подпись можно добавить и в само приглашение.",
        },
        {
          q: "Смогут ли пожилые родственники открыть электронное приглашение?",
          a: "Да. Приглашение — это обычная ссылка: нажали в Telegram или SMS, и оно сразу открывается на телефоне. Приложения и регистрация не нужны.",
        },
        {
          q: "Есть ли приглашение на утренний плов?",
          a: "Да. К каждому купленному свадебному приглашению на Taklifim.uz мы дарим приглашение на утренний плов (нахорги ош).",
        },
      ],
    },
    en: {
      name: "From the parents",
      title: "Wedding invitation wording from the parents",
      metaTitle:
        "Wedding Invitation Wording from Parents — Son's & Daughter's Wedding | Taklifim",
      metaDescription:
        "Wedding invitation wording from the parents: a son's wedding, a daughter's wedding, for relatives and with blessings. Copy it and send it with an online invitation from Taklifim.uz.",
      keywords: [
        "wedding invitation wording from parents",
        "son's wedding invitation wording",
        "daughter's wedding invitation wording",
        "wedding invitation wording",
        "online wedding invitation",
        "Uzbek wedding invitation",
      ],
      intro: [
        "At Uzbek weddings guests are often invited by the parents. Wedding invitation wording from the parents names the children and the family and addresses the guest with respect.",
        "Below are ready-made texts for a son's and a daughter's wedding. Replace what's in square brackets and send the text with a link to your children's [digital wedding invitation](/designs).",
      ],
      tips: [
        "Sign with the parents' names or the family name.",
        "For a son's wedding, “our son and daughter-in-law” is customary; for a daughter's, “our daughter”.",
        "Address older relatives formally and respectfully.",
        "Closing with good wishes makes it warmer.",
        "With a long guest list, a named online invitation saves time: every relative gets their own link with their own name.",
      ],
      samples: [
        {
          title: "A son's wedding",
          text: "Dear [guest's name],\nWe invite you to the celebration of the marriage of our son [groom's name] and our daughter-in-law [bride's name].\n[date] at [time], [venue name].\nWith respect, [father's name] and [mother's name]",
        },
        {
          title: "A daughter's wedding",
          text: "Dear [guest's name],\nWe invite you to celebrate as our daughter [bride's name] marries [groom's name]. On this joyful day your good wishes mean a great deal to us.\n[date], [time], [venue name].\nWith respect, the [family name] family",
        },
        {
          title: "With blessings",
          text: "Dear [guest's name],\nGod willing, on [date] we will celebrate the wedding of our son [groom's name]. We hope you will honour us with your presence and your blessings.\nThe celebration begins at [time] at [venue name].\nWith respect, the [family name] family",
        },
        {
          title: "To relatives",
          text: "Our dear family,\nWe have wonderful news: on [date] our children [groom's name] and [bride's name] are getting married. We can't imagine the day without you.\nWe'll be waiting for you at [time] at [venue name].\nWith love, [father's name] and [mother's name]",
        },
        {
          title: "Short",
          text: "The [family name] family invites you to the wedding of their son [groom's name].\n[date], [time], [venue name].\nYou're most welcome!",
        },
        {
          title: "With a link",
          text: "Hello, dear [guest's name],\nWe invite you to the wedding of our children [groom's name] and [bride's name]. The venue address and map are in the invitation: [link]\nWith respect, the [family name] family",
        },
      ],
      why: {
        heading: "Online invitations for parents",
        paragraphs: [
          "Handing out paper invitations to hundreds of guests is one of the biggest jobs for the parents. An online wedding invitation is made once and reaches relatives, neighbours and colleagues in a minute.",
          "A Taklifim.uz invitation is easy for older guests too: there's nothing to install, they just tap the link. Guests choose Uzbek (Latin or Cyrillic), Russian or English, and the venue is on a map.",
        ],
        list: [
          "A named link for each guest — the invitation greets them by name.",
          "Who's coming and how many people arrives in your Telegram.",
          "If the time or address changes, edit it — the link stays the same.",
          "Every invitation you buy comes with a free morning plov invitation.",
        ],
      },
      faq: [
        {
          q: "Who signs an invitation from the parents?",
          a: "Usually the father's and mother's names, or “the [family name] family”. On Taklifim.uz you can add the signature to the invitation itself too.",
        },
        {
          q: "Can older relatives open a digital invitation?",
          a: "Yes. The invitation is a normal link: tap it in Telegram or an SMS and it opens on the phone right away. No app or sign-up needed.",
        },
        {
          q: "Is there an invitation for the morning plov?",
          a: "Yes. Every wedding invitation you buy on Taklifim.uz comes with a free morning plov (nahorgi osh) invitation.",
        },
      ],
    },
  },
  engagement: {
    uz: {
      name: "Fotiha va unashtiruv",
      title: "Fotiha toʻyi va unashtiruvga taklif matni",
      metaTitle:
        "Fotiha toʻyi taklifnomasi matni — unashtiruvga taklif namunalari | Taklifim",
      metaDescription:
        "Fotiha toʻyi, unashtiruv va non sindirishga taklif matnlari: rasmiy, oilaviy, duo bilan va qisqa. Fotiha toʻyi taklifnomasini Taklifim.uz’da onlayn yarating.",
      keywords: [
        "fotiha toʻyi taklifnomasi",
        "fotiha toʻyiga taklif matni",
        "unashtiruv taklifnomasi",
        "non sindirish taklifnoma",
        "fotiha taklifnoma",
        "onlayn taklifnoma",
        "фотиха тўй таклифномаси",
      ],
      intro: [
        "Fotiha toʻyi — ikki oila rozilik berib, yoshlarni unashtiradigan marosim. Unga odatda eng yaqin qarindosh va doʻstlar taklif qilinadi, shuning uchun fotiha toʻyi taklifnomasi matni iliq va samimiy boʻladi.",
        "Quyidagi namunalarni nusxalab, ismlar, sana va manzilni oʻzingiznikiga almashtiring. Fotiha uchun ham [chiroyli onlayn taklifnoma](/designs) yaratib, havolasini shu matn bilan yuborishingiz mumkin.",
      ],
      tips: [
        "Marosim nomini aniq yozing: fotiha toʻyi, unashtiruv yoki non sindirish.",
        "Yigit va qizning ismlarini, sana, vaqt va manzilni koʻrsating.",
        "Marosim kichikroq boʻlsa, «yaqinlarimiz davrasida» degan iborani qoʻshing.",
        "Fotiha uyda boʻlsa, xaritadagi manzil mehmonlarga ayniqsa kerak — onlayn taklifnomaga qoʻshing.",
      ],
      samples: [
        {
          title: "Rasmiy",
          text: "Hurmatli [mehmon ismi]!\nFarzandlarimiz [kuyov ismi] va [kelin ismi]ning fotiha toʻyiga sizni taklif qilamiz.\n[sana] kuni soat [vaqt]da, [manzil].\nHurmat bilan, [oila nomi] oilasi",
        },
        {
          title: "Oilaviy",
          text: "Aziz [mehmon ismi]!\nIkki oila uchun quvonchli kun yaqinlashmoqda: [kuyov ismi] va [kelin ismi]ning fotihasi. Shu kunni yaqinlarimiz davrasida, siz bilan birga oʻtkazmoqchimiz.\n[sana], soat [vaqt], [manzil].",
        },
        {
          title: "Duo bilan",
          text: "Assalomu alaykum, [mehmon ismi]!\nAlloh nasib etsa, [sana] kuni [kuyov ismi] va [kelin ismi]ga fotiha oʻqiladi. Duolaringiz bilan bu xayrli ishni boshlab berishingizni soʻraymiz.\nSoat [vaqt]da [manzil]da kutamiz.",
        },
        {
          title: "Qisqa",
          text: "[kuyov ismi] va [kelin ismi]ning fotiha toʻyiga marhamat!\n[sana], soat [vaqt], [manzil].",
        },
        {
          title: "Havola bilan",
          text: "Assalomu alaykum, [mehmon ismi]!\n[sana] kuni [kuyov ismi] va [kelin ismi]ning fotiha toʻyi. Sizni yaqinlarimiz davrasida kutamiz — manzil va xarita taklifnomada: [havola]",
        },
      ],
      why: {
        heading: "Fotiha toʻyi uchun onlayn taklifnoma",
        paragraphs: [
          "Fotiha toʻyiga mehmonlar kam boʻlsa ham, ularning har biri siz uchun aziz. Onlayn taklifnoma bu kunga tantanavorlik qoʻshadi: mehmon havolani ochganda video bilan ochilish, musiqa va suratlaringizni koʻradi.",
          "Taklifim.uz’da fotiha, unashtiruv yoki non sindirish uchun taklifnomani telefoningizda bir necha daqiqada yaratasiz, keyinroq esa xuddi shu usulda asosiy toʻy taklifnomasini ham tayyorlaysiz.",
        ],
        list: [
          "Videoli ochilish va tanlagan kuyingiz — oddiy xabardan ancha chiroyli.",
          "Uy yoki restoran manzili xaritada.",
          "Fotihagacha qolgan kun va soatlar jonli sanaladi.",
          "Mehmonlar javobini Telegramda olasiz.",
        ],
      },
      faq: [
        {
          q: "Fotiha toʻyiga taklifnoma kerakmi?",
          a: "Fotiha odatda kichikroq marosim, lekin taklifnoma mehmonlarga sana va manzilni aniq yetkazadi va kunni tantanavor qiladi. Onlayn taklifnomani yuborish esa juda oson.",
        },
        {
          q: "Fotiha uchun qaysi dizayn mos?",
          a: "Taklifim.uz’dagi istalgan dizaynni fotiha toʻyi uchun ishlatishingiz mumkin — sarlavha, matn va suratlarni oʻzingiz yozasiz. Dizaynlarni oldindan jonli koʻrib chiqing.",
        },
      ],
    },
    ru: {
      name: "Фотиха и помолвка",
      title: "Текст приглашения на фотиху и помолвку",
      metaTitle:
        "Приглашение на фотиха-той и помолвку — тексты и онлайн-приглашение | Taklifim",
      metaDescription:
        "Тексты приглашений на фотиха-той, помолвку и нон синдириш: официальные, семейные, с благословением и короткие. Создайте онлайн-приглашение на помолвку на Taklifim.uz.",
      keywords: [
        "приглашение на фотиха той",
        "приглашение на помолвку",
        "текст приглашения на помолвку",
        "фотиха той",
        "онлайн приглашение на помолвку",
        "электронное приглашение",
      ],
      intro: [
        "Фотиха-той — обряд, на котором две семьи дают согласие и обручают молодых. Обычно на него зовут самых близких родственников и друзей, поэтому текст приглашения на помолвку тёплый и душевный.",
        "Скопируйте подходящий текст и замените имена, дату и адрес на свои. Для фотихи тоже можно создать [красивое онлайн-приглашение](/designs) и отправить его ссылку с этим текстом.",
      ],
      tips: [
        "Назовите обряд точно: фотиха-той, помолвка или нон синдириш.",
        "Укажите имена молодых, дату, время и адрес.",
        "Если праздник камерный, добавьте «в кругу близких».",
        "Если фотиха проходит дома, гостям особенно нужен адрес на карте — добавьте его в онлайн-приглашение.",
      ],
      samples: [
        {
          title: "Официальный",
          text: "Уважаемый(ая) [имя гостя]!\nПриглашаем вас на фотиха-той наших детей [имя жениха] и [имя невесты].\n[дата] в [время], [адрес].\nС уважением, семья [фамилия]",
        },
        {
          title: "Семейный",
          text: "Дорогой(ая) [имя гостя]!\nДля двух наших семей приближается радостный день — помолвка [имя жениха] и [имя невесты]. Мы хотим провести его в кругу близких, вместе с вами.\n[дата], [время], [адрес].",
        },
        {
          title: "С благословением",
          text: "Здравствуйте, [имя гостя]!\nДаст Бог, [дата] мы прочтём фотиху [имя жениха] и [имя невесты]. Просим вас благословить молодых на это доброе начало.\nЖдём вас в [время] по адресу: [адрес].",
        },
        {
          title: "Короткий",
          text: "Приглашаем на фотиха-той [имя жениха] и [имя невесты]!\n[дата], [время], [адрес].",
        },
        {
          title: "Со ссылкой",
          text: "Здравствуйте, [имя гостя]!\n[дата] фотиха-той [имя жениха] и [имя невесты]. Ждём вас в кругу близких — адрес и карта в приглашении: [ссылка]",
        },
      ],
      why: {
        heading: "Онлайн-приглашение на фотиха-той",
        paragraphs: [
          "Даже если гостей на фотихе немного, каждый из них вам дорог. Онлайн-приглашение делает этот день торжественнее: гость открывает ссылку и видит видео-открытие, слышит музыку и смотрит ваши фото.",
          "На Taklifim.uz приглашение на фотиху, помолвку или нон синдириш создаётся с телефона за несколько минут, а потом так же легко — приглашение на саму свадьбу.",
        ],
        list: [
          "Открытие с видео и ваша мелодия — гораздо красивее обычного сообщения.",
          "Адрес дома или ресторана на карте.",
          "Живой отсчёт дней и часов до фотихи.",
          "Ответы гостей приходят вам в Telegram.",
        ],
      },
      faq: [
        {
          q: "Нужно ли приглашение на фотиха-той?",
          a: "Фотиха обычно камерный праздник, но приглашение точно сообщает гостям дату и адрес и делает день торжественным. А отправить онлайн-приглашение очень просто.",
        },
        {
          q: "Какой дизайн подойдёт для помолвки?",
          a: "Любой дизайн Taklifim.uz можно использовать для фотихи — заголовок, текст и фото вы пишете сами. Посмотрите дизайны вживую заранее.",
        },
      ],
    },
    en: {
      name: "Fotiha and engagement",
      title: "Fotiha and engagement invitation wording",
      metaTitle: "Engagement & Fotiha Invitation Wording — Examples | Taklifim",
      metaDescription:
        "Invitation wording for a fotiha (Uzbek engagement), an engagement party or non sindirish: formal, family, with blessings and short. Create an online engagement invitation on Taklifim.uz.",
      keywords: [
        "engagement invitation wording",
        "fotiha invitation",
        "engagement party invitation",
        "Uzbek engagement ceremony",
        "online engagement invitation",
        "digital invitation",
      ],
      intro: [
        "The fotiha is the Uzbek engagement ceremony, where two families give their blessing to the couple. Usually only the closest relatives and friends are invited, so engagement invitation wording is warm and personal.",
        "Copy the text you like and replace the names, date and address with your own. You can make a [beautiful online invitation](/designs) for the fotiha too and send its link with this text.",
      ],
      tips: [
        "Name the occasion clearly: fotiha, engagement or non sindirish.",
        "Give both names, the date, the time and the address.",
        "For a small gathering, add “among our closest family and friends”.",
        "If the fotiha is at home, guests especially need the address on a map — add it to your online invitation.",
      ],
      samples: [
        {
          title: "Formal",
          text: "Dear [guest's name],\nWe invite you to the fotiha of our children [groom's name] and [bride's name].\n[date] at [time], [address].\nWith respect, the [family name] family",
        },
        {
          title: "Family",
          text: "Dear [guest's name],\nA joyful day is coming for both our families — the engagement of [groom's name] and [bride's name]. We'd like to spend it among our closest family and friends, with you.\n[date], [time], [address].",
        },
        {
          title: "With blessings",
          text: "Dear [guest's name],\nGod willing, on [date] the fotiha of [groom's name] and [bride's name] will be read. We ask you to bless the couple on this good beginning.\nWe'll be waiting for you at [time] at [address].",
        },
        {
          title: "Short",
          text: "Join us for the fotiha of [groom's name] and [bride's name]!\n[date], [time], [address].",
        },
        {
          title: "With a link",
          text: "Hello, [guest's name]!\nThe fotiha of [groom's name] and [bride's name] is on [date]. We'd love to see you among our closest family — the address and map are in the invitation: [link]",
        },
      ],
      why: {
        heading: "An online invitation for your fotiha",
        paragraphs: [
          "Even if the fotiha is small, every guest matters to you. An online invitation makes the day feel special: guests open the link to a video opening, your music and your photos.",
          "On Taklifim.uz you can make an invitation for a fotiha, engagement or non sindirish on your phone in minutes — and later the wedding invitation in exactly the same way.",
        ],
        list: [
          "A video opening and your song — far nicer than a plain message.",
          "The home or restaurant address on a map.",
          "A live countdown of days and hours to the fotiha.",
          "Guests' replies come to your Telegram.",
        ],
      },
      faq: [
        {
          q: "Do you need invitations for a fotiha?",
          a: "A fotiha is usually small, but an invitation gives guests the exact date and address and makes the day feel festive. Sending an online invitation is very easy.",
        },
        {
          q: "Which design suits an engagement?",
          a: "Any Taklifim.uz design works for a fotiha — you write the heading, text and photos yourself. Preview the designs live first.",
        },
      ],
    },
  },
  messengers: {
    uz: {
      name: "Telegram uchun qisqa matnlar",
      title: "Taklifnoma havolasi bilan yuboriladigan qisqa matnlar",
      metaTitle:
        "Telegram orqali toʻyga taklif matni — elektron taklifnoma uchun qisqa namunalar | Taklifim",
      metaDescription:
        "Elektron taklifnoma havolasini Telegram, WhatsApp yoki SMS orqali yuborish uchun qisqa toʻyga taklif matnlari: rasmiy, samimiy, guruh uchun va eslatma.",
      keywords: [
        "telegram taklifnoma",
        "telegram orqali taklif matni",
        "toʻyga taklif matni qisqa",
        "elektron taklifnoma havolasi",
        "onlayn taklifnoma yuborish",
        "whatsapp taklifnoma",
        "taklifnoma matni",
      ],
      intro: [
        "Elektron taklifnomani yuborishda havolaning oldiga bir-ikki jumla qoʻshsangiz, mehmon uni albatta ochadi. Telegram uchun taklif matni qisqa boʻlsin — sana, xarita va musiqa taklifnomaning ichida.",
        "Quyidagi matnlarni nusxalab, [havola] oʻrniga taklifnomangiz havolasini qoʻying. Havola hali yoʻqmi? [Taklifim.uz’da onlayn taklifnoma yarating](/cabinet/new) — bir necha daqiqa kifoya. Yuborish boʻyicha maslahatlar: [taklifnomani Telegram orqali yuborish](/articles/send-invitation-telegram).",
      ],
      tips: [
        "Avval salom va ism bilan murojaat qiling, keyin havolani qoʻying.",
        "Sana va kimning toʻyi ekanini bir jumlada ayting — tafsilotlar taklifnomada.",
        "Guruhga yuborsangiz, umumiy murojaatdan foydalaning.",
        "Toʻydan bir-ikki kun oldin qisqa eslatma yuborish foydali.",
        "Telegram havolani chiroyli koʻrinishda (rasm va sarlavha bilan) koʻrsatadi — Taklifim.uz taklifnomalari buni avtomatik qiladi.",
      ],
      samples: [
        {
          title: "Rasmiy",
          text: "Assalomu alaykum, hurmatli [mehmon ismi]!\nSizni [sana] kuni boʻladigan [kuyov ismi] va [kelin ismi]ning toʻyiga taklif qilamiz. Taklifnoma: [havola]",
        },
        {
          title: "Samimiy",
          text: "Salom, [mehmon ismi]! Biz turmush quryapmiz 🤍\nTaklifnomamizni ochib koʻring, sizni [sana] kuni kutamiz: [havola]",
        },
        {
          title: "Guruh uchun",
          text: "Assalomu alaykum, aziz doʻstlar va qarindoshlar!\n[sana] kuni [kuyov ismi] va [kelin ismi]ning toʻyi. Barchangizni taklif qilamiz — sana, manzil va xarita taklifnomada: [havola]",
        },
        {
          title: "Javob soʻrab",
          text: "Assalomu alaykum, [mehmon ismi]! Sizni toʻyimizga taklif qilamiz: [havola]\nKela olishingizni taklifnomadagi tugma orqali bildirsangiz, xursand boʻlamiz.",
        },
        {
          title: "Eslatma",
          text: "Assalomu alaykum, [mehmon ismi]! Eslatib qoʻyamiz: toʻyimiz ertaga, soat [vaqt]da. Manzil va xarita shu yerda: [havola]\nSizni kutamiz!",
        },
        {
          title: "Telegram kanal yoki status",
          text: "Biz turmush quryapmiz! 💍\n[kuyov ismi] va [kelin ismi] — [sana].\nTaklifnomamiz: [havola]",
        },
      ],
      why: {
        heading: "Telegram’da yuborish uchun eng yaxshi taklifnoma",
        paragraphs: [
          "Oʻzbekistonda toʻy taklifnomalari asosan Telegram orqali yuboriladi. Oddiy rasm yoki uzun xabar oʻrniga Taklifim.uz havolasini yuboring: chatda chiroyli koʻrinadi, bosilganda esa video bilan ochiladigan toʻliq taklifnoma chiqadi.",
          "Havola bitta, lekin imkoniyati koʻp: mehmon toʻyxonani xaritada topadi, kelishini bir bosishda bildiradi, siz esa har bir javobni Telegram’da darhol olasiz.",
        ],
        list: [
          "Telegram, WhatsApp, Instagram va SMS — havola hamma joyda ishlaydi.",
          "Har bir mehmonga ismli havola yuborish mumkin.",
          "Taklifnomani PNG rasm yoki QR kod qilib ham yuklab olasiz.",
          "Sana yoki manzil oʻzgarsa ham, yuborilgan havola oʻzgarmaydi.",
        ],
      },
      faq: [
        {
          q: "Taklifnomani Telegram’da qanday yuboraman?",
          a: "Taklifim.uz’da taklifnomani yarating va eʼlon qiling, keyin havolasini nusxalab, shu sahifadagi qisqa matnlardan biri bilan mehmon yoki guruhga yuboring.",
        },
        {
          q: "Har bir mehmonga alohida havola yuborsa boʻladimi?",
          a: "Ha. Ismli taklifnomalar boʻlimida har bir mehmon uchun shaxsiy havola yaratasiz — taklifnoma uni ismi bilan kutib oladi.",
        },
        {
          q: "Mehmon havolani ochmasa nima qilaman?",
          a: "Toʻydan bir-ikki kun oldin «Eslatma» namunasini yuboring. Taklifnoma qancha marta ochilganini kabinetingizda koʻrasiz.",
        },
      ],
    },
    ru: {
      name: "Короткие тексты для Telegram",
      title: "Короткие тексты к ссылке на приглашение",
      metaTitle:
        "Приглашение на свадьбу в Telegram — короткие тексты к электронному приглашению | Taklifim",
      metaDescription:
        "Короткие тексты, чтобы отправить ссылку на электронное приглашение на свадьбу в Telegram, WhatsApp или SMS: официальные, тёплые, для группы и напоминание.",
      keywords: [
        "приглашение на свадьбу в телеграм",
        "текст приглашения в телеграм",
        "короткий текст приглашения на свадьбу",
        "электронное приглашение ссылка",
        "отправить приглашение онлайн",
        "приглашение в whatsapp",
      ],
      intro: [
        "Отправляя электронное приглашение на свадьбу, добавьте к ссылке пару слов — так гость точно его откроет. Текст для Telegram должен быть коротким: дата, карта и музыка — внутри приглашения.",
        "Скопируйте текст и вставьте вместо [ссылка] ссылку на ваше приглашение. Ссылки ещё нет? [Создайте онлайн-приглашение на Taklifim.uz](/cabinet/new) — это займёт несколько минут. Советы по отправке: [как отправить приглашение в Telegram](/articles/send-invitation-telegram).",
      ],
      tips: [
        "Начните с приветствия и имени, потом — ссылка.",
        "Одной фразой скажите, чья свадьба и когда, остальное — в приглашении.",
        "Для группового чата используйте общее обращение.",
        "За день-два до свадьбы полезно отправить короткое напоминание.",
        "Telegram показывает ссылку красивым превью с картинкой и заголовком — приглашения Taklifim.uz делают это автоматически.",
      ],
      samples: [
        {
          title: "Официальный",
          text: "Здравствуйте, [имя гостя]!\nПриглашаем вас на свадьбу [имя жениха] и [имя невесты], которая состоится [дата]. Приглашение: [ссылка]",
        },
        {
          title: "Тёплый",
          text: "Привет, [имя гостя]! Мы женимся 🤍\nОткрой наше приглашение — ждём тебя [дата]: [ссылка]",
        },
        {
          title: "Для группы",
          text: "Дорогие друзья и родные!\n[дата] свадьба [имя жениха] и [имя невесты]. Приглашаем всех — дата, адрес и карта в приглашении: [ссылка]",
        },
        {
          title: "С просьбой ответить",
          text: "Здравствуйте, [имя гостя]! Приглашаем вас на нашу свадьбу: [ссылка]\nБудем рады, если вы ответите кнопкой в приглашении, сможете ли прийти.",
        },
        {
          title: "Напоминание",
          text: "Здравствуйте, [имя гостя]! Напоминаем: наша свадьба завтра в [время]. Адрес и карта здесь: [ссылка]\nЖдём вас!",
        },
        {
          title: "Для канала или статуса",
          text: "Мы женимся! 💍\n[имя жениха] и [имя невесты] — [дата].\nНаше приглашение: [ссылка]",
        },
      ],
      why: {
        heading: "Лучшее приглашение для отправки в Telegram",
        paragraphs: [
          "В Узбекистане свадебные приглашения чаще всего отправляют в Telegram. Вместо картинки или длинного сообщения отправьте ссылку Taklifim.uz: в чате она выглядит красиво, а по нажатию открывается полноценное приглашение с видео.",
          "Одна ссылка — много возможностей: гость находит зал на карте, отвечает одним нажатием, а вы сразу получаете каждый ответ в Telegram.",
        ],
        list: [
          "Telegram, WhatsApp, Instagram и SMS — ссылка работает везде.",
          "Каждому гостю можно отправить именную ссылку.",
          "Приглашение можно скачать картинкой PNG или QR-кодом.",
          "Даже если дата или адрес изменятся, отправленная ссылка останется прежней.",
        ],
      },
      faq: [
        {
          q: "Как отправить приглашение на свадьбу в Telegram?",
          a: "Создайте и опубликуйте приглашение на Taklifim.uz, скопируйте ссылку и отправьте её гостю или в группу вместе с одним из коротких текстов на этой странице.",
        },
        {
          q: "Можно ли отправить каждому гостю свою ссылку?",
          a: "Да. В разделе именных приглашений вы создаёте личную ссылку для каждого гостя — приглашение встречает его по имени.",
        },
        {
          q: "Что делать, если гость не открыл ссылку?",
          a: "За день-два до свадьбы отправьте текст «Напоминание». Сколько раз открывали приглашение, видно в вашем кабинете.",
        },
      ],
    },
    en: {
      name: "Short texts for messengers",
      title: "Short texts to send with your invitation link",
      metaTitle:
        "Short Wedding Invitation Messages for Telegram & WhatsApp | Taklifim",
      metaDescription:
        "Short messages to send your online wedding invitation link on Telegram, WhatsApp or SMS: formal, warm, for group chats, a reminder and a channel post.",
      keywords: [
        "wedding invitation message",
        "short wedding invitation text",
        "wedding invitation for WhatsApp",
        "Telegram wedding invitation",
        "send invitation link",
        "online wedding invitation",
      ],
      intro: [
        "When you send a digital wedding invitation, a line or two before the link makes sure guests open it. Keep the message short — the date, map and music are inside the invitation.",
        "Copy a message and put your invitation's link in place of [link]. No link yet? [Create an online invitation on Taklifim.uz](/cabinet/new) — it takes a few minutes. Tips on sending: [how to send an invitation on Telegram](/articles/send-invitation-telegram).",
      ],
      tips: [
        "Start with a greeting and the guest's name, then the link.",
        "Say whose wedding it is and when in one sentence; the rest is in the invitation.",
        "For a group chat, use a general greeting.",
        "A short reminder a day or two before the wedding helps.",
        "Telegram shows links as a preview with a picture and title — Taklifim.uz invitations do this automatically.",
      ],
      samples: [
        {
          title: "Formal",
          text: "Hello, [guest's name]!\nWe invite you to the wedding of [groom's name] and [bride's name] on [date]. Your invitation: [link]",
        },
        {
          title: "Warm",
          text: "Hi [guest's name]! We're getting married 🤍\nOpen our invitation — we'll see you on [date]: [link]",
        },
        {
          title: "For a group chat",
          text: "Dear friends and family!\n[groom's name] and [bride's name] are getting married on [date]. You're all invited — the date, address and map are in the invitation: [link]",
        },
        {
          title: "Asking for a reply",
          text: "Hello, [guest's name]! We'd love you to come to our wedding: [link]\nPlease let us know with the button in the invitation whether you can make it.",
        },
        {
          title: "Reminder",
          text: "Hello, [guest's name]! Just a reminder: our wedding is tomorrow at [time]. The address and map are here: [link]\nSee you there!",
        },
        {
          title: "For a channel or status",
          text: "We're getting married! 💍\n[groom's name] and [bride's name] — [date].\nOur invitation: [link]",
        },
      ],
      why: {
        heading: "The best invitation to send on Telegram",
        paragraphs: [
          "In Uzbekistan wedding invitations are mostly sent on Telegram. Instead of a picture or a long message, send a Taklifim.uz link: it looks great in the chat and opens a full invitation with a video opening.",
          "One link does a lot: guests find the venue on a map and reply in one tap, and you get every reply in Telegram straight away.",
        ],
        list: [
          "Telegram, WhatsApp, Instagram and SMS — the link works everywhere.",
          "You can send each guest a named link.",
          "Download the invitation as a PNG picture or a QR code too.",
          "Even if the date or address changes, the link you sent stays the same.",
        ],
      },
      faq: [
        {
          q: "How do I send a wedding invitation on Telegram?",
          a: "Create and publish your invitation on Taklifim.uz, copy its link and send it to a guest or a group with one of the short messages on this page.",
        },
        {
          q: "Can each guest get their own link?",
          a: "Yes. In the named invitations section you create a personal link for each guest, and the invitation greets them by name.",
        },
        {
          q: "What if a guest doesn't open the link?",
          a: "Send the “Reminder” message a day or two before the wedding. You can see how many times your invitation was opened in your account.",
        },
      ],
    },
  },
  friends: {
    uz: {
      name: "Doʻstlar va hamkasblar uchun",
      title: "Doʻstlar va hamkasblarni toʻyga taklif qilish matni",
      metaTitle:
        "Doʻstlar va hamkasblar uchun toʻyga taklif matni — namunalar | Taklifim",
      metaDescription:
        "Doʻstlar, dugonalar, sinfdoshlar va hamkasblarni toʻyga taklif qilish matnlari: samimiy, hazilomuz va ish jamoasi uchun. Onlayn taklifnoma bilan yuboring.",
      keywords: [
        "doʻstlarga toʻyga taklif matni",
        "hamkasblarga taklifnoma",
        "toʻyga taklif matni",
        "dugonaga taklif",
        "sinfdoshlarga taklifnoma",
        "onlayn taklifnoma",
      ],
      intro: [
        "Doʻstlar va tengdoshlarga toʻyga taklif matni erkinroq, samimiyroq boʻlishi mumkin, hamkasblarga esa odobli va qisqa.",
        "Quyidagi namunalardan nusxa oling, ismlar, sana va manzilni almashtiring va matnni [videoli onlayn taklifnoma](/designs) havolasi bilan yuboring — doʻstlaringiz albatta ochib koʻradi.",
      ],
      tips: [
        "Doʻstlarga «sen» bilan, hamkasblarga «siz» bilan murojaat qiling.",
        "Ish jamoasiga yuborishda butun jamoani bitta matnda taklif qilish mumkin.",
        "Hazil qoʻshsangiz ham, sana va manzil aniq boʻlsin.",
        "Doʻstlar guruhiga bitta havola yuborsangiz, kim kelishini taklifnomadagi javoblardan bilasiz.",
      ],
      samples: [
        {
          title: "Doʻstga",
          text: "[doʻst ismi], salom!\nNihoyat bu kun keldi — men uylanyapman! Sensiz toʻy toʻy emas, albatta kel.\n[sana], soat [vaqt], [toʻyxona nomi].\n[kuyov ismi]",
        },
        {
          title: "Dugonaga",
          text: "Azizim [dugona ismi]!\nMen turmushga chiqyapman! Shu baxtli kunda yonimda boʻlishingni juda xohlayman.\n[sana], soat [vaqt], [toʻyxona nomi].\nSeni kutaman, [kelin ismi]",
        },
        {
          title: "Hamkasblarga",
          text: "Hurmatli hamkasblar!\nSizlarni [sana] kuni soat [vaqt]da [toʻyxona nomi]da boʻladigan toʻyimga taklif qilaman. Shu quvonchli kunni jamoamiz bilan birga nishonlasak, xursand boʻlaman.\nHurmat bilan, [ismingiz]",
        },
        {
          title: "Sinfdoshlarga",
          text: "Aziz sinfdoshlar!\nYana bir sababga koʻra yigʻilamiz: [sana] kuni toʻyim! Hammangizni kutaman.\nSoat [vaqt], [toʻyxona nomi].",
        },
        {
          title: "Doʻstlar guruhiga",
          text: "Doʻstlar, katta yangilik! 🎉\n[sana] kuni toʻyim. Hammangizni kutaman — taklifnomani ochib, kelishingizni bildiring: [havola]",
        },
      ],
      why: {
        heading: "Doʻstlarni zamonaviy usulda taklif qiling",
        paragraphs: [
          "Doʻstlar va hamkasblar kunini telefonda oʻtkazadi — taklifnoma ham oʻsha yerda boʻlsin. Taklifim.uz’dagi onlayn taklifnoma video bilan ochiladi, sevimli qoʻshigʻingiz yangraydi va suratlaringizni koʻrsatadi.",
          "Bir havola bilan butun jamoani yoki doʻstlar guruhini taklif qilasiz, kim kelishini esa Telegram’da koʻrib turasiz.",
        ],
        list: [
          "Oʻz musiqangizni yuklang yoki tayyor kuylardan tanlang.",
          "6 tagacha suratingiz chiroyli ramkalarda.",
          "Toʻygacha jonli sanoq — doʻstlaringiz kunni unutmaydi.",
          "Mehmonlar tilaklarini faqat sizga yozadi.",
        ],
      },
      faq: [
        {
          q: "Hamkasblarni toʻyga qanday taklif qilish kerak?",
          a: "Hurmatli va qisqa matn yozing: sana, vaqt va toʻyxona. Butun jamoani bitta xabar va onlayn taklifnoma havolasi bilan taklif qilish qulay.",
        },
        {
          q: "Taklifnomaga oʻz musiqamni qoʻysam boʻladimi?",
          a: "Ha. Taklifim.uz’da tayyor kuylardan tanlashingiz yoki oʻz qoʻshigʻingizni yuklashingiz mumkin — u taklifnoma ochilganda yangraydi.",
        },
      ],
    },
    ru: {
      name: "Друзьям и коллегам",
      title: "Текст приглашения на свадьбу для друзей и коллег",
      metaTitle:
        "Приглашение на свадьбу друзьям и коллегам — тексты | Taklifim",
      metaDescription:
        "Тексты приглашений на свадьбу для друзей, подруг, одноклассников и коллег: тёплые, шутливые и для рабочего коллектива. Отправьте с онлайн-приглашением.",
      keywords: [
        "приглашение на свадьбу друзьям",
        "приглашение на свадьбу коллегам",
        "текст приглашения на свадьбу",
        "приглашение подруге на свадьбу",
        "онлайн приглашение",
      ],
      intro: [
        "Для друзей текст приглашения на свадьбу может быть свободнее и теплее, для коллег — вежливым и коротким.",
        "Скопируйте пример, замените имена, дату и место и отправьте текст со ссылкой на [онлайн-приглашение с видео](/designs) — друзья точно его откроют.",
      ],
      tips: [
        "Друзьям пишите на «ты», коллегам — на «вы».",
        "Рабочий коллектив можно пригласить одним сообщением.",
        "Даже в шутливом тексте дата и адрес должны быть точными.",
        "Отправьте одну ссылку в чат друзей — кто придёт, узнаете из ответов в приглашении.",
      ],
      samples: [
        {
          title: "Другу",
          text: "[имя друга], привет!\nЭтот день настал — я женюсь! Без тебя свадьба не свадьба, приходи обязательно.\n[дата], [время], [название зала].\n[имя жениха]",
        },
        {
          title: "Подруге",
          text: "Дорогая [имя подруги]!\nЯ выхожу замуж! Очень хочу, чтобы в этот счастливый день ты была рядом.\n[дата], [время], [название зала].\nЖду тебя, [имя невесты]",
        },
        {
          title: "Коллегам",
          text: "Уважаемые коллеги!\nПриглашаю вас на мою свадьбу [дата] в [время] в [название зала]. Буду рад(а) отпраздновать этот радостный день вместе с нашей командой.\nС уважением, [ваше имя]",
        },
        {
          title: "Одноклассникам",
          text: "Дорогие одноклассники!\nУ нас снова повод собраться: [дата] моя свадьба! Жду всех.\n[время], [название зала].",
        },
        {
          title: "В чат друзей",
          text: "Друзья, большая новость! 🎉\n[дата] моя свадьба. Жду всех — откройте приглашение и ответьте, придёте ли: [ссылка]",
        },
      ],
      why: {
        heading: "Пригласите друзей по-современному",
        paragraphs: [
          "Друзья и коллеги весь день в телефоне — пусть и приглашение будет там. Онлайн-приглашение Taklifim.uz открывается с видео, играет ваша любимая песня и показывает ваши фото.",
          "Одной ссылкой вы приглашаете всю команду или чат друзей, а кто придёт — видите в Telegram.",
        ],
        list: [
          "Загрузите свою музыку или выберите готовую мелодию.",
          "До 6 ваших фото в красивых рамках.",
          "Живой отсчёт до свадьбы — друзья не забудут дату.",
          "Пожелания гости пишут только вам.",
        ],
      },
      faq: [
        {
          q: "Как пригласить коллег на свадьбу?",
          a: "Напишите вежливый и короткий текст: дата, время и зал. Всю команду удобно пригласить одним сообщением со ссылкой на онлайн-приглашение.",
        },
        {
          q: "Можно ли поставить в приглашение свою музыку?",
          a: "Да. На Taklifim.uz можно выбрать готовую мелодию или загрузить свою песню — она зазвучит, когда гость откроет приглашение.",
        },
      ],
    },
    en: {
      name: "For friends and colleagues",
      title: "Wedding invitation wording for friends and colleagues",
      metaTitle:
        "Wedding Invitation Wording for Friends & Colleagues | Taklifim",
      metaDescription:
        "Wedding invitation wording for friends, classmates and colleagues: warm, playful and work-team examples. Send it with an online wedding invitation from Taklifim.uz.",
      keywords: [
        "wedding invitation wording for friends",
        "wedding invitation for colleagues",
        "casual wedding invitation wording",
        "wedding invitation message",
        "online wedding invitation",
      ],
      intro: [
        "For friends, wedding invitation wording can be relaxed and warm; for colleagues, polite and short.",
        "Copy an example, replace the names, date and venue and send it with a link to an [online invitation with video](/designs) — your friends will definitely open it.",
      ],
      tips: [
        "Write to friends casually and to colleagues more formally.",
        "You can invite a whole work team in one message.",
        "Even in a playful text, keep the date and address exact.",
        "Send one link to your friends' group chat and see who's coming from the replies in the invitation.",
      ],
      samples: [
        {
          title: "To a friend",
          text: "Hey [friend's name]!\nThe day has come — I'm getting married! It won't be a wedding without you, so make sure you come.\n[date], [time], [venue name].\n[groom's name]",
        },
        {
          title: "To a close friend",
          text: "Dear [friend's name],\nI'm getting married! I'd really love you to be by my side on this happy day.\n[date], [time], [venue name].\nCan't wait to see you, [bride's name]",
        },
        {
          title: "To colleagues",
          text: "Dear colleagues,\nI'd like to invite you to my wedding on [date] at [time] at [venue name]. It would be lovely to celebrate this happy day together with our team.\nKind regards, [your name]",
        },
        {
          title: "To classmates",
          text: "Dear classmates,\nWe have another reason to get together: I'm getting married on [date]! I hope to see you all there.\n[time], [venue name].",
        },
        {
          title: "To a group chat",
          text: "Big news, everyone! 🎉\nI'm getting married on [date]. I'd love to see you all — open the invitation and let me know if you're coming: [link]",
        },
      ],
      why: {
        heading: "Invite your friends the modern way",
        paragraphs: [
          "Your friends and colleagues live on their phones, so that's where your invitation should be. A Taklifim.uz online invitation opens with a video, plays your favourite song and shows your photos.",
          "One link invites the whole team or group chat, and you see who's coming in Telegram.",
        ],
        list: [
          "Upload your own music or pick a ready-made tune.",
          "Up to 6 of your photos in beautiful frames.",
          "A live countdown, so nobody forgets the date.",
          "Guests write their wishes to you alone.",
        ],
      },
      faq: [
        {
          q: "How do I invite colleagues to my wedding?",
          a: "Write a polite, short message with the date, time and venue. It's easiest to invite the whole team in one message with a link to your online invitation.",
        },
        {
          q: "Can I add my own music to the invitation?",
          a: "Yes. On Taklifim.uz you can pick a ready-made tune or upload your own song — it plays when a guest opens the invitation.",
        },
      ],
    },
  },
  "thank-you": {
    uz: {
      name: "Toʻydan keyin rahmat",
      title: "Toʻydan keyin mehmonlarga rahmat matni",
      metaTitle:
        "Toʻydan keyin mehmonlarga minnatdorchilik matni — namunalar | Taklifim",
      metaDescription:
        "Toʻydan keyin mehmonlarga rahmat matnlari: kelin-kuyov va ota-ona nomidan, sovgʻa uchun va hammaga. Toʻy suratlarini taklifnoma havolasi orqali ulashing.",
      keywords: [
        "toʻydan keyin rahmat matni",
        "mehmonlarga minnatdorchilik",
        "toʻy uchun rahmat xabari",
        "sovgʻa uchun rahmat",
        "toʻy suratlari ulashish",
        "onlayn taklifnoma",
      ],
      intro: [
        "Toʻydan keyin mehmonlarga rahmat aytish — chiroyli odat. Qisqa minnatdorchilik xabari ham ularning tashrifi siz uchun qanchalik qadrli boʻlganini bildiradi.",
        "Taklifim.uz’dagi onlayn taklifnoma toʻydan keyin ham ochiq qoladi, shuning uchun rahmat xabariga uning havolasini qoʻshib, toʻy suratlarini ham ulashishingiz mumkin.",
      ],
      tips: [
        "Rahmatni toʻydan keyingi bir-ikki hafta ichida yuboring.",
        "Sovgʻa yoki toʻyona uchun alohida minnatdorchilik bildiring.",
        "Yaqin kishilarga ism bilan, shaxsiy xabar yozing.",
        "Toʻy suratlarini taklifnomaga qoʻshib, havolasini rahmat xabari bilan yuboring.",
      ],
      samples: [
        {
          title: "Kelin-kuyov nomidan",
          text: "Aziz [mehmon ismi]!\nToʻyimizga kelib, quvonchimizga sherik boʻlganingiz uchun chin dildan rahmat. Sizning tashrifingiz va iliq tilaklaringiz bu kunni yanada unutilmas qildi.\nMehr bilan, [kuyov ismi] va [kelin ismi]",
        },
        {
          title: "Ota-ona nomidan",
          text: "Hurmatli [mehmon ismi]!\nFarzandlarimiz toʻyiga tashrif buyurib, duolaringizni ayamaganingiz uchun sizdan behad minnatdormiz. Alloh sizni ham doim quvonchli kunlar bilan siylasin.\nHurmat bilan, [oila nomi] oilasi",
        },
        {
          title: "Sovgʻa uchun",
          text: "[mehmon ismi], katta rahmat!\nToʻyimizda boʻlganingiz va ajoyib sovgʻangiz uchun minnatdormiz. Uni koʻrgan har safar sizni eslaymiz.\n[kuyov ismi] va [kelin ismi]",
        },
        {
          title: "Hammaga",
          text: "Aziz qarindoshlar va doʻstlar!\nToʻyimizda biz bilan boʻlganingiz uchun barchangizga rahmat. Toʻydan suratlar taklifnomamizda: [havola]",
        },
      ],
      why: {
        heading: "Taklifnoma toʻydan keyin ham ishlaydi",
        paragraphs: [
          "Qogʻoz taklifnoma toʻydan keyin unutiladi, onlayn taklifnoma esa xotiraga aylanadi. Taklifim.uz’da toʻydan keyin ham taklifnomangizni tahrirlab, eng yaxshi suratlarni qoʻshishingiz va havolasini rahmat xabari bilan yuborishingiz mumkin.",
          "Mehmonlar yozgan tilaklar ham kabinetingizda saqlanadi — eng yoqqanlarini belgilab, yillar oʻtib qayta oʻqiysiz.",
        ],
        list: [
          "Taklifnoma tadbirdan keyin ham ochiq qoladi.",
          "Suratlar va matnni istalgan payt yangilaysiz, havola oʻzgarmaydi.",
          "Mehmonlarning barcha tilaklari bir joyda.",
        ],
      },
      faq: [
        {
          q: "Toʻydan keyin qachon rahmat aytish kerak?",
          a: "Toʻydan keyingi bir-ikki hafta ichida. Yaqinlarga shaxsiy, qolganlarga umumiy xabar yuborish mumkin.",
        },
        {
          q: "Taklifnoma toʻydan keyin qancha vaqt ochiq turadi?",
          a: "Taklifnoma tadbirdan keyin ham ochiq qoladi. Tadbir kunidan bir yil oʻtgach uning suratlari oʻchiriladi, matni esa saqlanadi.",
        },
      ],
    },
    ru: {
      name: "Благодарность после свадьбы",
      title: "Текст благодарности гостям после свадьбы",
      metaTitle:
        "Благодарность гостям после свадьбы — тексты и примеры | Taklifim",
      metaDescription:
        "Тексты благодарности гостям после свадьбы: от молодожёнов и от родителей, за подарок и для всех гостей. Поделитесь свадебными фото по ссылке на приглашение.",
      keywords: [
        "благодарность гостям после свадьбы",
        "текст благодарности за свадьбу",
        "спасибо гостям за свадьбу",
        "благодарность за подарок на свадьбу",
        "онлайн приглашение",
      ],
      intro: [
        "Поблагодарить гостей после свадьбы — красивая традиция. Даже короткое сообщение с благодарностью покажет, как вам было дорого их присутствие.",
        "Онлайн-приглашение на Taklifim.uz остаётся доступным и после свадьбы, поэтому к благодарности можно приложить его ссылку и поделиться свадебными фото.",
      ],
      tips: [
        "Отправьте благодарность в течение одной-двух недель после свадьбы.",
        "Отдельно поблагодарите за подарок.",
        "Близким напишите лично, по имени.",
        "Добавьте свадебные фото в приглашение и отправьте ссылку вместе с благодарностью.",
      ],
      samples: [
        {
          title: "От молодожёнов",
          text: "Дорогой(ая) [имя гостя]!\nОт всего сердца спасибо, что пришли на нашу свадьбу и разделили с нами радость. Ваше присутствие и тёплые пожелания сделали этот день незабываемым.\nС любовью, [имя жениха] и [имя невесты]",
        },
        {
          title: "От родителей",
          text: "Уважаемый(ая) [имя гостя]!\nМы бесконечно благодарны вам за то, что вы были на свадьбе наших детей и не пожалели для них добрых слов. Пусть и в вашем доме всегда будет повод для радости.\nС уважением, семья [фамилия]",
        },
        {
          title: "За подарок",
          text: "[имя гостя], большое спасибо!\nМы благодарны, что вы были на нашей свадьбе, и за чудесный подарок. Каждый раз, глядя на него, будем вспоминать вас.\n[имя жениха] и [имя невесты]",
        },
        {
          title: "Всем гостям",
          text: "Дорогие родные и друзья!\nСпасибо всем, кто был с нами на свадьбе. Фото с праздника — в нашем приглашении: [ссылка]",
        },
      ],
      why: {
        heading: "Приглашение работает и после свадьбы",
        paragraphs: [
          "Бумажное приглашение после свадьбы забывается, а онлайн-приглашение становится памятью. На Taklifim.uz его можно отредактировать и после праздника, добавить лучшие фото и отправить ссылку вместе с благодарностью.",
          "Пожелания гостей тоже хранятся в вашем кабинете — отметьте самые любимые и перечитывайте их спустя годы.",
        ],
        list: [
          "Приглашение остаётся открытым и после торжества.",
          "Фото и текст можно обновить в любой момент, ссылка не меняется.",
          "Все пожелания гостей в одном месте.",
        ],
      },
      faq: [
        {
          q: "Когда благодарить гостей после свадьбы?",
          a: "В течение одной-двух недель после свадьбы. Близким — лично, остальным можно отправить общее сообщение.",
        },
        {
          q: "Сколько приглашение остаётся открытым после свадьбы?",
          a: "Приглашение остаётся доступным и после торжества. Через год после даты праздника фото удаляются, а текст сохраняется.",
        },
      ],
    },
    en: {
      name: "Thank-you after the wedding",
      title: "Thank-you messages for wedding guests",
      metaTitle: "Wedding Thank-You Messages for Guests — Examples | Taklifim",
      metaDescription:
        "Thank-you messages for your wedding guests: from the couple and from the parents, for a gift and for everyone. Share your wedding photos through your invitation link.",
      keywords: [
        "wedding thank you message",
        "thank you message for wedding guests",
        "wedding thank you wording",
        "thank you for wedding gift",
        "online wedding invitation",
      ],
      intro: [
        "Thanking your guests after the wedding is a lovely tradition. Even a short thank-you message shows how much their presence meant to you.",
        "Your Taklifim.uz online invitation stays up after the wedding, so you can add its link to your thank-you and share your wedding photos.",
      ],
      tips: [
        "Send your thanks within a week or two of the wedding.",
        "Thank guests for their gifts separately.",
        "Write to those closest to you personally, by name.",
        "Add your wedding photos to the invitation and send its link with your thanks.",
      ],
      samples: [
        {
          title: "From the couple",
          text: "Dear [guest's name],\nThank you from the bottom of our hearts for coming to our wedding and sharing our joy. Your presence and warm wishes made the day unforgettable.\nWith love, [groom's name] and [bride's name]",
        },
        {
          title: "From the parents",
          text: "Dear [guest's name],\nWe are deeply grateful that you came to our children's wedding and shared your kind words with them. May your home always have reasons to celebrate.\nWith respect, the [family name] family",
        },
        {
          title: "For a gift",
          text: "[guest's name], thank you so much!\nWe're grateful you came to our wedding and for your wonderful gift. We'll think of you every time we see it.\n[groom's name] and [bride's name]",
        },
        {
          title: "To everyone",
          text: "Dear family and friends,\nThank you all for being with us at our wedding. The photos are in our invitation: [link]",
        },
      ],
      why: {
        heading: "Your invitation keeps working after the wedding",
        paragraphs: [
          "A paper invitation is forgotten after the wedding; an online invitation becomes a keepsake. On Taklifim.uz you can still edit it afterwards, add your best photos and send the link with your thanks.",
          "Your guests' wishes stay in your account too — mark your favourites and read them again years later.",
        ],
        list: [
          "The invitation stays online after the event.",
          "Update the photos and text any time; the link doesn't change.",
          "All your guests' wishes in one place.",
        ],
      },
      faq: [
        {
          q: "When should you thank wedding guests?",
          a: "Within a week or two of the wedding. Write personally to those closest to you; a general message works for everyone else.",
        },
        {
          q: "How long does the invitation stay online after the wedding?",
          a: "The invitation stays open after the event. A year after the event date its photos are deleted and the text is kept.",
        },
      ],
    },
  },
};

/** The topics with a page, in the order they're listed. */
export const WORDING_TOPICS = Object.keys(WORDING);
