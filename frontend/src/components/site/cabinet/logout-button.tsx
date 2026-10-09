"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { authApi } from "@/lib/api-client";

export default function LogoutButton() {
  const t = useTranslations("Cabinet");
  const locale = useLocale();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      className="inline-flex h-9 items-center rounded-full px-4 text-sm text-muted ring-1 ring-line transition-colors hover:text-ink disabled:opacity-60"
      onClick={async () => {
        setPending(true);
        await authApi("/logout").catch(() => undefined);
        // Full reload, so nothing from this session stays in memory.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign(`/${locale}`);
      }}
    >
      {t("logout")}
    </button>
  );
}
