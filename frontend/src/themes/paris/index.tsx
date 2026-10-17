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
import { playfair, poiret } from "./fonts";
import "./paris.css";

// A love letter from Paris: warm cream paper, navy ink, sky blue and
// blush, like the balloons over the letter and the garland of roses.
const ASSETS = "/themes/paris";

/**
 * Paris: a sealed envelope opens onto the Eiffel Tower among waterfalls
 * and gold blossoms, down to the river (the opening video). The river's
 * last frame is the hero; further down the invitation's words are written
 * onto a sky of balloons and roses, and a garland of pink roses leads to
 * the closing line.
 */
export default async function ParisTheme({
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

      <article className="mx-auto max-w-md overflow-clip bg-[#f9ecdb] text-center text-[#2c3550] md:shadow-2xl md:shadow-[#2c3550]/15">
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
            <div
              className="paris-rise mt-8"
              style={{ "--i": 3 } as CSSProperties}
            >
              <ScrollHint className="text-[#b8925a]" />
            </div>
          </div>
        </section>

        {/* The letter: the words are written straight onto the sky,
            between the balloons and the roses. */}
        <section className="@container relative aspect-[736/1104]">
          <Image
            src={`${ASSETS}/frame.jpg`}
            alt=""
            fill
            unoptimized
            sizes="448px"
            className="object-cover [mask-image:linear-gradient(to_bottom,transparent,black_5%,black_92%,transparent)]"
          />
          <div className="absolute inset-x-[19%] top-[25%] bottom-[31%] flex flex-col items-center justify-center">
            <div className="paris-reveal">
              <h2
                className={`${playfair.className} text-[6.4cqw] leading-tight text-[#2c3550] italic`}
              >
                {guest
                  ? t("greetingNamed", { name: guest.name })
                  : t("greeting")}
              </h2>
              <p className="mt-[3.5cqw] font-serif text-[4.4cqw] leading-relaxed">
                {t("text", {
                  groom: taklif.groomName,
                  bride: taklif.brideName,
                })}
              </p>
              <p
                className={`${playfair.className} mt-[4cqw] text-[4.2cqw] text-[#5d6280] italic`}
              >
                {t("signature", { host: taklif.hostName })}
              </p>
            </div>
          </div>
        </section>

        <Section title={t("date.title")}>
          <div className="paris-reveal">
            <p
              className={`${poiret.className} text-xs font-semibold tracking-[0.3em] text-[#5d6280] uppercase`}
            >
              {weekdays[date.weekday]}
            </p>
            <p
              className={`${playfair.className} mt-2 text-6xl leading-none text-[#23407a]`}
            >
              {date.day}
            </p>
            <p
              className={`${playfair.className} mt-2 text-3xl capitalize italic`}
            >
              {monthsStandalone[date.month]}
            </p>
            <p
              className={`${poiret.className} mt-3 text-sm font-semibold tracking-[0.25em]`}
            >
              {date.year} · {date.time}
            </p>
          </div>
          <div className="paris-reveal mt-10">
            <p
              className={`${poiret.className} mb-4 text-xs font-semibold tracking-[0.3em] text-[#5d6280] uppercase`}
            >
              {t("countdown.title")}
            </p>
            <Countdown
              eventAt={taklif.eventAt}
              boxClassName="rounded-lg bg-[#fdf6ec] py-3 text-[#23407a] ring-1 ring-[#2c3550]/20"
            />
          </div>
        </Section>

        {taklif.photos.length > 0 && (
          <Section title={t("gallery.title")}>
            <Moments
              photos={taklif.photos}
              alt={coupleNames(taklif)}
              frameClass="paris-reveal bg-[#fdf6ec] p-1.5 shadow-lg shadow-[#2c3550]/10 ring-1 ring-[#b8925a]/45"
            />
          </Section>
        )}

        <Section title={t("venue.title")}>
          <div className="paris-reveal">
            <p className={`${playfair.className} text-2xl italic`}>
              {taklif.venueName}
            </p>
            <p className="mt-2 text-sm text-[#5d6280]">{taklif.venueAddress}</p>
            <VenueMap
              taklif={taklif}
              className="mt-6 rounded-2xl shadow-lg shadow-[#2c3550]/10 ring-1 ring-[#b8925a]/45"
            />
            <MapLink
              taklif={taklif}
              className={`${poiret.className} mt-6 inline-flex h-11 items-center rounded-full bg-[#2c3550] px-6 text-sm font-semibold tracking-[0.15em] text-[#fbf7f2] uppercase hover:bg-[#222a41]`}
            >
              {t("venue.map")}
            </MapLink>
          </div>
        </Section>

        <div className="px-4 pt-16">
          <Garland />
        </div>

        <Section title={tRsvp("title")}>
          <div className="paris-reveal">
            <Rsvp
              slug={taklif.slug}
              guest={guest}
              preview={preview}
              palette={{
                input:
                  "bg-[#fdf6ec] ring-1 ring-[#2c3550]/20 focus:ring-[#2c3550]",
                optionOn: "bg-[#2c3550] text-[#fbf7f2]",
                optionOff: "bg-[#fdf6ec] ring-1 ring-[#2c3550]/20",
                button: "bg-[#2c3550] text-[#fbf7f2] hover:bg-[#222a41]",
                muted: "text-[#5d6280]",
                accent: "text-[#b8925a]",
                error: "text-red-700",
              }}
            />
          </div>
        </Section>

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <div className="paris-reveal rounded-2xl bg-gradient-to-br from-[#dde6ef] via-[#fdf6ec] to-[#f6dcd6] px-6 py-8 ring-1 ring-[#b8925a]/35">
              <p className="text-sm text-[#5d6280]">{t("gift.text")}</p>
              <p className="mt-4 font-mono text-xl tracking-wider">
                {formatCardNumber(taklif.cardNumber)}
              </p>
              <CopyButton
                value={taklif.cardNumber}
                className="mt-4 rounded-full bg-[#fdf6ec] px-5 py-2 text-sm ring-1 ring-[#2c3550]/30 hover:bg-white"
              />
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className="paris-reveal inline-flex h-11 items-center rounded-full px-6 text-sm ring-1 ring-[#2c3550]/40 hover:bg-[#fdf6ec]"
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        <footer className="px-4 pt-16 pb-14">
          <Garland />
          <p
            className={`${playfair.className} paris-reveal mt-6 text-3xl leading-snug italic`}
          >
            {t("closing")}
          </p>
          <MadeWith className="mt-12 text-[#5d6280]" />
        </footer>
      </article>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-6 pt-20">
      <div className="paris-reveal mb-8">
        <Divider />
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

/** Two thin gold rules around a small blue dot. */
function Divider() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-3">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#b8925a]/70" />
      <span className="size-1.5 rounded-full bg-[#7d9cc4]" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#b8925a]/70" />
    </div>
  );
}

/** A garland of pink roses and blue leaves across the page. */
function Garland() {
  return (
    <Image
      src={`${ASSETS}/border.webp`}
      alt=""
      width={650}
      height={145}
      unoptimized
      sizes="448px"
      className="paris-reveal mx-auto w-full"
    />
  );
}
