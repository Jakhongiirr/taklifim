// Invitation wording samples (/[locale]/wording/<topic>), written for each
// site language rather than translated, so they read naturally. Samples are
// for sending with the invitation link or anywhere else; the invitation's own
// greeting is part of its design. Placeholders go in [square brackets].

export interface WordingSample {
  /** Short label: the sample's tone or use. */
  title: string;
  /** The text itself; \n starts a new line. */
  text: string;
}

export interface WordingTopic {
  /** In lists and breadcrumbs. */
  name: string;
  /** The page's h1. */
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  /** What to include, how to word it. */
  tips: string[];
  samples: WordingSample[];
}

export const WORDING: Record<string, Record<string, WordingTopic>> = {
  wedding: {
    uz: {
      name: "Toʻy taklifnomasi",
      title: "Toʻy taklifnomasi matni: namunalar",
      metaTitle: "Toʻy taklifnomasi matni — tayyor namunalar | Taklifim",
      metaDescription:
        "Toʻyga taklifnoma uchun tayyor matnlar: rasmiy, samimiy, qisqa va tantanavor namunalar. Nusxa oling, ismlar va sanani qoʻying.",
      intro: [
        "Toʻy taklifnomasi — mehmon toʻyingiz haqida birinchi bilib oladigan narsa. Shuning uchun matn hurmatli, aniq va qisqa boʻlgani maʼqul.",
        "Quyida turli uslubdagi tayyor matnlar bor. Yoqqanidan nusxa oling va kvadrat qavslardagi joylarni oʻzingiznikiga almashtiring.",
      ],
      tips: [
        "Kelin va kuyovning ismlarini, sana, vaqt va toʻyxona manzilini albatta yozing.",
        "Mehmonga ismi bilan murojaat qiling — bu hurmat belgisi.",
        "Matnni qisqa tuting: tafsilotlar (xarita, dastur) taklifnomaning oʻzida boʻladi.",
        "Kelish-kelmasligini qachongacha bildirishni soʻrasangiz, sanasini yozing.",
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
      ],
    },
    ru: {
      name: "Приглашение на свадьбу",
      title: "Текст приглашения на свадьбу: примеры",
      metaTitle: "Текст приглашения на свадьбу — готовые примеры | Taklifim",
      metaDescription:
        "Готовые тексты приглашений на свадьбу: официальные, тёплые, короткие и торжественные. Скопируйте и подставьте имена, дату и место.",
      intro: [
        "Приглашение — первое, что гости узнают о вашей свадьбе. Лучше, чтобы текст был уважительным, понятным и коротким.",
        "Ниже — готовые тексты в разном стиле. Скопируйте подходящий и замените то, что в квадратных скобках, на свои данные.",
      ],
      tips: [
        "Обязательно укажите имена жениха и невесты, дату, время и адрес зала.",
        "Обращайтесь к гостю по имени — это знак уважения.",
        "Текст держите коротким: подробности (карта, программа) будут в самом приглашении.",
        "Если просите подтвердить приход, укажите, до какой даты.",
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
      ],
    },
    en: {
      name: "Wedding invitation",
      title: "Wedding invitation wording: examples",
      metaTitle: "Wedding invitation wording — ready-made examples | Taklifim",
      metaDescription:
        "Ready-made wedding invitation wording: formal, warm, short and festive examples. Copy one and add your names, date and venue.",
      intro: [
        "The invitation is the first thing your guests learn about your wedding, so the wording should be respectful, clear and short.",
        "Below are ready-made texts in different tones. Copy the one you like and replace what's in square brackets with your own details.",
      ],
      tips: [
        "Always include both names, the date, the time and the venue.",
        "Address each guest by name — it shows respect.",
        "Keep it short: the details (map, schedule) are in the invitation itself.",
        "If you'd like guests to reply, say by when.",
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
      ],
    },
  },
  "from-parents": {
    uz: {
      name: "Ota-ona nomidan",
      title: "Ota-ona nomidan toʻy taklifnomasi matni",
      metaTitle:
        "Ota-ona nomidan toʻy taklifnomasi matni — namunalar | Taklifim",
      metaDescription:
        "Ota-ona nomidan yoziladigan toʻy taklifnomasi matnlari: oʻgʻil toʻyi, qiz uzatish, qarindoshlarga va qisqa namunalar.",
      intro: [
        "Oʻzbek toʻylarida mehmonlarni koʻpincha ota-ona taklif qiladi. Bunday matnda farzandlarning ismi, oilaning nomi va mehmonga hurmat bilan murojaat boʻladi.",
        "Quyidagi namunalarda oʻgʻil toʻyi va qiz uzatish uchun matnlar bor. Kvadrat qavslardagi joylarni oʻzingiznikiga almashtiring.",
      ],
      tips: [
        "Imzoda ota-onaning ismini yoki oila nomini yozing.",
        "Oʻgʻil toʻyida «oʻgʻlimiz va kelinimiz», qiz uzatishda «qizimiz» deb yozish odatiy.",
        "Keksa qarindoshlarga «Siz» bilan, hurmat soʻzlari bilan murojaat qiling.",
        "Duo va yaxshi niyatlar bilan yakunlash oʻzbekona ohang beradi.",
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
      ],
    },
    ru: {
      name: "От имени родителей",
      title: "Текст приглашения на свадьбу от родителей",
      metaTitle: "Приглашение на свадьбу от родителей — тексты | Taklifim",
      metaDescription:
        "Тексты приглашений на свадьбу от имени родителей: свадьба сына, проводы дочери, приглашение родственникам и короткие варианты.",
      intro: [
        "На узбекской свадьбе гостей часто приглашают родители. В таком тексте называют детей, фамилию семьи и уважительно обращаются к гостю.",
        "Ниже — тексты для свадьбы сына и проводов дочери. Замените то, что в квадратных скобках, на свои данные.",
      ],
      tips: [
        "В подписи укажите имена родителей или фамилию семьи.",
        "Для свадьбы сына принято «наш сын и невестка», для проводов дочери — «наша дочь».",
        "К старшим родственникам обращайтесь на «Вы» и с уважением.",
        "Добрые пожелания в конце делают текст теплее.",
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
      ],
    },
    en: {
      name: "From the parents",
      title: "Wedding invitation wording from the parents",
      metaTitle:
        "Wedding invitation wording from parents — examples | Taklifim",
      metaDescription:
        "Wedding invitation wording from the parents: a son's wedding, a daughter's wedding, an invitation to relatives and short versions.",
      intro: [
        "At Uzbek weddings guests are often invited by the parents. Such wording names the children and the family and addresses the guest with respect.",
        "Below are texts for a son's and a daughter's wedding. Replace what's in square brackets with your own details.",
      ],
      tips: [
        "Sign with the parents' names or the family name.",
        "For a son's wedding, “our son and daughter-in-law” is customary; for a daughter's, “our daughter”.",
        "Address older relatives formally and respectfully.",
        "Closing with good wishes makes it warmer.",
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
      ],
    },
  },
  engagement: {
    uz: {
      name: "Fotiha va unashtiruv",
      title: "Fotiha toʻyi va unashtiruvga taklif matni",
      metaTitle: "Fotiha toʻyi taklifnomasi matni — namunalar | Taklifim",
      metaDescription:
        "Fotiha toʻyi va unashtiruv marosimiga taklif matnlari: rasmiy, oilaviy va qisqa namunalar.",
      intro: [
        "Fotiha toʻyi — ikki oila rozilik berib, yoshlarni unashtiradigan marosim. Unga odatda eng yaqin qarindosh va doʻstlar taklif qilinadi.",
        "Quyidagi namunalarni nusxalab, ismlar, sana va manzilni oʻzingiznikiga almashtiring.",
      ],
      tips: [
        "Marosim nomini aniq yozing: fotiha toʻyi, unashtiruv yoki non sindirish.",
        "Yigit va qizning ismlarini, sana, vaqt va manzilni koʻrsating.",
        "Marosim kichikroq boʻlsa, «yaqinlarimiz davrasida» degan iborani qoʻshing.",
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
      ],
    },
    ru: {
      name: "Фотиха и помолвка",
      title: "Текст приглашения на фотиху и помолвку",
      metaTitle: "Приглашение на фотиха-той и помолвку — тексты | Taklifim",
      metaDescription:
        "Тексты приглашений на фотиха-той и помолвку: официальные, семейные и короткие примеры.",
      intro: [
        "Фотиха-той — обряд, на котором две семьи дают согласие и обручают молодых. Обычно на него зовут самых близких родственников и друзей.",
        "Скопируйте подходящий текст и замените имена, дату и адрес на свои.",
      ],
      tips: [
        "Назовите обряд точно: фотиха-той, помолвка или нон синдириш.",
        "Укажите имена молодых, дату, время и адрес.",
        "Если праздник камерный, добавьте «в кругу близких».",
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
      ],
    },
    en: {
      name: "Fotiha and engagement",
      title: "Fotiha and engagement invitation wording",
      metaTitle: "Fotiha and engagement invitation wording | Taklifim",
      metaDescription:
        "Invitation wording for a fotiha (Uzbek engagement) or an engagement party: formal, family and short examples.",
      intro: [
        "The fotiha is the Uzbek engagement ceremony, where two families give their blessing to the couple. Usually only the closest relatives and friends are invited.",
        "Copy the text you like and replace the names, date and address with your own.",
      ],
      tips: [
        "Name the occasion clearly: fotiha, engagement or non sindirish.",
        "Give both names, the date, the time and the address.",
        "For a small gathering, add “among our closest family and friends”.",
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
      ],
    },
  },
  messengers: {
    uz: {
      name: "Telegram uchun qisqa matnlar",
      title: "Taklifnoma havolasi bilan yuboriladigan qisqa matnlar",
      metaTitle:
        "Telegram orqali toʻyga taklif matni — qisqa namunalar | Taklifim",
      metaDescription:
        "Elektron taklifnoma havolasini Telegram, WhatsApp yoki SMS orqali yuborish uchun qisqa matnlar: rasmiy, samimiy, guruh uchun va eslatma.",
      intro: [
        "Elektron taklifnomani yuborishda havolaning oldiga bir-ikki jumla qoʻshsangiz, mehmon uni albatta ochadi. Matn qisqa boʻlsin — barcha tafsilotlar taklifnomaning ichida.",
        "Quyidagi matnlarni nusxalab, [havola] oʻrniga taklifnomangiz havolasini qoʻying.",
      ],
      tips: [
        "Avval salom va ism bilan murojaat qiling, keyin havolani qoʻying.",
        "Sana va kimning toʻyi ekanini bir jumlada ayting — tafsilotlar taklifnomada.",
        "Guruhga yuborsangiz, umumiy murojaatdan foydalaning.",
        "Toʻydan bir-ikki kun oldin qisqa eslatma yuborish foydali.",
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
      ],
    },
    ru: {
      name: "Короткие тексты для Telegram",
      title: "Короткие тексты к ссылке на приглашение",
      metaTitle:
        "Приглашение на свадьбу в Telegram — короткие тексты | Taklifim",
      metaDescription:
        "Короткие тексты, чтобы отправить ссылку на электронное приглашение в Telegram, WhatsApp или SMS: официальные, тёплые, для группы и напоминание.",
      intro: [
        "Отправляя электронное приглашение, добавьте к ссылке пару слов — так гость точно его откроет. Текст должен быть коротким: все подробности внутри приглашения.",
        "Скопируйте текст и вставьте вместо [ссылка] ссылку на ваше приглашение.",
      ],
      tips: [
        "Начните с приветствия и имени, потом — ссылка.",
        "Одной фразой скажите, чья свадьба и когда, остальное — в приглашении.",
        "Для группового чата используйте общее обращение.",
        "За день-два до свадьбы полезно отправить короткое напоминание.",
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
      ],
    },
    en: {
      name: "Short texts for messengers",
      title: "Short texts to send with your invitation link",
      metaTitle:
        "Short wedding invitation messages for Telegram & WhatsApp | Taklifim",
      metaDescription:
        "Short messages to send a digital wedding invitation link on Telegram, WhatsApp or SMS: formal, warm, for group chats and a reminder.",
      intro: [
        "When you send a digital invitation, a line or two before the link makes sure guests open it. Keep it short — all the details are inside the invitation.",
        "Copy a message and put your invitation's link in place of [link].",
      ],
      tips: [
        "Start with a greeting and the guest's name, then the link.",
        "Say whose wedding it is and when in one sentence; the rest is in the invitation.",
        "For a group chat, use a general greeting.",
        "A short reminder a day or two before the wedding helps.",
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
      ],
    },
  },
  friends: {
    uz: {
      name: "Doʻstlar va hamkasblar uchun",
      title: "Doʻstlar va hamkasblarni toʻyga taklif qilish matni",
      metaTitle:
        "Doʻstlar va hamkasblar uchun toʻy taklifnomasi matni | Taklifim",
      metaDescription:
        "Doʻstlar, sinfdoshlar va hamkasblarni toʻyga taklif qilish uchun matnlar: samimiy, hazilomuz, ish jamoasi uchun namunalar.",
      intro: [
        "Doʻstlar va tengdoshlarga matn erkinroq, samimiyroq boʻlishi mumkin, hamkasblarga esa odobli va qisqa.",
        "Quyidagi namunalardan nusxa oling va ismlar, sana, manzilni almashtiring.",
      ],
      tips: [
        "Doʻstlarga «sen» bilan, hamkasblarga «siz» bilan murojaat qiling.",
        "Ish jamoasiga yuborishda butun jamoani bitta matnda taklif qilish mumkin.",
        "Hazil qoʻshsangiz ham, sana va manzil aniq boʻlsin.",
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
      ],
    },
    ru: {
      name: "Друзьям и коллегам",
      title: "Текст приглашения на свадьбу для друзей и коллег",
      metaTitle:
        "Приглашение на свадьбу друзьям и коллегам — тексты | Taklifim",
      metaDescription:
        "Тексты приглашений на свадьбу для друзей, одноклассников и коллег: тёплые, шутливые и для рабочего коллектива.",
      intro: [
        "Для друзей текст может быть свободнее и теплее, для коллег — вежливым и коротким.",
        "Скопируйте пример и замените имена, дату и место.",
      ],
      tips: [
        "Друзьям пишите на «ты», коллегам — на «вы».",
        "Рабочий коллектив можно пригласить одним сообщением.",
        "Даже в шутливом тексте дата и адрес должны быть точными.",
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
      ],
    },
    en: {
      name: "For friends and colleagues",
      title: "Wedding invitation wording for friends and colleagues",
      metaTitle:
        "Wedding invitation wording for friends & colleagues | Taklifim",
      metaDescription:
        "Wedding invitation wording for friends, classmates and colleagues: warm, playful and work-team examples.",
      intro: [
        "For friends the wording can be relaxed and warm; for colleagues, polite and short.",
        "Copy an example and replace the names, date and venue.",
      ],
      tips: [
        "Write to friends casually and to colleagues more formally.",
        "You can invite a whole work team in one message.",
        "Even in a playful text, keep the date and address exact.",
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
      ],
    },
  },
  "thank-you": {
    uz: {
      name: "Toʻydan keyin rahmat",
      title: "Toʻydan keyin mehmonlarga rahmat matni",
      metaTitle: "Toʻydan keyin mehmonlarga minnatdorchilik matni | Taklifim",
      metaDescription:
        "Toʻydan keyin mehmonlarga yuboriladigan rahmat matnlari: kelin-kuyov va ota-ona nomidan, sovgʻa uchun minnatdorchilik.",
      intro: [
        "Toʻydan keyin mehmonlarga rahmat aytish — chiroyli odat. Qisqa xabar ham ularning tashrifi siz uchun qanchalik qadrli boʻlganini bildiradi.",
        "Toʻy oʻtgandan keyin ham taklifnoma ochiq qoladi, shuning uchun rahmat xabariga uning havolasini qoʻshib, toʻy suratlarini ham ulashishingiz mumkin.",
      ],
      tips: [
        "Rahmatni toʻydan keyingi bir-ikki hafta ichida yuboring.",
        "Sovgʻa yoki toʻyona uchun alohida minnatdorchilik bildiring.",
        "Yaqin kishilarga ism bilan, shaxsiy xabar yozing.",
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
    },
    ru: {
      name: "Благодарность после свадьбы",
      title: "Текст благодарности гостям после свадьбы",
      metaTitle: "Благодарность гостям после свадьбы — тексты | Taklifim",
      metaDescription:
        "Тексты благодарности гостям после свадьбы: от молодожёнов и от родителей, за подарок и для всех гостей.",
      intro: [
        "Поблагодарить гостей после свадьбы — красивая традиция. Даже короткое сообщение покажет, как вам было дорого их присутствие.",
        "Приглашение остаётся доступным и после свадьбы, поэтому к благодарности можно приложить его ссылку и поделиться свадебными фото.",
      ],
      tips: [
        "Отправьте благодарность в течение одной-двух недель после свадьбы.",
        "Отдельно поблагодарите за подарок.",
        "Близким напишите лично, по имени.",
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
    },
    en: {
      name: "Thank-you after the wedding",
      title: "Thank-you messages for wedding guests",
      metaTitle: "Thank-you messages for wedding guests — examples | Taklifim",
      metaDescription:
        "Thank-you messages for your wedding guests: from the couple and from the parents, for a gift and for everyone.",
      intro: [
        "Thanking your guests after the wedding is a lovely tradition. Even a short message shows how much their presence meant to you.",
        "Your invitation stays online after the wedding, so you can add its link to your thank-you and share your wedding photos.",
      ],
      tips: [
        "Send your thanks within a week or two of the wedding.",
        "Thank guests for their gifts separately.",
        "Write to those closest to you personally, by name.",
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
    },
  },
};

/** The topics with a page, in the order they're listed. */
export const WORDING_TOPICS = Object.keys(WORDING);
