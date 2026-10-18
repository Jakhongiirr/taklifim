"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { Music } from "@/lib/api-types";
import { ownMusicTitle } from "@/lib/own-music";
import { OWN_MUSIC, type OwnMusic } from "./types";

// Typically 8-12 tracks: show a few, the rest one tap away.
const VISIBLE = 5;

// Mirrors the backend's USER_AUDIO_FILE_TYPES and its users' audio size limit.
// Phones report audio types inconsistently, so the extension decides.
const OWN_EXTENSIONS = ["mp3", "m4a", "aac", "ogg", "opus"];
const OWN_MAX_BYTES = 10 * 1024 * 1024;
const OWN_ACCEPT = ["audio/*", ...OWN_EXTENSIONS.map((ext) => `.${ext}`)].join(
  ",",
);

const ownUrl = (own: OwnMusic) =>
  "existing" in own ? own.existing.url : own.preview;
const ownName = (own: OwnMusic) =>
  ownMusicTitle("existing" in own ? own.existing.originalName : own.file.name);

/**
 * "No music", the couple's own music or one of the tracks. Tapping a row
 * chooses it; the round button plays a preview (one at a time). Own music is
 * picked from the device (uploaded on save), then can be replaced or removed.
 * Long lists start folded, unless the chosen track is in the folded part.
 */
export default function MusicPicker({
  tracks,
  value,
  onChange,
  own,
  onOwnChange,
  onError,
}: {
  tracks: Music[];
  value: string;
  onChange: (id: string) => void;
  own: OwnMusic | null;
  /** Picking a file also chooses it; removing it chooses "No music". */
  onOwnChange: (own: OwnMusic | null) => void;
  onError: (message: string) => void;
}) {
  const t = useTranslations("Builder.music");
  const audio = useRef<HTMLAudioElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(
    () => tracks.findIndex((m) => m.id === value) >= VISIBLE,
  );

  // Stop the preview when leaving the page.
  useEffect(() => {
    const el = audio.current;
    return () => el?.pause();
  }, []);

  function toggle(id: string, url: string) {
    const el = audio.current;
    if (!el) return;
    if (playing === id) {
      el.pause();
      setPlaying(null);
      return;
    }
    el.src = url;
    el.play().catch(() => setPlaying(null));
    setPlaying(id);
  }

  function pick(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!OWN_EXTENSIONS.includes(ext)) return onError(t("own.badType"));
    if (file.size > OWN_MAX_BYTES) return onError(t("own.tooBig"));
    if (playing === OWN_MUSIC) {
      audio.current?.pause();
      setPlaying(null);
    }
    onOwnChange({ file, preview: URL.createObjectURL(file) });
  }

  function removeOwn() {
    if (playing === OWN_MUSIC) {
      audio.current?.pause();
      setPlaying(null);
    }
    onOwnChange(null);
  }

  const foldable = tracks.length > VISIBLE + 1;
  const shown = foldable && !expanded ? tracks.slice(0, VISIBLE) : tracks;

  return (
    <div>
      <audio ref={audio} onEnded={() => setPlaying(null)} />
      <input
        ref={fileInput}
        type="file"
        accept={OWN_ACCEPT}
        hidden
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = "";
        }}
      />
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

        {own ? (
          <Row
            selected={value === OWN_MUSIC}
            onSelect={() => onChange(OWN_MUSIC)}
            action={
              <PlayButton
                playing={playing === OWN_MUSIC}
                label={`${playing === OWN_MUSIC ? t("stop") : t("play")}: ${ownName(own)}`}
                onClick={() => toggle(OWN_MUSIC, ownUrl(own))}
              />
            }
            trailing={
              <>
                <IconButton
                  label={t("own.replace")}
                  onClick={() => fileInput.current?.click()}
                >
                  <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" />
                </IconButton>
                <IconButton label={t("own.remove")} onClick={removeOwn}>
                  <path d="M6 6l12 12M18 6 6 18" />
                </IconButton>
              </>
            }
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-ink">
                {ownName(own)}
              </span>
              <span className="block truncate text-xs text-muted">
                {t("own.label")}
              </span>
            </span>
          </Row>
        ) : (
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="flex items-center gap-3 rounded-2xl border border-dashed border-sage/40 bg-white py-2 pr-3 pl-2 text-left transition-colors hover:border-sage hover:bg-sage/5"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage/10 text-sage">
              <svg aria-hidden viewBox="0 0 24 24" className="size-4">
                <path
                  d="M12 16V4m0 0-4.5 4.5M12 4l4.5 4.5M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-sage">
                {t("own.add")}
              </span>
              <span className="block truncate text-xs text-muted">
                {t("own.hint")}
              </span>
            </span>
          </button>
        )}

        {shown.map((track) => (
          <Row
            key={track.id}
            selected={value === track.id}
            onSelect={() => onChange(track.id)}
            action={
              <PlayButton
                playing={playing === track.id}
                label={`${playing === track.id ? t("stop") : t("play")}: ${track.title}`}
                onClick={() => toggle(track.id, track.file.url)}
              />
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

/**
 * A selectable row; `action` (the play button) sits before the label,
 * `trailing` (more buttons) after the radio mark.
 */
function Row({
  selected,
  onSelect,
  action,
  trailing,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  action?: React.ReactNode;
  trailing?: React.ReactNode;
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
      {trailing}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="-mr-1 flex size-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-cream hover:text-ink"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </button>
  );
}

function PlayButton({
  playing,
  label,
  onClick,
}: {
  playing: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${playing ? "bg-sage text-paper" : "bg-cream text-sage hover:bg-sage/10"}`}
    >
      {playing ? <Bars /> : <PlayIcon />}
    </button>
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
