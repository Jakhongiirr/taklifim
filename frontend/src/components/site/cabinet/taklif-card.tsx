"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { api } from "@/lib/api-client";
import { copyText } from "@/lib/copy-text";
import { coupleNames, formatSum } from "@/lib/format";
import type { Taklif } from "@/lib/api-types";
import {
  draftPhotosDeletedAt,
  photosDeletedAfterEventAt,
} from "@/lib/retention";
import { useConfirm } from "../confirm-dialog";
import StatusBadge from "./status-badge";
import { usePay } from "./use-pay";
import { useTashkentDate } from "@/lib/use-tashkent-date";

/** The invitation's link for guests, in the given language. */
function invitationUrl(slug: string, locale: string) {
  return `${window.location.origin}/${locale}/taklif/${slug}`;
}

export default function TaklifCard({
  taklif,
  gift = false,
}: {
  taklif: Taklif;
  /** A plov draft the owner has a free gift for: publishing costs nothing. */
  gift?: boolean;
}) {
  const t = useTranslations("Cabinet");
  const locale = useLocale();
  const router = useRouter();
  const { confirm, dialog } = useConfirm();
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState<"card" | "qr">();
  const [notice, setNotice] = useState<{ text: string; error?: boolean }>();
  const payment = usePay(taklif.id);

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

  /**
   * Saves the invitation card or its QR code as a PNG, rendered by the
   * server in this language (the QR code opens the invitation in it).
   */
  async function downloadPng(kind: "card" | "qr") {
    setDownloading(kind);
    setNotice(undefined);
    try {
      const path = kind === "card" ? "download" : "qr";
      const res = await fetch(`/${locale}/cabinet/${path}/${taklif.slug}`);
      // A lost session redirects to the login page (HTML), not an error.
      if (!res.ok || res.headers.get("content-type") !== "image/png") {
        throw new Error(`Download failed (${res.status})`);
      }
      const url = URL.createObjectURL(await res.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = `taklifim-${taklif.slug}${kind === "qr" ? "-qr" : ""}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {
      setNotice({ text: t("actions.downloadError"), error: true });
    } finally {
      setDownloading(undefined);
    }
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
          <StatusBadge status={taklif.status} />
          <h2 className="mt-1.5 truncate font-serif text-2xl leading-tight text-ink">
            {names}
          </h2>
          <p className="mt-0.5 text-sm text-muted">
            {t("eventAt", { date: when(taklif.eventAt) })}
          </p>
          <p className="truncate text-sm text-muted">{taklif.venueName}</p>
          {/* Views start once guests can open it. */}
          {taklif.status !== "draft" && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink">
              <EyeIcon />
              {t("views", { count: taklif.viewCount })}
            </p>
          )}
        </div>
      </div>

      {/* When the nightly cleanup will remove the photos (none left: no line). */}
      {photo && (
        <p className="mt-3 text-xs text-muted">
          {taklif.status === "draft"
            ? t("draftExpires", {
                date: when(draftPhotosDeletedAt(taklif.updatedAt)),
              })
            : t("liveUntil", {
                date: when(photosDeletedAfterEventAt(taklif.eventAt)),
              })}
        </p>
      )}

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
        {/* Images of published invitations only: paying publishes. */}
        {taklif.status === "published" && (
          <>
            <ActionButton
              disabled={!!downloading}
              onClick={() => void downloadPng("card")}
            >
              {downloading === "card"
                ? t("actions.downloading")
                : t("actions.download")}
            </ActionButton>
            <ActionButton
              disabled={!!downloading}
              onClick={() => void downloadPng("qr")}
            >
              {downloading === "qr"
                ? t("actions.downloading")
                : t("actions.downloadQr")}
            </ActionButton>
          </>
        )}
        {/* Guests can be listed before publishing; their links open after. */}
        <Link
          href={`/cabinet/guests/${taklif.slug}`}
          className="inline-flex h-10 items-center rounded-full px-4 text-sm font-medium text-ink ring-1 ring-line transition-colors hover:ring-ink/30"
        >
          {t("actions.guests")}
        </Link>
        {taklif.status !== "draft" && (
          <Link
            href={`/cabinet/responses/${taklif.slug}`}
            className="inline-flex h-10 items-center rounded-full px-4 text-sm font-medium text-ink ring-1 ring-line transition-colors hover:ring-ink/30"
          >
            {t("actions.responses")}
          </Link>
        )}
        {taklif.status === "draft" &&
          // Paying publishes the draft, on the payment page; a free design
          // is published at once.
          (gift || taklif.theme.price === 0 ? (
            <ActionButton
              primary
              disabled={busy || payment.busy}
              onClick={() => void payment.pay()}
            >
              {t(
                payment.busy
                  ? "actions.publishing"
                  : gift
                    ? "actions.publishGift"
                    : "actions.publishFree",
              )}
            </ActionButton>
          ) : (
            <Link
              href={`/cabinet/pay/${taklif.slug}`}
              className="inline-flex h-10 items-center rounded-full bg-sage px-4 text-sm font-medium text-paper transition-colors hover:bg-sage-dark"
            >
              {t("actions.pay")}
            </Link>
          ))}
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
        {/* Owners delete drafts only: once published, only an admin can. */}
        {taklif.status === "draft" && !taklif.paidAt && (
          <ActionButton
            danger
            disabled={busy || payment.busy}
            onClick={async () => {
              const ok = await confirm({
                title: t("actions.confirmDeleteTitle"),
                message: t("actions.confirmDelete"),
                confirmLabel: t("actions.delete"),
                cancelLabel: t("actions.cancel"),
                danger: true,
              });
              if (!ok) return;
              void run(() => api(`/taklif/${taklif.id}`, { method: "DELETE" }));
            }}
          >
            {t("actions.delete")}
          </ActionButton>
        )}
      </div>

      {taklif.status === "draft" && (
        <p className="mt-2 text-xs text-muted">
          {gift
            ? t("actions.payHintGift")
            : taklif.theme.price === 0
              ? t("actions.payHintFree")
              : t("actions.payHint", { price: formatSum(taklif.theme.price) })}
        </p>
      )}
      {(payment.error || payment.published) && (
        <p
          role={payment.error ? "alert" : "status"}
          className={`mt-3 text-sm ${payment.error ? "text-red-700" : "text-sage"}`}
        >
          {payment.error || t("actions.publishedFree")}
        </p>
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

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 shrink-0 text-muted"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
