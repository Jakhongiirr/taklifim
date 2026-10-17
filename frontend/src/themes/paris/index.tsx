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
import TextGlow from "../shared/text-glow";
import VideoCover from "../shared/video-cover";
import type { ThemeProps } from "../types";
import { playfair, poiret } from "./fonts";
import "./paris.css";

// A love letter from Paris: cream paper, navy ink, sky blue and blush,
// gold blossoms, and the city's blue enamel street signs.
const ASSETS = "/themes/paris";

/**
 * Paris: a sealed envelope opens onto the Eiffel Tower among waterfalls
 * and gold blossoms, down to the river (the opening video). The river's
 * last frame is the hero; further down the invitation is a letter in a
 * rococo frame of roses.
 */
export default async function ParisTheme({ taklif, preview }: ThemeProps) {
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
  const initials = `${taklif.groomName[0]}${taklif.brideName[0]}`;

  const names = (
    <h1
      className={`${playfair.className} text-[2.5rem] leading-[1.1] font-normal text-[#2c3550] italic`}
    >
      {taklif.groomName}
      <span
        className={`${poiret.className} my-1 block text-2xl text-[#9c7640] not-italic`}
      >
        &amp;
      </span>
      {taklif.brideName}
    </h1>
  );

  return (
    <>
      {/* The video opens on the sealed envelope: the words sit below the seal. */}
      <VideoCover
        video={{
          src: `${ASSETS}/opening.mp4`,
          poster: `${ASSETS}/opening-start.jpg`,
        }}
        musicUrl={taklif.music?.file.url ?? null}
        openedClass="paris-opened"
        overlayClass="bg-gradient-to-b from-transparent via-transparent to-[#fbf7f2]/50"
        contentClass="justify-end pb-[12%]"
        buttonClass={`${poiret.className} border-[#2c3550]/50 bg-[#fbf7f2]/80 text-sm font-semibold tracking-[0.2em] text-[#2c3550] uppercase hover:bg-[#fbf7f2]`}
        musicClass="bg-[#fbf7f2]/90 text-[#2c3550] ring-1 ring-[#b8925a]/50"
      >
        {names}
        <p className={`${poiret.className} mt-4 text-base font-semibold`}>
          {fullDate}
        </p>
      </VideoCover>

      <article className="mx-auto max-w-md overflow-clip bg-[#fbf7f2] text-center text-[#2c3550] md:shadow-2xl md:shadow-[#2c3550]/15">
        {/* Hero: the video's last frame, so its end becomes the page. */}
        <section className="relative flex h-dvh flex-col items-center justify-end overflow-clip px-6 pb-16">
          <Image
            src={`${ASSETS}/opening-end.jpg`}
            alt=""
            fill
            unoptimized
            priority
            sizes="448px"
            className="paris-drift object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-35% via-[#fbf7f2]/35 via-65% to-[#fbf7f2]/70" />
          <Blossoms />
          <div className="relative isolate">
            <TextGlow tone="bg-[#fbf7f2]/80" className="paris-rise" />
            <p
              className={`${poiret.className} paris-rise text-[13px] font-semibold tracking-[0.3em] text-[#2c3550] uppercase`}
              style={{ "--i": 0 } as CSSProperties}
            >
              {t("cover.invite")}
            </p>
            <div
              className="paris-rise mt-3"
              style={{ "--i": 1 } as CSSProperties}
            >
              {names}
            </div>
            <p
              className={`${poiret.className} paris-rise mt-4 text-lg font-semibold`}
              style={{ "--i": 2 } as CSSProperties}
            >
              {fullDate}
            </p>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="paris-hint mx-auto mt-8 size-6 text-[#b8925a]"
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

        {/* The letter, in the rococo frame. */}
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
          <div className="relative px-8 py-28">
            <div className="paris-reveal relative bg-[#fffdf9]/90 px-6 pt-14 pb-10 shadow-xl shadow-[#2c3550]/15 backdrop-blur-sm">
              {/* Deckled inner rule, like letter paper. */}
              <div className="pointer-events-none absolute inset-2 border border-[#b8925a]/40" />
              <WaxSeal
                initials={initials}
                className="absolute -top-8 left-1/2 -translate-x-1/2"
              />
              <h2
                className={`${playfair.className} text-2xl text-[#2c3550] italic`}
              >
                {t("greeting")}
              </h2>
              <p className="mt-5 font-serif text-xl leading-relaxed">
                {t("text", {
                  groom: taklif.groomName,
                  bride: taklif.brideName,
                })}
              </p>
              <p
                className={`${playfair.className} mt-6 text-lg text-[#6b7088] italic`}
              >
                {t("signature", { host: taklif.hostName })}
              </p>
            </div>
          </div>
        </section>

        <Section title={t("date.title")}>
          {/* The date as a Paris street sign: blue enamel, white rule. */}
          <div className="paris-sign mx-auto max-w-[19rem] rounded-xl bg-[#2f4a3a] p-1.5 shadow-lg shadow-[#2c3550]/25">
            <div className="rounded-lg bg-[#23407a] p-1">
              <div className="rounded-md border-2 border-white/90 px-4 py-4 text-white">
                <p
                  className={`${poiret.className} text-xs font-semibold tracking-[0.3em] uppercase`}
                >
                  {weekdays[date.weekday]}
                </p>
                <p
                  className={`${playfair.className} mt-1 text-5xl leading-none font-medium`}
                >
                  {date.day}{" "}
                  <span className="text-3xl capitalize italic">
                    {monthsStandalone[date.month]}
                  </span>
                </p>
                <p
                  className={`${poiret.className} mt-2 text-sm font-semibold tracking-[0.25em]`}
                >
                  {date.year} · {date.time}
                </p>
              </div>
            </div>
          </div>
          <div className="paris-reveal mt-10">
            <p
              className={`${poiret.className} mb-4 text-xs font-semibold tracking-[0.3em] text-[#6b7088] uppercase`}
            >
              {t("countdown.title")}
            </p>
            <Countdown
              eventAt={taklif.eventAt}
              boxClassName="rounded-lg bg-[#23407a] py-3 text-white shadow-md shadow-[#2c3550]/20 ring-2 ring-inset ring-white/80"
            />
          </div>
        </Section>

        {taklif.photos.length > 0 && (
          <Section title={t("gallery.title")}>
            <Moments
              photos={taklif.photos}
              alt={coupleNames(taklif)}
              frameClass="paris-reveal bg-white p-1.5 shadow-lg shadow-[#2c3550]/10 ring-1 ring-[#b8925a]/45"
            />
          </Section>
        )}

        <Section title={t("venue.title")}>
          <div className="paris-reveal">
            <p className={`${playfair.className} text-2xl italic`}>
              {taklif.venueName}
            </p>
            <p className="mt-2 text-sm text-[#6b7088]">{taklif.venueAddress}</p>
            <MapLink
              url={taklif.locationUrl}
              className={`${poiret.className} mt-6 inline-flex h-11 items-center rounded-full bg-[#2c3550] px-6 text-sm font-semibold tracking-[0.15em] text-[#fbf7f2] uppercase hover:bg-[#222a41]`}
            >
              {t("venue.map")}
            </MapLink>
          </div>
        </Section>

        <Section title={tRsvp("title")}>
          <div className="paris-reveal">
            <Rsvp
              slug={taklif.slug}
              preview={preview}
              palette={{
                input: "bg-white ring-1 ring-[#2c3550]/20 focus:ring-[#2c3550]",
                optionOn: "bg-[#2c3550] text-[#fbf7f2]",
                optionOff: "bg-white ring-1 ring-[#2c3550]/20",
                button: "bg-[#2c3550] text-[#fbf7f2] hover:bg-[#222a41]",
                muted: "text-[#6b7088]",
                accent: "text-[#b8925a]",
                error: "text-red-700",
              }}
            />
          </div>
        </Section>

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <div className="paris-reveal rounded-2xl bg-gradient-to-br from-[#dbe7f0] via-white to-[#f6dfe0] px-6 py-8 ring-1 ring-[#b8925a]/35">
              <p className="text-sm text-[#6b7088]">{t("gift.text")}</p>
              <p className="mt-4 font-mono text-xl tracking-wider">
                {formatCardNumber(taklif.cardNumber)}
              </p>
              <CopyButton
                value={taklif.cardNumber}
                className="mt-4 rounded-full bg-white px-5 py-2 text-sm ring-1 ring-[#2c3550]/30 hover:bg-[#fbf7f2]"
              />
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className="paris-reveal inline-flex h-11 items-center rounded-full px-6 text-sm ring-1 ring-[#2c3550]/40 hover:bg-white"
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        <footer className="px-6 pt-20 pb-14">
          <TowerDivider />
          <p
            className={`${playfair.className} paris-reveal mt-6 text-3xl leading-snug italic`}
          >
            {t("closing")}
          </p>
          <MadeWith className="mt-12 text-xs text-[#6b7088]" />
        </footer>
      </article>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-6 pt-20">
      <div className="paris-reveal mb-8">
        <TowerDivider />
        <h2
          className={`${poiret.className} mt-3 text-2xl font-semibold tracking-[0.12em] uppercase`}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

/** The Eiffel Tower in gold line between two thin rules. */
function TowerDivider() {
  return (
    <div aria-hidden className="flex items-end justify-center gap-3">
      <span className="mb-1 h-px w-16 bg-gradient-to-r from-transparent to-[#b8925a]/70" />
      <svg
        viewBox="0 0 40 80"
        className="h-10 w-5 text-[#b8925a]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 1 V6" />
        <path d="M20 6 L21.5 18 L24 32 L28 52 L37 78" />
        <path d="M20 6 L18.5 18 L16 32 L12 52 L3 78" />
        <path d="M18.4 18 H21.6 M15.6 32 H24.4 M11.6 52 H28.4" />
        <path d="M10 66 C14 57 26 57 30 66" />
        <path d="M16 32 L24 52 M24 32 L16 52" strokeWidth="0.8" />
      </svg>
      <span className="mb-1 h-px w-16 bg-gradient-to-l from-transparent to-[#b8925a]/70" />
    </div>
  );
}

/** A gold wax seal with the couple's initials, like the envelope's. */
function WaxSeal({
  initials,
  className = "",
}: {
  initials: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`flex size-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#e6c98e,#b8925a_55%,#8a6d3f)] shadow-[0_6px_14px_-4px_rgba(80,60,30,0.55)] ${className}`}
    >
      <span
        className={`${playfair.className} flex size-12 items-center justify-center rounded-full border border-dashed border-[#fbf0d8]/70 text-lg text-[#fff8e8] italic`}
      >
        {initials}
      </span>
    </div>
  );
}

/** Gold five-petal blossoms drifting over the river. */
function Blossoms() {
  const blossoms: [number, number, string, string, string][] = [
    // left %, size px, delay, duration, drift
    [14, 16, "0s", "14s", "40px"],
    [70, 12, "2.5s", "16s", "-30px"],
    [44, 10, "5s", "13s", "25px"],
    [86, 14, "8s", "15s", "-35px"],
    [28, 11, "11s", "17s", "30px"],
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {blossoms.map(([x, size, delay, dur, drift]) => (
        <svg
          key={x}
          viewBox="0 0 20 20"
          className="paris-blossom absolute top-0 opacity-0 motion-reduce:hidden"
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
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx="10"
              cy="5"
              rx="3"
              ry="4.5"
              transform={`rotate(${a} 10 10)`}
              fill="#e2c27e"
            />
          ))}
          <circle cx="10" cy="10" r="2.2" fill="#b8925a" />
        </svg>
      ))}
    </div>
  );
}
