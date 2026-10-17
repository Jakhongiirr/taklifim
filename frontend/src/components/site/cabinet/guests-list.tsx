"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";
import { routing } from "@/i18n/routing";
import { ApiError, api } from "@/lib/api-client";
import type { TaklifGuest } from "@/lib/api-types";
import { copyText } from "@/lib/copy-text";
import { useConfirm } from "../confirm-dialog";

/** The backend takes up to this many names per request. */
const BATCH = 100;

/**
 * The owner adds guests by name (one per line) and copies or shares each
 * one's personal link, in the language the guest should read it in.
 */
export default function GuestsList({
  taklifId,
  slug,
  published,
  guests,
}: {
  taklifId: string;
  slug: string;
  published: boolean;
  guests: TaklifGuest[];
}) {
  const t = useTranslations("Guests");
  const router = useRouter();
  const locale = useLocale();
  const { confirm, dialog } = useConfirm();
  const [lang, setLang] = useState(locale);
  const [names, setNames] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ text: string; error?: boolean }>();

  const link = (token: string) =>
    `${window.location.origin}/${lang}/taklif/${slug}/${token}`;

  async function add(e: FormEvent) {
    e.preventDefault();
    const list = names
      .split("\n")
      .map((n) => n.trim().replace(/\s+/g, " ").slice(0, 60))
      .filter(Boolean);
    if (!list.length) return;
    setBusy("add");
    setNotice(undefined);
    try {
      for (let i = 0; i < list.length; i += BATCH) {
        await api(`/taklif/${taklifId}/guests`, {
          method: "POST",
          json: { names: list.slice(i, i + BATCH) },
        });
      }
      setNames("");
    } catch (err) {
      setNotice({
        text:
          err instanceof ApiError && err.status === 409
            ? t("tooMany")
            : t("error"),
        error: true,
      });
    } finally {
      setBusy(null);
      // Shows whatever was added, even if a later batch failed.
      router.refresh();
    }
  }

  async function remove(guest: TaklifGuest) {
    const ok = await confirm({
      title: t("confirmTitle"),
      message: t("confirmText"),
      confirmLabel: t("delete"),
      cancelLabel: t("cancel"),
      danger: true,
    });
    if (!ok) return;
    setBusy(guest.id);
    setNotice(undefined);
    try {
      await api(`/taklif/${taklifId}/guests/${guest.id}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch {
      setNotice({ text: t("error"), error: true });
    } finally {
      setBusy(null);
    }
  }

  async function copy(guest: TaklifGuest) {
    setNotice(
      (await copyText(link(guest.token)))
        ? { text: t("copied", { name: guest.name }) }
        : { text: t("error"), error: true },
    );
  }

  return (
    <>
      {dialog}
      <form
        onSubmit={add}
        className="mt-6 flex flex-col gap-3 rounded-3xl bg-white/70 p-4 ring-1 ring-line sm:p-5"
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-muted">{t("addLabel")}</span>
          <textarea
            value={names}
            onChange={(e) => setNames(e.target.value)}
            rows={4}
            placeholder={t("addPlaceholder")}
            className="w-full resize-y rounded-2xl bg-paper px-4 py-3 text-ink ring-1 ring-line outline-none focus:ring-sage"
          />
        </label>
        <button
          type="submit"
          disabled={busy === "add" || !names.trim()}
          className="inline-flex h-11 items-center justify-center self-start rounded-full bg-sage px-6 text-sm font-medium text-paper transition-colors hover:bg-sage-dark disabled:opacity-50 disabled:hover:bg-sage"
        >
          {busy === "add" ? t("adding") : t("add")}
        </button>
      </form>

      {/* Guests' links 404 until it's published: hard to miss on purpose. */}
      {!published && (
        <p
          role="status"
          className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-100 px-4 py-3 text-sm font-medium text-amber-900 ring-1 ring-amber-300"
        >
          <span
            aria-hidden
            className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-500"
          />
          {t("notPublished")}
        </p>
      )}
      {notice && (
        <p
          role={notice.error ? "alert" : "status"}
          className={`mt-4 text-sm ${notice.error ? "text-red-700" : "text-sage"}`}
        >
          {notice.text}
        </p>
      )}

      {guests.length ? (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted">
              {t("total", { count: guests.length })}
            </p>
            {/* Guests read the invitation in the language of their link. */}
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted">{t("linkLang")}</span>
              {routing.locales.map((l) => (
                <button
                  key={l}
                  type="button"
                  lang={l}
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                  className={`inline-flex h-8 items-center rounded-full px-3 text-xs font-medium uppercase transition-colors ${lang === l ? "bg-sage text-paper" : "text-ink ring-1 ring-line hover:ring-ink/30"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <ul className="mt-3 flex flex-col gap-3">
            {guests.map((guest) => (
              <li
                key={guest.id}
                className="rounded-3xl bg-white/70 p-4 ring-1 ring-line sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="min-w-0 font-serif text-xl break-words text-ink">
                    {guest.name}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${guest.reply?.attending ? "bg-sage/10 text-sage ring-sage/30" : "bg-cream text-muted ring-line"}`}
                  >
                    {!guest.reply
                      ? t("waiting")
                      : guest.reply.attending
                        ? t("coming", { count: guest.reply.guests })
                        : t("declined")}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void copy(guest)}
                    className="inline-flex h-10 items-center rounded-full bg-sage px-4 text-sm font-medium text-paper transition-colors hover:bg-sage-dark"
                  >
                    {t("copy")}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `https://t.me/share/url?url=${encodeURIComponent(link(guest.token))}`,
                        "_blank",
                        "noopener",
                      )
                    }
                    className="inline-flex h-10 items-center rounded-full px-4 text-sm font-medium text-ink ring-1 ring-line transition-colors hover:ring-ink/30"
                  >
                    {t("share")}
                  </button>
                  <button
                    type="button"
                    disabled={busy === guest.id}
                    onClick={() => void remove(guest)}
                    className="inline-flex h-10 items-center rounded-full px-4 text-sm font-medium text-red-700 ring-1 ring-red-200 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    {t("delete")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-6 rounded-[2rem] border border-dashed border-line px-6 py-12 text-center text-sm text-muted">
          {t("empty")}
        </p>
      )}
    </>
  );
}
