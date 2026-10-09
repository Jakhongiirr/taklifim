"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { amiri } from "./fonts";
import { Star8, StarPattern } from "./ornaments";

const OPEN_MS = 1400;

/**
 * Palace doors over the invitation. Tapping "open" fades the center, slides
 * the doors apart and starts the music (browsers only play audio after a
 * user gesture). It also marks <html> with .islamic-opened, which starts the
 * hero's entrance (islamic.css).
 */
export default function IslamicCover({
  names,
  date,
  musicUrl,
}: {
  names: string;
  date: string;
  musicUrl: string | null;
}) {
  const t = useTranslations("Invitation");
  const tIslamic = useTranslations("Islamic");
  const audio = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<"closed" | "opening" | "open">("closed");
  const [playing, setPlaying] = useState(false);
  const isOpen = state === "open";

  // No scrolling behind the doors.
  useEffect(() => {
    if (isOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  // Leaving the page (e.g. back to the cabinet) resets the entrance.
  useEffect(
    () => () => document.documentElement.classList.remove("islamic-opened"),
    [],
  );

  function open() {
    setState("opening");
    document.documentElement.classList.add("islamic-opened");
    setTimeout(() => setState("open"), OPEN_MS);
    audio.current?.play().catch(() => undefined);
  }

  function toggleMusic() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => undefined);
    else el.pause();
  }

  const opening = state === "opening";
  const door =
    "absolute inset-y-0 w-1/2 overflow-hidden bg-[#0b3b31] text-[#c9a45c]/25 transition-transform duration-[1400ms] ease-[cubic-bezier(0.7,0,0.25,1)] motion-reduce:duration-300";

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
        <div className="fixed inset-0 z-40">
          {/* The doors, each with half of the pattern and a gold edge. */}
          <div
            className={`${door} left-0 border-r border-[#c9a45c]/60 ${opening ? "-translate-x-full" : ""}`}
          >
            <StarPattern id="islamic-door-left" />
          </div>
          <div
            className={`${door} right-0 border-l border-[#c9a45c]/60 ${opening ? "translate-x-full" : ""}`}
          >
            <StarPattern id="islamic-door-right" />
          </div>

          <div
            className={`relative flex h-full flex-col items-center justify-center px-8 text-center text-[#f7f1e3] transition-opacity duration-500 ${opening ? "opacity-0" : "opacity-100"}`}
          >
            <p
              lang="ar"
              dir="rtl"
              className={`${amiri.className} text-2xl text-[#e9d29b]`}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <div className="relative mt-10 flex size-64 items-center justify-center">
              <Star8
                className="absolute inset-0 size-full text-[#c9a45c] motion-safe:animate-[spin_80s_linear_infinite]"
                strokeWidth={0.6}
              />
              <div className="relative flex size-44 flex-col items-center justify-center rounded-full bg-[#072821]/90 ring-1 ring-[#c9a45c]/50">
                <p className="text-[10px] tracking-[0.3em] text-[#c9a45c] uppercase">
                  {tIslamic("eyebrow")}
                </p>
                <p className="islamic-gold mt-3 px-3 font-serif text-3xl leading-tight italic">
                  {names}
                </p>
                <p className="mt-2 font-serif text-sm text-[#e9d29b]">{date}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={open}
              className="mt-12 inline-flex h-12 items-center gap-2 rounded-full border border-[#c9a45c] bg-[#c9a45c] px-7 font-medium text-[#072821] shadow-lg shadow-black/20 transition-colors hover:bg-[#e9d29b]"
            >
              {t("cover.open")}
            </button>
          </div>
        </div>
      )}

      {musicUrl && isOpen && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={playing ? t("music.pause") : t("music.play")}
          className="fixed right-4 bottom-4 z-30 flex size-12 items-center justify-center rounded-full bg-[#0b3b31]/90 text-[#e9d29b] shadow-lg ring-1 ring-[#c9a45c]/50 backdrop-blur"
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
