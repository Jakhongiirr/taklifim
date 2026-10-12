"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ApiError } from "@/lib/api-client";
import { useTelegramLogin } from "@/lib/use-telegram-login";

/** Login through the site's Telegram bot, for the public site. */
export default function LoginForm({ next }: { next: string }) {
  const t = useTranslations("Auth");
  const locale = useLocale();
  // A full load, so every page sees the new session.
  const login = useTelegramLogin(locale, () => window.location.assign(next));

  // The backend's messages are English; show our own per error kind.
  const error = !login.error
    ? ""
    : login.error instanceof ApiError &&
        login.error.code === "TOO_MANY_REQUESTS"
      ? t("errors.tooMany")
      : t("errors.generic");

  return (
    <div className="flex flex-col gap-5">
      <a
        href={login.url ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!login.url}
        onClick={(e) => {
          if (!login.url) e.preventDefault();
          else login.opened();
        }}
        className={`inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#229ED9] font-medium text-white transition-colors hover:bg-[#1c8cc2] ${login.url ? "" : "pointer-events-none opacity-60"}`}
      >
        <TelegramIcon />
        {!login.url
          ? t("preparing")
          : login.waiting
            ? t("openAgain")
            : t("telegram")}
      </a>

      {login.waiting && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl bg-cream px-4 py-3 text-sm"
        >
          <span className="mt-0.5 size-4 shrink-0 animate-spin rounded-full border-2 border-sage/30 border-t-sage" />
          <span>
            <span className="block font-medium text-ink">{t("waiting")}</span>
            <span className="text-muted">{t("waitingHint")}</span>
          </span>
        </div>
      )}

      {login.expired && !login.waiting && (
        <p role="status" className="text-center text-sm text-muted">
          {t("expired")}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="flex items-center justify-between gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
          <button
            type="button"
            className="shrink-0 font-medium underline underline-offset-4"
            onClick={() => void login.retry()}
          >
            {t("errors.retry")}
          </button>
        </p>
      )}

      <p className="text-center text-xs text-muted">{t("noTelegram")}</p>
      <p className="text-center text-xs leading-relaxed text-muted">
        {t.rich("consent", {
          terms: (chunks) => (
            <Link
              href="/terms"
              className="underline underline-offset-2 hover:text-ink"
            >
              {chunks}
            </Link>
          ),
          privacy: (chunks) => (
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-ink"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    </div>
  );
}

function TelegramIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M21.9 4.3 18.7 19.4c-.2 1-.9 1.3-1.7.8l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.5 13.2 1.8 11.7c-1-.3-1-1 .2-1.5L20.5 3.1c.9-.3 1.6.2 1.4 1.2Z" />
    </svg>
  );
}
