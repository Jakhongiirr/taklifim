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
import "./aurora.css";
import { greatVibes } from "./fonts";

// Ivory, champagne and gold, like the palace in the video, then the painted
// letter's parchment; warm brown text because the art is too bright for white.
const ASSETS = "/themes/aurora";

/**
 * Aurora: golden gates open onto a palace and its staircase hall (the
 * opening video). The hall's last frame is the hero; further down the
 * invitation's words are written onto a painted letter, and a garland of
 * flowers leads to the closing line.
 */
export default async function AuroraTheme({
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
        <div className="relative isolate">
          <TextGlow tone="bg-[#fffaf0]/60" />
          <p className="text-[11px] tracking-[0.4em] text-[#6e5128] uppercase">
            {t("cover.eyebrow")}
          </p>
          <div className="mt-5">{names}</div>
          <p className="mt-5 font-serif text-lg text-[#5c4325]">{fullDate}</p>
        </div>
      </VideoCover>

      <article className="mx-auto max-w-md overflow-clip bg-[#f9ecdb] text-center text-[#4f3a22] md:shadow-2xl md:shadow-[#4f3a22]/20">
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-35% via-[#fbf6ec]/35 via-65% to-[#fbf6ec]/70" />
          <Sparkles />
          <div className="relative isolate">
            <TextGlow tone="bg-[#fbf6ec]/75" className="aurora-rise" />
            <p
              className="aurora-rise text-[11px] tracking-[0.4em] text-[#6e5128] uppercase"
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
              className="aurora-rise mt-4 font-serif text-xl text-[#5c4325]"
              style={{ "--i": 2 } as CSSProperties}
            >
              {fullDate}
            </p>
            <div
              className="aurora-rise mt-8"
              style={{ "--i": 3 } as CSSProperties}
            >
              <ScrollHint className="text-[#b08a4e]" />
            </div>
          </div>
        </section>

        {/* The words, written straight onto a painted letter with gold
            scrolls, roses, a castle and a swan. Its parchment is the page's
            paper. Sizes follow the section's width so the words always fit
            inside the scrolls. */}
        <section className="@container relative aspect-[736/1104]">
          <Image
            src={`${ASSETS}/frame.jpg`}
            alt=""
            fill
            unoptimized
            sizes="448px"
            className="object-cover"
          />
          <div className="absolute inset-x-[18%] top-[31%] bottom-[29%] flex flex-col items-center justify-center">
            <div className="aurora-reveal">
              <h2 className="font-serif text-[6.2cqw] leading-tight text-[#7a5a2c]">
                {guest
                  ? t("greetingNamed", { name: guest.name })
                  : t("greeting")}
              </h2>
              <p className="mt-[3cqw] font-serif text-[4cqw] leading-relaxed">
                {t("text", {
                  groom: taklif.groomName,
                  bride: taklif.brideName,
                })}
              </p>
              <p className="mt-[3.5cqw] font-serif text-[3.9cqw] text-[#6e5638] italic">
                {t("signature", { host: taklif.hostName })}
              </p>
            </div>
          </div>
        </section>

        <Section title={t("date.title")}>
          <div className="aurora-reveal">
            <p className="text-xs tracking-[0.35em] text-[#755528] uppercase">
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
            <p className="mb-4 text-xs tracking-[0.3em] text-[#755528] uppercase">
              {t("countdown.title")}
            </p>
            <Countdown
              eventAt={taklif.eventAt}
              boxClassName="rounded-2xl bg-[#ead2ae]/70 py-3 ring-1 ring-[#b08a4e]/25"
            />
          </div>
        </Section>

        {taklif.photos.length > 0 && (
          <Section title={t("gallery.title")}>
            <Moments
              photos={taklif.photos}
              alt={coupleNames(taklif)}
              frameClass="aurora-reveal bg-[#f1e0c5] p-1.5 shadow-lg shadow-[#5c4325]/10 ring-1 ring-[#b08a4e]/45"
            />
          </Section>
        )}

        <Section title={t("venue.title")}>
          <div className="aurora-reveal">
            <p className="font-serif text-2xl text-[#7a5a2c]">
              {taklif.venueName}
            </p>
            <p className="mt-2 text-sm text-[#6e5638]">{taklif.venueAddress}</p>
            <VenueMap
              taklif={taklif}
              className="mt-6 rounded-2xl shadow-lg shadow-[#5c4325]/10 ring-1 ring-[#b08a4e]/45"
            />
            <MapLink
              taklif={taklif}
              className="mt-6 inline-flex h-11 items-center rounded-full bg-[#7a5a2c] px-6 text-sm tracking-wide text-[#f1e0c5] hover:bg-[#5c4325]"
            >
              {t("venue.map")}
            </MapLink>
          </div>
        </Section>

        <div className="px-4 pt-16">
          <Garland />
        </div>

        <Section title={tRsvp("title")}>
          <div className="aurora-reveal">
            <Rsvp
              slug={taklif.slug}
              guest={guest}
              preview={preview}
              palette={{
                input:
                  "bg-[#f1e0c5] ring-1 ring-[#b08a4e]/30 focus:ring-[#b08a4e]",
                optionOn: "bg-[#7a5a2c] text-[#f1e0c5]",
                optionOff: "bg-[#f1e0c5] ring-1 ring-[#b08a4e]/30",
                button: "bg-[#7a5a2c] text-[#f1e0c5] hover:bg-[#5c4325]",
                muted: "text-[#6e5638]",
                accent: "text-[#7a5a2c]",
                error: "text-red-700",
              }}
            />
          </div>
        </Section>

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <div className="aurora-reveal rounded-3xl bg-gradient-to-br from-[#ead2ae] to-[#f1e0c5] px-6 py-8 ring-1 ring-[#b08a4e]/30">
              <p className="text-sm text-[#6e5638]">{t("gift.text")}</p>
              <p className="mt-4 font-mono text-xl tracking-wider">
                {formatCardNumber(taklif.cardNumber)}
              </p>
              <CopyButton
                value={taklif.cardNumber}
                className="mt-4 rounded-full px-5 py-2 text-sm ring-1 ring-[#b08a4e]/60 hover:bg-[#f1e0c5]"
              />
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className="aurora-reveal inline-flex h-11 items-center rounded-full px-6 text-sm ring-1 ring-[#b08a4e]/60 hover:bg-[#ead2ae]"
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        <footer className="px-4 pt-16 pb-14">
          <Garland />
          <p
            className={`${greatVibes.className} aurora-reveal mt-6 text-5xl text-[#7a5a2c]`}
          >
            {t("closing")}
          </p>
          <MadeWith className="mt-12 text-[#6e5638]" />
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

/** A garland of watercolour peonies and wildflowers across the page. */
function Garland() {
  return (
    <Image
      src={`${ASSETS}/border.webp`}
      alt=""
      width={734}
      height={253}
      unoptimized
      sizes="448px"
      className="aurora-reveal mx-auto w-full"
    />
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
          className="aurora-sparkle absolute rounded-full bg-[#f1e0c5] shadow-[0_0_10px_3px_#fff3d6]"
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
