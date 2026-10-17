import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
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
import "./plov.css";
import { lora, oldStandard } from "./fonts";
import LidCover, { PLOV_IMAGE } from "./lid-cover";
import { PlatterRim, Rosette, StarRule } from "./ornaments";

// A morning plov ("nahorgi osh") invitation: warm ivory, gold girih and
// islimi ornaments, and a lagan of plov at its heart. The ornaments are
// SVG; the only art file is the plov photo (public/themes/plov/plov.webp).
const INK = "text-[#3b2a1a]";
const GOLD = "text-[#b08a45]";
const SAFFRON = "text-[#a4501f]";
const SOFT = "text-[#6b5640]";
const LABEL =
  "text-[11px] font-semibold tracking-[0.35em] text-[#8a6a2f] uppercase";
const NAMES = `${oldStandard.className} italic`;

/**
 * Plov: a platter under a domed lid opens onto the plov; below, the
 * hosts' invitation, the photos, the date and the time the plov is
 * served, the countdown, the venue and the guests' replies, each under a
 * gold star rule.
 */
export default async function PlovTheme({ taklif, preview }: ThemeProps) {
  const [t, tDates, tRsvp] = await Promise.all([
    getTranslations("Invitation"),
    getTranslations("Dates"),
    getTranslations("Rsvp"),
  ]);
  const months = tDates.raw("months") as string[];
  const weekdays = tDates.raw("weekdays") as string[];
  const date = tashkentParts(taklif.eventAt);
  const names = { groom: taklif.groomName, bride: taklif.brideName };

  return (
    <div className={lora.className}>
      <LidCover musicUrl={taklif.music?.file.url ?? null}>
        <Rosette className="mx-auto size-12" />
        <p className={`mt-4 ${LABEL}`}>{t("plov.eyebrow")}</p>
        <p className={`mt-3 text-4xl leading-tight ${NAMES} ${INK}`}>
          {taklif.groomName}
          <span className={`mx-2 ${GOLD}`}>&amp;</span>
          {taklif.brideName}
        </p>
      </LidCover>

      <article
        className={`plov-paper mx-auto max-w-md overflow-clip text-center lining-nums ${INK} md:shadow-2xl md:shadow-[#3b2a1a]/15`}
      >
        {/* Hero: under a gold arch, like a peshtoq's portal. */}
        <section className="relative flex min-h-dvh flex-col p-4 pt-6">
          <div className="flex flex-1 flex-col rounded-t-full border border-[#b08a45]/60 p-1.5">
            <div className="flex flex-1 flex-col items-center justify-center rounded-t-full border border-[#b08a45]/35 px-6 pt-24 pb-12">
              <div className="plov-rise" style={{ "--i": 0 } as CSSProperties}>
                <Rosette className="mx-auto size-14" />
                <p className={`mt-5 ${LABEL}`}>{t("plov.eyebrow")}</p>
              </div>
              <h1
                className={`plov-rise mt-6 text-[3.1rem] leading-[1.05] ${NAMES}`}
                style={{ "--i": 1 } as CSSProperties}
              >
                {taklif.groomName}
                <span className={`my-1 block text-3xl not-italic ${GOLD}`}>
                  &amp;
                </span>
                {taklif.brideName}
              </h1>
              <p
                className={`plov-rise mt-5 text-lg italic ${SOFT}`}
                style={{ "--i": 2 } as CSSProperties}
              >
                {t("plov.occasion")}
              </p>

              {/* The plov on its lagan. */}
              <div
                className="plov-rise relative mt-8 aspect-square w-56"
                style={{ "--i": 3 } as CSSProperties}
              >
                <div className="absolute inset-[15%] overflow-hidden rounded-full bg-[#e9d7b0]">
                  <Image
                    src={PLOV_IMAGE}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <PlatterRim className="plov-turn absolute inset-0 size-full drop-shadow-[0_14px_20px_rgba(59,42,26,0.2)]" />
              </div>

              <p
                className="plov-rise mt-8 text-lg font-semibold tracking-[0.12em] uppercase"
                style={{ "--i": 4 } as CSSProperties}
              >
                {tDates("dateTime", {
                  day: date.day,
                  month: months[date.month],
                  year: date.year,
                  time: date.time,
                })}
              </p>
              <div
                className="plov-rise mt-10"
                style={{ "--i": 5 } as CSSProperties}
              >
                <p className={`text-[10px] ${LABEL}`}>{t("plov.scroll")}</p>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className={`plov-hint mx-auto mt-2 size-5 ${GOLD}`}
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
            </div>
          </div>
        </section>

        {/* The hosts' invitation. */}
        <section className="px-6 pt-16">
          <div className="plov-reveal">
            <StarRule />
            <h2 className={`mt-6 text-3xl ${NAMES} ${SAFFRON}`}>
              {t("greeting")}
            </h2>
            <p className="mt-5 text-lg leading-relaxed">
              {t("plov.text", names)}
            </p>
          </div>
        </section>

        {taklif.photos.length > 0 && (
          <Section title={t("gallery.title")}>
            <Moments
              photos={taklif.photos}
              alt={coupleNames(taklif)}
              frameClass="plov-reveal rounded-2xl bg-[#fffaf0] p-1.5 shadow-md shadow-[#3b2a1a]/10 ring-1 ring-[#b08a45]/45"
            />
          </Section>
        )}

        <Section title={t("plov.dateTitle")}>
          <div className="plov-reveal">
            <div className="flex items-center justify-center gap-5">
              <p className={`w-24 text-right text-lg ${SOFT}`}>
                {weekdays[date.weekday]}
              </p>
              <div className="relative flex size-28 items-center justify-center">
                <svg
                  aria-hidden
                  viewBox="0 0 100 100"
                  className="absolute inset-0 size-full"
                  fill="#fffaf0"
                  stroke="#b08a45"
                  strokeWidth="1"
                >
                  <rect x="18" y="18" width="64" height="64" />
                  <rect
                    x="18"
                    y="18"
                    width="64"
                    height="64"
                    transform="rotate(45 50 50)"
                  />
                  <circle cx="50" cy="50" r="30" strokeOpacity="0.5" />
                </svg>
                <span
                  className={`relative text-5xl font-bold ${oldStandard.className}`}
                >
                  {date.day}
                </span>
              </div>
              <p className={`w-24 text-left text-lg ${SOFT}`}>
                {months[date.month]}
                <br />
                {date.year}
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-xs border-y border-[#b08a45]/45 py-5">
              <p className={LABEL}>{t("plov.served")}</p>
              <p
                className={`mt-2 text-6xl font-bold tabular-nums ${oldStandard.className} ${SAFFRON}`}
              >
                {date.time}
              </p>
            </div>
          </div>
          <div className="plov-reveal mt-14">
            <p className={`mb-5 ${LABEL}`}>{t("plov.countdown")}</p>
            <Countdown
              eventAt={taklif.eventAt}
              boxClassName="rounded-2xl bg-[#fffaf0] py-3 ring-1 ring-[#b08a45]/35"
            />
          </div>
        </Section>

        <Section title={t("venue.title")}>
          <div className="plov-reveal rounded-t-[7rem] border border-[#b08a45]/55 bg-[#fffaf0]/70 px-6 pt-14 pb-10">
            <p className={`text-3xl ${NAMES} ${SAFFRON}`}>{taklif.venueName}</p>
            <p className={`mt-3 text-lg ${SOFT}`}>{taklif.venueAddress}</p>
            <MapLink
              url={taklif.locationUrl}
              className="mt-7 inline-flex h-11 items-center rounded-full bg-[#3b2a1a] px-6 text-xs font-semibold tracking-[0.25em] text-[#faf6ec] uppercase transition-colors hover:bg-[#a4501f]"
            >
              {t("venue.map")}
            </MapLink>
          </div>
        </Section>

        <Section title={tRsvp("title")}>
          <div className="plov-reveal text-lg">
            <Rsvp
              slug={taklif.slug}
              preview={preview}
              subtitle={t("plov.rsvpSubtitle")}
              palette={{
                input:
                  "rounded-xl bg-[#fffaf0] ring-1 ring-[#b08a45]/40 focus:ring-[#a4501f]",
                optionOn: "rounded-xl bg-[#3b2a1a] text-[#faf6ec]",
                optionOff: "rounded-xl bg-[#fffaf0] ring-1 ring-[#b08a45]/40",
                button:
                  "rounded-full bg-[#a4501f] text-[#faf6ec] hover:bg-[#87401a]",
                muted: "text-[#8a6a2f]",
                accent: "text-[#a4501f]",
                error: "text-red-700",
              }}
            />
          </div>
        </Section>

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <div className="plov-reveal rounded-2xl border border-[#b08a45]/55 bg-[#fffaf0]/70 px-6 py-8">
              <p className={`text-lg italic ${SOFT}`}>{t("gift.text")}</p>
              <p className="mt-4 font-mono text-xl tracking-wider">
                {formatCardNumber(taklif.cardNumber)}
              </p>
              <CopyButton
                value={taklif.cardNumber}
                className="mt-5 rounded-full px-5 py-2 text-xs font-semibold tracking-[0.2em] uppercase ring-1 ring-[#b08a45]/70 hover:bg-[#fffaf0]"
              />
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className="plov-reveal inline-flex min-h-11 items-center rounded-full px-5 py-2 text-xs font-semibold tracking-[0.15em] uppercase ring-1 ring-[#b08a45]/70 hover:bg-[#fffaf0]"
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        {/* The closing words and the hosts' signature. */}
        <footer className="px-6 pt-24 pb-14">
          <div className="plov-reveal">
            <Rosette className="mx-auto size-16" />
            <p className={`mt-8 text-4xl ${NAMES} ${SAFFRON}`}>
              {t("plov.closing")}
            </p>
            <p className={`mt-6 text-xl italic ${SOFT}`}>
              {t("signature", { host: taklif.hostName })}
            </p>
          </div>
          <StarRule className="mt-12" />
          <MadeWith className={`mt-8 text-sm ${SOFT}`} />
        </footer>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-6 pt-20">
      <div className="plov-reveal mb-8">
        <h2 className={`${LABEL} text-xs`}>{title}</h2>
        <StarRule className="mt-3" />
      </div>
      {children}
    </section>
  );
}
