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
import ScrollHint from "../shared/scroll-hint";
import VenueMap from "../shared/venue-map";
import type { ThemeProps } from "../types";
import "./dove.css";
import { doveScript, forum } from "./fonts";

// Sunset blush from the rose arches for the opening, then the ivory paper
// and gold scrolls of the letter; rosewood text, a dusty blue for small lines.
const ASSETS = "/themes/dove";

/**
 * Dove: through a rose-covered arch, doves fly up and the guest walks down
 * a lantern-lit aisle (the opening video). The aisle's last frame is the
 * hero; further down the invitation's words are written onto a letter
 * under a dove with an olive branch, and two doves on a ribbon lead to the
 * closing line.
 */
export default async function DoveTheme({
  taklif,
  preview,
  guest,
}: ThemeProps) {
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
        className={`${forum.className} my-1 block text-xl tracking-[0.5em] text-[#a2626e]`}
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
        <div className="relative isolate">
          <TextGlow tone="bg-[#fff7f2]/60" />
          <p
            className={`${forum.className} text-xs tracking-[0.45em] text-[#6b3f4a] uppercase`}
          >
            {t("cover.eyebrow")}
          </p>
          <div className="mt-4">{names}</div>
          <p className={`${forum.className} mt-5 text-lg text-[#5a3e45]`}>
            {fullDate}
          </p>
        </div>
      </VideoCover>

      <article className="mx-auto max-w-md overflow-clip bg-[#f9ecdb] text-center text-[#5a3e45] md:shadow-2xl md:shadow-[#6b3f4a]/15">
        {/* Hero: the video's last frame, so its end becomes the page. */}
        <section className="relative flex h-dvh flex-col items-center justify-end overflow-clip px-6 pb-16">
          <Image
            src={`${ASSETS}/opening-end.jpg`}
            alt=""
            fill
            unoptimized
            priority
            sizes="448px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-35% via-[#f9ecdb]/35 via-65% to-[#f9ecdb]/70" />
          <Feathers />
          <div className="relative isolate">
            <TextGlow tone="bg-[#f9ecdb]/75" className="dove-rise" />
            <p
              className={`${forum.className} dove-rise text-xs tracking-[0.4em] text-[#6b3f4a] uppercase`}
              style={{ "--i": 0 } as CSSProperties}
            >
              {t("cover.invite")}
            </p>
            <div
              className="dove-rise mt-3"
              style={{ "--i": 1 } as CSSProperties}
            >
              {names}
            </div>
            <p
              className={`${forum.className} dove-rise mt-4 text-xl`}
              style={{ "--i": 2 } as CSSProperties}
            >
              {fullDate}
            </p>
            <div
              className="dove-rise mt-8"
              style={{ "--i": 3 } as CSSProperties}
            >
              <ScrollHint className="text-[#94565b]" />
            </div>
          </div>
        </section>

        {/* The words, written straight onto a letter with gold scrolls,
            white blossoms and a dove carrying an olive branch. Its paper is
            the page's paper. Sizes follow the section's width so the words
            always fit inside the scrolls. */}
        <section className="@container relative aspect-[862/1190]">
          <Image
            src={`${ASSETS}/frame.jpg`}
            alt=""
            fill
            unoptimized
            sizes="448px"
            className="object-cover"
          />
          <div className="absolute inset-x-[14%] top-[23%] bottom-[11%] flex flex-col items-center justify-center">
            <div className="dove-reveal">
              <h2
                className={`${forum.className} text-[5.6cqw] tracking-[0.12em] text-[#6b3f4a] uppercase`}
              >
                {guest
                  ? t("greetingNamed", { name: guest.name })
                  : t("greeting")}
              </h2>
              <p className="mt-[4cqw] font-serif text-[4.6cqw] leading-relaxed">
                {t("text", {
                  groom: taklif.groomName,
                  bride: taklif.brideName,
                })}
              </p>
              <p className="mt-[4.5cqw] font-serif text-[4.2cqw] text-[#796165] italic">
                {t("signature", { host: taklif.hostName })}
              </p>
            </div>
          </div>
        </section>

        <Section title={t("date.title")}>
          <div className="dove-reveal">
            {/* The day under an arch, like the ones in the video. */}
            <div className="relative mx-auto flex h-60 w-44 flex-col items-center justify-center rounded-t-full bg-gradient-to-b from-[#efe5d3] to-[#f9ecdb] ring-1 ring-[#b8955a]/50">
              <div className="absolute inset-2 rounded-t-full ring-1 ring-[#b8955a]/25" />
              <p
                className={`${forum.className} text-xs tracking-[0.35em] text-[#576a79] uppercase`}
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
              className={`${forum.className} mb-4 text-xs tracking-[0.3em] text-[#576a79] uppercase`}
            >
              {t("countdown.title")}
            </p>
            <Countdown
              eventAt={taklif.eventAt}
              boxClassName="rounded-t-full rounded-b-xl bg-[#efe5d3]/70 pt-5 pb-3 ring-1 ring-[#b8955a]/30"
            />
          </div>
        </Section>

        {taklif.photos.length > 0 && (
          <Section title={t("gallery.title")}>
            <Moments
              photos={taklif.photos}
              alt={coupleNames(taklif)}
              frameClass="dove-reveal bg-[#fdfaf4] p-1.5 shadow-lg shadow-[#6b3f4a]/10 ring-1 ring-[#b8955a]/50"
            />
          </Section>
        )}

        <Section title={t("venue.title")}>
          <div className="dove-reveal">
            <p className="font-serif text-2xl text-[#6b3f4a]">
              {taklif.venueName}
            </p>
            <p className="mt-2 text-sm text-[#796165]">{taklif.venueAddress}</p>
            <VenueMap
              taklif={taklif}
              className="mt-6 rounded-2xl shadow-lg shadow-[#6b3f4a]/10 ring-1 ring-[#b8955a]/50"
            />
            <MapLink
              taklif={taklif}
              className={`${forum.className} mt-6 inline-flex h-11 items-center rounded-full bg-[#6b3f4a] px-6 text-sm tracking-[0.15em] text-[#fdfaf4] uppercase hover:bg-[#5a3e45]`}
            >
              {t("venue.map")}
            </MapLink>
          </div>
        </Section>

        <div className="px-6 pt-16">
          <DoveBorder />
        </div>

        <Section title={tRsvp("title")}>
          <div className="dove-reveal">
            <Rsvp
              slug={taklif.slug}
              guest={guest}
              preview={preview}
              palette={{
                input:
                  "bg-[#fdfaf4] ring-1 ring-[#b8955a]/35 focus:ring-[#b8955a]",
                optionOn: "bg-[#6b3f4a] text-[#fdfaf4]",
                optionOff: "bg-[#fdfaf4] ring-1 ring-[#b8955a]/35",
                button: "bg-[#6b3f4a] text-[#fdfaf4] hover:bg-[#5a3e45]",
                muted: "text-[#796165]",
                accent: "text-[#6b3f4a]",
                error: "text-red-700",
              }}
            />
          </div>
        </Section>

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <div className="dove-reveal rounded-3xl bg-gradient-to-br from-[#efe5d3] via-[#fdfaf4] to-[#e7ece2] px-6 py-8 ring-1 ring-[#b8955a]/35">
              <p className="text-sm text-[#796165]">{t("gift.text")}</p>
              <p className="mt-4 font-mono text-xl tracking-wider">
                {formatCardNumber(taklif.cardNumber)}
              </p>
              <CopyButton
                value={taklif.cardNumber}
                className="mt-4 rounded-full px-5 py-2 text-sm ring-1 ring-[#6b3f4a]/40 hover:bg-[#fdfaf4]"
              />
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className="dove-reveal inline-flex h-11 items-center rounded-full px-6 text-sm ring-1 ring-[#6b3f4a]/40 hover:bg-[#efe5d3]"
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        <footer className="px-6 pt-16 pb-14">
          <DoveBorder />
          <p
            className={`${doveScript} dove-reveal mt-4 text-5xl leading-tight text-[#6b3f4a]`}
          >
            {t("closing")}
          </p>
          <MadeWith className="mt-12 text-[#796165]" />
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

/** Two watercolour doves on a ribbon, among rosehips, across the page. */
function DoveBorder() {
  return (
    <Image
      src={`${ASSETS}/border.webp`}
      alt=""
      width={552}
      height={329}
      unoptimized
      sizes="448px"
      className="dove-reveal mx-auto w-full"
    />
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
          <path
            d="M10 4 C10.5 16 10.5 28 10 39"
            stroke="#e0c4bb"
            strokeWidth="0.6"
          />
        </svg>
      ))}
    </div>
  );
}
