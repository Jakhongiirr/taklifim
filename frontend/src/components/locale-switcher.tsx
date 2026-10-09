"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <label className="relative flex items-center">
      <span className="sr-only">{t("label")}</span>
      <select
        className="h-9 appearance-none rounded-full border border-line bg-transparent pr-7 pl-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-sage/40"
        value={locale}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.value as typeof locale;
          startTransition(() => router.replace(pathname, { locale: next }));
        }}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {t("locale", { locale: l })}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 12 12"
        className="pointer-events-none absolute right-2.5 size-3 text-muted"
      >
        <path
          d="M3 4.5 6 7.5l3-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </label>
  );
}
