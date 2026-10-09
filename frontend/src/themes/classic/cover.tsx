"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { WaxSeal } from "./ornaments";

// The opening sequence, in ms from the tap.
const REVEAL_AT = 1650; // the page starts entering (.classic-opened)
const DONE_AT = 2300; // the envelope is removed
const REDUCED_DONE_AT = 350;

/**
 * A sealed envelope over the invitation. Tapping the seal (or the button)
 * lifts the seal, folds the flap open, slides the card out and fades the
 * envelope away; it also starts the music (browsers only play audio after a
 * user gesture) and marks <html> with .classic-opened for the hero's
 * entrance (classic.css).
 */
export default function ClassicCover({
  names,
  initials,
  date,
  musicUrl,
}: {
  names: string;
  initials: string;
  date: string;
  musicUrl: string | null;
}) {
  const t = useTranslations("Invitation");
  const audio = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<"closed" | "opening" | "open">("closed");
  const [playing, setPlaying] = useState(false);
  const isOpen = state === "open";
  const opening = state === "opening";

  // No scrolling behind the envelope.
  useEffect(() => {
    if (isOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  // Leaving the page resets the entrance.
  useEffect(
    () => () => document.documentElement.classList.remove("classic-opened"),
    [],
  );

  function open() {
    if (state !== "closed") return;
    setState("opening");
    audio.current?.play().catch(() => undefined);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setTimeout(
      () => document.documentElement.classList.add("classic-opened"),
      reduced ? 0 : REVEAL_AT,
    );
    setTimeout(() => setState("open"), reduced ? REDUCED_DONE_AT : DONE_AT);
  }

  function toggleMusic() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => undefined);
    else el.pause();
  }

  const step =
    "transition-all ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none";

  return (
    <>
      {musicUrl && (
        <audio
          ref={audio}
          src={musicUrl}
          loop
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}

      {!isOpen && (
        <div
          className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_40%,#fbf7ef,#f2ece1_70%)] px-6 text-center transition-opacity duration-[600ms] delay-[1700ms] motion-reduce:delay-0 motion-reduce:duration-300 ${opening ? "opacity-0" : "opacity-100"}`}
        >
          <p className="text-[11px] tracking-[0.35em] text-[#a8844f] uppercase">
            {t("cover.eyebrow")}
          </p>

          {/* The envelope. */}
          <div className="relative mt-10 h-[200px] w-[300px] [perspective:1200px]">
            <div className="absolute inset-0 rounded-md bg-[#e9dfcc] shadow-[0_24px_50px_-18px_rgba(42,39,35,0.35)]" />

            {/* The card inside, which slides out. */}
            <div
              className={`absolute inset-x-[7%] top-[7%] bottom-[7%] z-20 flex flex-col items-center justify-center rounded-sm border border-[#a8844f]/40 bg-[#fbf8f2] px-4 duration-[800ms] ${step} ${opening ? "-translate-y-[62%] delay-[800ms]" : ""}`}
            >
              <p className="text-[9px] tracking-[0.3em] text-[#a8844f] uppercase">
                {t("cover.eyebrow")}
              </p>
              <p className="mt-2 font-serif text-2xl leading-tight text-[#2a2723] italic">
                {names}
              </p>
              <p className="mt-1 font-serif text-sm text-[#46523f]">{date}</p>
            </div>

            {/* Front pockets. */}
            <svg
              aria-hidden
              viewBox="0 0 300 200"
              className="absolute inset-0 z-30 size-full"
            >
              <polygon points="0,0 0,200 160,108" fill="#f4ecdd" />
              <polygon points="300,0 300,200 140,108" fill="#f4ecdd" />
              <polygon points="0,200 300,200 150,96" fill="#efe5d3" />
              <g
                fill="none"
                stroke="#a8844f"
                strokeOpacity="0.35"
                strokeWidth="0.8"
              >
                <path d="M0 200 L150 96 L300 200" />
                <path d="M0 0 L146.2 98.7 M300 0 L153.8 98.7" />
              </g>
            </svg>

            {/* The flap: folds back, then drops behind the card. */}
            <div
              className={`absolute inset-x-0 top-0 h-[60%] origin-top [transform-style:preserve-3d] duration-[700ms] ${step} ${opening ? "z-10 [transform:rotateX(180deg)] delay-[250ms]" : "z-40"}`}
            >
              <svg aria-hidden viewBox="0 0 300 120" className="size-full">
                <polygon
                  points="0,0 300,0 150,118"
                  fill="#f1e8d8"
                  stroke="#a8844f"
                  strokeOpacity="0.35"
                  strokeWidth="0.8"
                />
              </svg>
            </div>

            {/* The seal is the button. */}
            <button
              type="button"
              onClick={open}
              aria-label={t("cover.open")}
              className={`absolute top-[86px] left-1/2 z-50 -translate-x-1/2 rounded-full duration-300 ${step} hover:scale-105 ${opening ? "scale-50 opacity-0" : ""}`}
            >
              <WaxSeal initials={initials} className="size-16 text-lg" />
            </button>
          </div>

          <p className="mt-12 font-serif text-4xl text-[#2a2723] italic">
            {names}
          </p>
          <p className="mt-2 font-serif text-lg text-[#46523f]">{date}</p>
          <button
            type="button"
            onClick={open}
            className="mt-8 inline-flex h-12 items-center rounded-full border border-[#46523f] px-7 text-sm font-medium tracking-wide text-[#46523f] transition-colors hover:bg-[#46523f] hover:text-[#faf7f1]"
          >
            {t("cover.open")}
          </button>
        </div>
      )}

      {musicUrl && isOpen && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={playing ? t("music.pause") : t("music.play")}
          className="fixed right-4 bottom-4 z-30 flex size-12 items-center justify-center rounded-full bg-[#faf7f1]/90 text-[#46523f] shadow-lg ring-1 ring-[#e4dccd] backdrop-blur"
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
