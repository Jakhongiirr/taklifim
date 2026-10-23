// Uzbek in Cyrillic (the uz-Cyrl locale) is made from the Latin Uzbek texts
// by transliterating them, so it always says exactly what Uzbek says and
// needs no translation of its own. Names, links and brands stay as written.

/**
 * Latin words whose Cyrillic spelling the letters alone don't give: Russian
 * loanwords keep their Russian spelling (ь, ц, ъ). Endings after them are
 * transliterated, and drop the ь ("sentabrdan" → "сентябрдан").
 */
const WORDS: Record<string, string> = {
  yanvar: "январь",
  fevral: "февраль",
  aprel: "апрель",
  iyun: "июнь",
  iyul: "июль",
  sentabr: "сентябрь",
  oktabr: "октябрь",
  noyabr: "ноябрь",
  dekabr: "декабрь",
  obyekt: "объект",
  subyekt: "субъект",
  subyektlar: "субъектлар",
  litsenziya: "лицензия",
  kompensatsiya: "компенсация",
  tranzaksiya: "транзакция",
  aksiya: "акция",
  fransiya: "франция",
  stir: "стир",
};

/**
 * Words that keep their Latin spelling: the site's and the designs' names,
 * brands and typefaces. Matched whole: an ending after them, like Payme’dan,
 * is transliterated. Abbreviations in capitals (QR, PNG, SMS) stay Latin too.
 */
const KEEP = [
  "Taklifim.uz",
  "taklifim.uz",
  "Taklifim",
  ...["Aurora", "Haven", "Dove", "Lavel", "Paris", "Violet", "Arcade"],
  ...["Classic", "Plov"],
  ...["WhatsApp", "Payme", "Uzcard", "Humo", "Google", "Yandex", "ChatGPT"],
  ...["cookie", "localStorage"],
  ...["Great Vibes", "Cormorant Garamond", "Cormorant SC", "EB Garamond"],
  ...["Alex Brush", "Marck Script", "Tenor Sans", "Playfair Display"],
  ...["Poiret One", "Parisienne", "Prata", "Lora", "Yeseva One", "Forum"],
  ...["Old Standard TT"],
];

// Links, e-mail addresses, rich-text tags, the targets of [label](/path)
// links and the kept words are copied as they are.
const PROTECTED = new RegExp(
  [
    String.raw`https?://\S+`,
    String.raw`[\w.+-]+@[\w-]+\.[\w.]+`,
    String.raw`</?[\w-]+>`,
    String.raw`\]\([^)]*\)`,
    String.raw`(?<![\w.])@\w+`,
    ...KEEP.map((word) => `(?<![\\w.])${word.replace(".", "\\.")}(?!\\w)`),
  ].join("|"),
  "g",
);

// A Latin word: letters, with the oʻ/gʻ sign or the tutuq belgisi (ʼ)
// inside it; writers use look-alikes for both. ’ elsewhere separates an
// ending ("SMS’da") and stays.
const APOSTROPHE = "ʻʼ'‘’`";
const WORD = new RegExp(
  `[A-Za-z](?:[A-Za-z]|[ʻʼ'‘\`](?=[A-Za-z])|(?<=[oOgG])[ʻ‘’])*`,
  "g",
);

const LETTERS: Record<string, string> = {
  a: "а",
  b: "б",
  c: "с",
  d: "д",
  e: "е",
  f: "ф",
  g: "г",
  h: "ҳ",
  i: "и",
  j: "ж",
  k: "к",
  l: "л",
  m: "м",
  n: "н",
  o: "о",
  p: "п",
  q: "қ",
  r: "р",
  s: "с",
  t: "т",
  u: "у",
  v: "в",
  w: "в",
  x: "х",
  y: "й",
  z: "з",
};

// The oʻ/gʻ sign after o and g, else the tutuq belgisi (ʼ).
const isSign = (c: string | undefined) =>
  c !== undefined && "ʻ‘’`'".includes(c);
const isApostrophe = (c: string | undefined) =>
  c !== undefined && APOSTROPHE.includes(c);
const isVowel = (lower: string, i: number) =>
  "aeiou".includes(lower[i] ?? "-") ||
  (isSign(lower[i]) && lower[i - 1] === "o");

/** One word, its letters' case kept ("Shahnoza" → "Шаҳноза"). */
function word(latin: string): string {
  const letters = latin.replace(/[^A-Za-z]/g, "");
  const allCaps = letters.length > 1 && letters === letters.toUpperCase();
  const lower = latin.toLowerCase();
  const stem = Object.keys(WORDS).find((w) => lower.startsWith(w));
  if (stem) {
    const ending = latin.slice(stem.length);
    const cyr = ending ? WORDS[stem].replace(/ь$/, "") : WORDS[stem];
    const capital = latin[0] !== lower[0];
    return (
      (allCaps
        ? cyr.toUpperCase()
        : capital
          ? cyr[0].toUpperCase() + cyr.slice(1)
          : cyr) + (ending && spell(ending, allCaps))
    );
  }
  // Abbreviations: QR, PNG, SMS.
  if (allCaps && latin.length <= 5 && !/[^A-Z]/.test(latin)) return latin;
  return spell(latin, false);
}

