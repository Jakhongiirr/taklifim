import Image from "next/image";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import Ornament from "@/components/site/ornament";
import { Link } from "@/i18n/navigation";
import { coupleNames, formatCardNumber, formatPhone } from "@/lib/format";
import { tashkentParts } from "@/lib/tashkent-date";
import Countdown from "../shared/countdown";
import CopyButton from "../shared/copy-button";
import type { ThemeProps } from "../types";
import ClassicCover from "./cover";

/**
 * "classic": ivory paper, serif type and gold ornaments. One phone-width
 * column; on desktop it sits on a cream backdrop like a card.
 */
export default async function ClassicTheme({ taklif }: ThemeProps) {
  const [t, tDates] = await Promise.all([
    getTranslations("Invitation"),
    getTranslations("Dates"),
  ]);
  const months = tDates.raw("months") as string[];
  const weekdays = tDates.raw("weekdays") as string[];
  const date = tashkentParts(taklif.eventAt);
  const names = coupleNames(taklif);
  const [hero, ...gallery] = taklif.photos;
  const shortDate = `${String(date.day).padStart(2, "0")} · ${String(date.month + 1).padStart(2, "0")} · ${date.year}`;

  return (
    <div className="min-h-full flex-1 bg-cream md:py-10">
      <ClassicCover
        names={names}
        date={shortDate}
        musicUrl={taklif.music?.file.url ?? null}
      />

      <article className="mx-auto max-w-md overflow-hidden bg-paper text-center md:rounded-[2rem] md:shadow-2xl md:shadow-ink/10">
        {/* Hero: the first photo, or an ornamental frame without one. */}
        {hero ? (
          <header className="relative aspect-[3/4]">
            <Image
              src={hero.url}
              alt=""
              fill
              unoptimized
              priority
              sizes="(min-width: 768px) 448px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-10 text-paper">
              <p className="text-xs tracking-[0.3em] uppercase opacity-80">
                {t("cover.eyebrow")}
              </p>
              <h1 className="mt-3 font-serif text-5xl leading-tight italic">
                {names}
              </h1>
              <p className="mt-3 font-serif text-xl opacity-90">{shortDate}</p>
            </div>
          </header>
        ) : (
          <header className="relative px-8 pt-20 pb-16">
            <div className="pointer-events-none absolute inset-4 rounded-[1.6rem] border border-gold/40" />
            <Ornament className="mx-auto" />
            <p className="mt-6 text-xs tracking-[0.3em] text-gold uppercase">
              {t("cover.eyebrow")}
            </p>
            <h1 className="mt-6 font-serif text-5xl leading-[1.1] text-ink italic">
              {taklif.groomName}
              <span className="my-2 block font-serif text-3xl text-gold not-italic">
                &
              </span>
              {taklif.brideName}
            </h1>
            <p className="mt-6 font-serif text-xl text-sage">{shortDate}</p>
            <Ornament className="mx-auto mt-8 rotate-180" />
          </header>
        )}

        <Section>
          <p className="font-serif text-2xl text-ink">{t("greeting")}</p>
          <p className="mt-4 leading-relaxed text-muted">
            {t("text", {
              bride: taklif.brideName,
              groom: taklif.groomName,
            })}
          </p>
          <p className="mt-6 font-serif text-xl text-ink italic">
            {t("signature", { host: taklif.hostName })}
          </p>
        </Section>

        <Section title={t("date.title")}>
          <div className="flex items-center justify-center gap-4">
            <span className="flex h-14 w-24 items-center justify-center border-y border-gold/50 text-xs tracking-[0.2em] text-muted uppercase">
              {weekdays[date.weekday]}
            </span>
            <span className="font-serif text-7xl leading-none text-sage">
              {date.day}
            </span>
            <span className="flex h-14 w-24 items-center justify-center border-y border-gold/50 text-xs tracking-[0.2em] text-muted uppercase">
              {months[date.month]} {date.year}
            </span>
          </div>
          <p className="mt-5 font-serif text-2xl text-ink">
            {t("date.time", { time: date.time })}
          </p>
        </Section>

        <Section title={t("countdown.title")}>
          <Countdown
            eventAt={taklif.eventAt}
            boxClassName="bg-cream text-ink ring-1 ring-line"
          />
        </Section>

        <Section title={t("venue.title")}>
          <p className="font-serif text-3xl text-ink">{taklif.venueName}</p>
          <p className="mt-2 text-muted">{taklif.venueAddress}</p>
          <a
            href={taklif.locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-sage px-7 font-medium text-paper transition-colors hover:bg-sage-dark"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="size-4">
              <path
                d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12ZM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
            {t("venue.map")}
          </a>
        </Section>

        {gallery.length > 0 && (
          <Section title={t("gallery.title")}>
            <div className="grid grid-cols-2 gap-2">
              {gallery.map((photo, i) => (
                <div
                  key={photo.id}
                  className={`relative overflow-hidden rounded-2xl bg-cream ${
                    // An odd last photo spans the row instead of leaving a gap.
                    i === gallery.length - 1 && gallery.length % 2 === 1
                      ? "col-span-2 aspect-[4/3]"
                      : "aspect-[3/4]"
                  }`}
                >
                  <Image
                    src={photo.url}
                    alt=""
                    fill
                    unoptimized
                    sizes="(min-width: 768px) 224px, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Section>
        )}

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <p className="text-sm text-muted">{t("gift.text")}</p>
            <div className="mt-5 rounded-2xl bg-cream px-5 py-5 ring-1 ring-line">
              <p className="font-mono text-xl tracking-wider text-ink">
                {formatCardNumber(taklif.cardNumber)}
              </p>
              <CopyButton
                value={taklif.cardNumber}
                className="mt-3 text-sm font-medium text-sage underline-offset-4 hover:underline"
              />
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className="inline-flex h-12 items-center rounded-full px-7 font-medium text-sage ring-1 ring-sage transition-colors hover:bg-sage hover:text-paper"
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        <footer className="px-8 pt-12 pb-10">
          <Ornament className="mx-auto" />
          <p className="mt-6 font-serif text-2xl text-ink">{t("closing")}</p>
          <p className="mt-3 font-serif text-3xl text-sage italic">{names}</p>
          <Link
            href="/"
            className="mt-12 inline-block text-xs text-muted hover:text-ink"
          >
            {t("madeWith")}
          </Link>
        </footer>
      </article>
    </div>
  );
}

function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="border-t border-line/70 px-8 py-12">
      {title && (
        <h2 className="mb-6 text-xs tracking-[0.3em] text-gold uppercase">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
