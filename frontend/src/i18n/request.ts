import { locale as rootLocale } from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import uz from "../../messages/uz.json";
import { deepCyrillic, messageToCyrillic } from "@/lib/uz-cyrillic";
import { routing } from "./routing";

// Uzbek in Cyrillic says exactly what Uzbek says, transliterated once.
let uzCyrl: typeof uz | undefined;

export default getRequestConfig(async ({ locale: override }) => {
  // An explicit `getTranslations({ locale })` wins over the `[locale]` segment.
  const requested = override ?? (await rootLocale());
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages:
      locale === "uz-Cyrl"
        ? (uzCyrl ??= deepCyrillic(uz, messageToCyrillic))
        : (await import(`../../messages/${locale}.json`)).default,
  };
});
