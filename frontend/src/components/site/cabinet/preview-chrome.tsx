"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";
import type { TaklifStatus } from "@/lib/api-types";
import { formatSum } from "@/lib/format";
import { usePay } from "./use-pay";

/**
 * Whether the theme's opening cover is still on screen. Once it's gone it
 * doesn't come back, so the watching stops there.
 */
const coverShown = () => !!document.querySelector("[data-video-cover]");
const subscribeCover = (onChange: () => void) => {
  const observer = new MutationObserver(() => {
    if (!coverShown()) observer.disconnect();
    onChange();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
};
const subscribeNothing = () => () => {};

/**
 * The owner's controls around their invitation preview: a slim bar on top
 * (back, what this is, edit), and for a draft a card at the bottom to pay
 * and publish it, once the cover is opened. The bar sits above the cover.
 */
export default function PreviewChrome({
  id,
  slug,
  status,
  price,
  owner,
}: {
  id: string;
  slug: string;
  status: TaklifStatus;
  /** The design's price in so'm (0: free). */
  price: number;
  /** Whether the viewer owns it (only the owner can pay). */
  owner: boolean;
}) {
  const t = useTranslations("Invitation.preview");
  const tPay = useTranslations("Cabinet.actions");
  const locale = useLocale();
  const payment = usePay(id);
  // Folded down to just the button, to see the whole invitation.
  const [folded, setFolded] = useState(false);
  const draft = owner && status === "draft" && !payment.published;
  // The pay card waits for the cover to open: it would sit over the
  // cover's own "open" button, and the opening deserves the whole screen.
  // Without a pay card there's nothing to wait for.
  const covered = useSyncExternalStore(
    draft ? subscribeCover : subscribeNothing,
    coverShown,
    () => true,
  );

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-white/10 bg-ink/85 text-paper backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-3xl items-center justify-between gap-2 px-3">
          <Link
            href="/cabinet"
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm text-paper/80 transition-colors hover:bg-white/10 hover:text-paper"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="size-4">
              <path
                d="M15 6l-6 6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("back")}
          </Link>

          <StatusChip status={payment.published ? "published" : status} />

          <Link
            href={`/cabinet/edit/${slug}`}
            className="flex items-center gap-1.5 rounded-full bg-paper px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-cream"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="size-3.5">
              <path
                d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3ZM14 8l3 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("edit")}
          </Link>
        </div>
      </div>

      {draft && !covered && (
        <>
          {/* The theme's music button would sit under the card. */}
          <style>{`[data-music-button]{bottom:${folded ? "6rem" : "11rem"}!important}`}</style>
          <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md pb-[env(safe-area-inset-bottom)] motion-safe:animate-[pay-card-in_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">
            <div className="rounded-3xl bg-paper/95 p-4 shadow-[0_20px_50px_-12px_rgba(42,39,35,0.45)] ring-1 ring-line backdrop-blur-md">
              {!folded && (
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold"
                  >
                    ✦
                  </span>
                  <div className="min-w-0">
                    <p className="font-serif text-xl leading-tight text-ink">
                      {t("readyTitle")}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      {price === 0 ? t("readyTextFree") : t("readyText")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFolded(true)}
                    aria-label={t("fold")}
                    title={t("fold")}
                    className="-mt-1 -mr-1 ml-auto flex size-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-cream hover:text-ink"
                  >
                    <svg aria-hidden viewBox="0 0 24 24" className="size-4">
                      <path
                        d="M6 9l6 6 6-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => void payment.pay()}
                disabled={payment.busy}
                className={`relative flex h-14 w-full ${folded ? "" : "mt-4"} items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-sage via-[#56664d] to-sage text-paper shadow-lg shadow-sage/30 transition-transform active:scale-[0.98] disabled:opacity-80`}
              >
                {/* A soft light passing across, now and then. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent motion-safe:animate-[pay-shine_3.2s_ease-in-out_infinite]"
                />
                {payment.busy ? (
                  <>
                    <span className="size-5 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
                    <span className="font-medium">{tPay("paying")}</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium">
                      {price === 0 ? t("publishFree") : tPay("pay")}
                    </span>
                    {price > 0 && (
                      <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-sm tabular-nums">
                        {formatSum(price)} soʻm
                      </span>
                    )}
                  </>
                )}
              </button>

              {folded ? (
                <button
                  type="button"
                  onClick={() => setFolded(false)}
                  className="mt-2 w-full text-center text-xs text-muted hover:text-ink"
                >
                  {t("unfold")}
                </button>
              ) : payment.error ? (
                <p
                  role="alert"
                  className="mt-2.5 text-center text-sm text-red-700"
                >
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
            </div>
          </div>
        </>
      )}

      {payment.published && (
        <div
          role="status"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-3xl bg-sage p-4 text-paper shadow-lg"
        >
          <span className="font-medium">✓ {t("published")}</span>
          <a
            href={`/${locale}/taklif/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-paper px-4 py-1.5 text-sm font-medium text-ink"
          >
            {t("open")} ↗
          </a>
        </div>
      )}
    </>
  );
}

function StatusChip({ status }: { status: TaklifStatus }) {
  const t = useTranslations("Invitation.preview");
  const styles = {
    draft: "bg-white/10 text-paper/90",
    published: "bg-emerald-400/20 text-emerald-100",
    unpublished: "bg-amber-400/20 text-amber-100",
  }[status];
  const label = {
    draft: t("label"),
    published: t("statusPublished"),
    unpublished: t("statusUnpublished"),
  }[status];
  return (
    <span
      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${styles}`}
      title={status === "unpublished" ? t("hiddenNote") : undefined}
    >
      {status === "draft" ? (
        <svg aria-hidden viewBox="0 0 24 24" className="size-3.5">
          <path
            d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      ) : (
        <span
          className={`size-1.5 rounded-full ${status === "published" ? "bg-emerald-300" : "bg-amber-300"}`}
        />
      )}
      {label}
    </span>
  );
}
