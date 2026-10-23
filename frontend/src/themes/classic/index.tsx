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
import ScrollHint from "../shared/scroll-hint";
import VenueMap from "../shared/venue-map";
import LetterText from "../shared/letter-text";
import { occasionMessages } from "../shared/occasion";
import type { ThemeProps } from "../types";
import "./classic.css";
import { cormorant } from "./fonts";
import SealCover from "./seal-cover";

// A traditional printed invitation: ivory paper, dark ink, antique gold
// rules and a burgundy wax seal. Everything is drawn in CSS and SVG, so
// the theme has no art files to load (public/themes/classic only holds the
// catalog's previews).
const INK = "text-[#2b2420]";
const GOLD = "text-[#a8894f]";
const WINE = "text-[#7a1f2b]";
/** GOLD deepened for words and marks set in type, so they read on the paper. */
const GOLD_TEXT = "text-[#957946]";
const LABEL =
  "text-[11px] font-semibold tracking-[0.35em] text-[#6f614e] uppercase";

/**
 * Classic: an envelope closed with a wax seal opens onto a framed card
 * with the couple's names; below, the letter, the date on a month
 * calendar, the countdown, the venue and the guests' replies, each under a
 * gold flourish.
 */
export default async function ClassicTheme({
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
  const initials = `${taklif.groomName[0]}·${taklif.brideName[0]}`;

  return (
    <div className={cormorant.className}>
      <SealCover
        musicUrl={taklif.music?.file.url ?? null}
        initials={initials}
        card={
          <>
            <p className={`text-[9px] ${LABEL}`}>{t("cover.eyebrow")}</p>
            <p className={`mt-2 text-2xl leading-tight italic ${INK}`}>
              {taklif.groomName}
              <span className={`mx-1.5 ${GOLD_TEXT}`}>&amp;</span>
              {taklif.brideName}
            </p>
          </>
        }
      >
        <p className={LABEL}>{t("cardGreeting.title")}</p>
        <p className={`mt-4 text-5xl italic ${INK}`}>{t("cover.eyebrow")}</p>
        <Flourish className="mt-4" />
      </SealCover>

      <article
        className={`classic-paper mx-auto max-w-md overflow-clip text-center lining-nums ${INK} md:shadow-2xl md:shadow-[#2b2420]/15`}
      >
        {/* Hero: the card from the envelope, in a double gold frame. */}
        <section className="relative flex min-h-dvh flex-col p-4">
          <Frame
            outerClassName="flex flex-1 flex-col"
            className="flex flex-1 flex-col items-center justify-center px-6 py-16"
          >
            <p
              className={`classic-rise ${LABEL}`}
              style={{ "--i": 0 } as CSSProperties}
            >
              {tw("invite")}
            </p>
            <h1
              className="classic-rise mt-8 text-[3.4rem] leading-[1.05] font-medium italic"
              style={{ "--i": 1 } as CSSProperties}
            >
              {taklif.groomName}
              <span className={`my-2 block text-4xl font-normal ${GOLD_TEXT}`}>
                &amp;
              </span>
              {taklif.brideName}
            </h1>
            <div className="classic-rise" style={{ "--i": 2 } as CSSProperties}>
              <Flourish className="mt-8" />
              <p className="mt-6 text-xl leading-snug text-[#5a4c3e] italic">
                {t("classic.tagline")}
              </p>
            </div>
            <p
              className="classic-rise mt-8 text-lg font-semibold tracking-[0.12em] uppercase"
              style={{ "--i": 3 } as CSSProperties}
            >
              {fullDate}
            </p>
            <div
              className="classic-rise mt-12"
              style={{ "--i": 4 } as CSSProperties}
            >
              <ScrollHint className="text-[#7b643a]" />
            </div>
          </Frame>
        </section>

        {/* The letter. */}
        <section className="px-6 pt-16">
          <div className="classic-reveal">
            <Monogram initials={initials} />
            <h2 className={`mt-6 text-3xl font-medium italic ${WINE}`}>
              {guest
                ? tw("greetingNamed", { name: guest.name })
                : tw("greeting")}
            </h2>
            <p className="mt-5 text-xl leading-relaxed">
              <LetterText
                text={tw("text", {
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
              frameClass="classic-reveal bg-[#fffdf8] p-1.5 shadow-md shadow-[#2b2420]/10 ring-1 ring-[#a8894f]/45"
            />
          </Section>
        )}

        <Section title={tw("dateTitle")}>
          <div className="classic-reveal">
            <p className="text-3xl font-medium">
              {t("classic.dayMonth", {
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
              <span className={`font-semibold ${WINE}`}>{date.time}</span>
              <span className={`mx-3 ${GOLD_TEXT}`}>—</span>
              <span className="text-[#5a4c3e] italic">
                {t("classic.startTime")}
              </span>
            </p>
          </div>
          <div className="classic-reveal mt-14">
            <p className={`mb-5 ${LABEL}`}>{tw("countdownTitle")}</p>
            <Countdown
              eventAt={taklif.eventAt}
              occasion={taklif.occasion}
              boxClassName="border-y border-[#a8894f]/45 py-3"
            />
          </div>
        </Section>

        <Section title={t("venue.title")}>
          <div className="classic-reveal">
            <Frame className="px-6 py-10">
              <p className={`text-3xl font-medium italic ${WINE}`}>
                {taklif.venueName}
              </p>
              <p className="mt-3 text-lg text-[#5a4c3e]">
                «{taklif.venueAddress}»
              </p>
              <VenueMap
                taklif={taklif}
                className="mt-6 rounded-sm ring-1 ring-[#a8894f]/45"
              />
              <MapLink
                taklif={taklif}
                className="mt-7 inline-flex h-11 items-center rounded-sm bg-[#2b2420] px-6 text-xs font-semibold tracking-[0.25em] text-[#faf6ee] uppercase transition-colors hover:bg-[#7a1f2b]"
              >
                {t("venue.map")}
              </MapLink>
            </Frame>
          </div>
        </Section>

        <Section title={tRsvp("title")}>
          <div className="classic-reveal text-lg">
            <Rsvp
              slug={taklif.slug}
              guest={guest}
              preview={preview}
              palette={{
                input:
                  "rounded-sm bg-[#fffdf8] ring-1 ring-[#a8894f]/40 focus:ring-[#7a1f2b]",
                optionOn: "rounded-sm bg-[#2b2420] text-[#faf6ee]",
                optionOff: "rounded-sm bg-[#fffdf8] ring-1 ring-[#a8894f]/40",
                button:
                  "rounded-sm bg-[#7a1f2b] text-[#faf6ee] hover:bg-[#5f1721]",
                muted: "text-[#6f614e]",
                accent: "text-[#7a1f2b]",
                error: "text-red-700",
              }}
            />
          </div>
        </Section>

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <div className="classic-reveal">
              <Frame className="px-6 py-8">
                <p className="text-lg text-[#5a4c3e] italic">
                  {t("gift.text")}
                </p>
                <p className="mt-4 font-mono text-xl tracking-wider">
                  {formatCardNumber(taklif.cardNumber)}
                </p>
                <CopyButton
                  value={taklif.cardNumber}
                  className="mt-5 rounded-sm px-5 py-2 text-xs font-semibold tracking-[0.2em] uppercase ring-1 ring-[#a8894f]/70 hover:bg-[#fffdf8]"
                />
              </Frame>
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className="classic-reveal inline-flex min-h-11 items-center rounded-sm px-5 py-2 text-xs font-semibold tracking-[0.15em] uppercase ring-1 ring-[#a8894f]/70 hover:bg-[#fffdf8]"
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        {/* The closing words and the hosts' signature. */}
        <footer className="px-6 pt-24 pb-14">
          <div className="classic-reveal">
            <Flourish />
            <p className={`mt-8 text-4xl italic ${WINE}`}>{t("closing")}</p>
            <p className="mt-6 text-xl text-[#5a4c3e] italic">
              {tw("signature", { host: taklif.hostName })}
            </p>
          </div>
          <p
            aria-hidden
            className={`mt-12 text-2xl tracking-[0.3em] italic ${GOLD_TEXT}`}
          >
            {taklif.groomName[0]} ♡ {taklif.brideName[0]}
          </p>
          <MadeWith className="mt-8 text-[#6f614e]" />
        </footer>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-6 pt-20">
      <div className="classic-reveal mb-8">
        <h2 className={`${LABEL} text-xs`}>{title}</h2>
        <Flourish className="mt-3" />
      </div>
      {children}
    </section>
  );
}

/** A thin double gold rule with a flourish in each corner. */
function Frame({
  className = "",
  outerClassName = "",
  children,
}: {
  /** The inner panel (padding, layout). */
  className?: string;
  /** The outer rule (e.g. to fill a column). */
  outerClassName?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative border border-[#a8894f]/60 p-1.5 ${outerClassName}`}
    >
      <div className={`border border-[#a8894f]/35 ${className}`}>
        {children}
      </div>
      {(
        [
          "top-0 left-0",
          "top-0 right-0 -scale-x-100",
          "bottom-0 left-0 -scale-y-100",
          "right-0 bottom-0 -scale-100",
        ] as const
      ).map((place) => (
        <svg
          key={place}
          aria-hidden
          viewBox="0 0 40 40"
          className={`absolute size-10 ${place} ${GOLD}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
        >
          <path d="M3 18 V3 H18" />
          <path d="M3 3 C9 9 14 10 20 8 C16 13 12 15 7 14" />
          <path d="M3 3 C9 9 10 14 8 20 C13 16 15 12 14 7" />
          <circle cx="11" cy="11" r="1.4" fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}

/** A gold rule with a small heart between two scrolls. */
function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 220 20"
      className={`mx-auto h-5 w-52 ${GOLD} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
    >
      <path d="M6 10 H84 M136 10 H214" />
      <path d="M84 10 C90 4 96 4 98 8 C99 11 96 13 94 11" />
      <path d="M136 10 C130 4 124 4 122 8 C121 11 124 13 126 11" />
      <path
        d="M110 15 C104 11 101 8 101 6 C101 4 103 3 105 3 C107 3 109 5 110 6 C111 5 113 3 115 3 C117 3 119 4 119 6 C119 8 116 11 110 15Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

/** The couple's initials in a gold ring with a laurel under it. */
function Monogram({ initials }: { initials: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className={`mx-auto size-24 ${GOLD}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
    >
      <circle cx="50" cy="46" r="30" />
      <circle cx="50" cy="46" r="27" strokeOpacity="0.5" />
      <text
        x="50"
        y="48"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#7a1f2b"
        stroke="none"
        fontSize="20"
        fontStyle="italic"
        fontFamily="inherit"
      >
        {initials}
      </text>
      <path d="M30 82 C38 90 46 92 50 92 C54 92 62 90 70 82" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path
            d={`M${36 + i * 4.5} ${85.5 + i * 2.2} c-4 -1 -6 -4 -6 -7 c3 0 5 3 6 7z`}
            fill="currentColor"
            stroke="none"
          />
          <path
            d={`M${64 - i * 4.5} ${85.5 + i * 2.2} c4 -1 6 -4 6 -7 c-3 0 -5 3 -6 7z`}
            fill="currentColor"
            stroke="none"
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * The event's month, Monday first (as in `Dates.weekdaysShort`), with the
 * day ringed by a burgundy heart.
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
    <div className="mx-auto mt-8 max-w-xs border-y border-[#a8894f]/45 py-5">
      <p className={`${LABEL} text-xs`}>{title}</p>
      <div className="mt-4 grid grid-cols-7 gap-y-1.5 text-lg">
        {weekdays.map((w) => (
          <span
            key={w}
            className="pb-1 text-xs font-semibold tracking-wider text-[#7b643a] uppercase"
          >
            {w}
          </span>
        ))}
        {cells.map((n, i) =>
          n === day ? (
            <span
              key={i}
              className="relative flex h-9 items-center justify-center font-semibold text-[#faf6ee]"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 22"
                className="absolute size-9 text-[#7a1f2b]"
              >
                <path
                  d="M12 21 C5 16 1 12 1 7.5 C1 4 3.6 1.5 6.8 1.5 C9 1.5 11 2.8 12 4.6 C13 2.8 15 1.5 17.2 1.5 C20.4 1.5 23 4 23 7.5 C23 12 19 16 12 21Z"
                  fill="currentColor"
                />
              </svg>
              <span className="relative -mt-0.5">{n}</span>
            </span>
          ) : (
            <span
              key={i}
              className="flex h-9 items-center justify-center text-[#5a4c3e]"
            >
              {n}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
