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
import { occasionMessages } from "../shared/occasion";
import LetterWords from "../shared/letter-words";
import type { ThemeProps } from "../types";
import "./violet.css";
import { marck, tenor } from "./fonts";

// A moonlit fairy tale: the cover keeps the castle's night violet and
// lantern gold; the page below takes the letter's midnight navy, moonlight
// silver and the periwinkle of its flowers. The only dark theme.
const ASSETS = "/themes/violet";

/**
 * Violet: a violet castle under a full moon, sky lanterns rising, down to a
 * flowered valley and its bridge (the opening video). The valley's last
 * frame is the hero; further down the invitation's words are written onto
 * a night sky framed by the moon, crystals and flowers by the sea, and a
 * garland of blue and white flowers leads to the closing line.
 */
export default async function VioletTheme({
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
        musicClass="bg-[#141c3e]/85 text-[#c9d2f4] ring-1 ring-[#9fb0f0]/40"
      >
        <div className="relative isolate">
          <TextGlow tone="bg-[#1b1430]/45" />
          <p
            className={`${tenor.className} text-[11px] tracking-[0.45em] text-[#f7f2ff] uppercase [text-shadow:0_0_10px_rgba(27,20,48,0.9)]`}
          >
            {t("cover.eyebrow")}
          </p>
          <div className="mt-4">{names}</div>
          <p
            className={`${tenor.className} mt-5 text-sm tracking-[0.15em] text-[#f7f2ff] [text-shadow:0_0_10px_rgba(27,20,48,0.9)]`}
          >
            {fullDate}
          </p>
        </div>
      </VideoCover>

      <article className="mx-auto max-w-md overflow-clip bg-[#0f1631] text-center text-[#eef0fa] md:shadow-2xl md:shadow-black/40">
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-35% via-[#1b1430]/35 via-65% to-[#1b1430]/70" />
          <div className="relative isolate">
            <TextGlow tone="bg-[#1b1430]/55" className="violet-rise" />
            <p
              className={`${tenor.className} violet-rise text-[11px] tracking-[0.35em] text-[#e6dcfa] uppercase`}
              style={{ "--i": 0 } as CSSProperties}
            >
              {tw("invite")}
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
            <div
              className="violet-rise mt-8"
              style={{ "--i": 3 } as CSSProperties}
            >
              <ScrollHint className="text-[#f5c27a]" />
            </div>
          </div>
        </section>

        {/* The letter: the words are written onto the night sky, between
            the moon, the crystals and the flowers by the sea. */}
        <section className="@container relative aspect-[736/1308]">
          <Image
            src={`${ASSETS}/frame.jpg`}
            alt=""
            fill
            unoptimized
            sizes="448px"
            className="object-cover [mask-image:linear-gradient(to_bottom,transparent,black_4%,black_94%,transparent)]"
          />
          <div className="absolute inset-x-[22%] top-[21%] bottom-[33%] flex flex-col items-center justify-center">
            <div className="violet-reveal">
              <h2
                className={`${tenor.className} text-[4.2cqw] leading-snug tracking-[0.16em] text-[#c9d2f4] uppercase`}
              >
                {guest
                  ? tw("greetingNamed", { name: guest.name })
                  : tw("greeting")}
              </h2>
              <p className="mt-[4cqw] font-serif text-[4.4cqw] leading-relaxed text-[#eef0fa]">
                <LetterWords
                  taklif={taklif}
                  fallback={tw("text", {
                    groom: taklif.groomName,
                    bride: taklif.brideName,
                  })}
                  fit
                />
              </p>
              <p className="mt-[4cqw] font-serif text-[4.2cqw] text-[#b4bde0] italic">
                {tw("signature", { host: taklif.hostName })}
              </p>
            </div>
          </div>
        </section>

        <Section title={tw("dateTitle")}>
          <div className="violet-reveal">
            <p
              className={`${tenor.className} text-xs tracking-[0.35em] text-[#b4bde0] uppercase`}
            >
              {weekdays[date.weekday]}
            </p>
            <p
              className={`${marck.className} mt-2 text-7xl leading-none text-[#eef0fa]`}
            >
              {date.day}
            </p>
            <p
              className={`${tenor.className} mt-4 text-base tracking-[0.15em] capitalize`}
            >
              {monthsStandalone[date.month]} {date.year}
            </p>
            <p className="mt-1 font-serif text-lg text-[#b4bde0] italic">
              {t("date.time", { time: date.time })}
            </p>
          </div>
          <div className="violet-reveal mt-10">
            <p
              className={`${tenor.className} mb-4 text-[11px] tracking-[0.3em] text-[#b4bde0] uppercase`}
            >
              {tw("countdownTitle")}
            </p>
            <Countdown
              eventAt={taklif.eventAt}
              occasion={taklif.occasion}
              boxClassName="rounded-2xl bg-[#18214a] py-3 text-[#eef0fa] ring-1 ring-[#9fb0f0]/30"
            />
          </div>
        </Section>

        {taklif.photos.length > 0 && (
          <Section title={t("gallery.title")}>
            <Moments
              photos={taklif.photos}
              alt={coupleNames(taklif)}
              frameClass="violet-reveal bg-[#18214a] p-1.5 shadow-lg shadow-black/40 ring-1 ring-[#c5cbe0]/35"
            />
          </Section>
        )}

        <Section title={t("venue.title")}>
          <div className="violet-reveal">
            <p className={`${marck.className} text-4xl text-[#eef0fa]`}>
              {taklif.venueName}
            </p>
            <p className="mt-2 text-sm text-[#b4bde0]">{taklif.venueAddress}</p>
            <VenueMap
              taklif={taklif}
              className="mt-6 rounded-2xl shadow-lg shadow-black/40 ring-1 ring-[#c5cbe0]/35"
            />
            <MapLink
              taklif={taklif}
              className={`${tenor.className} mt-6 inline-flex h-11 items-center rounded-full bg-[#c9d2f4] px-6 text-xs tracking-[0.2em] text-[#0f1631] uppercase hover:bg-[#dce2f8]`}
            >
              {t("venue.map")}
            </MapLink>
          </div>
        </Section>

        <div className="pt-16">
          <Garland />
        </div>

        <Section title={tRsvp("title")}>
          <div className="violet-reveal">
            <Rsvp
              slug={taklif.slug}
              guest={guest}
              preview={preview}
              palette={{
                input:
                  "bg-[#18214a] text-[#eef0fa] ring-1 ring-[#9fb0f0]/30 placeholder:text-[#b4bde0]/70 focus:ring-[#9fb0f0]",
                optionOn: "bg-[#c9d2f4] text-[#0f1631]",
                optionOff:
                  "bg-[#18214a] text-[#eef0fa] ring-1 ring-[#9fb0f0]/30",
                button: "bg-[#c9d2f4] text-[#0f1631] hover:bg-[#dce2f8]",
                muted: "text-[#b4bde0]",
                accent: "text-[#c9d2f4]",
                error: "text-[#ffb4c2]",
              }}
            />
          </div>
        </Section>

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <div className="violet-reveal rounded-3xl bg-gradient-to-br from-[#26336b] to-[#141c3e] px-6 py-8 ring-1 ring-[#c5cbe0]/30">
              <p className="text-sm text-[#b4bde0]">{t("gift.text")}</p>
              <p className="mt-4 font-mono text-xl tracking-wider text-[#eef0fa]">
                {formatCardNumber(taklif.cardNumber)}
              </p>
              <CopyButton
                value={taklif.cardNumber}
                className="mt-4 rounded-full px-5 py-2 text-sm text-[#eef0fa] ring-1 ring-[#c9d2f4]/60 hover:bg-white/5"
              />
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className="violet-reveal inline-flex h-11 items-center rounded-full px-6 text-sm ring-1 ring-[#9fb0f0]/50 hover:bg-white/5"
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        <footer className="pt-16 pb-14">
          <Garland />
          <p
            className={`${marck.className} violet-reveal mt-6 px-6 text-5xl leading-tight text-[#eef0fa]`}
          >
            {t("closing")}
          </p>
          <MadeWith className="mt-12 text-[#b4bde0]" />
        </footer>
      </article>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-6 pt-20">
      <div className="violet-reveal mb-8">
        <Divider />
        <h2
          className={`${tenor.className} mt-3 text-xl tracking-[0.25em] text-[#eef0fa] uppercase`}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

/** Two thin silver rules around a small periwinkle dot. */
function Divider() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-3">
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#c5cbe0]/70" />
      <span className="size-1.5 rounded-full bg-[#9fb0f0]" />
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#c5cbe0]/70" />
    </div>
  );
}

/** A garland of blue and white flowers across the page. */
function Garland() {
  return (
    <Image
      src={`${ASSETS}/border.webp`}
      alt=""
      width={1024}
      height={298}
      unoptimized
      sizes="448px"
      className="violet-reveal mx-auto w-full [mask-image:linear-gradient(to_bottom,black_78%,transparent)]"
    />
  );
}
