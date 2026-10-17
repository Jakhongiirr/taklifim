import type { CSSProperties, ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { coupleNames, formatCardNumber, formatPhone } from "@/lib/format";
import { tashkentParts } from "@/lib/tashkent-date";
import Countdown from "../shared/countdown";
import CopyButton from "../shared/copy-button";
import MapLink from "../shared/map-link";
import Moments from "../shared/moments";
import MadeWith from "../shared/made-with";
import Rsvp from "../shared/rsvp";
import type { ThemeProps } from "../types";
import "./lavel.css";
import { garamond, lavelScript } from "./fonts";
import GateCover from "./gate-cover";
import { Bouquet, Divider, Sprig, Wreath } from "./lavender";

// A lavender field in summer: lilac paper, plum ink, sprigs of lavender
// and sage stems. Everything is drawn in CSS and SVG, so the theme has no
// art files to load (public/themes/lavel only holds the catalog's
// previews).
const INK = "text-[#43345e]";
const MUTED = "text-[#6e6283]";
const LILAC = "text-[#8a73c0]";
const PLUM = "text-[#6f58a8]";
const SCRIPT = `${lavelScript} font-normal not-italic`;
const LABEL =
  "text-[11px] font-semibold tracking-[0.35em] text-[#7d6c99] uppercase";

/**
 * Lavel: a folded lilac card sealed with lavender wax opens onto a
 * greeting and a bouquet; below, the couple's names under an arch, the
 * letter, photos, the date on a month calendar, the countdown, the venue,
 * the guests' replies and the hosts' warm wishes.
 */
export default async function LavelTheme({ taklif, preview }: ThemeProps) {
  const [t, tDates, tRsvp] = await Promise.all([
    getTranslations("Invitation"),
    getTranslations("Dates"),
    getTranslations("Rsvp"),
  ]);
  const months = tDates.raw("months") as string[];
  const monthsStandalone = tDates.raw("monthsStandalone") as string[];
  const weekdays = tDates.raw("weekdays") as string[];
  const weekdaysShort = tDates.raw("weekdaysShort") as string[];
  const date = tashkentParts(taklif.eventAt);
  const fullDate = tDates("dateTime", {
    day: date.day,
    month: months[date.month],
    year: date.year,
    time: date.time,
  });
  const initials = `${taklif.groomName[0]} ♡ ${taklif.brideName[0]}`;

  return (
    <div className={`${garamond.className} lavel-paper`}>
      <GateCover
        musicUrl={taklif.music?.file.url ?? null}
        initials={initials}
      />

      <article
        className={`lavel-paper mx-auto max-w-md overflow-clip text-center lining-nums ${INK} md:shadow-2xl md:shadow-[#43345e]/15`}
      >
        {/* Hero: the greeting, with a bouquet. */}
        <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pt-14 pb-10">
          <Sprig
            bend={10}
            className="pointer-events-none absolute -top-4 -left-3 h-48 w-12 rotate-[200deg] opacity-80"
          />
          <Sprig
            bend={-10}
            className="pointer-events-none absolute -top-4 -right-3 h-48 w-12 -rotate-[200deg] opacity-80"
          />
          <p
            className={`lavel-rise ${LABEL}`}
            style={{ "--i": 0 } as CSSProperties}
          >
            {t("lavel.hello")}
          </p>
          <h1
            className={`lavel-rise mt-5 text-[min(5rem,16vw)] leading-none ${SCRIPT} ${PLUM}`}
            style={{ "--i": 1 } as CSSProperties}
          >
            {t("cover.eyebrow")}
          </h1>
          <p
            className={`lavel-rise mt-4 max-w-xs text-xl leading-snug italic ${MUTED}`}
            style={{ "--i": 2 } as CSSProperties}
          >
            {t("lavel.invite")}
          </p>
          <div
            className="lavel-rise mt-8"
            style={{ "--i": 3 } as CSSProperties}
          >
            <Bouquet className="lavel-sway mx-auto h-56 w-40" />
          </div>
          <p
            className="lavel-rise mt-6 text-base font-semibold tracking-[0.14em] uppercase"
            style={{ "--i": 4 } as CSSProperties}
          >
            {fullDate}
          </p>
          <div
            className="lavel-rise mt-10"
            style={{ "--i": 5 } as CSSProperties}
          >
            <p className={`text-[10px] ${LABEL}`}>{t("lavel.scroll")}</p>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className={`lavel-hint mx-auto mt-2 size-5 ${LILAC}`}
            >
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </section>

        {/* The couple, under an arch. */}
        <section className="px-6 pt-12">
          <div className="lavel-reveal">
            <p className={LABEL}>{t("lavel.ceremony")}</p>
            <Divider className="mt-3" />
          </div>
          <div className="lavel-reveal relative mx-auto mt-8 max-w-[19rem] rounded-t-full border border-[#a690d4]/55 p-2">
            <div className="rounded-t-full border border-[#a690d4]/35 bg-[#fdfbff]/70 px-6 pt-16 pb-10">
              <div className="relative mx-auto -mt-6 mb-3 size-20">
                <Wreath r={38} className="absolute inset-0" />
                <p
                  aria-hidden
                  className={`relative flex size-full items-center justify-center text-lg italic ${PLUM}`}
                >
                  {taklif.groomName[0]}&thinsp;·&thinsp;{taklif.brideName[0]}
                </p>
              </div>
              <h2
                className={`text-[min(4rem,15vw)] leading-[1.05] [overflow-wrap:anywhere] ${SCRIPT}`}
              >
                {taklif.groomName}
                <span className={`block text-4xl leading-tight ${LILAC}`}>
                  &amp;
                </span>
                {taklif.brideName}
              </h2>
              <p className={`mt-6 text-lg leading-snug italic ${MUTED}`}>
                {t("lavel.tagline")}
              </p>
            </div>
            <Sprig
              bend={6}
              className="absolute -bottom-3 -left-5 h-32 w-8 rotate-[22deg]"
            />
            <Sprig
              bend={-6}
              className="absolute -right-5 -bottom-3 h-32 w-8 -rotate-[22deg]"
            />
          </div>
        </section>

        {/* The letter. */}
        <section className="px-6 pt-20">
          <div className="lavel-reveal">
            <h2 className={`text-5xl ${SCRIPT} ${PLUM}`}>{t("greeting")}</h2>
            <p className="mt-5 text-lg leading-relaxed">
              {t("text", {
                groom: taklif.groomName,
                bride: taklif.brideName,
              })}
            </p>
          </div>
        </section>

        {taklif.photos.length > 0 && (
          <Section title={t("gallery.title")}>
            <Moments
              photos={taklif.photos}
              alt={coupleNames(taklif)}
              frameClass="lavel-reveal rounded-2xl bg-[#fdfbff] p-1.5 shadow-md shadow-[#43345e]/10 ring-1 ring-[#a690d4]/50"
            />
          </Section>
        )}

        <Section title={t("date.title")}>
          <div className="lavel-reveal">
            <p className="text-2xl font-medium">
              {t("lavel.dayMonth", {
                day: date.day,
                month: months[date.month],
                weekday: weekdays[date.weekday],
              })}
            </p>
            <Calendar
              year={date.year}
              month={date.month}
              day={date.day}
              title={`${monthsStandalone[date.month]} ${date.year}`}
              weekdays={weekdaysShort}
            />
            <p className="mt-6 text-xl">
              <span className={`font-semibold ${PLUM}`}>{date.time}</span>
              <span className={`mx-3 ${LILAC}`}>—</span>
              <span className={`italic ${MUTED}`}>{t("lavel.startTime")}</span>
            </p>
          </div>
          <div className="lavel-reveal mt-14">
            <p className={`mb-5 ${LABEL}`}>{t("countdown.title")}</p>
            <Countdown
              eventAt={taklif.eventAt}
              boxClassName="rounded-2xl bg-[#fdfbff]/80 py-3 ring-1 ring-[#a690d4]/40"
            />
            <p className={`mt-6 text-lg italic ${MUTED}`}>
              {t("lavel.awaiting")}
            </p>
          </div>
        </Section>

        <Section title={t("venue.title")}>
          <div className="lavel-reveal rounded-3xl bg-[#fdfbff]/80 px-6 py-10 ring-1 ring-[#a690d4]/45">
            <Sprig bend={4} className="mx-auto -mt-2 mb-4 h-16 w-4" />
            <p className={`text-2xl font-medium ${PLUM}`}>{taklif.venueName}</p>
            <p className={`mt-3 text-lg ${MUTED}`}>{taklif.venueAddress}</p>
            <MapLink
              url={taklif.locationUrl}
              className="mt-7 inline-flex h-11 items-center rounded-full bg-[#6f58a8] px-7 text-xs font-semibold tracking-[0.22em] text-[#fbf8fe] uppercase transition-colors hover:bg-[#574289]"
            >
              {t("venue.map")}
            </MapLink>
          </div>
        </Section>

        <Section title={tRsvp("title")}>
          <div className="lavel-reveal text-lg">
            <Rsvp
              slug={taklif.slug}
              preview={preview}
              palette={{
                input:
                  "rounded-xl bg-[#fdfbff] ring-1 ring-[#a690d4]/45 focus:ring-[#6f58a8]",
                optionOn: "rounded-xl bg-[#6f58a8] text-[#fbf8fe]",
                optionOff: "rounded-xl bg-[#fdfbff] ring-1 ring-[#a690d4]/45",
                button:
                  "rounded-full bg-[#6f58a8] text-[#fbf8fe] hover:bg-[#574289]",
                muted: "text-[#7d6c99]",
                accent: "text-[#6f58a8]",
                error: "text-red-700",
              }}
            />
          </div>
        </Section>

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <div className="lavel-reveal rounded-3xl bg-[#fdfbff]/80 px-6 py-8 ring-1 ring-[#a690d4]/45">
              <p className={`text-lg italic ${MUTED}`}>{t("gift.text")}</p>
              <p className="mt-4 font-mono text-xl tracking-wider">
                {formatCardNumber(taklif.cardNumber)}
              </p>
              <CopyButton
                value={taklif.cardNumber}
                className="mt-5 rounded-full px-5 py-2 text-xs font-semibold tracking-[0.2em] uppercase ring-1 ring-[#a690d4]/80 hover:bg-[#f1eafa]"
              />
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className="lavel-reveal inline-flex min-h-11 items-center rounded-full px-5 py-2 text-xs font-semibold tracking-[0.15em] uppercase ring-1 ring-[#a690d4]/80 hover:bg-[#fdfbff]"
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        {/* The hosts' warm wishes and their signature. */}
        <footer className="relative overflow-hidden px-6 pt-24 pb-14">
          <div className="lavel-reveal">
            <p className={LABEL}>{t("lavel.wishTitle")}</p>
            <Divider className="mt-3" />
            <p className="mt-8 text-lg leading-relaxed">{t("lavel.wish")}</p>
            <p className={`mt-8 text-5xl ${SCRIPT} ${PLUM}`}>{t("closing")}</p>
            <p className={`mt-6 text-lg italic ${MUTED}`}>
              {t("signature", { host: taklif.hostName })}
            </p>
          </div>
          <Bouquet className="lavel-reveal mx-auto mt-10 h-36 w-28" />
          <p
            aria-hidden
            className={`mt-6 text-xl tracking-[0.3em] italic ${LILAC}`}
          >
            {initials}
          </p>
          <MadeWith className="mt-8 text-sm text-[#7d6c99]" />
        </footer>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-6 pt-20">
      <div className="lavel-reveal mb-8">
        <h2 className={`${LABEL} text-xs`}>{title}</h2>
        <Divider className="mt-3" />
      </div>
      {children}
    </section>
  );
}

/**
 * The event's month, Monday first (as in `Dates.weekdaysShort`), with the
 * day inside a small lavender wreath.
 */
function Calendar({
  year,
  month,
  day,
  title,
  weekdays,
}: {
  year: number;
  month: number;
  day: number;
  title: string;
  weekdays: string[];
}) {
  const lead = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const length = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length }, (_, i) => i + 1),
  ];

  return (
    <div className="mx-auto mt-8 max-w-xs rounded-3xl bg-[#fdfbff]/80 px-4 py-5 ring-1 ring-[#a690d4]/40">
      <p className={`${LABEL} text-xs`}>{title}</p>
      <div className="mt-4 grid grid-cols-7 gap-y-1.5 text-base">
        {weekdays.map((w) => (
          <span
            key={w}
            className={`pb-1 text-xs font-semibold tracking-wider uppercase ${LILAC}`}
          >
            {w}
          </span>
        ))}
        {cells.map((n, i) =>
          n === day ? (
            <span
              key={i}
              className={`relative flex h-9 items-center justify-center font-semibold ${PLUM}`}
            >
              <Wreath r={38} count={16} className="absolute size-11" />
              <span className="relative">{n}</span>
            </span>
          ) : (
            <span
              key={i}
              className={`flex h-9 items-center justify-center ${MUTED}`}
            >
              {n}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
