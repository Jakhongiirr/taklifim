"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import AutoScroll from "../shared/auto-scroll";
import SmoothScroll from "../shared/smooth-scroll";
import { Sprig } from "./lavender";

/** The seal breaks and the two doors of the card swing open. */
const OPENING_MS = 1300;
/** When the hero starts rising behind them. */
const HERO_MS = 350;
/** Then what's left of the cover fades into the page. */
const REVEAL_MS = 700;
const REDUCED_REVEAL_MS = 300;

/**
 * The lavel theme's opening, drawn in CSS rather than a video: a folded
 * card whose two doors meet in the middle under a lilac wax seal with a
 * lavender sprig. Tapping the seal (or anywhere on the cover) starts the
 * music, swings the doors open onto the page and fades out; <html> gets
 * `lavel-opened` for the hero's entrance. Reduced motion skips straight to
 * the page. Like the video covers, it locks scrolling while shown and is
 * hidden without JavaScript.
 */
export default function GateCover({
  musicUrl,
  initials,
}: {
  musicUrl: string | null;
  /** Under the seal, e.g. "F ♡ S". */
  initials: string;
}) {
  const t = useTranslations("Invitation");
  const audio = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<
    "closed" | "opening" | "revealing" | "open"
  >("closed");
  const [playing, setPlaying] = useState(false);
  const isOpen = state === "open";

  useEffect(() => {
    if (isOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  useEffect(
    () => () => document.documentElement.classList.remove("lavel-opened"),
    [],
  );

  function open() {
    if (state !== "closed") return;
    audio.current?.play().catch(() => undefined);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return reveal(REDUCED_REVEAL_MS);
    setState("opening");
    // The hero starts rising behind the doors as they swing open.
    setTimeout(
      () => document.documentElement.classList.add("lavel-opened"),
      HERO_MS,
    );
    setTimeout(() => reveal(REVEAL_MS), OPENING_MS);
  }

  function reveal(ms: number) {
    setState("revealing");
    document.documentElement.classList.add("lavel-opened");
    setTimeout(() => setState("open"), ms);
  }

  function toggleMusic() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => undefined);
    else el.pause();
  }

  return (
    <>
      {musicUrl && (
        <audio
          ref={audio}
          src={musicUrl}
          loop
          preload="auto"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}
      {isOpen && (
        <>
          <SmoothScroll />
          <AutoScroll />
        </>
      )}

      {!isOpen && (
        <div
          data-gate-cover
          data-state={state}
          onClick={open}
          className="fixed inset-0 z-40 overflow-hidden text-[#43345e] transition-opacity duration-700 ease-out motion-reduce:duration-300 data-[state=closed]:cursor-pointer data-[state=revealing]:pointer-events-none data-[state=revealing]:opacity-0"
        >
          {/* The two doors, each half the card. */}
          <div className="lavel-doors absolute inset-0 flex justify-center">
            <Door side="left" />
            <Door side="right" />
          </div>

          <div
            data-font-reveal
            className="lavel-cover-words pointer-events-none absolute inset-x-0 top-[13%] px-8 text-center"
          >
            <p className="text-[11px] font-semibold tracking-[0.35em] text-[#64557f] uppercase">
              {t("cover.eyebrow")}
            </p>
            <p className="mt-4 text-2xl leading-snug italic">
              {t("lavel.forYou")}
            </p>
          </div>

          <button
            type="button"
            tabIndex={state === "closed" ? 0 : -1}
            aria-label={t("cover.open")}
            className="lavel-seal absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6f58a8]"
          >
            <WaxSeal />
          </button>

          <div
            data-font-reveal
            className="lavel-cover-words pointer-events-none absolute inset-x-0 top-[calc(50%+4.5rem)] px-8 text-center"
          >
            <p className="text-[11px] font-semibold tracking-[0.35em] text-[#64557f] uppercase">
              {t("lavel.sealHint")}
            </p>
            <p className="mt-4 text-xl tracking-[0.3em] text-[#7257b3] italic">
              {initials}
            </p>
          </div>
        </div>
      )}
      <noscript>
        <style>{"[data-gate-cover]{display:none}"}</style>
      </noscript>

      {musicUrl && isOpen && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={playing ? t("music.pause") : t("music.play")}
          data-music-button
          className="fixed right-4 bottom-4 z-30 flex size-12 items-center justify-center rounded-full bg-[#fbf8fe]/90 text-[#6f58a8] shadow-lg ring-1 ring-[#a690d4]/50 backdrop-blur"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className={`size-5 ${playing ? "motion-safe:animate-[spin_6s_linear_infinite]" : ""}`}
          >
            <path
              d="M9 18V6l11-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {!playing && (
              <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" />
            )}
          </svg>
        </button>
      )}
    </>
  );
}

