"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Ornament from "@/components/site/ornament";

/**
 * Full-screen cover the guest taps to open the invitation. The tap also
 * starts the music: browsers only allow audio to play after a user gesture.
 */
export default function ClassicCover({
  names,
  date,
  musicUrl,
}: {
  names: string;
  date: string;
  musicUrl: string | null;
}) {
  const t = useTranslations("Invitation");
  const audio = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<"closed" | "opening" | "open">("closed");
  const [playing, setPlaying] = useState(false);
  const isOpen = state === "open";

  // No scrolling behind the cover.
  useEffect(() => {
    if (isOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  function open() {
    setState("opening");
    setTimeout(() => setState("open"), 700);
    audio.current?.play().catch(() => undefined);
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
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}

      {!isOpen && (
        <div
          className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-cream px-8 text-center transition-opacity duration-700 ${state === "opening" ? "opacity-0" : "opacity-100"}`}
        >
          <div className="pointer-events-none absolute inset-4 rounded-[2rem] border border-gold/40" />
          <div className="pointer-events-none absolute inset-6 rounded-[1.6rem] border border-gold/20" />
          <Ornament />
          <p className="mt-6 text-xs tracking-[0.3em] text-gold uppercase">
            {t("cover.eyebrow")}
          </p>
          <h1 className="mt-6 font-serif text-5xl leading-tight text-ink italic">
            {names}
          </h1>
          <p className="mt-4 font-serif text-xl text-sage">{date}</p>
          <p className="mt-8 max-w-xs text-sm text-muted">
            {t("cover.invite")}
          </p>
          <button
            type="button"
            onClick={open}
            className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-sage px-7 font-medium text-paper shadow-lg shadow-sage/20 transition-colors hover:bg-sage-dark"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="size-4">
              <path
                d="M3 7l9 6 9-6M3 7v10h18V7M3 7l9-4 9 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            {t("cover.open")}
          </button>
          <Ornament className="mt-10 rotate-180" />
        </div>
      )}

      {musicUrl && isOpen && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={playing ? t("music.pause") : t("music.play")}
          className="fixed right-4 bottom-4 z-30 flex size-12 items-center justify-center rounded-full bg-paper/90 text-sage shadow-lg ring-1 ring-line backdrop-blur"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className={`size-5 ${playing ? "animate-[spin_6s_linear_infinite]" : ""}`}
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
