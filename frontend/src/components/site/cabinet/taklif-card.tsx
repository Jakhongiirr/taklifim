"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { api } from "@/lib/api-client";
import { copyText } from "@/lib/copy-text";
import { coupleNames } from "@/lib/format";
import type { Taklif } from "@/lib/api-types";
import { deletedAfterEventAt, draftDeletedAt } from "@/lib/retention";
import { useConfirm } from "../confirm-dialog";
import { useTashkentDate } from "@/lib/use-tashkent-date";

const STATUS_STYLES: Record<Taklif["status"], string> = {
  draft: "bg-cream text-muted ring-line",
  published: "bg-sage/10 text-sage ring-sage/30",
  unpublished: "bg-gold/10 text-gold ring-gold/30",
};

/** The invitation's link for guests, in the given language. */
function invitationUrl(slug: string, locale: string) {
  return `${window.location.origin}/${locale}/taklif/${slug}`;
}

export default function TaklifCard({ taklif }: { taklif: Taklif }) {
  const t = useTranslations("Cabinet");
  const router = useRouter();
  const { confirm, dialog } = useConfirm();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error?: boolean }>();

  const when = useTashkentDate();
  const names = coupleNames(taklif);
  const photo = taklif.photos[0];

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setNotice(undefined);
    try {
      await action();
      router.refresh();
    } catch {
      setNotice({ text: t("actions.error"), error: true });
    } finally {
      setBusy(false);
    }
  }

  async function copyLink(locale: string) {
    if (!(await copyText(invitationUrl(taklif.slug, locale)))) {
      return setNotice({ text: t("actions.error"), error: true });
    }
    setNotice({ text: t("actions.copied", { lang: locale.toUpperCase() }) });
  }

  return (
    <article className="rounded-3xl bg-white/70 p-4 ring-1 ring-line sm:p-5">
      {dialog}
      <div className="flex gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-cream">
          {photo ? (
            <Image
              src={photo.url}
              alt=""
              fill
              unoptimized
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center font-serif text-2xl text-gold italic">
              {taklif.groomName[0]}&{taklif.brideName[0]}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${STATUS_STYLES[taklif.status]}`}
          >
            {t(`status.${taklif.status}`)}
          </span>
          <h2 className="mt-1.5 truncate font-serif text-2xl leading-tight text-ink">
            {names}
          </h2>
          <p className="mt-0.5 text-sm text-muted">
            {t("eventAt", { date: when(taklif.eventAt) })}
          </p>
          <p className="truncate text-sm text-muted">{taklif.venueName}</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">
        {taklif.status === "draft"
          ? t("draftExpires", { date: when(draftDeletedAt(taklif.updatedAt)) })
          : t("liveUntil", {
              date: when(deletedAfterEventAt(taklif.eventAt)),
            })}
      </p>

      {taklif.status === "published" && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">{t("actions.copyLink")}</span>
          {/* Guests see the invitation in the language of the link. */}
          {routing.locales.map((locale) => (
            <button
              key={locale}
              type="button"
              lang={locale}
              onClick={() => void copyLink(locale)}
              className="inline-flex h-10 items-center rounded-full bg-sage px-4 text-sm font-medium text-paper uppercase transition-colors hover:bg-sage-dark"
            >
              {locale}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/taklif/${taklif.slug}/preview`}
          className="inline-flex h-10 items-center rounded-full px-4 text-sm font-medium text-ink ring-1 ring-line transition-colors hover:ring-ink/30"
        >
          {t("actions.preview")}
        </Link>
        <Link
          href={`/cabinet/edit/${taklif.slug}`}
          className="inline-flex h-10 items-center rounded-full px-4 text-sm font-medium text-ink ring-1 ring-line transition-colors hover:ring-ink/30"
        >
          {t("actions.edit")}
        </Link>
        {taklif.status === "draft" && (
          <>
            {/* Drafts are published by paying; payments aren't built yet. */}
            <ActionButton primary disabled title={t("actions.paySoon")}>
              {t("actions.pay")}
            </ActionButton>
            <ActionButton
              danger
              disabled={busy}
              onClick={async () => {
                const ok = await confirm({
                  title: t("actions.confirmDeleteTitle"),
                  message: t("actions.confirmDelete"),
                  confirmLabel: t("actions.delete"),
                  cancelLabel: t("actions.cancel"),
                  danger: true,
                });
                if (!ok) return;
                void run(() =>
                  api(`/taklif/${taklif.id}`, { method: "DELETE" }),
                );
              }}
            >
              {t("actions.delete")}
            </ActionButton>
          </>
        )}
        {taklif.status === "published" && (
          <>
            <ActionButton
              disabled={busy}
              onClick={() =>
                void run(() =>
                  api(`/taklif/${taklif.id}/unpublish`, { method: "POST" }),
                )
              }
            >
              {t("actions.unpublish")}
            </ActionButton>
          </>
        )}
        {taklif.status === "unpublished" && (
          <ActionButton
            primary
            disabled={busy}
            onClick={() =>
              void run(() =>
                api(`/taklif/${taklif.id}/publish`, { method: "POST" }),
              )
            }
          >
            {t("actions.publish")}
          </ActionButton>
        )}
      </div>

      {taklif.status === "draft" && (
        <p className="mt-2 text-xs text-muted">{t("actions.paySoon")}</p>
      )}
      {notice && (
        <p
          role={notice.error ? "alert" : "status"}
          className={`mt-3 text-sm ${notice.error ? "text-red-700" : "text-sage"}`}
        >
          {notice.text}
        </p>
      )}
    </article>
  );
}

function ActionButton({
  children,
  primary,
  danger,
  ...props
}: {
  children: ReactNode;
  primary?: boolean;
  danger?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const style = primary
    ? "bg-sage text-paper hover:bg-sage-dark"
    : danger
      ? "text-red-700 ring-1 ring-red-200 hover:bg-red-50"
      : "text-ink ring-1 ring-line hover:ring-ink/30";
  return (
    <button
      type="button"
      className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition-colors disabled:opacity-50 disabled:hover:bg-transparent ${style} ${primary ? "disabled:hover:bg-sage" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
