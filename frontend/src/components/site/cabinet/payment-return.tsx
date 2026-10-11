"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { ApiBody, Taklif } from "@/lib/api-types";

const POLL_MS = 2500;
const MAX_POLLS = 12; // ~30 seconds

const subscribe = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

/**
 * Payme sends the buyer back to /cabinet#paid-<slug>. Payme's server
 * confirms the payment separately (PerformTransaction), so this waits for
 * the invitation to turn published, then says so; if it takes too long it
 * says that instead of guessing.
 */
export default function PaymentReturn() {
  const t = useTranslations("Cabinet.payment");
  const locale = useLocale();
  const router = useRouter();
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
  const slug = /^#paid-([a-z0-9]+)$/.exec(hash)?.[1] ?? null;
  const [state, setState] = useState<"pending" | "done" | "slow">("pending");

  useEffect(() => {
    if (!slug) return;
    let polls = 0;
    let timer: ReturnType<typeof setTimeout>;
    const check = async () => {
      try {
        const res = await fetch("/api/backend/taklif/mine", {
          cache: "no-store",
        });
        const body = (await res.json()) as ApiBody<Taklif[]>;
        const taklif = body.success
          ? body.data.find((x) => x.slug === slug)
          : undefined;
        if (taklif?.paidAt) {
          setState("done");
          router.refresh(); // the card shows it published
          return;
        }
      } catch {
        // Try again on the next round.
      }
      if (++polls >= MAX_POLLS) return setState("slow");
      timer = setTimeout(check, POLL_MS);
    };
    void check();
    return () => clearTimeout(timer);
  }, [slug, router]);

  if (!slug) return null;

  const dismiss = () => {
    // Drop the hash without a navigation (it would scroll and re-render).
    history.replaceState(null, "", window.location.pathname);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  const styles = {
    pending: "bg-cream ring-line",
    done: "bg-sage/10 ring-sage/30",
    slow: "bg-gold/10 ring-gold/30",
  }[state];

  return (
    <div
      role="status"
      className={`mt-6 flex items-start gap-3 rounded-3xl p-4 ring-1 ${styles}`}
    >
      {state === "pending" ? (
        <span className="mt-0.5 size-5 shrink-0 animate-spin rounded-full border-2 border-sage/30 border-t-sage" />
      ) : (
        <span
          aria-hidden
          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs text-paper ${state === "done" ? "bg-sage" : "bg-gold"}`}
        >
          {state === "done" ? "✓" : "!"}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink">{t(state)}</p>
        <p className="mt-0.5 text-sm text-muted">{t(`${state}Text`)}</p>
        {state === "done" && (
          <a
            href={`/${locale}/taklif/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex h-10 items-center rounded-full bg-sage px-4 text-sm font-medium text-paper hover:bg-sage-dark"
          >
            {t("open")} ↗
          </a>
        )}
      </div>
      {state !== "pending" && (
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-sm text-muted hover:text-ink"
        >
          {t("dismiss")}
        </button>
      )}
    </div>
  );
}
