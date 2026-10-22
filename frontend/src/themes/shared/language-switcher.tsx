"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * Lets guests pick the language of the invitation's fixed wording (cover,
 * headings, RSVP form). What the owner wrote stays as written. Pinned to the
 * top corner over every theme and its cover, so a guest can switch before
 * opening it. Switching opens the same link, personal ones too, under the
 * picked locale; the choice is remembered (locale cookie), so the short link
 * opens in it next time (see proxy.ts).
 */
export default function LanguageSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  // Without the locale prefix: "/taklif/<slug>" or "/taklif/<slug>/<token>".
  const pathname = usePathname();
  return (
    <nav
      aria-label={t("label")}
      className="fixed top-3 right-3 z-50 flex rounded-full bg-black/35 p-0.5 text-[11px] font-semibold tracking-wider text-white uppercase shadow-lg ring-1 ring-white/25 backdrop-blur-md"
    >
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          lang={l}
          title={t("locale", { locale: l })}
          replace
          scroll={false}
          aria-current={l === locale ? "true" : undefined}
          className={`flex h-8 min-w-9 items-center justify-center rounded-full px-2 transition-colors ${l === locale ? "bg-white text-black" : "hover:bg-white/15"}`}
        >
          {l}
        </Link>
      ))}
    </nav>
  );
}
