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
import { cormorantSc, prata } from "./fonts";
import "./haven.css";

// A painted old garden: linen paper, forest-green ink, old roses, black
// wrought iron and the lanterns' amber.
const ASSETS = "/themes/haven";

/**
 * Haven: an iron gate in a rose garden opens onto an old palace under the
 * lanterns (the opening video). The palace's last frame is the hero;
 * further down the invitation's words hang by a swing among the roses.
 */
export default async function HavenTheme({ taklif, preview }: ThemeProps) {
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

  const names = (tone: string, amp: string) => (
    <h1 className={`${prata.className} text-[2.6rem] leading-[1.15] ${tone}`}>
      {taklif.groomName}
      <span className={`block font-serif text-4xl italic ${amp}`}>&amp;</span>
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
        openedClass="haven-opened"
        overlayClass="bg-gradient-to-b from-[#1c211a]/10 via-[#1c211a]/55 to-[#1c211a]/20"
        buttonClass={`${cormorantSc.className} border-[#fbf6ee]/70 bg-[#1c211a]/30 text-base tracking-[0.18em] text-[#fbf6ee] backdrop-blur-sm hover:bg-[#1c211a]/50`}
        musicClass="bg-[#f4efe6]/90 text-[#2f3a2c] ring-1 ring-[#2b2a28]/30"
      >
        <Ironwork className="w-44 text-[#fbf6ee]/80" />
        <p
          className={`${cormorantSc.className} mt-4 text-sm tracking-[0.4em] text-[#f1d9c8]`}
        >
          {t("cover.eyebrow")}
        </p>
        <div className="mt-4 [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]">
          {names("text-[#fbf6ee]", "text-[#f1c9c4]")}
        </div>
        <p
          className={`${cormorantSc.className} mt-5 text-xl text-[#fbf6ee] [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]`}
        >
          {fullDate}
        </p>
      </VideoCover>

      <article className="mx-auto max-w-md overflow-clip bg-[#f4efe6] text-center text-[#2f3a2c] md:shadow-2xl md:shadow-[#2b2a28]/20">
        {/* Hero: the video's last frame, so its end becomes the page. */}
        <section className="relative flex h-dvh flex-col items-center justify-end overflow-clip px-6 pb-16">
          <Image
            src={`${ASSETS}/opening-end.jpg`}
            alt=""
            fill
            unoptimized
            priority
            sizes="448px"
            className="haven-drift object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-45% via-[#f4efe6]/10 via-70% to-[#f4efe6]/30" />
          <Petals />
          <div className="relative">
            <p
              className={`${cormorantSc.className} haven-rise text-sm tracking-[0.35em] text-[#8a4f58]`}
              style={{ "--i": 0 } as CSSProperties}
            >
              {t("cover.invite")}
            </p>
            <div
              className="haven-rise mt-3"
              style={{ "--i": 1 } as CSSProperties}
            >
              {names("text-[#2f3a2c]", "text-[#b5707a]")}
            </div>
            <p
              className={`${cormorantSc.className} haven-rise mt-4 text-xl`}
              style={{ "--i": 2 } as CSSProperties}
            >
              {fullDate}
            </p>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="haven-hint mx-auto mt-8 size-6 text-[#b5707a]"
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

        {/* The words, by the swing among the roses. */}
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
            {/* A linen card in a double frame, like an old print. */}
            <div className="haven-reveal bg-[#f4efe6]/85 p-2 shadow-xl shadow-[#2b2a28]/15 backdrop-blur-md">
              <div className="border border-[#2b2a28]/35 px-6 py-10 outline outline-1 outline-offset-4 outline-[#2b2a28]/15">
                <Ironwork className="mx-auto w-40 text-[#2b2a28]/70" />
                <h2
                  className={`${cormorantSc.className} mt-5 text-2xl tracking-[0.1em] text-[#8a4f58]`}
                >
                  {t("greeting")}
                </h2>
                <p className="mt-5 font-serif text-xl leading-relaxed">
                  {t("text", {
                    groom: taklif.groomName,
                    bride: taklif.brideName,
                  })}
                </p>
                <p className="mt-6 font-serif text-lg text-[#6d7262] italic">
                  {t("signature", { host: taklif.hostName })}
                </p>
              </div>
            </div>
          </div>
        </section>

        <Section title={t("date.title")}>
          <div className="haven-reveal">
            <p
              className={`${cormorantSc.className} text-sm tracking-[0.35em] text-[#6d7262]`}
            >
              {weekdays[date.weekday]}
            </p>
            {/* The day in a lantern's glow, ringed in iron. */}
            <div className="relative mx-auto mt-4 flex size-44 items-center justify-center">
              <div className="haven-glow absolute inset-0 rounded-full bg-[radial-gradient(circle,#f3c77d_0%,#f3c77d55_45%,transparent_70%)]" />
              <div className="absolute inset-3 rounded-full ring-1 ring-[#2b2a28]/40" />
              <div className="absolute inset-5 rounded-full ring-1 ring-[#2b2a28]/15" />
              <span
                className={`${prata.className} relative text-6xl text-[#2f3a2c]`}
              >
                {date.day}
              </span>
            </div>
            <p className={`${cormorantSc.className} mt-4 text-xl`}>
              {monthsStandalone[date.month]} {date.year}
            </p>
            <p className="mt-1 font-serif text-lg text-[#6d7262] italic">
              {t("date.time", { time: date.time })}
            </p>
          </div>
          <div className="haven-reveal mt-10">
            <p
              className={`${cormorantSc.className} mb-4 text-sm tracking-[0.3em] text-[#6d7262]`}
            >
              {t("countdown.title")}
            </p>
            <Countdown
              eventAt={taklif.eventAt}
              boxClassName="border border-[#2b2a28]/30 bg-[#ebe3d4]/70 py-3 outline outline-1 -outline-offset-4 outline-[#2b2a28]/10"
            />
          </div>
        </Section>

        {taklif.photos.length > 0 && (
          <Section title={t("gallery.title")}>
            <Moments
              photos={taklif.photos}
              alt={coupleNames(taklif)}
              frameClass="haven-reveal bg-[#fbf6ee] p-1.5 shadow-lg shadow-[#2b2a28]/15 ring-1 ring-[#2b2a28]/30"
            />
          </Section>
        )}

        <Section title={t("venue.title")}>
          <div className="haven-reveal">
            <p className={`${prata.className} text-2xl`}>{taklif.venueName}</p>
            <p className="mt-2 text-sm text-[#6d7262]">{taklif.venueAddress}</p>
            <MapLink
              url={taklif.locationUrl}
              className={`${cormorantSc.className} mt-6 inline-flex h-11 items-center bg-[#2f3a2c] px-7 text-base tracking-[0.15em] text-[#f4efe6] hover:bg-[#232c21]`}
            >
              {t("venue.map")}
            </MapLink>
          </div>
        </Section>

        <Section title={tRsvp("title")}>
          <div className="haven-reveal">
            <Rsvp
              slug={taklif.slug}
              preview={preview}
              palette={{
                input:
                  "bg-[#fbf6ee] ring-1 ring-[#2b2a28]/25 focus:ring-[#2f3a2c]",
                optionOn: "bg-[#2f3a2c] text-[#f4efe6]",
                optionOff: "bg-[#fbf6ee] ring-1 ring-[#2b2a28]/25",
                button: "bg-[#2f3a2c] text-[#f4efe6] hover:bg-[#232c21]",
                muted: "text-[#6d7262]",
                accent: "text-[#8a4f58]",
                card: "bg-[#fbf6ee] ring-1 ring-[#2b2a28]/20",
                error: "text-red-700",
              }}
            />
          </div>
        </Section>

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <div className="haven-reveal border border-[#2b2a28]/30 bg-[#ebe3d4]/60 px-6 py-8 outline outline-1 -outline-offset-[6px] outline-[#2b2a28]/10">
              <p className="text-sm text-[#6d7262]">{t("gift.text")}</p>
              <p className="mt-4 font-mono text-xl tracking-wider">
                {formatCardNumber(taklif.cardNumber)}
              </p>
              <CopyButton
                value={taklif.cardNumber}
                className="mt-4 px-5 py-2 text-sm ring-1 ring-[#2b2a28]/40 hover:bg-[#fbf6ee]"
              />
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className="haven-reveal inline-flex h-11 items-center px-6 text-sm ring-1 ring-[#2b2a28]/40 hover:bg-[#ebe3d4]"
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        <footer className="px-6 pt-20 pb-14">
          <Ironwork className="mx-auto w-44 text-[#2b2a28]/70" />
          <p
            className={`${prata.className} haven-reveal mt-6 text-3xl leading-snug text-[#2f3a2c]`}
          >
            {t("closing")}
          </p>
          <MadeWith className="mt-12 text-xs text-[#6d7262]" />
        </footer>
      </article>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-6 pt-20">
      <div className="haven-reveal mb-8">
        <h2
          className={`${cormorantSc.className} text-3xl tracking-[0.08em] text-[#2f3a2c]`}
        >
          {title}
        </h2>
        <span className="mx-auto mt-3 block h-px w-12 bg-[#b5707a]" />
      </div>
      {children}
    </section>
  );
}

