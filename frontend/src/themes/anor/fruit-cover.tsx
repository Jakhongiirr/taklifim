"use client";

import { useTranslations } from "next-intl";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import AutoScroll from "../shared/auto-scroll";
import SmoothScroll from "../shared/smooth-scroll";
import { BURST, FruitHeart } from "./art";

/** The fruit splits open and its seeds scatter. */
const OPENING_MS = 1400;
/** Then the cover fades into the page. */
const REVEAL_MS = 900;
const REDUCED_REVEAL_MS = 300;

/**
 * The anor theme's opening: a ripe pomegranate glowing on deep garnet,
 * drawn in SVG rather than a video. Tapping it (or anywhere on the cover)
 * starts the music, splits the fruit in two, scatters its seeds and fades
 * into the page; <html> gets `anor-opened` for the hero's entrance.
 * Reduced motion skips straight to the page. Like the other covers, it
 * locks scrolling while shown and is hidden without JavaScript.
 */
export default function FruitCover({
  musicUrl,
  children,
}: {
  musicUrl: string | null;
  /** Above the fruit (title, names). */
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
    () => () => document.documentElement.classList.remove("anor-opened"),
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
    document.documentElement.classList.add("anor-opened");
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
          data-anor-cover
          data-state={state}
          onClick={open}
          className="anor-night fixed inset-0 z-40 overflow-hidden text-[#f6e4d3] transition-opacity duration-[900ms] ease-out motion-reduce:duration-300 data-[state=closed]:cursor-pointer data-[state=revealing]:pointer-events-none data-[state=revealing]:opacity-0"
        >
          <div className="anor-arch pointer-events-none absolute inset-4 mx-auto max-w-[26rem]" />
          <div className="relative mx-auto flex h-full max-w-md flex-col items-center justify-center px-8 text-center">
            <div data-font-reveal className="anor-cover-words">
              {children}
            </div>

            <div className="relative mt-10 size-56">
              <div className="anor-glow absolute -inset-10 rounded-full" />
              <div className="absolute inset-x-[18%] bottom-[-2%] h-[10%] rounded-[50%] bg-[#1a0307]/45 blur-md" />
              <FruitHeart className="absolute inset-0 size-full" />
              <div className="anor-burst absolute inset-0">
                {BURST.map((s, i) => (
                  <svg
                    key={i}
                    aria-hidden
                    viewBox="0 0 10 12"
                    className="absolute top-[58%] left-1/2"
                    style={
                      {
                        width: `${s.size}%`,
                        "--x": `${s.x}%`,
                        "--y": `${s.y}%`,
                        "--turn": `${s.turn}deg`,
                      } as CSSProperties
                    }
                  >
                    <use href="#anor-seed" width="10" height="12" />
                  </svg>
                ))}
              </div>
              {(["left", "right"] as const).map((half) => (
                <svg
                  key={half}
                  aria-hidden
                  viewBox="0 0 100 110"
                  className={`anor-half anor-half-${half} absolute inset-0 size-full`}
                >
                  <use href="#anor-fruit" width="100" height="110" />
                </svg>
              ))}
              <button
                type="button"
                tabIndex={state === "closed" ? 0 : -1}
                aria-label={t("cover.open")}
                className="absolute inset-[12%] rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e9c98f]"
              />
            </div>

            <p
              data-font-reveal
              className="anor-cover-hint mt-12 text-[11px] font-semibold tracking-[0.35em] text-[#ecd0bd] uppercase"
            >
              {t("anor.fruitHint")}
            </p>
          </div>
        </div>
      )}
      <noscript>
        <style>{"[data-anor-cover]{display:none}"}</style>
      </noscript>

      {musicUrl && isOpen && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={playing ? t("music.pause") : t("music.play")}
          data-music-button
          className="fixed right-4 bottom-4 z-30 flex size-12 items-center justify-center rounded-full bg-[#fffaf3]/90 text-[#8c1c2c] shadow-lg ring-1 ring-[#b08a45]/50 backdrop-blur"
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
