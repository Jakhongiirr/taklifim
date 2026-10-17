"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useRef, useState } from "react";
import AutoScroll from "../shared/auto-scroll";
import SmoothScroll from "../shared/smooth-scroll";

/** The flap opens and the card rises out of the envelope. */
const OPENING_MS = 1500;
/** Then the cover fades into the page. */
const REVEAL_MS = 900;
const REDUCED_REVEAL_MS = 300;

/**
 * The classic theme's opening: an envelope closed with a wax seal, drawn
 * in CSS rather than a video. Tapping the seal (or anywhere on the cover)
 * starts the music, opens the flap, lifts the card out (`card`) and fades
 * into the page; <html> gets `classic-opened` for the hero's entrance.
 * Reduced motion skips straight to the page. Like the video covers, it
 * locks scrolling while shown and is hidden without JavaScript.
 */
export default function SealCover({
  musicUrl,
  initials,
  card,
  children,
}: {
  musicUrl: string | null;
  /** On the seal, e.g. "F·S". */
  initials: string;
  /** The card inside the envelope (names, date). */
  card: ReactNode;
  /** Above the envelope (greeting, title). */
  children: ReactNode;
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
    () => () => document.documentElement.classList.remove("classic-opened"),
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
    setTimeout(() => reveal(REVEAL_MS), OPENING_MS);
  }

  function reveal(ms: number) {
    setState("revealing");
    document.documentElement.classList.add("classic-opened");
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
          data-seal-cover
          data-state={state}
          onClick={open}
          className="classic-paper fixed inset-0 z-40 overflow-hidden text-[#2b2420] transition-opacity duration-[900ms] ease-out motion-reduce:duration-300 data-[state=closed]:cursor-pointer data-[state=revealing]:pointer-events-none data-[state=revealing]:opacity-0"
        >
          <div className="relative mx-auto flex h-full max-w-md flex-col items-center justify-center px-6 text-center">
            <div data-font-reveal className="classic-cover-words">
              {children}
            </div>

            <div className="classic-envelope relative mt-10 aspect-[10/7] w-full max-w-[20rem]">
              {/* The card, tucked inside; it rises as the flap opens. */}
              <div className="classic-card absolute inset-x-[6%] top-[8%] bottom-[6%] flex flex-col items-center justify-center rounded-sm bg-[#fffdf8] px-4 shadow-md ring-1 ring-[#a8894f]/40">
                {card}
              </div>
              {/* The pocket: the envelope's front, over the card. */}
              <svg
                aria-hidden
                viewBox="0 0 100 70"
                preserveAspectRatio="none"
                className="absolute inset-0 size-full drop-shadow-[0_14px_18px_rgba(43,36,32,0.18)]"
              >
                <path d="M0 22 L50 47 L100 22 V70 H0Z" fill="#efe5d3" />
                <path d="M0 22 L44 50 L0 70Z" fill="#e9dcc6" />
                <path d="M100 22 L56 50 L100 70Z" fill="#e9dcc6" />
                <path
                  d="M0 70 L44 50 Q50 46 56 50 L100 70"
                  fill="none"
                  stroke="#a8894f"
                  strokeOpacity="0.35"
                  strokeWidth="0.3"
                />
              </svg>
              {/* The flap, folded down over the card until it opens. */}
              <svg
                aria-hidden
                viewBox="0 0 100 50"
                preserveAspectRatio="none"
                className="classic-flap absolute inset-x-0 top-0 h-[71%] w-full"
              >
                <path d="M0 0 H100 L54 46 Q50 49 46 46Z" fill="#e6d8bf" />
                <path
                  d="M0 0 L46 46 Q50 49 54 46 L100 0"
                  fill="none"
                  stroke="#a8894f"
                  strokeOpacity="0.45"
                  strokeWidth="0.3"
                />
              </svg>
              <button
                type="button"
                tabIndex={state === "closed" ? 0 : -1}
                aria-label={t("cover.open")}
                className="classic-seal absolute top-[71%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7a1f2b]"
              >
                <WaxSeal initials={initials} />
              </button>
            </div>

            <p
              data-font-reveal
              className="classic-cover-hint mt-12 text-[11px] font-semibold tracking-[0.35em] text-[#7a6a55] uppercase"
            >
              {t("classic.sealHint")}
            </p>
          </div>
        </div>
      )}
      <noscript>
        <style>{"[data-seal-cover]{display:none}"}</style>
      </noscript>

      {musicUrl && isOpen && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={playing ? t("music.pause") : t("music.play")}
          data-music-button
          className="fixed right-4 bottom-4 z-30 flex size-12 items-center justify-center rounded-full bg-[#fffdf8]/90 text-[#7a1f2b] shadow-lg ring-1 ring-[#a8894f]/50 backdrop-blur"
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

/** A burgundy wax seal with a wavy rim and the couple's initials. */
function WaxSeal({ initials }: { initials: string }) {
  // A rim of 14 soft bumps around the disc.
  const rim = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2;
    const r = i % 2 ? 46 : 49;
    return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" className="block size-20">
      <defs>
        <radialGradient id="classic-wax" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#a8323f" />
          <stop offset="0.55" stopColor="#7a1f2b" />
          <stop offset="1" stopColor="#4f121b" />
        </radialGradient>
      </defs>
      <polygon
        points={rim}
        fill="url(#classic-wax)"
        stroke="#4f121b"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <circle
        cx="50"
        cy="50"
        r="33"
        fill="none"
        stroke="#d9a3a9"
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />
      <circle
        cx="50"
        cy="50"
        r="29"
        fill="none"
        stroke="#3d0d14"
        strokeOpacity="0.5"
        strokeWidth="0.8"
      />
      <text
        x="50"
        y="51"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#f1d3d6"
        fillOpacity="0.9"
        fontSize="22"
        fontStyle="italic"
        fontFamily="inherit"
      >
        {initials}
      </text>
    </svg>
  );
}