/** Wrought-iron scrolls, like the gate's, around a small rose. */
function Ironwork({ className = "" }: { className?: string }) {
  const half = (
    <>
      <path
        pathLength={1}
        d="M96 20 C80 20 70 20 58 20 C46 20 40 12 46 7 C51 3 58 8 54 13 C51 16 47 13 49 11"
      />
      <path
        pathLength={1}
        d="M58 20 C48 20 40 28 32 28 C22 28 20 18 27 16 C32 15 34 21 30 22"
      />
      <path pathLength={1} d="M32 28 C24 28 14 22 4 22" />
    </>
  );
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 40"
      className={`haven-iron h-auto ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    >
      <g>{half}</g>
      <g transform="translate(200 0) scale(-1 1)">{half}</g>
      {/* The rose. */}
      <circle cx="100" cy="20" r="5.5" fill="#b5707a" fillOpacity="0.35" stroke="#b5707a" />
      <path
        pathLength={1}
        d="M100 16.5 C102.5 17.5 102.5 21 100 22 C98 21 98 18.5 100.5 18.5"
        stroke="#8a4f58"
        strokeWidth="1"
      />
    </svg>
  );
}

/** Old-rose petals tumbling over the palace. */
function Petals() {
  const petals: [number, number, string, string, string][] = [
    // left %, size px, delay, duration, drift
    [10, 14, "0s", "13s", "50px"],
    [70, 12, "2.5s", "12s", "-40px"],
    [40, 10, "5s", "15s", "30px"],
    [86, 13, "7.5s", "14s", "-30px"],
    [24, 11, "10s", "12s", "45px"],
    [58, 9, "12s", "16s", "-20px"],
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {petals.map(([x, size, delay, dur, drift]) => (
        <svg
          key={x}
          viewBox="0 0 20 24"
          className="haven-petal absolute top-0 opacity-0 motion-reduce:hidden"
          style={
            {
              left: `${x}%`,
              width: size,
              "--d": delay,
              "--dur": dur,
              "--drift": drift,
            } as CSSProperties
          }
        >
          <path
            d="M10 0 C17 5 20 13 15 20 C13 23 7 23 5 20 C0 13 3 5 10 0Z"
            fill="#e3a9ac"
          />
          <path
            d="M10 3 C11 9 11 15 10 21"
            stroke="#c98589"
            strokeWidth="0.8"
            fill="none"
          />
        </svg>
      ))}
    </div>
  );
}
