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
import LetterText from "../shared/letter-text";
import { occasionMessages } from "../shared/occasion";
import type { ThemeProps } from "../types";
import { cormorantSc, prata } from "./fonts";
import "./haven.css";

// A painted old garden for the opening, then an old letter: parchment,
// brown ink, burgundy roses and the lanterns' amber.
const ASSETS = "/themes/haven";

/**
 * Haven: an iron gate in a rose garden opens onto an old palace under the
 * lanterns (the opening video). The palace's last frame is the hero;
 * further down the invitation's words are written onto an old letter, and
 * a garland of peonies leads to the closing line.
 */
export default async function HavenTheme({
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
        <div className="relative isolate">
          <TextGlow tone="bg-[#1c211a]/40" />
          <p
            className={`${cormorantSc.className} mt-4 text-sm font-semibold tracking-[0.4em] text-[#fbeee4] [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]`}
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
        </div>
      </VideoCover>

      <article className="mx-auto max-w-md overflow-clip bg-[#f9ecdb] text-center text-[#3d2b1f] md:shadow-2xl md:shadow-[#3d2b1f]/25">
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-35% via-[#f4efe6]/35 via-65% to-[#f4efe6]/70" />
          <Petals />
          <div className="relative isolate">
            <TextGlow tone="bg-[#f4efe6]/85" className="haven-rise" />
            <p
              className={`${cormorantSc.className} haven-rise text-sm font-semibold tracking-[0.25em] text-[#4a1c22]`}
              style={{ "--i": 0 } as CSSProperties}
            >
              {tw("invite")}
            </p>
            <div
              className="haven-rise mt-3"
              style={{ "--i": 1 } as CSSProperties}
            >
              {names("text-[#2f3a2c]", "text-[#6e2f36]")}
            </div>
            <p
              className={`${cormorantSc.className} haven-rise mt-4 text-xl text-[#2f3a2c]`}
              style={{ "--i": 2 } as CSSProperties}
            >
              {fullDate}
            </p>
            <div
              className="haven-rise mt-8"
              style={{ "--i": 3 } as CSSProperties}
            >
              <ScrollHint className="text-[#5a2a30]" />
            </div>
          </div>
        </section>

        {/* The words, written straight onto an old letter among roses,
            stamps and a pocket watch. Its parchment is the page's paper. */}
        <section className="relative aspect-[736/1104]">
          <Image
            src={`${ASSETS}/frame.jpg`}
            alt=""
            fill
            unoptimized
            sizes="448px"
            className="object-cover"
          />
          <div className="absolute inset-x-[19%] top-[19%] bottom-[15%] flex flex-col items-center justify-center">
            <div className="haven-reveal">
              <h2
                className={`${cormorantSc.className} text-2xl tracking-[0.1em] text-[#6e2f36]`}
              >
                {guest
                  ? tw("greetingNamed", { name: guest.name })
                  : tw("greeting")}
              </h2>
              <p className="mt-4 font-serif text-lg leading-relaxed sm:text-xl">
                <LetterText
                  text={tw("text", {
                    groom: taklif.groomName,
                    bride: taklif.brideName,
                  })}
                />
              </p>
              <p className="mt-5 font-serif text-lg text-[#56402c] italic">
                {tw("signature", { host: taklif.hostName })}
              </p>
            </div>
          </div>
        </section>

        <Section title={tw("dateTitle")}>
          <div className="haven-reveal">
            <p
              className={`${cormorantSc.className} text-sm tracking-[0.35em] text-[#6f5640]`}
            >
              {weekdays[date.weekday]}
            </p>
            {/* The day in a lantern's glow, ringed in iron. */}
            <div className="relative mx-auto mt-4 flex size-44 items-center justify-center">
              <div className="haven-glow absolute inset-0 rounded-full bg-[radial-gradient(circle,#f3c77d_0%,#f3c77d55_45%,transparent_70%)]" />
              <div className="absolute inset-3 rounded-full ring-1 ring-[#3d2b1f]/40" />
              <div className="absolute inset-5 rounded-full ring-1 ring-[#3d2b1f]/15" />
              <span
                className={`${prata.className} relative text-6xl text-[#5a2a30]`}
              >
                {date.day}
              </span>
            </div>
            <p className={`${cormorantSc.className} mt-4 text-xl`}>
              {monthsStandalone[date.month]} {date.year}
            </p>
            <p className="mt-1 font-serif text-lg text-[#6f5640] italic">
              {t("date.time", { time: date.time })}
            </p>
          </div>
          <div className="haven-reveal mt-10">
            <p
              className={`${cormorantSc.className} mb-4 text-sm tracking-[0.3em] text-[#6f5640]`}
            >
              {tw("countdownTitle")}
            </p>
            <Countdown
              eventAt={taklif.eventAt}
              occasion={taklif.occasion}
              boxClassName="border border-[#3d2b1f]/30 bg-[#dec5a0]/70 py-3 outline outline-1 -outline-offset-4 outline-[#3d2b1f]/10"
            />
          </div>
        </Section>

        {taklif.photos.length > 0 && (
          <Section title={t("gallery.title")}>
            <Moments
              photos={taklif.photos}
              alt={coupleNames(taklif)}
              frameClass="haven-reveal bg-[#e8d5b4] p-1.5 shadow-lg shadow-[#3d2b1f]/15 ring-1 ring-[#3d2b1f]/30"
            />
          </Section>
        )}

        <Section title={t("venue.title")}>
          <div className="haven-reveal">
            <p className={`${prata.className} text-2xl`}>{taklif.venueName}</p>
            <p className="mt-2 text-sm text-[#6f5640]">{taklif.venueAddress}</p>
            <VenueMap
              taklif={taklif}
              className="mt-6 shadow-lg shadow-[#3d2b1f]/15 ring-1 ring-[#3d2b1f]/30"
            />
            <MapLink
              taklif={taklif}
              className={`${cormorantSc.className} mt-6 inline-flex h-11 items-center bg-[#5a2a30] px-7 text-base tracking-[0.15em] text-[#f3e6cf] hover:bg-[#47201f]`}
            >
              {t("venue.map")}
            </MapLink>
          </div>
        </Section>

        <div className="px-4 pt-16">
          <Garland />
        </div>

        <Section title={tRsvp("title")}>
          <div className="haven-reveal">
            <Rsvp
              slug={taklif.slug}
              guest={guest}
              preview={preview}
              palette={{
                input:
                  "bg-[#e8d5b4] ring-1 ring-[#3d2b1f]/25 focus:ring-[#5a2a30]",
                optionOn: "bg-[#5a2a30] text-[#f3e6cf]",
                optionOff: "bg-[#e8d5b4] ring-1 ring-[#3d2b1f]/25",
                button: "bg-[#5a2a30] text-[#f3e6cf] hover:bg-[#47201f]",
                muted: "text-[#6f5640]",
                accent: "text-[#6e2f36]",
                error: "text-red-700",
              }}
            />
          </div>
        </Section>

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <div className="haven-reveal border border-[#3d2b1f]/30 bg-[#dec5a0]/60 px-6 py-8 outline outline-1 -outline-offset-[6px] outline-[#3d2b1f]/10">
              <p className="text-sm text-[#6f5640]">{t("gift.text")}</p>
              <p className="mt-4 font-mono text-xl tracking-wider">
                {formatCardNumber(taklif.cardNumber)}
              </p>
              <CopyButton
                value={taklif.cardNumber}
                className="mt-4 px-5 py-2 text-sm ring-1 ring-[#3d2b1f]/40 hover:bg-[#e8d5b4]"
              />
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className="haven-reveal inline-flex h-11 items-center px-6 text-sm ring-1 ring-[#3d2b1f]/40 hover:bg-[#dec5a0]"
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        <footer className="px-4 pt-16 pb-14">
          <Garland />
          <p
            className={`${prata.className} haven-reveal mt-6 text-3xl leading-snug text-[#5a2a30]`}
          >
            {t("closing")}
          </p>
          <MadeWith className="mt-12 text-[#6f5640]" />
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
          className={`${cormorantSc.className} text-3xl tracking-[0.08em] text-[#5a2a30]`}
        >
          {title}
        </h2>
        <span className="mx-auto mt-3 block h-px w-12 bg-[#8e4a52]" />
      </div>
      {children}
    </section>
  );
}

/** A garland of watercolour peonies across the page. */
function Garland() {
  return (
    <Image
      src={`${ASSETS}/border.webp`}
      alt=""
      width={900}
      height={387}
      unoptimized
      sizes="448px"
      className="haven-reveal mx-auto w-full"
    />
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
