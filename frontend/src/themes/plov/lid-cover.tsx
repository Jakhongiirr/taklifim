"use client";

import Image from "next/image";
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
import { Lid, PlatterRim } from "./ornaments";

/** The lid lifts off and the steam rises from the plov. */
const OPENING_MS = 1900;
/** Then the cover fades into the page. */
const REVEAL_MS = 900;
const REDUCED_REVEAL_MS = 300;

export const PLOV_IMAGE = "/themes/plov/plov.webp";

/**
 * The plov theme's opening: a lagan (serving platter) under a domed lid,
 * drawn in SVG over a photo of plov. Tapping the lid (or anywhere on the
 * cover) starts the music, lifts the lid off, lets the steam rise and
 * fades into the page; <html> gets `plov-opened` for the hero's entrance.
 * Reduced motion skips straight to the page. Like the other covers, it
 * locks scrolling while shown and is hidden without JavaScript.
 */
export default function LidCover({
  musicUrl,
  children,
}: {
  musicUrl: string | null;
  /** Above the platter (what it is, the names). */
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
    () => () => document.documentElement.classList.remove("plov-opened"),
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
    document.documentElement.classList.add("plov-opened");
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
          data-lid-cover
          data-state={state}
          onClick={open}
          className="plov-paper fixed inset-0 z-40 overflow-hidden text-[#3b2a1a] transition-opacity duration-[900ms] ease-out motion-reduce:duration-300 data-[state=closed]:cursor-pointer data-[state=revealing]:pointer-events-none data-[state=revealing]:opacity-0"
        >
          <div className="relative mx-auto flex h-full max-w-md flex-col items-center justify-center px-6 text-center">
            <div data-font-reveal className="plov-cover-words">
              {children}
            </div>

            <div className="plov-platter relative mt-10 aspect-square w-full max-w-[19rem]">
              <div className="absolute inset-[15%] overflow-hidden rounded-full bg-[#e9d7b0]">
                <Image
                  src={PLOV_IMAGE}
                  alt=""
                  fill
                  priority
                  sizes="220px"
                  className="plov-dish object-cover"
                />
              </div>
              <PlatterRim className="absolute inset-0 size-full drop-shadow-[0_18px_24px_rgba(59,42,26,0.22)]" />
              <Steam />
              <button
                type="button"
                tabIndex={state === "closed" ? 0 : -1}
                aria-label={t("cover.open")}
                className="plov-lid absolute inset-[4%] rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8a6a2f]"
              >
                <Lid className="block size-full drop-shadow-[0_10px_14px_rgba(59,42,26,0.28)]" />
              </button>
            </div>

            <p
              data-font-reveal
              className="plov-cover-hint mt-12 text-[11px] font-semibold tracking-[0.35em] text-[#765a27] uppercase"
            >
              {t("plov.lidHint")}
            </p>
          </div>
        </div>
      )}
      <noscript>
        <style>{"[data-lid-cover]{display:none}"}</style>
      </noscript>

      {musicUrl && isOpen && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={playing ? t("music.pause") : t("music.play")}
          data-music-button
          className="fixed right-4 bottom-4 z-30 flex size-12 items-center justify-center rounded-full bg-[#fffaf0]/90 text-[#765a27] shadow-lg ring-1 ring-[#b08a45]/50 backdrop-blur"
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

/** Three wisps of steam over the plov, shown once the lid is off. */
function Steam() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className="plov-steam pointer-events-none absolute inset-x-0 -top-[30%] h-[80%] w-full overflow-visible"
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth="2.4"
    >
      {[
        "M38 92 C30 78 46 70 38 56 C30 42 44 34 38 20",
        "M50 96 C42 80 58 72 50 58 C42 44 56 34 50 14",
        "M62 92 C54 78 70 70 62 56 C54 42 68 34 62 22",
      ].map((d, i) => (
        <path
          key={d}
          d={d}
          style={{ "--i": i } as CSSProperties}
          className="plov-wisp"
        />
      ))}
    </svg>
  );
}
