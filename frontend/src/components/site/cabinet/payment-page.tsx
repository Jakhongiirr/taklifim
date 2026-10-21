"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useEffect, useState } from "react";
import { OPERATOR, TELEGRAM_URL } from "@/content/legal/operator";
import { designName } from "@/content/designs";
import { Link } from "@/i18n/navigation";
import type { Taklif } from "@/lib/api-types";
import { copyText } from "@/lib/copy-text";
import { coupleNames, formatSum } from "@/lib/format";
import { useTashkentDate } from "@/lib/use-tashkent-date";
import { usePay } from "./use-pay";

/**
 * The ways to pay, in the order shown. Adding one: an entry here (its
 * name and text under Pay.methods.<id>) and its branch in `start` below.
 */
const PAYMENT_METHODS = [{ id: "payme", logo: <PaymeLogo /> }] as const;

type MethodId = (typeof PAYMENT_METHODS)[number]["id"];

/**
 * The payment page's body: what is being paid for, a choice of payment
 * methods and the button, then the support Telegram for anyone who can't
 * pay online. A free (or gifted) draft just gets a publish button.
 */
export default function PaymentPage({
  taklif,
  gift,
}: {
  taklif: Taklif;
  /** Published with the owner's free plov gift. */
  gift: boolean;
}) {
  const t = useTranslations("Pay");
  const tPay = useTranslations("Cabinet.actions");
  const locale = useLocale();
  const router = useRouter();
  const when = useTashkentDate();
  const payment = usePay(taklif.id);
  const [method, setMethod] = useState<MethodId>(PAYMENT_METHODS[0].id);
  const price = gift ? 0 : taklif.theme.price;
  const photo = taklif.photos[0];
  // Ready for the support chat, in the visitor's language.
  const telegramMessage = t("telegram.message", { code: taklif.slug });

  function start() {
    switch (method) {
      case "payme":
        return void payment.pay();
    }
  }

  // Paid (or published free): the cabinet shows it, with its links.
  useEffect(() => {
    if (payment.published) {
      router.push(`/${locale}/cabinet#paid-${taklif.slug}`);
    }
  }, [payment.published, router, locale, taklif.slug]);

  // Back from Payme via the browser's back button, this page comes from the
  // browser's cache; loading it again sends a paid invitation to the cabinet.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  return (
    <>
      <Link
        href={`/taklif/${taklif.slug}/preview`}
        className="text-sm text-muted hover:text-ink"
      >
        ← {t("back")}
      </Link>
      <h1 className="mt-3 font-serif text-4xl font-medium text-ink">
        {t("title")}
      </h1>

      {/* The order */}
      <section className="mt-6 rounded-3xl bg-white/70 p-4 ring-1 ring-line sm:p-5">
        <div className="flex gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-cream">
            {photo ? (
              <Image
                src={photo.url}
                alt=""
                fill
                unoptimized
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center font-serif text-xl text-gold italic">
                {taklif.groomName[0]}&{taklif.brideName[0]}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-2xl leading-tight text-ink">
              {coupleNames(taklif)}
            </p>
            <p className="mt-0.5 text-sm text-muted">{when(taklif.eventAt)}</p>
            <p className="text-sm text-muted">
              {t("design", { name: designName(taklif.theme.themeId) })}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-line pt-4">
          <span className="text-sm text-muted">{t("total")}</span>
          <span className="font-serif text-3xl text-ink tabular-nums">
            {price === 0 ? t("free") : t("amount", { price: formatSum(price) })}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted">
          {gift
            ? tPay("payHintGift")
            : price === 0
              ? tPay("payHintFree")
              : t("afterPay")}
        </p>
      </section>

      {price > 0 && (
        <fieldset className="mt-8">
          <legend className="font-medium text-ink">{t("chooseMethod")}</legend>
          <div className="mt-3 flex flex-col gap-2">
            {PAYMENT_METHODS.map((m) => (
              <MethodOption
                key={m.id}
                id={m.id}
                checked={method === m.id}
                onSelect={() => setMethod(m.id)}
                logo={m.logo}
                name={t(`methods.${m.id}.name`)}
                text={t(`methods.${m.id}.text`)}
              />
            ))}
          </div>
        </fieldset>
      )}

      <button
        type="button"
        onClick={start}
        disabled={payment.busy}
        className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-sage text-paper shadow-lg shadow-sage/30 transition-transform hover:bg-sage-dark active:scale-[0.98] disabled:opacity-80"
      >
        {payment.busy && (
          <span className="size-5 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
        )}
        <span className="font-medium">
          {payment.busy
            ? tPay(price === 0 ? "publishing" : "paying")
            : gift
              ? tPay("publishGift")
              : price === 0
                ? tPay("publishFree")
                : t("payButton", { price: formatSum(price) })}
        </span>
      </button>
      {payment.error ? (
        <p role="alert" className="mt-2.5 text-center text-sm text-red-700">
          {payment.error}
        </p>
      ) : (
        price > 0 && (
          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-muted">
            <svg aria-hidden viewBox="0 0 24 24" className="size-3.5">
              <path
                d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            {t("secure")}
          </p>
        )
      )}

      {/* For anyone who can't pay online: the admin takes it from there. */}
      {price > 0 && (
        <>
          <section className="mt-10 rounded-3xl bg-cream p-5 ring-1 ring-line">
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#2aabee] text-white shadow-md shadow-[#2aabee]/30"
              >
                <TelegramIcon />
              </span>
              <div className="min-w-0">
                <p className="font-serif text-xl text-ink">
                  {t("telegram.title")}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {t("telegram.text", { username: OPERATOR.telegram })}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {t("telegram.code")} <CopyCode code={taklif.slug} />
                </p>
              </div>
            </div>
            {/* Telegram fills this in the chat; it's shown so it's no surprise. */}
            <p className="mt-4 rounded-2xl rounded-br-md bg-[#effdde] px-4 py-2.5 text-sm text-ink shadow-sm ring-1 ring-black/5">
              {telegramMessage}
            </p>
            <a
              href={`${TELEGRAM_URL}?text=${encodeURIComponent(telegramMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2aabee] text-sm font-medium text-white transition-colors hover:bg-[#229ed9]"
            >
              {OPERATOR.telegram}
              <span aria-hidden>↗</span>
            </a>
          </section>
        </>
      )}
    </>
  );
}

/** The invitation code, copied with a tap (to paste into the message). */
function CopyCode({ code }: { code: string }) {
  const t = useTranslations("Pay.telegram");
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!(await copyText(code))) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      title={t("copy")}
      className="inline-flex items-center gap-1.5 rounded-md bg-paper px-1.5 py-0.5 align-middle font-mono text-ink ring-1 ring-line transition-colors hover:ring-ink/30"
    >
      {code}
      <span className="font-sans text-xs text-muted">
        {copied ? `✓ ${t("copied")}` : <CopyIcon />}
      </span>
    </button>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h8" />
    </svg>
  );
}

function MethodOption({
  id,
  checked,
  onSelect,
  logo,
  name,
  text,
}: {
  id: string;
  checked: boolean;
  onSelect: () => void;
  logo: ReactNode;
  name: string;
  text: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-4 rounded-2xl bg-white/70 p-4 ring-1 transition-colors ${checked ? "ring-2 ring-sage" : "ring-line hover:ring-ink/30"}`}
    >
      <input
        type="radio"
        name="payment-method"
        value={id}
        checked={checked}
        onChange={onSelect}
        className="size-4 accent-sage"
      />
      {logo}
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-ink">{name}</span>
        <span className="block text-xs text-muted">{text}</span>
      </span>
    </label>
  );
}

/** Payme's name as a wordmark, in its colours. */
function PaymeLogo() {
  return (
    <span
      aria-hidden
      className="flex h-9 w-20 shrink-0 items-center justify-center rounded-xl bg-[#e6fafa] text-lg font-bold tracking-tight"
    >
      <span className="text-[#1e2a38]">pay</span>
      <span className="text-[#00b9c0]">me</span>
    </span>
  );
}

function TelegramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 -translate-x-px"
      fill="currentColor"
    >
      <path d="M21.4 4.3 18.3 19c-.2 1-.9 1.3-1.7.8l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.1 12.8 1.4 11.3c-1-.3-1-1 .2-1.5L20 2.7c.9-.3 1.6.2 1.4 1.6Z" />
    </svg>
  );
}
