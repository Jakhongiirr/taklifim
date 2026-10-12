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
import "./dove.css";
import { doveScript, forum } from "./fonts";

// Sunset blush and ivory from the rose arches, rosewood text, and the
// lake's dusty blue for the small lines.
const ASSETS = "/themes/dove";

/**
 * Dove: through a rose-covered arch, doves fly up and the guest walks down
 * a lantern-lit aisle (the opening video). The aisle's last frame is the
 * hero; further down the invitation's words sit by a lake with a swan,
 * under an arch of their own.
 */
export default async function DoveTheme({ taklif, preview }: ThemeProps) {
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
      className={`${doveScript} text-[3.5rem] leading-[1.05] text-[#6b3f4a] [text-shadow:0_0_20px_#fff7f2,0_0_6px_#fff7f2]`}
    >
      {taklif.groomName}
      <span
        className={`${forum.className} my-1 block text-xl tracking-[0.5em] text-[#6f8597]`}
      >
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
        openedClass="dove-opened"
        overlayClass="bg-gradient-to-b from-[#fff7f2]/0 via-[#fff7f2]/55 to-[#fff7f2]/0"
        buttonClass={`${forum.className} border-[#6b3f4a]/50 bg-[#fff7f2]/80 tracking-[0.2em] text-[#6b3f4a] uppercase backdrop-blur-sm hover:bg-[#fff7f2]`}
        musicClass="bg-[#fff7f2]/85 text-[#6b3f4a] ring-1 ring-[#c98b8b]/50"
      >
        <DovePair className="w-36" />
        <p
          className={`${forum.className} mt-4 text-xs tracking-[0.45em] text-[#6b3f4a] uppercase`}
        >
          {t("cover.eyebrow")}
        </p>
        <div className="mt-4">{names}</div>
        <p className={`${forum.className} mt-5 text-lg text-[#5a3e45]`}>
          {fullDate}
        </p>
      </VideoCover>

      <article className="mx-auto max-w-md overflow-clip bg-[#fbf3ee] text-center text-[#5a3e45] md:shadow-2xl md:shadow-[#6b3f4a]/15">
        {/* Hero: the video's last frame, so its end becomes the page. */}
        <section className="relative flex h-dvh flex-col items-center justify-end overflow-clip px-6 pb-16">
          <Image
            src={`${ASSETS}/opening-end.jpg`}
            alt=""
            fill
            unoptimized
            priority
            sizes="448px"
            className="dove-drift object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% via-[#fbf3ee]/70 via-60% to-[#fbf3ee]" />
          <Feathers />
          <div className="relative">
            <p
              className={`${forum.className} dove-rise text-xs tracking-[0.4em] text-[#6b3f4a] uppercase`}
              style={{ "--i": 0 } as CSSProperties}
            >
              {t("cover.invite")}
            </p>
            <div className="dove-rise mt-3" style={{ "--i": 1 } as CSSProperties}>
              {names}
            </div>
            <p
              className={`${forum.className} dove-rise mt-4 text-xl`}
              style={{ "--i": 2 } as CSSProperties}
            >
              {fullDate}
            </p>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="dove-hint mx-auto mt-8 size-6 text-[#c98b8b]"
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

        {/* The words, under an arch by the lake (fixed behind, like a window). */}
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
            <div className="dove-reveal rounded-t-full rounded-b-[2rem] bg-[#fff7f2]/80 px-7 pt-24 pb-10 shadow-xl shadow-[#6b3f4a]/10 ring-1 ring-[#fff7f2] backdrop-blur-md">
              <DovePair className="mx-auto w-32" />
              <h2
                className={`${forum.className} mt-5 text-2xl tracking-[0.12em] text-[#6b3f4a] uppercase`}
              >
                {t("greeting")}
              </h2>
              <p className="mt-5 font-serif text-xl leading-relaxed">
                {t("text", {
                  groom: taklif.groomName,
                  bride: taklif.brideName,
                })}
              </p>
              <p className="mt-6 font-serif text-lg text-[#8a6f73] italic">
                {t("signature", { host: taklif.hostName })}
              </p>
            </div>
          </div>
        </section>

        <Section title={t("date.title")}>
          <div className="dove-reveal">
            {/* The day under an arch, like the ones in the video. */}
            <div className="relative mx-auto flex h-60 w-44 flex-col items-center justify-center rounded-t-full bg-gradient-to-b from-[#f6e2d8] to-[#fbf3ee] ring-1 ring-[#c98b8b]/50">
              <div className="absolute inset-2 rounded-t-full ring-1 ring-[#c98b8b]/25" />
              <p
                className={`${forum.className} text-xs tracking-[0.35em] text-[#6f8597] uppercase`}
              >
                {weekdays[date.weekday]}
              </p>
              <p className="mt-1 font-serif text-7xl leading-none text-[#6b3f4a]">
                {date.day}
              </p>
              <p className={`${forum.className} mt-2 text-lg capitalize`}>
                {monthsStandalone[date.month]} {date.year}
              </p>
            </div>
            <p className={`${forum.className} mt-5 text-xl`}>
              {t("date.time", { time: date.time })}
            </p>
          </div>
          <div className="dove-reveal mt-10">
            <p
              className={`${forum.className} mb-4 text-xs tracking-[0.3em] text-[#6f8597] uppercase`}
            >
              {t("countdown.title")}
            </p>
            <Countdown
              eventAt={taklif.eventAt}
              boxClassName="rounded-t-full rounded-b-xl bg-[#f6e2d8]/70 pt-5 pb-3 ring-1 ring-[#c98b8b]/30"
            />
          </div>
        </Section>

        {taklif.photos.length > 0 && (
          <Section title={t("gallery.title")}>
            <Moments
              photos={taklif.photos}
              alt={coupleNames(taklif)}
              frameClass="dove-reveal bg-[#fff7f2] p-1.5 shadow-lg shadow-[#6b3f4a]/10 ring-1 ring-[#c98b8b]/50"
            />
          </Section>
        )}

        <Section title={t("venue.title")}>
          <div className="dove-reveal">
            <p className="font-serif text-2xl text-[#6b3f4a]">
              {taklif.venueName}
            </p>
            <p className="mt-2 text-sm text-[#8a6f73]">{taklif.venueAddress}</p>
            <MapLink
              url={taklif.locationUrl}
              className={`${forum.className} mt-6 inline-flex h-11 items-center rounded-full bg-[#6b3f4a] px-6 text-sm tracking-[0.15em] text-[#fff7f2] uppercase hover:bg-[#5a3e45]`}
            >
              {t("venue.map")}
            </MapLink>
          </div>
        </Section>

        <Section title={tRsvp("title")}>
          <div className="dove-reveal">
            <Rsvp
              slug={taklif.slug}
              preview={preview}
              palette={{
                input:
                  "bg-[#fff7f2] ring-1 ring-[#c98b8b]/35 focus:ring-[#c98b8b]",
                optionOn: "bg-[#6b3f4a] text-[#fff7f2]",
                optionOff: "bg-[#fff7f2] ring-1 ring-[#c98b8b]/35",
                button: "bg-[#6b3f4a] text-[#fff7f2] hover:bg-[#5a3e45]",
                muted: "text-[#8a6f73]",
                accent: "text-[#6b3f4a]",
                card: "bg-[#fff7f2] ring-1 ring-[#c98b8b]/30",
                error: "text-red-700",
              }}
            />
          </div>
        </Section>

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <div className="dove-reveal rounded-3xl bg-gradient-to-br from-[#f6e2d8] via-[#fff7f2] to-[#e3eaf0] px-6 py-8 ring-1 ring-[#c98b8b]/35">
              <p className="text-sm text-[#8a6f73]">{t("gift.text")}</p>
              <p className="mt-4 font-mono text-xl tracking-wider">
                {formatCardNumber(taklif.cardNumber)}
              </p>
              <CopyButton
                value={taklif.cardNumber}
                className="mt-4 rounded-full px-5 py-2 text-sm ring-1 ring-[#6b3f4a]/40 hover:bg-[#fff7f2]"
              />
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className="dove-reveal inline-flex h-11 items-center rounded-full px-6 text-sm ring-1 ring-[#6b3f4a]/40 hover:bg-[#f6e2d8]"
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        <footer className="px-6 pt-20 pb-14">
          <DovePair className="mx-auto w-36" />
          <p
            className={`${doveScript} dove-reveal mt-4 text-5xl leading-tight text-[#6b3f4a]`}
          >
            {t("closing")}
          </p>
          <p className="mt-12 text-xs text-[#8a6f73]">{t("madeWith")}</p>
        </footer>
      </article>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-6 pt-20">
      <h2
        className={`${forum.className} dove-reveal mb-8 text-2xl tracking-[0.15em] text-[#6b3f4a] uppercase`}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Two doves in line, facing each other over a small heart. */
function DovePair({ className = "" }: { className?: string }) {
  const dove = (
    <>
      {/* Body, from the tail to the head and beak. */}
      <path
        pathLength={1}
        d="M8 30 L16 27 C24 31 36 32 44 27 C48 24 50 20 53 18 C55 17 57 17.5 58 19 L61 19.6 L58 20.8 C56 24 52 28 46 31 C36 35 22 34 8 30Z"
      />
      {/* The raised wing. */}
      <path
        pathLength={1}
        d="M28 29 C25 21 26 12 33 5 C34 12 37 18 42 22 C40 15 41 9 46 4 C47 12 47 20 44 26"
      />
    </>
  );
  return (
    <svg
      aria-hidden
      viewBox="0 0 140 40"
      className={`dove-pair h-auto text-[#c98b8b] ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g>{dove}</g>
      <g transform="translate(140 0) scale(-1 1)">{dove}</g>
      <path
        pathLength={1}
        d="M70 24 C67 21 64 22 64 25 C64 28 70 31 70 31 C70 31 76 28 76 25 C76 22 73 21 70 24Z"
        fill="#c98b8b"
        fillOpacity="0.25"
      />
    </svg>
  );
}

/** White feathers drifting down over the aisle. */
function Feathers() {
  const feathers: [number, number, string, string, string][] = [
    // left %, size px, delay, duration, sway
    [14, 22, "0s", "15s", "40px"],
    [78, 18, "3s", "13s", "-30px"],
    [46, 14, "6.5s", "17s", "25px"],
    [28, 16, "9s", "14s", "-20px"],
    [64, 20, "11.5s", "16s", "35px"],
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {feathers.map(([x, size, delay, dur, sway]) => (
        <svg
          key={x}
          viewBox="0 0 20 40"
          className="dove-feather absolute top-0 opacity-0 motion-reduce:hidden"
          style={
            {
              left: `${x}%`,
              width: size,
              "--d": delay,
              "--dur": dur,
              "--sway": sway,
            } as CSSProperties
          }
        >
          <path
            d="M10 1 C17 8 18 22 11 36 C4 26 3 10 10 1Z"
            fill="#fffdfb"
            stroke="#e8d3cc"
            strokeWidth="0.6"
          />
          <path d="M10 4 C10.5 16 10.5 28 10 39" stroke="#e0c4bb" strokeWidth="0.6" />
        </svg>
      ))}
    </div>
  );
}
