// What each design's page (/[locale]/designs/<themeId>) says about it, in
// every site language. Keys are the backend theme's `themeId` and follow the
// order the designs are listed in. Describe only what the design really
// shows (src/themes/<themeId>); update the copy when a design changes.

export interface DesignCopy {
  /** One line under the name; also the page's meta description start. */
  tagline: string;
  /** A few paragraphs about the design. */
  about: string[];
  /** Short points: the opening video, colours, typefaces, details. */
  highlights: string[];
}

export const DESIGN_COPY: Record<string, Record<string, DesignCopy>> = {
  aurora: {
    uz: {
      tagline:
        "Oltin darvozalar ochilib, chiroqlarga toʻla saroy zaliga olib kiruvchi hashamatli toʻy taklifnomasi.",
      about: [
        "Aurora — klassik, saroy uslubidagi toʻyni yaxshi koʻradiganlar uchun. Taklifnoma video bilan ochiladi: oltin darvozalar asta ochiladi, mehmon saroy ichidan oʻtib, chiroqlar bilan yoritilgan zinali zalga kiradi.",
        "Fil suyagi, shampan va oltin ranglari, nafis qoʻlyozma shriftdagi ismlar va quyosh nuri tushgan marmar ayvondagi tabrik kartasi taklifnomaga tantanavor, ammo yengil koʻrinish beradi.",
      ],
      highlights: [
        "Ochilish videosi: oltin darvozalar, saroy va zinali bazm zali",
        "Fil suyagi, shampan va oltin ranglar",
        "Ismlar Great Vibes qoʻlyozma shriftida",
        "Marmar ayvon fonidagi tabrik kartasi va oltin ramkali suratlar",
      ],
    },
    ru: {
      tagline:
        "Роскошное свадебное приглашение: золотые ворота открываются и ведут в сияющий огнями дворцовый зал.",
      about: [
        "Aurora — для тех, кто любит классическую свадьбу в дворцовом стиле. Приглашение открывается видео: медленно распахиваются золотые ворота, и гость проходит через дворец в зал с парадной лестницей, залитый светом.",
        "Цвета слоновой кости, шампанского и золота, имена изящным рукописным шрифтом и открытка с приветствием на залитой солнцем мраморной террасе делают приглашение торжественным и при этом лёгким.",
      ],
      highlights: [
        "Видео-открытие: золотые ворота, дворец и бальный зал с лестницей",
        "Цвета слоновой кости, шампанского и золота",
        "Имена рукописным шрифтом Great Vibes",
        "Открытка на фоне мраморной террасы и фото в золотых рамках",
      ],
    },
    en: {
      tagline:
        "A luxurious wedding invitation: golden gates swing open onto a palace hall full of lights.",
      about: [
        "Aurora is for couples who love a classic, palace-style wedding. The invitation opens with a video: golden gates slowly part and your guests walk through a palace into a grand staircase hall glowing with lights.",
        "Ivory, champagne and gold, your names in a graceful script and a greeting card set on a sunlit marble terrace make it feel festive yet light.",
      ],
      highlights: [
        "Opening video: golden gates, a palace and a staircase ballroom",
        "Ivory, champagne and gold colours",
        "Names in the Great Vibes script",
        "A greeting card on a marble terrace and gold-framed photos",
      ],
    },
  },
  dove: {
    uz: {
      tagline:
        "Gullar bilan bezalgan ravoq va oq kaptarlar — nafis va romantik toʻy taklifnomasi.",
      about: [
        "Dove — mayin, romantik kayfiyatdagi toʻy uchun. Taklifnoma gullar bilan bezalgan ravoq ostidan uchib chiqqan kaptarlar videosi bilan ochiladi, keyin oqqushlar suzayotgan koʻl manzarasi davom etadi.",
        "Pushti va atirgul ranglari moviy-kulrang ohanglar bilan uygʻunlashgan. Ismlar Parisienne qoʻlyozma shriftida, sahifa boʻylab patlar uchib yuradi, tabrik esa ravoqsimon kartada.",
      ],
      highlights: [
        "Ochilish videosi: gulli ravoq va uchayotgan kaptarlar",
        "Pushti, atirgul va moviy-kulrang ranglar",
        "Ismlar Parisienne qoʻlyozma shriftida",
        "Kaptarlar juftligi bezagi, uchib yuruvchi patlar va sanoq kartochkalari",
      ],
    },
    ru: {
      tagline:
        "Цветочная арка и белые голуби — нежное романтичное свадебное приглашение.",
      about: [
        "Dove — для свадьбы в нежном, романтичном настроении. Приглашение открывается видео, в котором из-под цветочной арки вылетают голуби, а дальше открывается вид на озеро с лебедями.",
        "Пудрово-розовые и цвета розы сочетаются с пыльно-голубым. Имена — рукописным шрифтом Parisienne, по странице плывут пёрышки, а приветствие оформлено на арочной открытке.",
      ],
      highlights: [
        "Видео-открытие: цветочная арка и летящие голуби",
        "Пудрово-розовый, цвет розы и пыльно-голубой",
        "Имена рукописным шрифтом Parisienne",
        "Пара голубей, парящие пёрышки и плитки обратного отсчёта",
      ],
    },
    en: {
      tagline:
        "A flower arch and white doves — a delicate, romantic wedding invitation.",
      about: [
        "Dove is for a soft, romantic wedding. The invitation opens with a video of doves flying out from under a flower arch, then gives way to a lake with swans.",
        "Blush and rosewood meet dusty blue. Your names are set in the Parisienne script, feathers drift across the page and the greeting sits on an arched card.",
      ],
      highlights: [
        "Opening video: a flower arch and doves taking flight",
        "Blush, rosewood and dusty blue",
        "Names in the Parisienne script",
        "A pair of doves, drifting feathers and countdown tiles",
      ],
    },
  },
  haven: {
    uz: {
      tagline:
        "Atirgullar bogʻidagi temir darvoza va fonarlar yoritgan qadimiy saroy — vintaj uslubdagi toʻy taklifnomasi.",
      about: [
        "Haven — vintaj va bogʻ uslubidagi toʻyni yoqtiradiganlar uchun. Taklifnoma atirgullar bogʻidagi naqshinkor temir darvoza ochilishi bilan boshlanadi va mehmonni fonarlar yoritgan qadimiy saroyga olib boradi.",
        "Zigʻir, toʻq yashil va eski atirgul ranglari, temir naqshli ajratgichlar, sochilib tushayotgan atirgul barglari, fonar nurida yoritilgan sana va ikki qavatli vintaj ramkalar unga iliq, samimiy koʻrinish beradi.",
      ],
      highlights: [
        "Ochilish videosi: atirgullar bogʻidagi temir darvoza va saroy",
        "Zigʻir, toʻq yashil va eski atirgul ranglari",
        "Ismlar Prata, sarlavhalar Cormorant SC shriftida",
        "Atirgul barglari, fonar nuridagi sana va vintaj ramkalar",
      ],
    },
    ru: {
      tagline:
        "Кованые ворота в розовом саду и старинный дворец в свете фонарей — свадебное приглашение в винтажном стиле.",
      about: [
        "Haven — для любителей винтажной свадьбы в саду. Приглашение начинается с того, как открываются узорные кованые ворота в розовом саду, и ведёт гостя к старинному дворцу, освещённому фонарями.",
        "Лён, глубокий зелёный и цвет пыльной розы, кованые разделители, падающие лепестки роз, дата в свете фонаря и двойные винтажные рамки создают тёплое, уютное настроение.",
      ],
      highlights: [
        "Видео-открытие: кованые ворота в розовом саду и дворец",
        "Лён, глубокий зелёный и пыльная роза",
        "Имена шрифтом Prata, заголовки — Cormorant SC",
        "Лепестки роз, дата в свете фонаря и винтажные рамки",
      ],
    },
    en: {
      tagline:
        "Iron gates in a rose garden and an old palace lit by lanterns — a vintage-style wedding invitation.",
      about: [
        "Haven is for couples who love a vintage garden wedding. The invitation begins as ornate iron gates open in a rose garden and leads your guests to an old palace lit by lanterns.",
        "Linen, forest green and old rose, wrought-iron dividers, falling rose petals, a date in lantern light and double-bordered vintage frames give it a warm, intimate feel.",
      ],
      highlights: [
        "Opening video: iron gates in a rose garden and a palace",
        "Linen, forest green and old rose",
        "Names in Prata, headings in Cormorant SC",
        "Rose petals, a lantern-lit date and vintage frames",
      ],
    },
  },
  arcade: {
    uz: {
      tagline:
        "Ertak qasri, pushti qandilli bazm zali va koʻl boʻyidagi ayvon — ertakdek toʻy taklifnomasi.",
      about: [
        "Arcade — ertakdek, yorqin va quvnoq toʻy uchun. Ochilish videosi mehmonni ertak qasriga, gulzor orangereyaga, pushti qandillar osilgan bazm zaliga va nihoyat koʻl manzarali ayvonga olib boradi.",
        "Krem, atirgul, shalfey yashili va olxoʻri ranglari, Yeseva One shriftidagi ismlar, uchib yuruvchi kapalaklar, atirgul va barglardan gulchambar ichidagi sana hamda dumaloq sanoq kartochkalari uni jonli va mayin qiladi.",
      ],
      highlights: [
        "Ochilish videosi: qasr, pushti bazm zali va koʻl boʻyidagi ayvon",
        "Krem, atirgul, shalfey yashili va olxoʻri ranglari",
        "Ismlar va sarlavhalar Yeseva One shriftida",
        "Uchayotgan kapalaklar, gulchambardagi sana va pastel ramkali tabrik",
      ],
    },
    ru: {
      tagline:
        "Сказочный замок, бальный зал с розовыми люстрами и балкон над озером — свадебное приглашение как из сказки.",
      about: [
        "Arcade — для сказочной, светлой и радостной свадьбы. Видео-открытие проводит гостя через сказочный замок и оранжерею в бальный зал с розовыми люстрами и, наконец, на балкон с видом на озеро.",
        "Кремовый, розовый, шалфейный и сливовый цвета, имена шрифтом Yeseva One, порхающие бабочки, дата в венке из роз и листьев и круглые плитки отсчёта делают его живым и нежным.",
      ],
      highlights: [
        "Видео-открытие: замок, розовый бальный зал и балкон над озером",
        "Кремовый, розовый, шалфейный и сливовый",
        "Имена и заголовки шрифтом Yeseva One",
        "Бабочки, дата в цветочном венке и открытка в пастельной рамке",
      ],
    },
    en: {
      tagline:
        "A fairytale château, a ballroom with pink chandeliers and a balcony over a lake — a storybook wedding invitation.",
      about: [
        "Arcade is for a fairytale, bright and joyful wedding. The opening video takes your guests through a château and a conservatory into a ballroom hung with pink chandeliers, and out onto a balcony over a lake.",
        "Cream, rose, sage and plum, names in Yeseva One, fluttering butterflies, a date inside a wreath of roses and leaves and round countdown tiles make it lively and soft.",
      ],
      highlights: [
        "Opening video: a château, a pink ballroom and a lakeside balcony",
        "Cream, rose, sage and plum",
        "Names and headings in Yeseva One",
        "Butterflies, a date in a flower wreath and a pastel-framed greeting",
      ],
    },
  },
  violet: {
    uz: {
      tagline:
        "Toʻlin oy ostidagi binafsha qasr va osmonga koʻtarilayotgan fonarlar — kechki toʻy uchun toʻq rangli taklifnoma.",
      about: [
        "Violet — kechki va sirli kayfiyatdagi toʻy uchun yagona toʻq rangli dizayn. Taklifnoma toʻlin oy ostidagi binafsha qasr va osmonga koʻtarilayotgan fonarlar videosi bilan ochiladi.",
        "Tungi binafsha fonda oy nuridek oq matn, nilufar va fonar oltini ranglari, sahifa ustida miltillayotgan yulduzlar, porlayotgan toʻlin oy ustidagi sana va shaffof tungi kartalar unga sehrli koʻrinish beradi.",
      ],
      highlights: [
        "Ochilish videosi: oy ostidagi qasr va uchayotgan fonarlar",
        "Yagona toʻq dizayn: tungi binafsha, nilufar va fonar oltini",
        "Ismlar Marck Script, sarlavhalar Tenor Sans shriftida",
        "Miltillovchi yulduzlar, toʻlin oydagi sana va tungi shisha kartalar",
      ],
    },
    ru: {
      tagline:
        "Фиолетовый замок под полной луной и небесные фонарики — тёмное приглашение для вечерней свадьбы.",
      about: [
        "Violet — единственный тёмный дизайн, для вечерней свадьбы с ноткой волшебства. Приглашение открывается видео с фиолетовым замком под полной луной и поднимающимися в небо фонариками.",
        "Лунно-светлый текст на ночном фиолетовом, сиреневый и золото фонарей, мерцающие звёзды над страницей, дата на сияющей полной луне и полупрозрачные «ночные» карточки создают сказочное настроение.",
      ],
      highlights: [
        "Видео-открытие: замок под луной и летящие фонарики",
        "Единственный тёмный дизайн: ночной фиолетовый, сирень и золото",
        "Имена шрифтом Marck Script, заголовки — Tenor Sans",
        "Мерцающие звёзды, дата на полной луне и «стеклянные» карточки",
      ],
    },
    en: {
      tagline:
        "A violet castle under a full moon and rising sky lanterns — a dark invitation for an evening wedding.",
      about: [
        "Violet is our only dark design, for an evening wedding with a touch of magic. The invitation opens with a video of a violet castle under a full moon as sky lanterns rise into the night.",
        "Moonlight text on night violet, lilac and lantern gold, stars twinkling over the page, the date on a glowing full moon and night-glass cards give it a spellbinding mood.",
      ],
      highlights: [
        "Opening video: a moonlit castle and rising sky lanterns",
        "The only dark design: night violet, lilac and lantern gold",
        "Names in Marck Script, headings in Tenor Sans",
        "Twinkling stars, the date on a full moon and night-glass cards",
      ],
    },
  },
  paris: {
    uz: {
      tagline:
        "Muhrlangan maktub, Eyfel minorasi va daryo boʻyi — Parij uslubidagi nafis toʻy taklifnomasi.",
      about: [
        "Paris — Fransiya ruhidagi nafis toʻy uchun. Taklifnoma oltin muhr bilan yopilgan maktub ochilishidan boshlanadi, keyin Eyfel minorasi va favvoralar orasidan daryo boʻyiga olib boradi.",
        "Krem, toʻq koʻk va koʻk emal ranglari, Playfair Display kursividagi ismlar, Eyfel minorasi tasvirli ajratgichlar, oltin gullar, mumli muhrli maktub va Parij koʻcha belgisi koʻrinishidagi sana uni oʻziga xos qiladi.",
      ],
      highlights: [
        "Ochilish videosi: muhrli maktub, Eyfel minorasi va daryo boʻyi",
        "Krem, toʻq koʻk va koʻk emal ranglari",
        "Ismlar Playfair Display kursivida, sarlavhalar Poiret One shriftida",
        "Mumli muhrli maktub va Parij koʻcha belgisidagi sana",
      ],
    },
    ru: {
      tagline:
        "Запечатанное письмо, Эйфелева башня и набережная — изысканное свадебное приглашение в парижском стиле.",
      about: [
        "Paris — для изысканной свадьбы во французском духе. Приглашение начинается с письма, запечатанного золотой печатью, а затем ведёт мимо Эйфелевой башни и фонтанов к набережной.",
        "Кремовый, тёмно-синий и синяя эмаль, имена курсивом Playfair Display, разделители с Эйфелевой башней, золотые цветы, письмо с восковой печатью и дата в виде парижской уличной таблички делают его особенным.",
      ],
      highlights: [
        "Видео-открытие: письмо с печатью, Эйфелева башня и набережная",
        "Кремовый, тёмно-синий и синяя эмаль",
        "Имена курсивом Playfair Display, заголовки — Poiret One",
        "Письмо с восковой печатью и дата на парижской табличке",
      ],
    },
    en: {
      tagline:
        "A sealed letter, the Eiffel Tower and the riverside — an elegant Paris-style wedding invitation.",
      about: [
        "Paris is for an elegant wedding with a French touch. The invitation begins as a letter sealed in gold opens, then leads past the Eiffel Tower and fountains to the riverside.",
        "Cream, navy and blue enamel, names in Playfair Display italic, Eiffel Tower dividers, gold blossoms, a letter with a wax seal and the date on a Paris street sign make it one of a kind.",
      ],
      highlights: [
        "Opening video: a sealed letter, the Eiffel Tower and the riverside",
        "Cream, navy and blue enamel",
        "Names in Playfair Display italic, headings in Poiret One",
        "A wax-sealed letter and the date on a Paris street sign",
      ],
    },
  },
  classic: {
    uz: {
      tagline:
        "Mumli muhr bilan yopilgan konvert va oltin ramkali karta — anʼanaviy uslubdagi nafis toʻy taklifnomasi.",
      about: [
        "Classic — sodda va oʻlmas, anʼanaviy bosma taklifnomalarni yoqtiradiganlar uchun. Taklifnoma toʻq qizil mumli muhr bilan yopilgan konvertdan boshlanadi: mehmon muhrni bosadi, qopqoq ochiladi va ichidan ismlaringiz yozilgan karta chiqadi.",
        "Fil suyagi rangidagi qogʻoz, toʻq siyoh, nozik oltin chiziqlar va burchak naqshlari, Cormorant Garamond kursividagi ismlar hamda toʻy kuni yurakcha bilan belgilangan oy taqvimi unga bosma taklifnomadek koʻrinish beradi.",
      ],
      highlights: [
        "Ochilish: mumli muhrli konvert ochilib, ichidan karta chiqadi",
        "Fil suyagi, toʻq siyoh, oltin va toʻq qizil ranglar",
        "Ismlar Cormorant Garamond kursivida",
        "Toʻy kuni belgilangan oy taqvimi va oltin ramkalar",
      ],
    },
    ru: {
      tagline:
        "Конверт с восковой печатью и открытка в золотой рамке — изысканное свадебное приглашение в классическом стиле.",
      about: [
        "Classic — для тех, кто любит простые и вечные печатные приглашения. Приглашение начинается с конверта, запечатанного бордовой восковой печатью: гость нажимает на печать, клапан открывается, и из конверта поднимается открытка с вашими именами.",
        "Бумага цвета слоновой кости, тёмные чернила, тонкие золотые линии и угловые орнаменты, имена курсивом Cormorant Garamond и календарь месяца, где день свадьбы отмечен сердцем, делают его похожим на настоящее печатное приглашение.",
      ],
      highlights: [
        "Открытие: конверт с восковой печатью и открытка внутри",
        "Слоновая кость, тёмные чернила, золото и бордо",
        "Имена курсивом Cormorant Garamond",
        "Календарь месяца с отмеченным днём свадьбы и золотые рамки",
      ],
    },
    en: {
      tagline:
        "An envelope closed with a wax seal and a gold-framed card — an elegant wedding invitation in the classic style.",
      about: [
        "Classic is for couples who love simple, timeless printed invitations. It begins with an envelope closed with a burgundy wax seal: your guests tap the seal, the flap opens and a card with your names rises out.",
        "Ivory paper, dark ink, fine gold rules and corner ornaments, names in Cormorant Garamond italic and a month calendar with your day marked by a heart make it feel like a real printed invitation.",
      ],
      highlights: [
        "Opening: a wax-sealed envelope with the card rising out",
        "Ivory, dark ink, gold and burgundy",
        "Names in Cormorant Garamond italic",
        "A month calendar with your day marked and gold frames",
      ],
    },
  },
  lavel: {
    uz: {
      tagline:
        "Lavanda muhri bilan yopilgan karta va lavanda guldastalari — romantik, nafis binafsha rangli toʻy taklifnomasi.",
      about: [
        "Lavel — yozgi lavanda dalasidek yumshoq va romantik toʻy uchun. Taklifnoma ikki tavaqali karta bilan boshlanadi: mehmon lavanda novdasi tushirilgan binafsha mumli muhrni bosadi, tavaqalar ochiladi va ichidan salomlashuv va lavanda guldastasi koʻrinadi.",
        "Nafis nilufarrang qogʻoz, toʻq binafsha siyoh, lavanda novdalari va yashil poyalar, Alex Brush yozma shriftidagi ismlar, ravoq ichidagi kelin-kuyov ismlari hamda toʻy kuni lavanda gulchambari bilan belgilangan oy taqvimi unga oʻziga xos koʻrinish beradi.",
      ],
      highlights: [
        "Ochilish: lavanda muhrli karta ikki tomonga ochiladi",
        "Nilufarrang, toʻq binafsha va yashil poya ranglari",
        "Ismlar Alex Brush yozma shriftida, matn EB Garamond shriftida",
        "Lavanda guldastalari, ravoq va gulchambarli oy taqvimi",
      ],
    },
    ru: {
      tagline:
        "Открытка с лавандовой печатью и букеты лаванды — романтичное, нежное сиреневое свадебное приглашение.",
      about: [
        "Lavel — для мягкой и романтичной свадьбы, как летнее лавандовое поле. Приглашение начинается со сложенной открытки: гость нажимает на сиреневую восковую печать с веточкой лаванды, створки раскрываются, и за ними появляются приветствие и букет лаванды.",
        "Нежная сиреневая бумага, тёмно-фиолетовые чернила, веточки лаванды и зелёные стебли, имена каллиграфическим шрифтом Alex Brush под аркой и календарь месяца, где день свадьбы обведён лавандовым венком, делают его особенным.",
      ],
      highlights: [
        "Открытие: открытка с лавандовой печатью раскрывается в стороны",
        "Сиреневый, тёмно-фиолетовый и зелень стеблей",
        "Имена каллиграфическим Alex Brush, текст — EB Garamond",
        "Букеты лаванды, арка и календарь с венком",
      ],
    },
    en: {
      tagline:
        "A card sealed with lavender wax and bouquets of lavender — a romantic, soft lilac wedding invitation.",
      about: [
        "Lavel is for a soft, romantic wedding, like a lavender field in summer. It begins with a folded card: your guests tap the lilac wax seal pressed with a sprig of lavender, the two doors swing open and a greeting with a lavender bouquet appears.",
        "Soft lilac paper, deep plum ink, lavender sprigs on sage stems, your names in Alex Brush script under an arch and a month calendar with your day ringed by a lavender wreath give it its own character.",
      ],
      highlights: [
        "Opening: a lavender-sealed card swings open",
        "Lilac, deep plum and sage",
        "Names in Alex Brush script, text in EB Garamond",
        "Lavender bouquets, an arch and a calendar with a wreath",
      ],
    },
  },
};

/** The designs with a page, in the order they're listed. */
export const DESIGN_IDS = Object.keys(DESIGN_COPY);

/** A design's display name: its id, capitalised ("aurora" → "Aurora"). */
export const designName = (id: string) => id[0].toUpperCase() + id.slice(1);
