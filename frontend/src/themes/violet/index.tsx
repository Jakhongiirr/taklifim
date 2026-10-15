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
import "./violet.css";
import { marck, tenor } from "./fonts";

// A moonlit fairy tale: night violet, moonlight text, lilac glow and the
// sky lanterns' gold, like the castle in the video. The only dark theme.
const ASSETS = "/themes/violet";

/**
 * Violet: a violet castle under a full moon, sky lanterns rising, down to a
 * flowered valley and its bridge (the opening video). The valley's last
 * frame is the hero; further down the invitation's words sit on a
 * lantern-lit terrace looking out over the city at night.
 */
export default async function VioletTheme({ taklif, preview }: ThemeProps) {
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
      className={`${marck.className} text-[3.4rem] leading-[1.05] text-[#f7f2ff] [text-shadow:0_0_24px_rgba(185,156,232,0.9),0_0_6px_rgba(255,255,255,0.6)]`}
    >
      {taklif.groomName}
      <span
        className={`${tenor.className} my-1 block text-lg tracking-[0.5em] text-[#f5c27a]`}
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
        openedClass="violet-opened"
        overlayClass="bg-gradient-to-b from-[#1b1430]/10 via-[#1b1430]/55 to-[#1b1430]/30"
        buttonClass={`${tenor.className} border-[#f5c27a]/70 bg-[#1b1430]/40 text-xs tracking-[0.25em] text-[#f7f2ff] uppercase backdrop-blur-sm hover:bg-[#1b1430]/60`}
        musicClass="bg-[#2a1f48]/85 text-[#f5c27a] ring-1 ring-[#b79ce8]/40"
      >
        <Crescent className="w-10" />
        <p
          className={`${tenor.className} mt-4 text-[11px] tracking-[0.45em] text-[#e6dcfa] uppercase`}
        >
          {t("cover.eyebrow")}
        </p>
        <div className="mt-4">{names}</div>
        <p
          className={`${tenor.className} mt-5 text-sm tracking-[0.15em] text-[#f7f2ff]`}
        >
          {fullDate}
        </p>
      </VideoCover>

      <article className="relative mx-auto max-w-md overflow-clip bg-gradient-to-b from-[#1b1430] via-[#241a40] to-[#1b1430] text-center text-[#f1ecfa] md:shadow-2xl md:shadow-black/40">
        <Stars />

        {/* Hero: the video's last frame, so its end becomes the page. */}
        <section className="relative flex h-dvh flex-col items-center justify-end overflow-clip px-6 pb-16">
          <Image
            src={`${ASSETS}/opening-end.jpg`}
            alt=""
            fill
            unoptimized
            priority
            sizes="448px"
            className="violet-drift object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-35% via-[#1b1430]/35 via-65% to-[#1b1430]/70" />
          <Lanterns />
          <div className="relative">
            <p
              className={`${tenor.className} violet-rise text-[11px] tracking-[0.35em] text-[#e6dcfa] uppercase`}
              style={{ "--i": 0 } as CSSProperties}
            >
              {t("cover.invite")}
            </p>
            <div
              className="violet-rise mt-3"
              style={{ "--i": 1 } as CSSProperties}
            >
              {names}
            </div>
            <p
              className={`${tenor.className} violet-rise mt-4 text-sm tracking-[0.15em]`}
              style={{ "--i": 2 } as CSSProperties}
            >
              {fullDate}
            </p>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="violet-hint mx-auto mt-8 size-6 text-[#f5c27a]"
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

        {/* The words, on the moonlit terrace. */}
        <section className="relative">
          <div className="absolute inset-0">
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
            {/* Night glass over the light. */}
            <div className="violet-reveal rounded-[2rem] bg-[#1b1430]/60 px-6 py-10 shadow-[0_0_60px_-10px_rgba(185,156,232,0.6)] ring-1 ring-[#b79ce8]/40 backdrop-blur-md">
              <Crescent className="mx-auto w-9" />
              <h2
                className={`${tenor.className} mt-4 text-lg tracking-[0.2em] text-[#f5c27a] uppercase`}
              >
                {t("greeting")}
              </h2>
              <p className="mt-5 font-serif text-xl leading-relaxed text-[#f7f2ff]">
                {t("text", {
                  groom: taklif.groomName,
                  bride: taklif.brideName,
                })}
              </p>
              <p className="mt-6 font-serif text-lg text-[#d9cdf2] italic">
                {t("signature", { host: taklif.hostName })}
              </p>
            </div>
          </div>
        </section>

        <Section title={t("date.title")}>
          <div className="violet-reveal">
            <p
              className={`${tenor.className} text-xs tracking-[0.35em] text-[#b9aed3] uppercase`}
            >
              {weekdays[date.weekday]}
            </p>
            {/* The day on a full moon. */}
            <div className="violet-moon relative mx-auto mt-5 flex size-40 items-center justify-center rounded-full bg-[radial-gradient(circle_at_40%_35%,#fbf8ff,#e4daf7_55%,#c9b7ee)] shadow-[0_0_50px_12px_rgba(185,156,232,0.4)]">
              {/* Faint craters. */}
              <span className="absolute top-[22%] left-[60%] size-5 rounded-full bg-[#c9b7ee]/40" />
              <span className="absolute top-[62%] left-[24%] size-7 rounded-full bg-[#c9b7ee]/30" />
              <span className="absolute top-[70%] left-[66%] size-3 rounded-full bg-[#c9b7ee]/40" />
              <span
                className={`${marck.className} relative text-6xl text-[#2a1f48]`}
              >
                {date.day}
              </span>
            </div>
            <p
              className={`${tenor.className} mt-6 text-base tracking-[0.15em] capitalize`}
            >
              {monthsStandalone[date.month]} {date.year}
            </p>
            <p className="mt-1 font-serif text-lg text-[#d9cdf2] italic">
              {t("date.time", { time: date.time })}
            </p>
          </div>
          <div className="violet-reveal mt-10">
            <p
              className={`${tenor.className} mb-4 text-[11px] tracking-[0.3em] text-[#b9aed3] uppercase`}
            >
              {t("countdown.title")}
            </p>
            <Countdown
              eventAt={taklif.eventAt}
              boxClassName="rounded-2xl bg-white/5 py-3 text-[#f7f2ff] ring-1 ring-[#b79ce8]/30 backdrop-blur-sm"
            />
          </div>
        </Section>

        {taklif.photos.length > 0 && (
          <Section title={t("gallery.title")}>
            <Moments
              photos={taklif.photos}
              alt={coupleNames(taklif)}
              frameClass="violet-reveal bg-[#2a1f48] p-1.5 shadow-[0_0_30px_-8px_rgba(185,156,232,0.6)] ring-1 ring-[#b79ce8]/40"
            />
          </Section>
        )}

        <Section title={t("venue.title")}>
          <div className="violet-reveal">
            <p className={`${marck.className} text-4xl text-[#f7f2ff]`}>
              {taklif.venueName}
            </p>
            <p className="mt-2 text-sm text-[#b9aed3]">{taklif.venueAddress}</p>
            <MapLink
              url={taklif.locationUrl}
              className={`${tenor.className} mt-6 inline-flex h-11 items-center rounded-full bg-[#f5c27a] px-6 text-xs tracking-[0.2em] text-[#1b1430] uppercase shadow-[0_0_24px_-4px_rgba(245,194,122,0.7)] hover:bg-[#f8d29a]`}
            >
              {t("venue.map")}
            </MapLink>
          </div>
        </Section>

        <Section title={tRsvp("title")}>
          <div className="violet-reveal">
            <Rsvp
              slug={taklif.slug}
              preview={preview}
              palette={{
                input:
                  "bg-white/5 text-[#f7f2ff] ring-1 ring-[#b79ce8]/30 placeholder:text-[#b9aed3]/60 focus:ring-[#b79ce8]",
                optionOn: "bg-[#b79ce8] text-[#1b1430]",
                optionOff: "bg-white/5 text-[#f1ecfa] ring-1 ring-[#b79ce8]/30",
                button: "bg-[#f5c27a] text-[#1b1430] hover:bg-[#f8d29a]",
                muted: "text-[#b9aed3]",
                accent: "text-[#f5c27a]",
                card: "bg-white/5 ring-1 ring-[#b79ce8]/25",
                error: "text-[#ffb4c2]",
              }}
            />
          </div>
        </Section>

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <div className="violet-reveal rounded-3xl bg-gradient-to-br from-[#3a2a63] to-[#1f1738] px-6 py-8 shadow-[0_0_40px_-12px_rgba(185,156,232,0.6)] ring-1 ring-[#b79ce8]/35">
              <p className="text-sm text-[#b9aed3]">{t("gift.text")}</p>
              <p className="mt-4 font-mono text-xl tracking-wider text-[#f7f2ff]">
                {formatCardNumber(taklif.cardNumber)}
              </p>
              <CopyButton
                value={taklif.cardNumber}
                className="mt-4 rounded-full px-5 py-2 text-sm text-[#f5c27a] ring-1 ring-[#f5c27a]/60 hover:bg-white/5"
              />
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className="violet-reveal inline-flex h-11 items-center rounded-full px-6 text-sm ring-1 ring-[#b79ce8]/50 hover:bg-white/5"
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        <footer className="relative px-6 pt-20 pb-14">
          <Crescent className="mx-auto w-10" />
          <p
            className={`${marck.className} violet-reveal mt-5 text-5xl leading-tight text-[#f7f2ff] [text-shadow:0_0_20px_rgba(185,156,232,0.8)]`}
          >
            {t("closing")}
          </p>
          <MadeWith className="mt-12 text-xs text-[#b9aed3]" />
        </footer>
      </article>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="relative px-6 pt-20">
      <div className="violet-reveal mb-8">
        <Sparkle />
        <h2
          className={`${tenor.className} mt-3 text-xl tracking-[0.25em] text-[#f7f2ff] uppercase`}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

/** A crescent moon with a small star, in lantern gold. */
function Crescent({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      className={`h-auto drop-shadow-[0_0_8px_rgba(245,194,122,0.7)] ${className}`}
    >
      <path
        d="M24 6 A15 15 0 1 0 34 30 A12 12 0 1 1 24 6Z"
        fill="#f5c27a"
      />
      <path
        d="M33 6 L34.2 9.3 L37.5 10.5 L34.2 11.7 L33 15 L31.8 11.7 L28.5 10.5 L31.8 9.3Z"
        fill="#fbe7c6"
      />
    </svg>
  );
}

/** A four-point sparkle between two faint lines. */
function Sparkle() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-3">
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#b79ce8]/70" />
      <svg viewBox="0 0 20 20" className="size-4 text-[#f5c27a]">
        <path
          d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8Z"
          fill="currentColor"
        />
      </svg>
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#b79ce8]/70" />
    </div>
  );
}

