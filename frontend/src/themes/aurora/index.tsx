import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { coupleNames, formatCardNumber, formatPhone } from "@/lib/format";
import { tashkentParts } from "@/lib/tashkent-date";
import Countdown from "../shared/countdown";
import CopyButton from "../shared/copy-button";
import MapLink from "../shared/map-link";
import Moments from "../shared/moments";
import Rsvp from "../shared/rsvp";
import VideoCover from "../shared/video-cover";
import type { ThemeProps } from "../types";
import "./aurora.css";
import { greatVibes } from "./fonts";

// Ivory, champagne and gold, like the palace in the video; warm brown text
// because the art is too bright for white.
const ASSETS = "/themes/aurora";

/**
 * Aurora: golden gates open onto a palace and its staircase hall (the
 * opening video). The hall's last frame is the hero; further down the
 * invitation's words sit on a sunlit marble terrace.
 */
export default async function AuroraTheme({ taklif, preview }: ThemeProps) {
  const [t, tDates, tRsvp] = await Promise.all([
    getTranslations("Invitation"),
    getTranslations("Dates"),
    getTranslations("Rsvp"),
  ]);
  const months = tDates.raw("months") as string[];
  const monthsStandalone = tDates.raw("monthsStandalone") as string[];
  const weekdays = tDates.raw("weekdays") as string[];
  const date = tashkentParts(taklif.eventAt);
  const fullDate = tDates("dateTime", {
    day: date.day,
    month: months[date.month],
    year: date.year,
    time: date.time,
  });

  const names = (
    <h1
      className={`${greatVibes.className} text-[3.6rem] leading-[1.05] text-[#7a5a2c] [text-shadow:0_0_18px_#fffaf0,0_0_4px_#fffaf0]`}
    >
      {taklif.groomName}
      <span className="mx-2 block text-[2.4rem] text-[#b08a4e]">&amp;</span>
      {taklif.brideName}
    </h1>
  );

  return (
    <>
      <VideoCover
        video={{
          src: `${ASSETS}/opening.mp4`,
          poster: `${ASSETS}/opening-start.jpg`,
        }}
        musicUrl={taklif.music?.file.url ?? null}
        openedClass="aurora-opened"
        overlayClass="bg-gradient-to-b from-[#fffaf0]/10 via-[#fffaf0]/45 to-[#fffaf0]/10"
        buttonClass="border-[#b08a4e] bg-[#fffaf0]/80 text-[#5c4325] backdrop-blur-sm hover:bg-[#fffaf0]"
        musicClass="bg-[#fffaf0]/85 text-[#7a5a2c] ring-1 ring-[#b08a4e]/40"
      >
        <p className="text-[11px] tracking-[0.4em] text-[#8a6a3a] uppercase">
          {t("cover.eyebrow")}
        </p>
        <div className="mt-5">{names}</div>
        <p className="mt-5 font-serif text-lg text-[#5c4325]">{fullDate}</p>
      </VideoCover>

      <article className="mx-auto max-w-md overflow-clip bg-[#fbf6ec] text-center text-[#5c4325] md:shadow-2xl md:shadow-[#5c4325]/15">
        {/* Hero: the video's last frame, so its end becomes the page. */}
        <section className="relative flex h-dvh flex-col items-center justify-end overflow-clip px-6 pb-16">
          <Image
            src={`${ASSETS}/opening-end.jpg`}
            alt=""
            fill
            unoptimized
            priority
            sizes="448px"
            className="aurora-drift object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fbf6ec]/10 via-45% to-[#fbf6ec]" />
          <Sparkles />
          <div className="relative">
            <p
              className="aurora-rise text-[11px] tracking-[0.4em] text-[#8a6a3a] uppercase"
              style={{ "--i": 0 } as CSSProperties}
            >
              {t("cover.invite")}
            </p>
            <div
              className="aurora-rise mt-4"
              style={{ "--i": 1 } as CSSProperties}
            >
              {names}
            </div>
            <p
              className="aurora-rise mt-4 font-serif text-xl"
              style={{ "--i": 2 } as CSSProperties}
            >
              {fullDate}
            </p>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="aurora-hint mx-auto mt-8 size-6 text-[#b08a4e]"
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

        {/* The words, on the sunlit terrace (fixed behind, like a window). */}
        <section className="relative [clip-path:inset(0)]">
          <div className="fixed inset-y-0 left-1/2 -z-0 w-full max-w-md -translate-x-1/2">
            <Image
              src={`${ASSETS}/backdrop.jpg`}
              alt=""
              fill
              unoptimized
              sizes="448px"
              className="object-cover"
            />
          </div>
          <div className="relative px-6 py-28">
            <div className="aurora-reveal rounded-[2rem] bg-[#fffaf0]/75 px-6 py-10 shadow-xl shadow-[#5c4325]/10 ring-1 ring-[#fffaf0] backdrop-blur-md">
              <Flourish />
              <h2 className="mt-5 font-serif text-3xl text-[#7a5a2c]">
                {t("greeting")}
              </h2>
              <p className="mt-5 font-serif text-xl leading-relaxed">
                {t("text", {
                  groom: taklif.groomName,
                  bride: taklif.brideName,
                })}
              </p>
              <p className="mt-6 font-serif text-lg text-[#8a7457] italic">
                {t("signature", { host: taklif.hostName })}
              </p>
              <div className="mt-6">
                <Flourish />
              </div>
            </div>
          </div>
        </section>

        <Section title={t("date.title")}>
          <div className="aurora-reveal">
            <p className="text-xs tracking-[0.35em] text-[#8a6a3a] uppercase">
              {weekdays[date.weekday]}
            </p>
            <div className="mt-3 flex items-center justify-center gap-5 font-serif">
              <span className="w-24 border-y border-[#b08a4e]/50 py-2 text-lg capitalize">
                {monthsStandalone[date.month]}
              </span>
              <span className="text-7xl leading-none text-[#7a5a2c]">
                {date.day}
              </span>
              <span className="w-24 border-y border-[#b08a4e]/50 py-2 text-lg">
                {date.year}
              </span>
            </div>
            <p className="mt-4 font-serif text-xl">
              {t("date.time", { time: date.time })}
            </p>
          </div>
          <div className="aurora-reveal mt-10">
            <p className="mb-4 text-xs tracking-[0.3em] text-[#8a6a3a] uppercase">
              {t("countdown.title")}
            </p>
            <Countdown
              eventAt={taklif.eventAt}
              boxClassName="rounded-2xl bg-[#f3e7d3]/70 py-3 ring-1 ring-[#b08a4e]/25"
            />
          </div>
        </Section>

        {taklif.photos.length > 0 && (
          <Section title={t("gallery.title")}>
            <Moments
              photos={taklif.photos}
              alt={coupleNames(taklif)}
              frameClass="aurora-reveal bg-[#fffaf0] p-1.5 shadow-lg shadow-[#5c4325]/10 ring-1 ring-[#b08a4e]/45"
            />
          </Section>
        )}

        <Section title={t("venue.title")}>
          <div className="aurora-reveal">
            <p className="font-serif text-2xl text-[#7a5a2c]">
              {taklif.venueName}
            </p>
            <p className="mt-2 text-sm text-[#8a7457]">{taklif.venueAddress}</p>
            <MapLink
              url={taklif.locationUrl}
              className="mt-6 inline-flex h-11 items-center rounded-full bg-[#7a5a2c] px-6 text-sm tracking-wide text-[#fffaf0] hover:bg-[#5c4325]"
            >
              {t("venue.map")}
            </MapLink>
          </div>
        </Section>

        <Section title={tRsvp("title")}>
          <div className="aurora-reveal">
            <Rsvp
              slug={taklif.slug}
              preview={preview}
              palette={{
                input:
                  "bg-[#fffaf0] ring-1 ring-[#b08a4e]/30 focus:ring-[#b08a4e]",
                optionOn: "bg-[#7a5a2c] text-[#fffaf0]",
                optionOff: "bg-[#fffaf0] ring-1 ring-[#b08a4e]/30",
                button: "bg-[#7a5a2c] text-[#fffaf0] hover:bg-[#5c4325]",
                muted: "text-[#8a7457]",
                accent: "text-[#7a5a2c]",
                card: "bg-[#fffaf0] ring-1 ring-[#b08a4e]/25",
                error: "text-red-700",
              }}
            />
          </div>
        </Section>

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <div className="aurora-reveal rounded-3xl bg-gradient-to-br from-[#f3e7d3] to-[#fffaf0] px-6 py-8 ring-1 ring-[#b08a4e]/30">
              <p className="text-sm text-[#8a7457]">{t("gift.text")}</p>
              <p className="mt-4 font-mono text-xl tracking-wider">
                {formatCardNumber(taklif.cardNumber)}
              </p>
              <CopyButton
                value={taklif.cardNumber}
                className="mt-4 rounded-full px-5 py-2 text-sm ring-1 ring-[#b08a4e]/60 hover:bg-[#fffaf0]"
              />
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className="aurora-reveal inline-flex h-11 items-center rounded-full px-6 text-sm ring-1 ring-[#b08a4e]/60 hover:bg-[#f3e7d3]"
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        <footer className="px-6 pt-20 pb-14">
          <Flourish />
          <p
            className={`${greatVibes.className} aurora-reveal mt-6 text-5xl text-[#7a5a2c]`}
          >
            {t("closing")}
          </p>
          <p className="mt-12 text-xs text-[#8a7457]">{t("madeWith")}</p>
        </footer>
      </article>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-6 pt-20">
      <h2 className="aurora-reveal mb-8 font-serif text-3xl text-[#7a5a2c]">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** A thin gold line with a diamond and two leaves. */
function Flourish() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 20"
      className="mx-auto h-5 w-48 text-[#b08a4e]"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
    >
      <path d="M4 10 H78 M122 10 H196" />
      <path d="M100 4 L106 10 L100 16 L94 10Z" fill="currentColor" />
      <path d="M90 10 C84 4 78 4 74 8 C80 11 85 11 90 10Z" />
      <path d="M110 10 C116 4 122 4 126 8 C120 11 115 11 110 10Z" />
    </svg>
  );
}

/** Specks of light over the hall, twinkling. */
function Sparkles() {
  const specks: [number, number, number, string][] = [
    [18, 22, 3, "0s"],
    [72, 16, 2, "0.8s"],
    [84, 34, 3, "1.6s"],
    [30, 40, 2, "2.2s"],
    [60, 30, 2, "1.1s"],
    [12, 56, 2, "2.7s"],
    [88, 60, 3, "0.4s"],
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {specks.map(([x, y, size, delay]) => (
        <span
          key={`${x}-${y}`}
          className="aurora-sparkle absolute rounded-full bg-[#fffaf0] shadow-[0_0_10px_3px_#fff3d6]"
          style={
            {
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              "--d": delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
