"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { apiIfAllowed } from "@/lib/api-client";
import type { Taklif } from "@/lib/api-types";

/**
 * On the 404 of an invitation link (/taklif/<slug>, a guest's one too):
 * when the invitation is only hidden from guests (a draft or unpublished)
 * and the viewer is its owner or an admin, opens its preview instead.
 * Guests and signed-out visitors stay on the 404. Done in the browser, so
 * the guest page stays cached for everyone.
 */
export default function HiddenInvitationRedirect() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    const [, page, slug, rest] = pathname.split("/");
    if (page !== "taklif" || !slug || rest === "preview") return;
    let cancelled = false;
    void apiIfAllowed<Taklif>(`/taklif/preview/${encodeURIComponent(slug)}`)
      .then((taklif) => {
        // A published one 404s here only for a wrong guest link.
        if (cancelled || !taklif || taklif.status === "published") return;
        // A full load: the preview's inline scripts don't run on a client
        // navigation.
        window.location.replace(`/${locale}/taklif/${slug}/preview`);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname, locale]);

  return null;
}