/** Sky lanterns rising from the valley. */
function Lanterns() {
  const lanterns: [number, number, string, string, string][] = [
    // left %, size px, delay, duration, sway
    [12, 16, "0s", "17s", "18px"],
    [74, 12, "3s", "20s", "-14px"],
    [40, 10, "6s", "22s", "10px"],
    [88, 14, "9s", "18s", "-20px"],
    [26, 12, "12s", "21s", "16px"],
    [58, 9, "15s", "23s", "-10px"],
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {lanterns.map(([x, size, delay, dur, sway]) => (
        <span
          key={x}
          className="violet-lantern absolute bottom-[8%] opacity-0 motion-reduce:hidden"
          style={
            {
              left: `${x}%`,
              "--d": delay,
              "--dur": dur,
              "--sway": sway,
            } as CSSProperties
          }
        >
          <span
            className="violet-flame block rounded-[40%_40%_30%_30%] bg-gradient-to-b from-[#ffd9a0] to-[#f09a4a] shadow-[0_0_14px_5px_rgba(245,170,90,0.6)]"
            style={{ width: size, height: size * 1.25 }}
          />
        </span>
      ))}
    </div>
  );
}

/** Faint stars twinkling over the whole page (fixed positions). */
function Stars() {
  // A small deterministic spread, so server and browser agree.
  const stars = Array.from({ length: 46 }, (_, i) => {
    const x = (i * 37.7) % 100;
    const y = (i * 61.3 + (i % 7) * 13) % 100;
    return { x, y, size: 1 + (i % 3), d: `${(i % 9) * 0.45}s`, dur: `${2.5 + (i % 5) * 0.6}s` };
  });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {stars.map((s, i) => (
        <span
          key={i}
          className="violet-star absolute rounded-full bg-white"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              opacity: 0.6,
              "--d": s.d,
              "--dur": s.dur,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
