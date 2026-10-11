import Image from "next/image";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { coupleNames, formatCardNumber, formatPhone } from "@/lib/format";
import { tashkentParts } from "@/lib/tashkent-date";
import Countdown from "./shared/countdown";
import CopyButton from "./shared/copy-button";
import Rsvp from "./shared/rsvp";
import type { ThemeProps } from "./types";

/**
 * The undecorated fallback: every part of the invitation in the site's own
 * styles, for theme ids without a design.
 */
export default async function PlainInvitation({ taklif, preview }: ThemeProps) {
  const [t, tDates, tRsvp] = await Promise.all([
    getTranslations("Invitation"),
    getTranslations("Dates"),
    getTranslations("Rsvp"),
  ]);
  const months = tDates.raw("months") as string[];
  const { year, month, day, time } = tashkentParts(taklif.eventAt);

  return (
    <article className="mx-auto min-h-dvh max-w-md bg-paper px-6 py-12 text-center text-ink">
      <p className="text-xs tracking-[0.3em] text-muted uppercase">
        {t("cover.eyebrow")}
      </p>
      <h1 className="mt-4 font-serif text-5xl">{coupleNames(taklif)}</h1>

      {taklif.photos[0] && (
        <Image
          src={taklif.photos[0].url}
          alt=""
          width={600}
          height={750}
          unoptimized
          priority
          className="mt-8 aspect-[4/5] w-full rounded-2xl object-cover"
        />
      )}

      <Section title={t("greeting")}>
        <p>
          {t("text", { groom: taklif.groomName, bride: taklif.brideName })}
        </p>
        <p className="mt-3 text-muted">
          {t("signature", { host: taklif.hostName })}
        </p>
      </Section>

      <Section title={t("date.title")}>
        <p className="font-serif text-2xl">
          {tDates("dateTime", { day, month: months[month], year, time })}
        </p>
      </Section>

      <Section title={t("countdown.title")}>
        <Countdown
          eventAt={taklif.eventAt}
          boxClassName="rounded-2xl bg-cream py-3"
        />
      </Section>

      <Section title={t("venue.title")}>
        <p className="font-serif text-2xl">{taklif.venueName}</p>
        <p className="mt-1 text-muted">{taklif.venueAddress}</p>
        {taklif.locationUrl && (
          <a
            href={taklif.locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-full bg-ink px-5 py-2 text-sm text-paper"
          >
            {t("venue.map")}
          </a>
        )}
      </Section>

      {taklif.photos.length > 1 && (
        <Section title={t("gallery.title")}>
          <div className="grid grid-cols-2 gap-2">
            {taklif.photos.slice(1).map((photo) => (
              <Image
                key={photo.id}
                src={photo.url}
                alt=""
                width={300}
                height={300}
                unoptimized
                className="aspect-square w-full rounded-xl object-cover"
              />
            ))}
          </div>
        </Section>
      )}

      {taklif.music && (
        <Section title={taklif.music.title}>
          <audio controls src={taklif.music.file.url} className="w-full" />
        </Section>
      )}

      <Section title={tRsvp("title")}>
        <Rsvp
          slug={taklif.slug}
          preview={preview}
          palette={{
            input: "bg-white ring-1 ring-line",
            optionOn: "bg-ink text-paper",
            optionOff: "bg-white ring-1 ring-line",
            button: "bg-ink text-paper",
            muted: "text-muted",
            accent: "text-ink",
            card: "bg-white ring-1 ring-line",
            error: "text-red-700",
          }}
        />
      </Section>

      {taklif.cardNumber && (
        <Section title={t("gift.title")}>
          <p className="text-muted">{t("gift.text")}</p>
          <p className="mt-3 font-mono text-lg tracking-wider">
            {formatCardNumber(taklif.cardNumber)}
          </p>
          <CopyButton
            value={taklif.cardNumber}
            className="mt-3 rounded-full px-4 py-1.5 text-sm ring-1 ring-line"
          />
        </Section>
      )}

      {taklif.phone && (
        <Section title={t("contact.title")}>
          <a
            href={`tel:${taklif.phone}`}
            className="inline-block rounded-full px-5 py-2 text-sm ring-1 ring-line"
          >
            {t("contact.call")} · {formatPhone(taklif.phone)}
          </a>
        </Section>
      )}

      <p className="mt-14 font-serif text-2xl">{t("closing")}</p>
      <p className="mt-10 text-xs text-muted">{t("madeWith")}</p>
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="mb-4 font-serif text-3xl">{title}</h2>
      {children}
    </section>
  );
}
