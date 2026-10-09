"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { Music } from "@/lib/api-types";

// Typically 8-12 tracks: show a few, the rest one tap away.
const VISIBLE = 5;

/**
 * "No music" or one of the tracks. Tapping a row chooses it; the round button
 * plays a preview (one at a time). Long lists start folded, unless the chosen
 * track is in the folded part.
 */
export default function MusicPicker({
  tracks,
  value,
  onChange,
}: {
  tracks: Music[];
  value: string;
  onChange: (id: string) => void;
}) {
  const t = useTranslations("Builder.music");
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(
    () => tracks.findIndex((m) => m.id === value) >= VISIBLE,
  );

  // Stop the preview when leaving the page.
  useEffect(() => {
    const el = audio.current;
    return () => el?.pause();
  }, []);

  function toggle(track: Music) {
    const el = audio.current;
    if (!el) return;
    if (playing === track.id) {
      el.pause();
      setPlaying(null);
      return;
    }
    el.src = track.file.url;
    el.play().catch(() => setPlaying(null));
    setPlaying(track.id);
  }

  const foldable = tracks.length > VISIBLE + 1;
  const shown = foldable && !expanded ? tracks.slice(0, VISIBLE) : tracks;

  return (
    <div>
      <audio ref={audio} onEnded={() => setPlaying(null)} />
      <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">
        <Row selected={value === ""} onSelect={() => onChange("")}>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cream text-muted">
            <svg aria-hidden viewBox="0 0 24 24" className="size-4">
              <path
                d="M9 18V6l11-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM3 3l18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </span>
          <span className="truncate text-sm font-medium text-ink">
            {t("none")}
          </span>
        </Row>

        {shown.map((track) => (
          <Row
            key={track.id}
            selected={value === track.id}
            onSelect={() => onChange(track.id)}
            action={
              <button
                type="button"
                onClick={() => toggle(track)}
                aria-label={`${playing === track.id ? t("stop") : t("play")}: ${track.title}`}
                className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${playing === track.id ? "bg-sage text-paper" : "bg-cream text-sage hover:bg-sage/10"}`}
              >
                {playing === track.id ? <Bars /> : <PlayIcon />}
              </button>
            }
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-ink">
                {track.title}
              </span>
              {track.artist && (
                <span className="block truncate text-xs text-muted">
                  {track.artist}
                </span>
              )}
            </span>
          </Row>
        ))}
      </div>

      {foldable && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 w-full rounded-full py-2.5 text-sm font-medium text-sage ring-1 ring-line transition-colors hover:ring-sage/40"
        >
          {expanded ? t("showLess") : t("showAll", { count: tracks.length })}
        </button>
      )}
    </div>
  );
}

/** A selectable row; `action` (the play button) sits before the label. */
function Row({
  selected,
  onSelect,
  action,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl py-2 pr-3 pl-2 ring-1 transition ${selected ? "bg-sage/5 ring-sage" : "bg-white ring-line"}`}
    >
      {action}
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-3 self-stretch text-left"
      >
        {!action && children}
        {action && <span className="min-w-0 flex-1">{children}</span>}
        <span
          className={`ml-auto flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ${selected ? "bg-sage ring-sage" : "ring-line"}`}
        >
          {selected && (
            <svg aria-hidden viewBox="0 0 12 12" className="size-3 text-paper">
              <path
                d="M2.5 6.5 5 9l4.5-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="ml-0.5 size-4">
      <path d="M7 4.5v15l12-7.5-12-7.5Z" fill="currentColor" />
    </svg>
  );
}

/** Animated equalizer bars for the track that is playing. */
function Bars() {
  return (
    <span aria-hidden className="flex h-4 items-end gap-[3px]">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-[3px] origin-bottom animate-[bars_0.9s_ease-in-out_infinite] rounded-full bg-current"
          style={{ animationDelay: `${delay}ms`, height: "100%" }}
        />
      ))}
    </span>
  );
}
