import Image from "next/image";
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
import VideoCover from "../shared/video-cover";
import type { ThemeProps } from "../types";
import "./arcade.css";
import { yeseva } from "./fonts";

// A storybook garden party: cream, rose pink and sage, plum ink, and
// butterflies everywhere, like the château in the video.
const ASSETS = "/themes/arcade";

/**
 * Arcade: a fairy-tale château with a fountain, through its glass
 * conservatory and a banquet hall under pink chandeliers, out onto a
 * balcony over a lake (the opening video). The balcony's last frame is the
 * hero; further down the invitation's words sit in a rose-covered arcade.
 */
export default async function ArcadeTheme({ taklif, preview }: ThemeProps) {
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
      className={`${yeseva.className} text-[2.7rem] leading-[1.1] text-[#4d3a52] [text-shadow:0_0_18px_#fffaf6,0_0_5px_#fffaf6]`}
    >
      {taklif.groomName}
      <span className="my-1 block font-serif text-3xl text-[#d27f93] italic">
        &amp;
      </span>
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
        openedClass="arcade-opened"
        overlayClass="bg-gradient-to-b from-[#fffaf6]/0 via-[#fffaf6]/60 to-[#fffaf6]/0"
        buttonClass="border-[#d27f93]/60 bg-[#fffaf6]/85 text-[#4d3a52] backdrop-blur-sm hover:bg-[#fffaf6]"
        musicClass="bg-[#fffaf6]/90 text-[#4d3a52] ring-1 ring-[#d27f93]/50"
      >
        <Butterfly className="w-12" />
        <p className="mt-3 text-[11px] tracking-[0.4em] text-[#8a5a74] uppercase">
          {t("cover.eyebrow")}
        </p>
        <div className="mt-4">{names}</div>
        <p className="mt-5 font-serif text-lg text-[#4d3a52]">{fullDate}</p>
      </VideoCover>

      <article className="mx-auto max-w-md overflow-clip bg-[#fdf8f4] text-center text-[#4d3a52] md:shadow-2xl md:shadow-[#4d3a52]/15">
        {/* Hero: the video's last frame, so its end becomes the page. */}
        <section className="relative flex h-dvh flex-col items-center justify-end overflow-clip px-6 pb-16">
          <Image
            src={`${ASSETS}/opening-end.jpg`}
            alt=""
            fill
            unoptimized
            priority
            sizes="448px"
            className="arcade-drift object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-45% via-[#fdf8f4]/10 via-70% to-[#fdf8f4]/30" />
          <Flight />
          <div className="relative">
            <p
              className="arcade-rise text-[11px] tracking-[0.35em] text-[#8a5a74] uppercase"
              style={{ "--i": 0 } as CSSProperties}
            >
              {t("cover.invite")}
            </p>
            <div
              className="arcade-rise mt-3"
              style={{ "--i": 1 } as CSSProperties}
            >
              {names}
            </div>
            <p
              className="arcade-rise mt-4 font-serif text-xl"
              style={{ "--i": 2 } as CSSProperties}
            >
              {fullDate}
            </p>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="arcade-hint mx-auto mt-8 size-6 text-[#d27f93]"
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

        {/* The words, in the rose arcade (fixed behind, like a window). */}
        <section className="relative [clip-path:inset(0)]">
          <div className="fixed inset-y-0 left-1/2 w-full max-w-md -translate-x-1/2">
            <Image
              src={`${ASSETS}/backdrop.jpg`}
              alt=""
              fill
              unoptimized
              sizes="448px"
              className="object-cover"
            />
          </div>
          <div className="relative px-7 py-28">
            {/* A pastel card: rose to sage, like the garden. */}
            <div className="arcade-reveal rounded-[2.5rem] bg-gradient-to-br from-[#f3d9dc] via-[#e6efe3] to-[#dfeaf1] p-[3px] shadow-xl shadow-[#4d3a52]/15">
              <div className="rounded-[calc(2.5rem-3px)] bg-[#fffaf6]/85 px-6 py-10 backdrop-blur-md">
                <Butterfly className="mx-auto w-11" />
                <h2
                  className={`${yeseva.className} mt-4 text-2xl text-[#4d3a52]`}
                >
                  {t("greeting")}
                </h2>
                <p className="mt-5 font-serif text-xl leading-relaxed">
                  {t("text", {
                    groom: taklif.groomName,
                    bride: taklif.brideName,
                  })}
                </p>
                <p className="mt-6 font-serif text-lg text-[#8a6f84] italic">
                  {t("signature", { host: taklif.hostName })}
                </p>
              </div>
            </div>
          </div>
        </section>

        <Section title={t("date.title")}>
          <div className="arcade-reveal">
            {/* The day inside a wreath of leaves and roses. */}
            <div className="relative mx-auto flex size-52 items-center justify-center">
              <Wreath className="arcade-wreath absolute inset-0 size-full" />
              <div className="relative flex flex-col items-center">
                <p className="text-[10px] tracking-[0.3em] text-[#7d9a7e] uppercase">
                  {weekdays[date.weekday]}
                </p>
                <p
                  className={`${yeseva.className} text-6xl leading-tight text-[#4d3a52]`}
                >
                  {date.day}
                </p>
                <p className="font-serif text-lg capitalize">
                  {monthsStandalone[date.month]} {date.year}
                </p>
              </div>
            </div>
            <p className="mt-3 font-serif text-xl">
              {t("date.time", { time: date.time })}
            </p>
          </div>
          <div className="arcade-reveal mt-10">
            <p className="mb-4 text-xs tracking-[0.3em] text-[#7d9a7e] uppercase">
              {t("countdown.title")}
            </p>
            <Countdown
              eventAt={taklif.eventAt}
              boxClassName="rounded-full bg-gradient-to-b from-[#f3d9dc]/70 to-[#e6efe3]/70 py-4 ring-1 ring-[#d27f93]/25"
            />
          </div>
        </Section>

        {taklif.photos.length > 0 && (
          <Section title={t("gallery.title")}>
            <Moments
              photos={taklif.photos}
              alt={coupleNames(taklif)}
              frameClass="arcade-reveal bg-[#fffaf6] p-1.5 shadow-lg shadow-[#4d3a52]/10 ring-1 ring-[#d27f93]/40"
            />
          </Section>
        )}

        <Section title={t("venue.title")}>
          <div className="arcade-reveal">
            <p className={`${yeseva.className} text-2xl`}>{taklif.venueName}</p>
            <p className="mt-2 text-sm text-[#8a6f84]">{taklif.venueAddress}</p>
            <MapLink
              url={taklif.locationUrl}
              className="mt-6 inline-flex h-11 items-center rounded-full bg-[#7d9a7e] px-6 text-sm tracking-wide text-white hover:bg-[#6b886c]"
            >
              {t("venue.map")}
            </MapLink>
          </div>
        </Section>

        <Section title={tRsvp("title")}>
          <div className="arcade-reveal">
            <Rsvp
              slug={taklif.slug}
              preview={preview}
              palette={{
                input:
                  "bg-[#fffaf6] ring-1 ring-[#d27f93]/30 focus:ring-[#d27f93]",
                optionOn: "bg-[#d27f93] text-white",
                optionOff: "bg-[#fffaf6] ring-1 ring-[#d27f93]/30",
                button: "bg-[#4d3a52] text-[#fffaf6] hover:bg-[#3d2d42]",
                muted: "text-[#8a6f84]",
                accent: "text-[#d27f93]",
                card: "bg-[#fffaf6] ring-1 ring-[#d27f93]/25",
                error: "text-red-700",
              }}
            />
          </div>
        </Section>

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <div className="arcade-reveal rounded-[2rem] bg-gradient-to-br from-[#f3d9dc] via-[#fffaf6] to-[#e6efe3] px-6 py-8 ring-1 ring-[#d27f93]/30">
              <p className="text-sm text-[#8a6f84]">{t("gift.text")}</p>
              <p className="mt-4 font-mono text-xl tracking-wider">
                {formatCardNumber(taklif.cardNumber)}
              </p>
              <CopyButton
                value={taklif.cardNumber}
                className="mt-4 rounded-full bg-[#fffaf6] px-5 py-2 text-sm ring-1 ring-[#d27f93]/50 hover:bg-white"
              />
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className="arcade-reveal inline-flex h-11 items-center rounded-full px-6 text-sm ring-1 ring-[#7d9a7e]/60 hover:bg-[#e6efe3]"
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        <footer className="px-6 pt-20 pb-14">
          <ButterflyDivider />
          <p
            className={`${yeseva.className} arcade-reveal mt-6 text-3xl leading-snug`}
          >
            {t("closing")}
          </p>
          <MadeWith className="mt-12 text-xs text-[#8a6f84]" />
        </footer>
      </article>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-6 pt-20">
      <div className="arcade-reveal mb-8">
        <ButterflyDivider />
        <h2 className={`${yeseva.className} mt-3 text-3xl`}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

/** A butterfly, wings beating (rose wings, plum body). */
function Butterfly({
  className = "",
  beat,
}: {
  className?: string;
  beat?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 32"
      className={`mx-auto h-auto overflow-visible ${className}`}
    >
      <g
        className="arcade-wings"
        style={beat ? ({ "--beat": beat } as CSSProperties) : undefined}
        fill="#f0b8c4"
        fillOpacity="0.85"
        stroke="#c9707f"
        strokeWidth="0.8"
        strokeLinejoin="round"
      >
        <path d="M20 15 C15 3 4 1 3 8 C2 14 10 17 20 15Z" />
        <path d="M20 17 C13 17 6 22 8 27 C10 31 17 25 20 17Z" />
        <path d="M20 15 C25 3 36 1 37 8 C38 14 30 17 20 15Z" />
        <path d="M20 17 C27 17 34 22 32 27 C30 31 23 25 20 17Z" />
        <circle cx="9" cy="8" r="1.6" fill="#fffaf6" stroke="none" />
        <circle cx="31" cy="8" r="1.6" fill="#fffaf6" stroke="none" />
      </g>
      <ellipse cx="20" cy="16.5" rx="1.1" ry="6" fill="#4d3a52" />
      <path
        d="M20 11 C19 7 17 5 15.5 4 M20 11 C21 7 23 5 24.5 4"
        fill="none"
        stroke="#4d3a52"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Thin sage lines either side of a small butterfly. */
function ButterflyDivider() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-3">
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#7d9a7e]/70" />
      <Butterfly className="!mx-0 w-7" beat="0.45s" />
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#7d9a7e]/70" />
    </div>
  );
}

/** Butterflies wandering across the hero. */
function Flight() {
  const flights: [number, number, string, string, string][] = [
    // top %, width px, delay, duration, wing beat
    [18, 26, "0s", "15s", "0.28s"],
    [34, 18, "5s", "19s", "0.22s"],
    [12, 20, "10s", "17s", "0.25s"],
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {flights.map(([top, width, delay, dur, beat]) => (
        <div
          key={delay}
          className="arcade-flight absolute left-0 opacity-0 motion-reduce:hidden"
          style={
            {
              top: `${top}%`,
              width,
              "--d": delay,
              "--dur": dur,
            } as CSSProperties
          }
        >
          <Butterfly className="!mx-0 w-full" beat={beat} />
        </div>
      ))}
    </div>
  );
}

/** A ring of sage leaves with small roses, drawn around the date. */
function Wreath({ className = "" }: { className?: string }) {
  const steps = Array.from({ length: 24 }, (_, i) => (i * 360) / 24);
  return (
    <svg aria-hidden viewBox="0 0 200 200" className={className}>
      <circle
        cx="100"
        cy="100"
        r="78"
        fill="none"
        stroke="#7d9a7e"
        strokeOpacity="0.5"
        strokeWidth="0.8"
      />
      {steps.map((angle, i) =>
        i % 4 === 0 ? (
          <g key={angle} transform={`rotate(${angle} 100 100) translate(100 22)`}>
            <circle r="5.5" fill="#f0b8c4" stroke="#c9707f" strokeWidth="0.7" />
            <circle r="2.2" fill="none" stroke="#c9707f" strokeWidth="0.6" />
          </g>
        ) : (
          <ellipse
            key={angle}
            cx="100"
            cy="22"
            rx="3"
            ry="8"
            transform={`rotate(${angle} 100 100) rotate(${i % 2 ? 35 : -35} 100 22)`}
            fill="#a9c3a6"
            fillOpacity="0.8"
            stroke="#7d9a7e"
            strokeWidth="0.5"
          />
        ),
      )}
    </svg>
  );
}
