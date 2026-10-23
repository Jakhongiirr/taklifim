import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // uz-Cyrl is Uzbek in Cyrillic, transliterated from uz (lib/uz-cyrillic.ts).
  locales: ["uz", "uz-Cyrl", "ru", "en"],
  defaultLocale: "uz",
  // Pages declare their language versions in <head> (lib/seo.ts) instead
  // of the middleware's Link header, so there's one source for them.
  alternateLinks: false,
});

type Locale = (typeof routing.locales)[number];

/** Each language's name in itself, for the language menus. */
export const LOCALE_NAMES: Record<Locale, string> = {
  uz: "Oʻzbekcha",
  "uz-Cyrl": "Ўзбекча",
  ru: "Русский",
  en: "English",
};

/** Short labels, for the invitation's language switcher. */
export const LOCALE_LABELS: Record<Locale, string> = {
  uz: "UZ",
  "uz-Cyrl": "ЎЗ",
  ru: "RU",
  en: "EN",
};
