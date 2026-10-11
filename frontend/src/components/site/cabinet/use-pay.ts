"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { api, ApiError } from "@/lib/api-client";

/**
 * "Pay and publish" for an owner's draft: off to Payme's checkout, which
 * returns to the cabinet (#paid-<slug>) to confirm the payment. A free
 * design is published at once and the page refreshes. Used by the cabinet
 * card and the preview.
 */
export function usePay(taklifId: string) {
  const t = useTranslations("Cabinet.actions");
  const locale = useLocale();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [published, setPublished] = useState(false);

  async function pay() {
    setBusy(true);
    setError("");
    try {
      const result = await api<{ url?: string; published: boolean }>(
        `/payments/checkout/${taklifId}`,
        { method: "POST", json: { lang: locale } },
      );
      if (result.url) {
        window.location.assign(result.url);
        return; // stays busy until Payme's page opens
      }
      setPublished(true);
      router.refresh();
    } catch (err) {
      setError(
        t(
          err instanceof ApiError && err.status === 503
            ? "payUnavailable"
            : "error",
        ),
      );
    }
    setBusy(false);
  }

  return { pay, busy, error, published };
}
