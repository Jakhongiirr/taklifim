import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import Ornament from "./ornament";

/**
 * The hero's sample invitation: a phone showing a "classic" invitation, a
 * gold arch behind it and two floating feature cards. Pure HTML/SVG.
 */
export default async function PhoneMockup() {
  const [t, tCount] = await Promise.all([
    getTranslations("HomePage.mock"),
    getTranslations("Invitation.countdown"),
  ]);

  return (
    <div className="relative mx-auto w-[228px] py-6 sm:w-[260px]">
      {/* Glow and a thin wedding arch behind the phone. */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[160%] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,132,79,0.22),rgba(70,82,63,0.08)_45%,transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden
        className="absolute inset-x-[-14%] top-0 bottom-[8%] -z-10 rounded-t-full border border-b-0 border-gold/35 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-[-8%] top-[4%] bottom-[8%] -z-10 rounded-t-full border border-b-0 border-gold/20 [mask-image:linear-gradient(to_bottom,black_45%,transparent)]"
      />

      <Phone>
        <div className="flex h-full flex-col items-center justify-between px-5 pt-1 pb-4 text-center">
          <div className="flex flex-col items-center">
            <Branch />
            <p className="mt-2 text-[9px] tracking-[0.35em] text-gold uppercase">
              {t("eyebrow")}
            </p>
            <p className="mt-3 font-serif text-[2rem] leading-[1.05] text-ink italic">
              {t("groom")}
              <span className="my-0.5 block text-xl text-gold not-italic">
                &
              </span>
              {t("bride")}
            </p>
            <p className="mt-3 text-[10px] leading-snug text-muted">
              {t("invite")}
            </p>
          </div>

          <div className="flex w-full flex-col items-center">
            {/* The theme's date row: weekday | day | month. */}
            <div className="flex w-full items-center justify-center gap-2">
              <span className="flex h-8 flex-1 items-center justify-center border-y border-gold/50 text-[8px] tracking-[0.15em] text-muted uppercase">
                {t("weekday")}
              </span>
              <span className="font-serif text-[2.6rem] leading-none text-sage">
                {t("day")}
              </span>
              <span className="flex h-8 flex-1 flex-col items-center justify-center border-y border-gold/50 text-[8px] leading-tight tracking-[0.15em] text-muted uppercase">
                {t("month")}
                <span>{t("year")}</span>
              </span>
            </div>
            <p className="mt-2 font-serif text-sm text-ink">{t("time")}</p>

            <div className="mt-3 grid w-full grid-cols-3 gap-1.5">
              {(
                [
                  ["14", "days"],
                  ["06", "hours"],
                  ["32", "minutes"],
                ] as const
              ).map(([n, unit]) => (
                <span
                  key={unit}
                  className="flex flex-col items-center rounded-xl bg-paper py-1.5 ring-1 ring-line"
                >
                  <span className="font-serif text-base leading-tight text-ink">
                    {n}
                  </span>
                  <span className="text-[7px] tracking-wide text-muted uppercase">
                    {tCount(unit)}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-[11px] font-medium text-ink">{t("venue")}</p>
            <span className="mt-2 inline-flex h-7 items-center gap-1 rounded-full bg-sage px-3.5 text-[10px] font-medium text-paper">
              <svg aria-hidden viewBox="0 0 24 24" className="size-3">
                <path
                  d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12ZM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
              {t("map")}
            </span>
            <Ornament className="mt-3 h-3 w-20 rotate-180" />
          </div>
        </div>
      </Phone>

      {/* Floating feature cards. */}
      <FloatingCard className="top-[16%] -right-10 sm:-right-16">
        <p className="font-serif text-2xl leading-none text-sage">
          {t("daysLeft")}
        </p>
        <p className="mt-1 text-[11px] text-muted">{t("daysLeftText")}</p>
      </FloatingCard>
      {/* In the gap between the countdown and the venue where there's room
          next to the phone; on phones and narrow two-column layouts, below
          the map button instead. */}
      <FloatingCard
        className="bottom-[3%] -left-10 sm:top-[71%] sm:bottom-auto sm:-left-[116px] md:top-auto md:bottom-[3%] md:-left-20 lg:top-[71%] lg:bottom-auto lg:-left-[116px]"
        delay="1.5s"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sage text-paper">
            <span aria-hidden className="flex h-3.5 items-end gap-[3px]">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="h-full w-[3px] origin-bottom rounded-full bg-current motion-safe:animate-[bars_0.9s_ease-in-out_infinite]"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </span>
          </span>
          <span className="text-left">
            <span className="block text-xs font-medium text-ink">
              {t("musicTitle")}
            </span>
            <span className="block text-[11px] text-muted">
              {t("musicText")}
            </span>
          </span>
        </div>
      </FloatingCard>
    </div>
  );
}

/** A phone frame: bezel, side buttons, status bar, camera and glass shine. */
function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {/* Side buttons. */}
      <span className="absolute top-[18%] -left-[3px] h-8 w-[3px] rounded-l bg-[#3a3530]" />
      <span className="absolute top-[28%] -left-[3px] h-12 w-[3px] rounded-l bg-[#3a3530]" />
      <span className="absolute top-[24%] -right-[3px] h-16 w-[3px] rounded-r bg-[#3a3530]" />

      <div className="aspect-[9/19.5] rounded-[3rem] bg-gradient-to-b from-[#3d3832] to-[#25221f] p-[7px] shadow-[0_40px_80px_-20px_rgba(42,39,35,0.45),0_0_0_1px_rgba(255,255,255,0.06)_inset]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[2.55rem] bg-[radial-gradient(120%_80%_at_50%_0%,#f8f3ea,#f2ece1_60%,#ece4d6)]">
          <div className="flex h-9 shrink-0 items-center justify-between px-6 pt-1 text-[10px] font-semibold text-ink">
            <span>9:41</span>
            <span className="flex items-center gap-1" aria-hidden>
              <svg viewBox="0 0 18 12" className="h-2.5">
                <path
                  d="M1 11h2V8H1zM5 11h2V6H5zM9 11h2V4H9zM13 11h2V1h-2z"
                  fill="currentColor"
                />
              </svg>
              <span className="flex h-2.5 w-5 items-center rounded-[3px] border border-ink/70 p-[1px]">
                <span className="h-full w-3/4 rounded-[1px] bg-ink" />
              </span>
            </span>
          </div>
          <span
            aria-hidden
            className="absolute top-2 left-1/2 h-[22px] w-[76px] -translate-x-1/2 rounded-full bg-[#1d1b18]"
          />
          <div className="min-h-0 flex-1">{children}</div>
          {/* Soft glass reflection. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.35)_0%,transparent_28%)]"
          />
        </div>
      </div>
    </div>
  );
}

function FloatingCard({
  className,
  delay = "0s",
  children,
}: {
  className: string;
  delay?: string;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden
      className={`absolute rounded-2xl bg-white/90 px-4 py-3 shadow-[0_12px_30px_-10px_rgba(42,39,35,0.25)] ring-1 ring-line backdrop-blur motion-safe:animate-[float_4s_ease-in-out_infinite_alternate] ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

/** An olive branch in gold, above the names. */
function Branch() {
  return (
    <svg aria-hidden viewBox="0 0 120 34" className="h-7 w-24 text-gold">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      >
        <path d="M10 26c18-3 34-9 50-20 16 11 32 17 50 20" />
        {[
          [22, 23, -30],
          [34, 19, -38],
          [46, 13, -48],
          [74, 13, 48],
          [86, 19, 38],
          [98, 23, 30],
        ].map(([x, y, r]) => (
          <ellipse
            key={x}
            cx={x}
            cy={y - 4}
            rx="2.4"
            ry="6"
            transform={`rotate(${r} ${x} ${y - 4})`}
          />
        ))}
        <circle cx="60" cy="6" r="2.2" fill="currentColor" />
      </g>
    </svg>
  );
}
