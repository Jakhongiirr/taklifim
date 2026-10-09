import Image from "next/image";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { coupleNames, formatCardNumber, formatPhone } from "@/lib/format";
import { tashkentParts } from "@/lib/tashkent-date";
import Countdown from "../shared/countdown";
import CopyButton from "../shared/copy-button";
import type { ThemeProps } from "../types";
import IslamicCover from "./cover";
import { amiri } from "./fonts";
import "./islamic.css";
import { Arch, Sparkle, Star8, StarDivider, StarPattern } from "./ornaments";

// Palette: deep emerald, gold and ivory.
const EMERALD = "bg-[#0b3b31] text-[#f7f1e3]";
const IVORY = "bg-[#f7f1e3] text-[#1f2a24]";

/**
 * "islamic": emerald and gold with 8-point stars and a mihrab arch, the
 * Bismillah, the marriage verse (Ar-Rum 30:21) and the dua for newlyweds.
 * Doors open onto it; sections fade in as they scroll into view.
 */
export default async function IslamicTheme({ taklif }: ThemeProps) {
  const [t, ti, tDates] = await Promise.all([
    getTranslations("Invitation"),
    getTranslations("Islamic"),
    getTranslations("Dates"),
  ]);
  const months = tDates.raw("months") as string[];
  const weekdays = tDates.raw("weekdays") as string[];
  const date = tashkentParts(taklif.eventAt);
  const names = coupleNames(taklif);
  const [hero, ...gallery] = taklif.photos;
  const shortDate = `${String(date.day).padStart(2, "0")} · ${String(date.month + 1).padStart(2, "0")} · ${date.year}`;
  // Staggered entrance after the doors open (islamic.css).
  const rise = (delay: number) => ({
    className: "islamic-rise",
    style: { animationDelay: `${delay}ms` },
  });

  return (
    <div className="min-h-full flex-1 bg-[#072821] md:py-10">
      <IslamicCover
        names={names}
        date={shortDate}
        musicUrl={taklif.music?.file.url ?? null}
      />

      <article className="mx-auto max-w-md overflow-hidden text-center md:rounded-[2rem] md:shadow-2xl md:shadow-black/40">
        {/* Hero */}
        <header
          className={`relative overflow-hidden px-6 pt-12 pb-14 ${EMERALD}`}
        >
          <StarPattern id="islamic-hero" className="text-[#c9a45c]/10" />
          <Star8
            className="absolute -top-24 -right-24 size-72 text-[#c9a45c]/15 motion-safe:animate-[spin_120s_linear_infinite]"
            strokeWidth={0.5}
          />
          <Sparkle className="top-16 left-8 size-3 text-[#e9d29b]" />
          <Sparkle
            className="top-40 right-10 size-2 text-[#e9d29b]"
            delay="1.1s"
          />
          <Sparkle
            className="bottom-24 left-12 size-2.5 text-[#e9d29b]"
            delay="2.2s"
          />

          <div className="relative">
            <p
              lang="ar"
              dir="rtl"
              {...rise(0)}
              className={`islamic-rise ${amiri.className} text-2xl text-[#e9d29b]`}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            {/* The names in a mihrab arch; the photo fills it when there's one. */}
            <div className="relative mx-auto mt-8 aspect-[2/3] w-full max-w-[300px]">
              {hero ? (
                <div
                  {...rise(250)}
                  className="islamic-rise absolute inset-0 overflow-hidden rounded-t-full border border-[#c9a45c]/70 p-1.5"
                >
                  <div className="relative size-full overflow-hidden rounded-t-full">
                    <Image
                      src={hero.url}
                      alt=""
                      fill
                      unoptimized
                      priority
                      sizes="300px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#072821] from-10% via-[#072821]/75 via-50% to-transparent to-85%" />
                  </div>
                </div>
              ) : (
                <Arch
                  draw
                  className="absolute inset-0 size-full text-[#c9a45c]"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-10">
                <p
                  {...rise(500)}
                  className="islamic-rise text-[10px] tracking-[0.3em] text-[#c9a45c] uppercase"
                >
                  {ti("eyebrow")}
                </p>
                <h1 className="mt-4 font-serif text-5xl leading-[1.05] italic [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.55))]">
                  <span
                    {...rise(700)}
                    className="islamic-rise islamic-gold block"
                  >
                    {taklif.groomName}
                  </span>
                  <span
                    {...rise(850)}
                    className="islamic-rise my-1 block text-2xl text-[#c9a45c] not-italic"
                  >
                    &
                  </span>
                  <span
                    {...rise(1000)}
                    className="islamic-rise islamic-gold block"
                  >
                    {taklif.brideName}
                  </span>
                </h1>
                <p
                  {...rise(1250)}
                  className="islamic-rise mt-5 font-serif text-xl text-[#e9d29b]"
                >
                  {shortDate}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* The marriage verse */}
        <section className={`relative px-8 pt-4 pb-14 ${EMERALD}`}>
          <StarDivider className="islamic-reveal text-[#c9a45c]" />
          <p
            lang="ar"
            dir="rtl"
            className={`islamic-reveal mt-8 ${amiri.className} text-2xl leading-[2] text-balance text-[#f5e2a8]`}
          >
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
            لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
          </p>
          <p className="islamic-reveal mt-6 text-sm leading-relaxed text-[#f7f1e3]/80 italic">
            {ti("ayahTranslation")}
          </p>
          <p className="islamic-reveal mt-3 text-xs tracking-[0.2em] text-[#c9a45c] uppercase">
            {ti("ayahRef")}
          </p>
        </section>

        <div className={IVORY}>
          <Section>
            <p className="font-serif text-2xl text-[#0b3b31]">
              {ti("greeting")}
            </p>
            <p className="mt-4 leading-relaxed text-[#1f2a24]/75">
              {ti("text", {
                groom: taklif.groomName,
                bride: taklif.brideName,
              })}
            </p>
            <p className="mt-6 font-serif text-xl text-[#0b3b31] italic">
              {t("signature", { host: taklif.hostName })}
            </p>
          </Section>

          <Section title={t("date.title")}>
            <p className="text-xs tracking-[0.25em] text-[#1f2a24]/60 uppercase">
              {weekdays[date.weekday]}
            </p>
            {/* The day inside a slowly turning 8-point star. */}
            <div className="relative mx-auto my-3 flex size-36 items-center justify-center">
              <Star8
                className="absolute inset-0 size-full text-[#c9a45c] motion-safe:animate-[spin_60s_linear_infinite]"
                strokeWidth={1}
              />
              <span className="relative font-serif text-6xl leading-none text-[#0b3b31]">
                {date.day}
              </span>
            </div>
            <p className="text-xs tracking-[0.25em] text-[#1f2a24]/60 uppercase">
              {months[date.month]} {date.year}
            </p>
            <p className="mt-4 font-serif text-2xl text-[#0b3b31]">
              {t("date.time", { time: date.time })}
            </p>
          </Section>

          <Section title={t("countdown.title")}>
            <Countdown
              eventAt={taklif.eventAt}
              boxClassName="bg-[#0b3b31] text-[#f5e2a8] ring-1 ring-[#c9a45c]/40"
            />
          </Section>

          <Section title={t("venue.title")}>
            <p className="font-serif text-3xl text-[#0b3b31]">
              {taklif.venueName}
            </p>
            <p className="mt-2 text-[#1f2a24]/70">{taklif.venueAddress}</p>
            <a
              href={taklif.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-[#0b3b31] px-7 font-medium text-[#f5e2a8] ring-1 ring-[#c9a45c]/50 transition-colors hover:bg-[#072821]"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-4">
                <path
                  d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12ZM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
              {t("venue.map")}
            </a>
          </Section>

          {gallery.length > 0 && (
            <Section title={t("gallery.title")}>
              <div className="grid grid-cols-2 gap-3">
                {gallery.map((photo, i) => (
                  <div
                    key={photo.id}
                    className={`relative overflow-hidden rounded-t-full border border-[#c9a45c]/60 p-1 ${
                      // An odd last photo spans the row instead of leaving a gap.
                      i === gallery.length - 1 && gallery.length % 2 === 1
                        ? "col-span-2 aspect-[4/3]"
                        : "aspect-[3/4]"
                    }`}
                  >
                    <div className="relative size-full overflow-hidden rounded-t-full">
                      <Image
                        src={photo.url}
                        alt=""
                        fill
                        unoptimized
                        sizes="(min-width: 768px) 224px, 50vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {taklif.cardNumber && (
            <Section title={t("gift.title")}>
              <p className="text-sm text-[#1f2a24]/70">{t("gift.text")}</p>
              <div className="mt-5 rounded-2xl bg-[#0b3b31] px-5 py-5 ring-1 ring-[#c9a45c]/40">
                <p className="font-mono text-xl tracking-wider text-[#f5e2a8]">
                  {formatCardNumber(taklif.cardNumber)}
                </p>
                <CopyButton
                  value={taklif.cardNumber}
                  className="mt-3 text-sm font-medium text-[#e9d29b] underline-offset-4 hover:underline"
                />
              </div>
            </Section>
          )}

          {taklif.phone && (
            <Section title={t("contact.title")}>
              <a
                href={`tel:${taklif.phone}`}
                className="inline-flex h-12 items-center rounded-full px-6 text-sm font-medium whitespace-nowrap text-[#0b3b31] ring-1 ring-[#0b3b31] transition-colors hover:bg-[#0b3b31] hover:text-[#f5e2a8]"
              >
                {t("contact.call")} · {formatPhone(taklif.phone)}
              </a>
            </Section>
          )}
        </div>

        {/* Closing: the Prophet's dua for newlyweds (ﷺ). */}
        <footer
          className={`relative overflow-hidden px-8 pt-14 pb-10 ${EMERALD}`}
        >
          <StarPattern id="islamic-footer" className="text-[#c9a45c]/10" />
          <div className="relative">
            <p className="islamic-reveal text-xs tracking-[0.3em] text-[#c9a45c] uppercase">
              {ti("duaTitle")}
            </p>
            <p
              lang="ar"
              dir="rtl"
              className={`islamic-reveal mt-6 ${amiri.className} text-2xl leading-[2] text-balance text-[#f5e2a8]`}
            >
              بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا
              فِي خَيْرٍ
            </p>
            <p className="islamic-reveal mt-4 text-sm leading-relaxed text-[#f7f1e3]/80 italic">
              {ti("duaTranslation")}
            </p>
            <StarDivider className="islamic-reveal mt-10 text-[#c9a45c]" />
            <p className="islamic-reveal mt-6 font-serif text-2xl">
              {ti("closing")}
            </p>
            <p className="islamic-reveal islamic-gold mt-3 font-serif text-3xl italic">
              {names}
            </p>
            <Link
              href="/"
              className="mt-12 inline-block text-xs text-[#f7f1e3]/50 hover:text-[#f7f1e3]"
            >
              {t("madeWith")}
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}

function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="islamic-reveal border-t border-[#c9a45c]/25 px-8 py-12">
      {title && (
        <h2 className="mb-6 text-xs tracking-[0.3em] text-[#a8843c] uppercase">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
