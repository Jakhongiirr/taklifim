import type { CSSProperties, ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { coupleNames, formatCardNumber, formatPhone } from "@/lib/format";
import { tashkentParts } from "@/lib/tashkent-date";
import Countdown from "../shared/countdown";
import CopyButton from "../shared/copy-button";
import LetterWords from "../shared/letter-words";
import MadeWith from "../shared/made-with";
import MapLink from "../shared/map-link";
import Moments from "../shared/moments";
import { occasionMessages } from "../shared/occasion";
import Rsvp from "../shared/rsvp";
import ScrollHint from "../shared/scroll-hint";
import VenueMap from "../shared/venue-map";
import type { ThemeProps } from "../types";
import "./anor.css";
import { AnorDefs, Bough, Fruit, SeedRule } from "./art";
import { spectral, viaoda } from "./fonts";
import FruitCover from "./fruit-cover";

// A pomegranate orchard at dusk: deep garnet for the cover, hero and
// closing, cream paper between, ruby seeds, sage leaves and thin antique
// gold. Everything is drawn in SVG (./art), so the theme has no art files
// to load (public/themes/anor only holds the catalog's previews).
const INK = "text-[#3b1d20]";
const GARNET = "text-[#8c1c2c]";
const MUTED = "text-[#6b4a45]";
/** Gold deepened for words set in type, so they read on the paper. */
const GOLD_TEXT = "text-[#86632c]";
const LABEL = "text-[11px] font-semibold tracking-[0.35em] uppercase";
/** On the garnet night: cream words, a softer cream and warm gold. */
const NIGHT_MUTED = "text-[#ecd0bd]";
const NIGHT_GOLD = "text-[#e0bd78]";

/**
 * Anor: a ripe pomegranate splits open and scatters its seeds; under a
 * gold arch on garnet, a bough with the fruit crowns the couple's names.
 * Below, on cream paper, the letter, the date on a month calendar marked
 * with a pomegranate, the countdown, the venue and the guests' replies;
 * the closing words return to the garnet night.
 */
export default async function AnorTheme({
  taklif,
  preview,
  guest,
}: ThemeProps) {
  const [t, tw, tDates, tRsvp] = await Promise.all([
    getTranslations("Invitation"),
    getTranslations(occasionMessages(taklif)),
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

  return (
    <div className={spectral.className}>
      <AnorDefs />
      <FruitCover musicUrl={taklif.music?.file.url ?? null}>
        <p className={`${LABEL} ${NIGHT_MUTED}`}>{t("cover.eyebrow")}</p>
        <p
          className={`${viaoda.className} mt-5 text-[2.6rem] leading-[1.1] text-[#f6e4d3]`}
        >
          {taklif.groomName}
          <span className={`mx-2 ${NIGHT_GOLD}`}>&amp;</span>
          {taklif.brideName}
        </p>
      </FruitCover>

      <article
        className={`anor-paper mx-auto max-w-md overflow-clip text-center lining-nums ${INK} md:shadow-2xl md:shadow-[#3b1d20]/20`}
      >
        {/* Hero: the bough and the names under a gold arch, on garnet. */}
        <section className="anor-night relative flex min-h-dvh flex-col p-4 text-[#f6e4d3]">
          <div className="anor-arch flex flex-1 flex-col items-center justify-center px-6 pt-14 pb-12">
            <Bough
              className="anor-rise w-full max-w-[19rem]"
              style={{ "--i": 0 } as CSSProperties}
            />
            <p
              className={`anor-rise mt-8 ${LABEL} ${NIGHT_MUTED}`}
              style={{ "--i": 1 } as CSSProperties}
            >
              {tw("invite")}
            </p>
            <h1
              className={`anor-rise ${viaoda.className} mt-6 text-[3.5rem] leading-[1.05]`}
              style={{ "--i": 2 } as CSSProperties}
            >
              {taklif.groomName}
              <span className={`my-1 block text-4xl ${NIGHT_GOLD}`}>&amp;</span>
              {taklif.brideName}
            </h1>
            <p
              className={`anor-rise mt-6 text-xl leading-snug italic ${NIGHT_MUTED}`}
              style={{ "--i": 3 } as CSSProperties}
            >
              {t("anor.tagline")}
            </p>
            <p
              className="anor-rise mt-7 text-lg font-semibold tracking-[0.12em] uppercase"
              style={{ "--i": 4 } as CSSProperties}
            >
              {fullDate}
            </p>
            <div
              className="anor-rise mt-10"
              style={{ "--i": 5 } as CSSProperties}
            >
              <ScrollHint className="text-[#e0bd78]" />
            </div>
          </div>
        </section>

        {/* The letter, on a card with a pomegranate at its head. */}
        <section className="px-5 pt-20">
          <div className="anor-reveal relative rounded-[1.75rem] bg-[#fffaf3] px-6 pt-14 pb-10 shadow-lg shadow-[#3b1d20]/10 ring-1 ring-[#b08a45]/45">
            <div className="pointer-events-none absolute inset-2 rounded-[1.4rem] border border-[#8c1c2c]/15" />
            <Fruit className="absolute -top-9 left-1/2 w-16 -translate-x-1/2 drop-shadow-md" />
            <h2
              className={`${viaoda.className} text-[2rem] leading-tight ${GARNET}`}
            >
              {guest
                ? tw("greetingNamed", { name: guest.name })
                : tw("greeting")}
            </h2>
            <SeedRule className="mt-4" />
            <p className="mt-5 text-lg leading-relaxed">
              <LetterWords
                taklif={taklif}
                fallback={tw("text", {
                  groom: taklif.groomName,
                  bride: taklif.brideName,
                })}
              />
            </p>
          </div>
        </section>

        {taklif.photos.length > 0 && (
          <Section title={t("gallery.title")}>
            <Moments
              photos={taklif.photos}
              alt={coupleNames(taklif)}
              frameClass="anor-reveal bg-[#fffaf3] p-1.5 shadow-md shadow-[#3b1d20]/10 ring-1 ring-[#b08a45]/45"
            />
          </Section>
        )}

        <Section title={tw("dateTitle")}>
          <div className="anor-reveal">
            <p className={`${viaoda.className} text-[2rem] ${GARNET}`}>
              {t("anor.dayMonth", {
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
            <p className="mt-6 text-2xl">
              <span className={`font-semibold ${GARNET}`}>{date.time}</span>
              <span className={`mx-3 ${GOLD_TEXT}`}>—</span>
              <span className={`italic ${MUTED}`}>{t("anor.startTime")}</span>
            </p>
          </div>
          <div className="anor-reveal mt-14">
            <p className={`mb-5 ${LABEL} ${MUTED}`}>{tw("countdownTitle")}</p>
            <Countdown
              eventAt={taklif.eventAt}
              occasion={taklif.occasion}
              boxClassName="rounded-2xl bg-[#fffaf3] py-3 ring-1 ring-[#b08a45]/40"
              digitClassName={`${viaoda.className} text-[#8c1c2c]`}
            />
          </div>
        </Section>

        <Section title={t("venue.title")}>
          <div className="anor-reveal rounded-[1.75rem] bg-[#fffaf3] px-6 py-10 ring-1 ring-[#b08a45]/45">
            <p
              className={`${viaoda.className} text-[2rem] leading-tight ${GARNET}`}
            >
              {taklif.venueName}
            </p>
            <p className={`mt-3 text-lg ${MUTED}`}>{taklif.venueAddress}</p>
            <VenueMap
              taklif={taklif}
              className="mt-6 overflow-hidden rounded-2xl ring-1 ring-[#b08a45]/45"
            />
            <MapLink
              taklif={taklif}
              className="mt-7 inline-flex h-11 items-center rounded-full bg-[#8c1c2c] px-7 text-xs font-semibold tracking-[0.22em] text-[#fbefe6] uppercase transition-colors hover:bg-[#6f1422]"
            >
              {t("venue.map")}
            </MapLink>
          </div>
        </Section>

        <Section title={tRsvp("title")}>
          <div className="anor-reveal text-lg">
            <Rsvp
              slug={taklif.slug}
              guest={guest}
              preview={preview}
              palette={{
                input:
                  "rounded-2xl bg-[#fffaf3] ring-1 ring-[#b08a45]/45 focus:ring-[#8c1c2c]",
                optionOn: "rounded-2xl bg-[#8c1c2c] text-[#fbefe6]",
                optionOff: "rounded-2xl bg-[#fffaf3] ring-1 ring-[#b08a45]/45",
                button:
                  "rounded-full bg-[#8c1c2c] text-[#fbefe6] hover:bg-[#6f1422]",
                muted: "text-[#6b4a45]",
                accent: "text-[#8c1c2c]",
                error: "text-red-700",
              }}
            />
          </div>
        </Section>

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <div className="anor-reveal rounded-[1.75rem] bg-[#fffaf3] px-6 py-8 ring-1 ring-[#b08a45]/45">
              <p className={`text-lg italic ${MUTED}`}>{t("gift.text")}</p>
              <p className="mt-4 font-mono text-xl tracking-wider">
                {formatCardNumber(taklif.cardNumber)}
              </p>
              <CopyButton
                value={taklif.cardNumber}
                className={`mt-5 rounded-full px-5 py-2 text-xs font-semibold tracking-[0.2em] uppercase ring-1 ring-[#8c1c2c]/50 hover:bg-[#f9ecdb] ${GARNET}`}
              />
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className={`anor-reveal inline-flex min-h-11 items-center rounded-full px-5 py-2 text-xs font-semibold tracking-[0.15em] uppercase ring-1 ring-[#8c1c2c]/50 hover:bg-[#fffaf3] ${GARNET}`}
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        {/* The closing words and the hosts' signature, back on garnet. */}
        <footer className="anor-night mt-24 px-6 pt-16 pb-14 text-[#f6e4d3]">
          <div className="anor-reveal">
            <Bough className="mx-auto w-full max-w-[17rem]" />
            <p
              className={`${viaoda.className} mt-8 text-[2.6rem] leading-tight`}
            >
              {t("closing")}
            </p>
            <p className={`mt-6 text-xl italic ${NIGHT_MUTED}`}>
              {tw("signature", { host: taklif.hostName })}
            </p>
          </div>
          <p
            aria-hidden
            className={`${viaoda.className} mt-12 text-3xl tracking-[0.3em] ${NIGHT_GOLD}`}
          >
            {taklif.groomName[0]} · {taklif.brideName[0]}
          </p>
          <MadeWith className="mt-8 text-[#ecd0bd]" />
        </footer>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-5 pt-20">
      <div className="anor-reveal mb-8">
        <h2 className={`${viaoda.className} text-[2.1rem] ${GARNET}`}>
          {title}
        </h2>
        <SeedRule className="mt-2" />
      </div>
      {children}
    </section>
  );
}

/**
 * The event's month, Monday first (as in `Dates.weekdaysShort`), with the
 * day set on a small pomegranate.
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
    <div className="mx-auto mt-8 max-w-xs rounded-[1.75rem] bg-[#fffaf3] px-4 py-5 ring-1 ring-[#b08a45]/45">
      <p className={`${LABEL} ${MUTED}`}>{title}</p>
      <div className="mt-4 grid grid-cols-7 gap-y-1.5 text-lg">
        {weekdays.map((w) => (
          <span
            key={w}
            className={`pb-1 text-xs font-semibold tracking-wider uppercase ${GOLD_TEXT}`}
          >
            {w}
          </span>
        ))}
        {cells.map((n, i) =>
          n === day ? (
            <span
              key={i}
              className="relative flex h-9 items-center justify-center font-semibold text-[#fbefe6] [text-shadow:0_1px_2px_rgb(60_8_16/0.5)]"
            >
              <Fruit className="absolute -top-2 h-11" />
              <span className="relative mt-1.5">{n}</span>
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
