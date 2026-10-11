"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/api-client";
import type { TaklifResponse } from "@/lib/api-types";
import { useTashkentDate } from "@/lib/use-tashkent-date";
import { useConfirm } from "../confirm-dialog";

/** The owner's list of replies: like a wish, or delete a reply. */
export default function ResponsesList({
  taklifId,
  items,
}: {
  taklifId: string;
  items: TaklifResponse[];
}) {
  const t = useTranslations("Responses");
  const router = useRouter();
  const when = useTashkentDate();
  const { confirm, dialog } = useConfirm();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function run(id: string, action: () => Promise<unknown>) {
    setBusy(id);
    setError("");
    try {
      await action();
      router.refresh();
    } catch {
      setError(t("error"));
    } finally {
      setBusy(null);
    }
  }

  const path = (id: string) => `/taklif/${taklifId}/responses/${id}`;

  return (
    <>
      {dialog}
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-3xl bg-white/70 p-4 ring-1 ring-line sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-serif text-xl text-ink">{item.name}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {when(item.createdAt)}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${item.attending ? "bg-sage/10 text-sage ring-sage/30" : "bg-cream text-muted ring-line"}`}
              >
                {item.attending
                  ? `${t("yes")} · ${t("people", { count: item.guests })}`
                  : t("no")}
              </span>
            </div>
            <p
              className={`mt-3 text-sm leading-relaxed ${item.message ? "text-ink/85" : "text-muted italic"}`}
            >
              {item.message ?? t("noWish")}
            </p>
            <div className="mt-4 flex gap-2">
              {item.message && (
                <button
                  type="button"
                  disabled={busy === item.id}
                  aria-pressed={item.liked}
                  onClick={() =>
                    void run(item.id, () =>
                      api(path(item.id), {
                        method: "PATCH",
                        json: { liked: !item.liked },
                      }),
                    )
                  }
                  className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm transition-colors disabled:opacity-50 ${item.liked ? "bg-[#c2846f]/10 text-[#b0644f] ring-1 ring-[#c2846f]/40" : "text-ink ring-1 ring-line hover:ring-ink/30"}`}
                >
                  <span aria-hidden>{item.liked ? "♥" : "♡"}</span>
                  {item.liked ? t("unlike") : t("like")}
                </button>
              )}
              <button
                type="button"
                disabled={busy === item.id}
                onClick={async () => {
                  const ok = await confirm({
                    title: t("confirmTitle"),
                    message: t("confirmText"),
                    confirmLabel: t("delete"),
                    cancelLabel: t("cancel"),
                    danger: true,
                  });
                  if (ok) {
                    void run(item.id, () =>
                      api(path(item.id), { method: "DELETE" }),
                    );
                  }
                }}
                className="inline-flex h-9 items-center rounded-full px-3.5 text-sm text-red-700 ring-1 ring-red-200 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                {t("delete")}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
