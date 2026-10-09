"use client";

import { useTranslations } from "next-intl";
import type { FormEvent } from "react";
import { Link } from "@/i18n/navigation";
import { ApiError } from "@/lib/api-client";
import { useOtpLogin } from "@/lib/use-otp-login";

const inputClass =
  "h-12 w-full rounded-2xl border border-line bg-white px-4 text-base text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-sage focus:ring-2 focus:ring-sage/20 disabled:bg-cream disabled:text-muted";

/** Phone + Telegram code login for the public site. */
export default function LoginForm({ next }: { next: string }) {
  const t = useTranslations("Auth");
  const login = useOtpLogin();
  const { step, phone, code, resendIn, pending } = login;

  // The backend's messages are English; show our own per error kind.
  function errorText(error: unknown) {
    if (!error) return "";
    if (!(error instanceof ApiError)) return t("errors.generic");
    const retryAfter = (error.details as { retryAfter?: number } | undefined)
      ?.retryAfter;
    if (retryAfter) return t("errors.codeSent");
    switch (error.code) {
      case "VALIDATION_FAILED":
        return step === "phone" ? t("errors.phone") : t("errors.code");
      case "BAD_REQUEST":
        return t("errors.code");
      case "TOO_MANY_REQUESTS":
        return t("errors.tooMany");
      case "SERVICE_UNAVAILABLE":
        return t("errors.delivery");
      default:
        return t("errors.generic");
    }
  }

  async function verify() {
    // A full load, so every page sees the new session.
    if (await login.verify()) window.location.assign(next);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void (step === "phone" ? login.requestCode() : verify());
  }

  const error = errorText(login.error);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">{t("phone")}</span>
        <input
          className={inputClass}
          type="tel"
          autoComplete="tel"
          placeholder="+998 90 123 45 67"
          value={phone}
          onChange={(e) => login.setPhone(e.target.value)}
          disabled={step === "code"}
          required
          autoFocus
        />
      </label>

      {step === "code" && (
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-ink">{t("code")}</span>
          <input
            className={`${inputClass} text-center font-mono text-xl tracking-[0.5em]`}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="••••••"
            value={code}
            onChange={(e) => login.setCode(e.target.value)}
            maxLength={8}
            required
            autoFocus
          />
          <span className="text-sm text-muted">{t("codeHint", { phone })}</span>
          <span className="flex flex-wrap justify-between gap-2 text-sm">
            <button
              type="button"
              className="text-sage underline-offset-4 hover:underline disabled:text-muted disabled:no-underline"
              disabled={resendIn > 0 || pending}
              onClick={() => void login.requestCode()}
            >
              {resendIn > 0
                ? t("resendIn", { seconds: resendIn })
                : t("resend")}
            </button>
            <button
              type="button"
              className="text-muted underline-offset-4 hover:text-ink hover:underline"
              onClick={login.changeNumber}
            >
              {t("change")}
            </button>
          </span>
        </label>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-sage font-medium text-paper transition-colors hover:bg-sage-dark disabled:opacity-60"
      >
        {pending && (
          <span className="mr-2 size-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
        )}
        {step === "phone" ? t("send") : t("verify")}
      </button>
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
    </form>
  );
}
