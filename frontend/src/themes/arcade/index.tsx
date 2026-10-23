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
import "./arcade.css";
import { yeseva } from "./fonts";

// A storybook garden party: cream, rose pink and sage, plum ink, like the
// château in the video; below the hero the page takes the blush paper of the
// painted letter.
const ASSETS = "/themes/arcade";

/**
 * Arcade: a fairy-tale château with a fountain, through its glass
 * conservatory and a banquet hall under pink chandeliers, out onto a
 * balcony over a lake (the opening video). The balcony's last frame is the
 * hero; further down the invitation's words are written onto a watercolour
 * letter of roses and butterflies, and a rose garland leads to the closing.
 */
export default async function ArcadeTheme({
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
      className={`${yeseva.className} text-[2.7rem] leading-[1.1] text-[#4d3a52] [text-shadow:0_0_18px_#fffaf6,0_0_5px_#fffaf6]`}
    >
      {taklif.groomName}
      <span className="my-1 block font-serif text-3xl text-[#c55b75] italic">
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
        <div className="relative isolate">
          <TextGlow tone="bg-[#fffaf6]/70" />
          <p className="text-[11px] tracking-[0.4em] text-[#7a4a64] uppercase">
            {t("cover.eyebrow")}
          </p>
          <div className="mt-4">{names}</div>
          <p className="mt-5 font-serif text-lg text-[#4d3a52]">{fullDate}</p>
        </div>
      </VideoCover>

      <article className="mx-auto max-w-md overflow-clip bg-[#f9ecdb] text-center text-[#4d3a52] md:shadow-2xl md:shadow-[#4d3a52]/15">
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-35% via-[#fdf8f4]/35 via-65% to-[#fdf8f4]/70" />
          <div className="relative isolate">
            <TextGlow tone="bg-[#fdf8f4]/75" className="arcade-rise" />
            <p
              className="arcade-rise text-[11px] tracking-[0.35em] text-[#74475f] uppercase"
              style={{ "--i": 0 } as CSSProperties}
            >
              {tw("invite")}
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
            <div
              className="arcade-rise mt-8"
              style={{ "--i": 3 } as CSSProperties}
            >
              <ScrollHint className="text-[#a8455e]" />
            </div>
          </div>
        </section>

        {/* The words, written straight onto a watercolour letter with roses
            in its corners and a gold stem down its right side. Its blush
            paper is the page's paper, and its foot fades into it. Sizes
            follow the section's width so the words always stay clear of the
            flowers. */}
        <section className="@container relative aspect-[736/1104]">
          <Image
            src={`${ASSETS}/frame.jpg`}
            alt=""
            fill
            unoptimized
            sizes="448px"
            className="object-cover [mask-image:linear-gradient(to_bottom,black_90%,transparent)]"
          />
          <div className="absolute inset-x-[16%] top-[18%] bottom-[30%] flex flex-col items-center justify-center">
            <div className="arcade-reveal">
              <h2
                className={`${yeseva.className} text-[6.2cqw] leading-tight text-[#4d3a52]`}
              >
                {guest
                  ? tw("greetingNamed", { name: guest.name })
                  : tw("greeting")}
              </h2>
              <p className="mt-[4cqw] font-serif text-[4.3cqw] leading-relaxed">
                <LetterWords
                  taklif={taklif}
                  fallback={tw("text", {
                    groom: taklif.groomName,
                    bride: taklif.brideName,
                  })}
                  fit
                />
              </p>
              <p className="mt-[4.5cqw] font-serif text-[4cqw] text-[#7d5f74] italic">
                {tw("signature", { host: taklif.hostName })}
              </p>
            </div>
          </div>
        </section>

        <Section title={tw("dateTitle")}>
          <div className="arcade-reveal">
            <div className="flex flex-col items-center">
              <p className="text-[10px] tracking-[0.3em] text-[#556e56] uppercase">
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
            <p className="mt-3 font-serif text-xl">
              {t("date.time", { time: date.time })}
            </p>
          </div>
          <div className="arcade-reveal mt-10">
            <p className="mb-4 text-xs tracking-[0.3em] text-[#556e56] uppercase">
              {tw("countdownTitle")}
            </p>
            <Countdown
              eventAt={taklif.eventAt}
              occasion={taklif.occasion}
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
            <p className="mt-2 text-sm text-[#7d5f74]">{taklif.venueAddress}</p>
            <VenueMap
              taklif={taklif}
              className="mt-6 rounded-2xl shadow-lg shadow-[#4d3a52]/10 ring-1 ring-[#d27f93]/40"
            />
            <MapLink
              taklif={taklif}
              className="mt-6 inline-flex h-11 items-center rounded-full bg-[#607c61] px-6 text-sm tracking-wide text-white hover:bg-[#516b52]"
            >
              {t("venue.map")}
            </MapLink>
          </div>
        </Section>

        <div className="px-4 pt-16">
          <Garland />
        </div>

        <Section title={tRsvp("title")}>
          <div className="arcade-reveal">
            <Rsvp
              slug={taklif.slug}
              guest={guest}
              preview={preview}
              palette={{
                input:
                  "bg-[#fffaf6] ring-1 ring-[#d27f93]/30 focus:ring-[#d27f93]",
                optionOn: "bg-[#c04c68] text-white",
                optionOff: "bg-[#fffaf6] ring-1 ring-[#d27f93]/30",
                button: "bg-[#c04c68] text-white hover:bg-[#a8455e]",
                muted: "text-[#7d5f74]",
                accent: "text-[#c55b75]",
                error: "text-red-700",
              }}
            />
          </div>
        </Section>

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <div className="arcade-reveal rounded-[2rem] bg-gradient-to-br from-[#f3d9dc] via-[#fffaf6] to-[#e6efe3] px-6 py-8 ring-1 ring-[#d27f93]/30">
              <p className="text-sm text-[#7d5f74]">{t("gift.text")}</p>
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

        <footer className="px-4 pt-16 pb-14">
          <Garland />
          <p
            className={`${yeseva.className} arcade-reveal mt-6 text-3xl leading-snug`}
          >
            {t("closing")}
          </p>
          <MadeWith className="mt-12 text-[#7d5f74]" />
        </footer>
      </article>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-6 pt-20">
      <div className="arcade-reveal mb-8">
        <Divider />
        <h2 className={`${yeseva.className} mt-3 text-3xl`}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

/** A garland of watercolour roses and gingham ribbon across the page. */
function Garland() {
  return (
    <Image
      src={`${ASSETS}/border.webp`}
      alt=""
      width={896}
      height={402}
      unoptimized
      sizes="448px"
      className="arcade-reveal mx-auto w-full"
    />
  );
}

/** Thin sage lines either side of a small rose dot. */
function Divider() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-3">
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#7d9a7e]/70" />
      <span className="size-1.5 rounded-full bg-[#d27f93]" />
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#7d9a7e]/70" />
    </div>
  );
}
