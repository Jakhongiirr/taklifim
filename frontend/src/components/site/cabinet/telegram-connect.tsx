"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import type { TelegramLoginStarted } from "@/lib/api-types";

/**
 * For owners the bot can't write to yet (logged in before their Telegram
 * account was saved, or with a code): a link to the bot that connects it,
 * so guests' replies reach them. The link is fetched up front, so the
 * button is a plain link (opening Telegram after an await would be blocked
 * as a pop-up). Back on the page, it reloads the cabinet, which drops this
 * banner once the bot has connected them.
 */
export default function TelegramConnect() {
  const t = useTranslations("Cabinet.telegram");
  const locale = useLocale();
  const router = useRouter();
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    let active = true;
    api<TelegramLoginStarted>("/auth/telegram/connect", {
      method: "POST",
      json: { locale },
    }).then(
      (started) => active && setUrl(started.url),
      () => active && setError(true),
    );
    return () => {
      active = false;
    };
  }, [locale]);

  useEffect(() => {
    if (!opened) return;
    const onShow = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    document.addEventListener("visibilitychange", onShow);
    window.addEventListener("focus", onShow);
    return () => {
      document.removeEventListener("visibilitychange", onShow);
      window.removeEventListener("focus", onShow);
    };
  }, [opened, router]);

  return (
    <section className="mt-8 rounded-3xl bg-[#e8f3fb] p-4 ring-1 ring-[#229ED9]/30 sm:p-5">
      <h2 className="font-serif text-2xl leading-tight text-ink">
        {t("title")}
      </h2>
      <p className="mt-1 text-sm text-muted">{t("text")}</p>
      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {t("error")}
        </p>
      ) : (
        <a
          href={url ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!url}
          onClick={() => setOpened(true)}
          className="mt-3 inline-flex h-10 items-center rounded-full bg-[#229ED9] px-5 text-sm font-medium text-white transition-colors hover:bg-[#1c8cc2] aria-disabled:pointer-events-none aria-disabled:opacity-60"
        >
          {t("button")}
        </a>
      )}
    </section>
  );
}