/**
 * Half of the folded card: lilac paper with a deckled inner rule and
 * sprigs leaning in from the outer corners.
 */
function Door({ side }: { side: "left" | "right" }) {
  const left = side === "left";
  return (
    <div
      className={`lavel-door lavel-paper relative h-full w-1/2 ${left ? "lavel-door-left border-r" : "lavel-door-right border-l"} border-[#a690d4]/40 shadow-[0_0_40px_rgba(67,52,94,0.12)]`}
    >
      <div
        className={`absolute inset-y-4 ${left ? "right-0 left-4 border-r-0" : "right-4 left-0 border-l-0"} border border-[#a690d4]/45`}
      />
      <Sprig
        bend={left ? 8 : -8}
        className={`absolute bottom-6 h-44 w-11 ${left ? "left-6 rotate-[14deg]" : "right-6 -rotate-[14deg]"}`}
      />
      <Sprig
        bend={left ? 5 : -5}
        className={`absolute bottom-5 h-32 w-8 ${left ? "left-14 rotate-[28deg]" : "right-14 -rotate-[28deg]"}`}
      />
      <Sprig
        bend={left ? -6 : 6}
        className={`absolute top-6 h-28 w-7 ${left ? "left-6 rotate-[160deg]" : "right-6 -rotate-[160deg]"}`}
      />
    </div>
  );
}

/** A lilac wax seal with a wavy rim and a lavender sprig pressed in it. */
function WaxSeal() {
  const rim = Array.from({ length: 32 }, (_, i) => {
    const a = (i / 32) * Math.PI * 2;
    const r = i % 2 ? 46 : 49;
    return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" className="block size-24 drop-shadow-lg">
      <defs>
        <radialGradient id="lavel-wax" cx="36%" cy="30%" r="78%">
          <stop offset="0" stopColor="#a58fd6" />
          <stop offset="0.55" stopColor="#7a62b3" />
          <stop offset="1" stopColor="#4e3b80" />
        </radialGradient>
      </defs>
      <polygon
        points={rim}
        fill="url(#lavel-wax)"
        stroke="#4e3b80"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <circle
        cx="50"
        cy="50"
        r="33"
        fill="none"
        stroke="#e4daf5"
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />
      <circle
        cx="50"
        cy="50"
        r="29.5"
        fill="none"
        stroke="#3a2b63"
        strokeOpacity="0.45"
        strokeWidth="0.8"
      />
      {/* The pressed sprig: a stem and its buds, in relief. */}
      <g
        fill="#e4daf5"
        fillOpacity="0.8"
        stroke="none"
        transform="rotate(-18 50 50)"
      >
        <path
          d="M50 76 Q51 50 50 26"
          fill="none"
          stroke="#e4daf5"
          strokeOpacity="0.8"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path d="M50 72 C44 66 43 60 45 55 C48 61 49 66 50 72Z" />
        {Array.from({ length: 7 }, (_, i) => {
          const y = 52 - i * 4;
          const s = 1 - i * 0.08;
          return (
            <g key={i}>
              <ellipse
                cx={50 - 2.6 * s}
                cy={y}
                rx={1.8 * s}
                ry={3.2 * s}
                transform={`rotate(-30 ${50 - 2.6 * s} ${y})`}
              />
              <ellipse
                cx={50 + 2.6 * s}
                cy={y}
                rx={1.8 * s}
                ry={3.2 * s}
                transform={`rotate(30 ${50 + 2.6 * s} ${y})`}
              />
            </g>
          );
        })}
        <ellipse cx="50" cy="25" rx="1.4" ry="2.8" />
      </g>
    </svg>
  );
}