function spell(latin: string, allCaps: boolean): string {
  const lower = latin.toLowerCase();
  let out = "";
  for (let i = 0; i < lower.length; ) {
    const c = lower[i];
    const next = lower[i + 1];
    let cyr: string;
    let size = 2;
    if ((c === "o" || c === "g") && isSign(next)) cyr = c === "o" ? "ў" : "ғ";
    else if (c === "s" && next === "h") cyr = "ш";
    else if (c === "c" && next === "h") cyr = "ч";
    // yoʻl is йўл, not ёʻл.
    else if (c === "y" && next === "o" && !isSign(lower[i + 2])) cyr = "ё";
    else if (c === "y" && next === "u") cyr = "ю";
    else if (c === "y" && next === "a") cyr = "я";
    else if (c === "y" && next === "e") cyr = "е";
    else {
      size = 1;
      if (isApostrophe(c)) cyr = "ъ";
      // e at the start or after a vowel is э: eʼlon, poeziya.
      else if (c === "e" && (i === 0 || isVowel(lower, i - 1))) cyr = "э";
      else cyr = LETTERS[c] ?? c;
    }
    out += allCaps || latin[i] !== c ? cyr.toUpperCase() : cyr;
    i += size;
  }
  return out;
}

/** Plain text (or Markdown with [label](/path) links) in Uzbek Cyrillic. */
export function toCyrillic(text: string): string {
  let out = "";
  let last = 0;
  for (const kept of text.matchAll(PROTECTED)) {
    out += words(text.slice(last, kept.index));
    out += kept[0];
    last = kept.index + kept[0].length;
  }
  return out + words(text.slice(last));
}

const words = (text: string) => text.replace(WORD, word);

/**
 * An ICU message ("{count, plural, other {# kun}}") in Uzbek Cyrillic: the
 * text and the plural/select branches are transliterated, argument names,
 * types and keys are not.
 */
export function messageToCyrillic(message: string): string {
  return icu(message, 0, false)[0];
}

function icu(s: string, start: number, nested: boolean): [string, number] {
  let out = "";
  let text = "";
  let i = start;
  for (; i < s.length; i++) {
    const c = s[i];
    if (c === "}" && nested) break;
    if (c !== "{") {
      text += c;
      continue;
    }
    out += toCyrillic(text);
    text = "";
    const [argument, end] = icuArgument(s, i);
    out += argument;
    i = end;
  }
  return [out + toCyrillic(text), i];
}

/** `{name}` or `{name, type, ...}` from s[start] = "{"; returns the end "}". */
function icuArgument(s: string, start: number): [string, number] {
  const head = /^\{\s*([^,}]+?)\s*(?:,\s*(\w+)\s*)?(,|\})/.exec(s.slice(start));
  if (!head) return ["{", start];
  const [whole, , type, stop] = head;
  let i = start + whole.length;
  if (stop === "}") return [whole, i - 1];
  let out = whole;
  if (type === "plural" || type === "select" || type === "selectordinal") {
    for (;;) {
      const key = /^\s*([^\s{}]+)\s*/.exec(s.slice(i));
      if (!key) break;
      out += key[0];
      i += key[0].length;
      if (s[i] !== "{") continue; // offset:1
      const [branch, end] = icu(s, i + 1, true);
      out += `{${branch}}`;
      i = end + 1;
    }
    const close = /^\s*\}/.exec(s.slice(i));
    return [out + (close?.[0] ?? ""), i + (close ? close[0].length - 1 : 0)];
  }
  // number/date styles: copied up to the matching brace.
  let depth = 1;
  for (; i < s.length && depth > 0; i++) {
    if (s[i] === "{") depth++;
    if (s[i] === "}") depth--;
    out += s[i];
  }
  return [out, i - 1];
}

/** Every string in a JSON-like value, transliterated with `convert`. */
export function deepCyrillic<T>(
  value: T,
  convert: (text: string) => string = toCyrillic,
): T {
  if (typeof value === "string") return convert(value) as T;
  if (Array.isArray(value)) {
    return value.map((item) => deepCyrillic(item, convert)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        deepCyrillic(item, convert),
      ]),
    ) as T;
  }
  return value;
}

const transliterated = new WeakMap<object, unknown>();

/**
 * A page's text in its locale, from texts written per locale: Uzbek in
 * Cyrillic is the Uzbek one transliterated, a missing one is the Uzbek one.
 */
export function inLocale<T>(texts: Record<string, T>, locale: string): T {
  if (locale !== "uz-Cyrl") return texts[locale] ?? texts.uz;
  if (!transliterated.has(texts)) {
    transliterated.set(texts, deepCyrillic(texts.uz));
  }
  return transliterated.get(texts) as T;
}

/** The parts of an invitation its owner writes, which may be Latin Uzbek. */
interface OwnerText {
  brideName: string;
  groomName: string;
  hostName: string;
  venueName: string;
  venueAddress: string;
}

/**
 * An invitation with what its owner wrote in Uzbek Cyrillic: names, host
 * and venue. Text already in Cyrillic (Russian, say) stays as it is.
 */
export function cyrillicOwnerText<T extends OwnerText>(taklif: T): T {
  return {
    ...taklif,
    brideName: toCyrillic(taklif.brideName),
    groomName: toCyrillic(taklif.groomName),
    hostName: toCyrillic(taklif.hostName),
    venueName: toCyrillic(taklif.venueName),
    venueAddress: toCyrillic(taklif.venueAddress),
  };
}
