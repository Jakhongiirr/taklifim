import Image from "next/image";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import Ornament from "@/components/site/ornament";
import { Link } from "@/i18n/navigation";
import { coupleNames, formatCardNumber, formatPhone } from "@/lib/format";
import { tashkentParts } from "@/lib/tashkent-date";
import Countdown from "../shared/countdown";
import CopyButton from "../shared/copy-button";
import type { ThemeProps } from "../types";
import MonthCalendar from "./calendar";
import ClassicCover from "./cover";
import "./classic.css";
import { FloralCorner, Petals, WaxSeal } from "./ornaments";

const GOLD = "text-[#a8844f]";

/**
 * "classic": ivory, serif and gold. An envelope with a wax seal opens onto
 * gold floral corners and drifting petals, an oval portrait, a month
 * calendar with the day circled, and sections that fade into view.
 */
export default async function ClassicTheme({ taklif }: ThemeProps) {
  const [t, tDates] = await Promise.all([
    getTranslations("Invitation"),
    getTranslations("Dates"),
  ]);
  const weekdays = tDates.raw("weekdays") as string[];
  const weekdaysShort = tDates.raw("weekdaysShort") as string[];
  const monthsStandalone = tDates.raw("monthsStandalone") as string[];
  const date = tashkentParts(taklif.eventAt);
  const names = coupleNames(taklif);
  const initials = `${taklif.groomName[0] ?? ""}&${taklif.brideName[0] ?? ""}`;
  const [hero, ...gallery] = taklif.photos;
  const shortDate = `${String(date.day).padStart(2, "0")} · ${String(date.month + 1).padStart(2, "0")} · ${date.year}`;
  // Staggered entrance after the envelope opens (classic.css).
  const rise = (delay: number) => ({ style: { animationDelay: `${delay}ms` } });

  return (
    <div className="min-h-full flex-1 bg-[#efe8dc] md:py-10">
      <ClassicCover
        names={names}
        initials={initials}
        date={shortDate}
        musicUrl={taklif.music?.file.url ?? null}
      />

      <article className="mx-auto max-w-md overflow-hidden bg-[#faf7f1] text-center text-[#2a2723] md:rounded-[2rem] md:shadow-2xl md:shadow-[#2a2723]/10">
        {/* Hero */}
        <header className="relative overflow-hidden px-8 pt-16 pb-14">
          <Petals />
          <FloralCorner className={`absolute top-2 left-2 w-32 ${GOLD}`} />
          <FloralCorner
            className={`absolute top-2 right-2 w-32 -scale-x-100 ${GOLD}`}
          />
          <FloralCorner
            className={`absolute bottom-2 left-2 w-24 -scale-y-100 opacity-60 ${GOLD}`}
          />
          <FloralCorner
            className={`absolute right-2 bottom-2 w-24 -scale-100 opacity-60 ${GOLD}`}
          />

          <div className="relative">
            <p
              {...rise(0)}
              className={`classic-rise text-[11px] tracking-[0.35em] uppercase ${GOLD}`}
            >
              {t("cover.eyebrow")}
            </p>

            {hero ? (
              // An oval portrait in a double gold frame.
              <div
                {...rise(200)}
                className="classic-rise mx-auto mt-8 aspect-[3/4] w-56 rounded-[50%] p-2 ring-1 ring-[#a8844f]/50"
              >
                <div className="relative size-full overflow-hidden rounded-[50%] ring-1 ring-[#a8844f]/30">
                  <Image
                    src={hero.url}
                    alt=""
                    fill
                    unoptimized
                    priority
                    sizes="224px"
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              <div
                {...rise(200)}
                className="classic-rise mt-8 flex justify-center"
              >
                <WaxSeal initials={initials} className="size-20 text-2xl" />
              </div>
            )}

            <h1 className="mt-8 font-serif text-[3.25rem] leading-[1.05] italic">
              <span {...rise(500)} className="classic-rise block">
                {taklif.groomName}
              </span>
              <span
                {...rise(650)}
                className={`classic-rise my-1 block font-serif text-3xl not-italic ${GOLD}`}
              >
                &
              </span>
              <span {...rise(800)} className="classic-rise block">
                {taklif.brideName}
              </span>
            </h1>

            <div {...rise(1000)} className="classic-rise mt-7">
              <Ornament className="mx-auto" />
              <p className="mt-4 font-serif text-xl tracking-wider text-[#46523f]">
                {shortDate}
              </p>
            </div>

            <div
              {...rise(1400)}
              className={`classic-rise mt-10 flex justify-center ${GOLD}`}
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="classic-nudge size-5"
              >
                <path
                  d="M6 9l6 6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </header>

        <Section>
          <p className="font-serif text-2xl">{t("greeting")}</p>
          <p className="mt-4 leading-relaxed text-[#6f675d]">
            {t("text", { groom: taklif.groomName, bride: taklif.brideName })}
          </p>
          <p className="mt-6 font-serif text-xl italic">
            {t("signature", { host: taklif.hostName })}
          </p>
        </Section>

        <Section title={t("date.title")}>
          <MonthCalendar
            year={date.year}
            month={date.month}
            day={date.day}
            title={`${monthsStandalone[date.month]} ${date.year}`}
            weekdays={weekdaysShort}
          />
          <p className="mt-6 font-serif text-xl text-[#46523f]">
            <span className="capitalize">{weekdays[date.weekday]}</span>
            {" · "}
            {t("date.time", { time: date.time })}
          </p>
        </Section>

        <Section title={t("countdown.title")}>
          <Countdown
            eventAt={taklif.eventAt}
            boxClassName="border-l border-[#a8844f]/30 py-1 text-[#2a2723] first:border-l-0"
          />
        </Section>

        <Section title={t("venue.title")}>
          <span
            className={`mx-auto flex size-12 items-center justify-center rounded-full ring-1 ring-[#a8844f]/40 ${GOLD}`}
          >
            <svg aria-hidden viewBox="0 0 24 24" className="size-5">
              <path
                d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12ZM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              />
            </svg>
          </span>
          <p className="mt-5 font-serif text-3xl">{taklif.venueName}</p>
          <p className="mt-2 text-[#6f675d]">{taklif.venueAddress}</p>
          <a
            href={taklif.locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-full border border-[#46523f] px-7 text-sm font-medium tracking-wide text-[#46523f] transition-colors hover:bg-[#46523f] hover:text-[#faf7f1]"
          >
            {t("venue.map")} <span aria-hidden>↗</span>
          </a>
        </Section>

        {gallery.length > 0 && (
          <Section title={t("gallery.title")}>
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((photo, i) => (
                <div
                  key={photo.id}
                  className={`rounded-[1.4rem] p-1 ring-1 ring-[#a8844f]/35 ${
                    // An odd last photo spans the row instead of leaving a gap.
                    i === gallery.length - 1 && gallery.length % 2 === 1
                      ? "col-span-2 aspect-[4/3]"
                      : "aspect-[3/4]"
                  }`}
                >
                  <div className="relative size-full overflow-hidden rounded-[1.1rem]">
                    <Image
                      src={photo.url}
                      alt=""
                      fill
                      unoptimized
                      sizes="(min-width: 768px) 224px, 50vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {taklif.cardNumber && (
          <Section title={t("gift.title")}>
            <p className="text-sm text-[#6f675d]">{t("gift.text")}</p>
            <div className="mx-auto mt-5 max-w-xs rounded-2xl border border-[#a8844f]/40 px-5 py-5">
              <p className="font-mono text-xl tracking-wider">
                {formatCardNumber(taklif.cardNumber)}
              </p>
              <CopyButton
                value={taklif.cardNumber}
                className="mt-3 text-sm font-medium text-[#46523f] underline-offset-4 hover:underline"
              />
            </div>
          </Section>
        )}

        {taklif.phone && (
          <Section title={t("contact.title")}>
            <a
              href={`tel:${taklif.phone}`}
              className="inline-flex h-12 items-center rounded-full border border-[#46523f] px-6 text-sm font-medium whitespace-nowrap text-[#46523f] transition-colors hover:bg-[#46523f] hover:text-[#faf7f1]"
            >
              {t("contact.call")} · {formatPhone(taklif.phone)}
            </a>
          </Section>
        )}

        {/* Closing */}
        <footer className="classic-reveal relative overflow-hidden px-8 pt-16 pb-12">
          <FloralCorner
            className={`absolute bottom-2 left-2 w-28 -scale-y-100 ${GOLD}`}
          />
          <FloralCorner
            className={`absolute right-2 bottom-2 w-28 -scale-100 ${GOLD}`}
          />
          <div className="relative">
            <div className="flex justify-center">
              <WaxSeal initials={initials} className="size-16 text-lg" />
            </div>
            <p className="mt-7 font-serif text-2xl">{t("closing")}</p>
            <p className="mt-3 font-serif text-3xl text-[#46523f] italic">
              {names}
            </p>
            <Link
              href="/"
              className="mt-14 inline-block text-xs text-[#6f675d] hover:text-[#2a2723]"
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
    <section className="classic-reveal px-8 py-12">
      <Ornament className="mx-auto mb-8 opacity-70" />
      {title && (
        <h2 className={`mb-6 text-[11px] tracking-[0.35em] uppercase ${GOLD}`}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
