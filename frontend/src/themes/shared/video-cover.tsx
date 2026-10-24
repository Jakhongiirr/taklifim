"use client";

import { useTranslations } from "next-intl";
import {
  type ReactNode,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import AutoScroll from "./auto-scroll";
import SmoothScroll from "./smooth-scroll";

const REVEAL_MS = 900;
const REDUCED_REVEAL_MS = 300;
/** How long a tap waits for the video to download before opening without it. */
const MAX_WAIT_MS = 6000;
/** A video streamed from the network that stalls this long is skipped. */
const MAX_STALL_MS = 1200;

/**
 * A theme's opening video, bundled with the theme in public/themes/<id>/:
 * opening.mp4 (H.264, no audio track, 30 fps, encoded from the source
 * with -preset slower at CRF 22-25, about 2-5 MB; it is downloaded whole
 * while the cover shows) and its first frame as
 * opening-start.jpg. The theme's hero uses the last frame (opening-end.jpg)
 * as its background, so the end of the video turns into the page.
 */
export interface OpeningVideo {
  src: string;
  /** The video's first frame: the cover before it plays. */
  poster: string;
}

/**
 * The opening every theme shares. The cover shows the video's first frame
 * under the theme's content (names, date...). Tapping it plays the video
 * once (the walk through the gates) and starts the music (browsers only
 * play audio after a user gesture). The whole video downloads into memory
 * while the cover shows (phones, iPhones above all, otherwise buffer only a
 * little and the walk freezes mid-way on a slow connection); a tap before
 * it's there waits up to MAX_WAIT_MS, then opens the page without it. When
 * the video ends, <html> gets `openedClass`
 * for the hero's entrance and the cover fades into the page, whose hero
 * shows the same last frame. Reduced motion and data saver skip the video.
 * Themes can restyle the steps through `data-state` (closed, loading,
 * playing, revealing).
 */
export default function VideoCover({
  video,
  musicUrl,
  openedClass,
  children,
  className = "",
  overlayClass = "bg-black/25",
  contentClass = "justify-center",
  buttonClass,
  musicClass,
}: {
  video: OpeningVideo;
  musicUrl: string | null;
  /** Added to <html> as the page is revealed (e.g. "aurora-opened"). */
  openedClass: string;
  /** The theme's cover content, over the first frame. */
  children: ReactNode;
  /** Extra classes on the cover (its text colour, the theme's CSS hooks). */
  className?: string;
  /** A tint over the first frame, so the content stays legible. */
  overlayClass?: string;
  /** Where the content sits (e.g. "justify-end pb-24" to keep the frame's middle clear). */
  contentClass?: string;
  /** The "open" and "skip" buttons, and the music button (Tailwind classes). */
  buttonClass: string;
  musicClass: string;
}) {
  const t = useTranslations("Invitation");
  const videoRef = useRef<HTMLVideoElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<
    "closed" | "loading" | "playing" | "revealing" | "open"
  >("closed");
  const [playing, setPlaying] = useState(false);
  /** Enough of the video is here to play to the end without stalling. */
  const ready = useRef(false);
  /** A tap that came before the video: opens without it at the deadline. */
  const wait = useRef<ReturnType<typeof setTimeout>>(undefined);
  const stall = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isOpen = state === "open";

  const loaded = useEffectEvent((src: string, whole: boolean) => {
    const el = videoRef.current;
    if (!el) return;
    el.src = src;
    if (whole) markReady();
    // The video has the connection to itself first; then the music buffers
    // too, so a tap starts both at once.
    if (audio.current) audio.current.preload = "auto";
  });

  // Download the whole video while the guest reads the cover. If that
  // fails, the element streams it as before.
  useEffect(() => {
    if (skipVideo()) return;
    const ctrl = new AbortController();
    let url: string | undefined;
    fetch(video.src, { signal: ctrl.signal })
      .then((res) => (res.ok ? res.blob() : Promise.reject(res.status)))
      .then((blob) => {
        url = URL.createObjectURL(blob);
        loaded(url, true);
      })
      .catch(() => {
        if (!ctrl.signal.aborted) loaded(video.src, false);
      });
    return () => {
      ctrl.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [video.src]);

  useEffect(
    () => () => {
      clearTimeout(wait.current);
      clearTimeout(stall.current);
    },
    [],
  );

  // No scrolling behind the cover.
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
    () => () => document.documentElement.classList.remove(openedClass),
    [openedClass],
  );

  function open() {
    if (state !== "closed") return;
    audio.current?.play().catch(() => undefined);
    if (skipVideo() || !videoRef.current) return reveal();
    if (ready.current) return play();
    setState("loading");
    wait.current = setTimeout(reveal, MAX_WAIT_MS);
  }

  function markReady() {
    if (ready.current) return;
    ready.current = true;
    if (wait.current !== undefined) play();
  }

  function play() {
    clearTimeout(wait.current);
    wait.current = undefined;
    setState("playing");
    // A video that can't play (format, network, iOS low power mode) doesn't
    // block the page.
    videoRef.current?.play().catch(reveal);
  }

  function reveal() {
    clearTimeout(wait.current);
    wait.current = undefined;
    clearTimeout(stall.current);
    setState((s) => (s === "revealing" || s === "open" ? s : "revealing"));
    document.documentElement.classList.add(openedClass);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Unmounting the cover also frees the video's decoder.
    setTimeout(() => setState("open"), reduced ? REDUCED_REVEAL_MS : REVEAL_MS);
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
        // Preloaded only once the video is in (see `loaded`), so the two
        // don't split a slow connection.
        <audio
          ref={audio}
          src={musicUrl}
          loop
          preload="none"
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
          data-video-cover
          data-state={state}
          onClick={open}
          className={`group fixed inset-0 z-40 overflow-hidden bg-black transition-opacity duration-[900ms] ease-out motion-reduce:duration-300 data-[state=closed]:cursor-pointer data-[state=revealing]:pointer-events-none data-[state=revealing]:opacity-0 ${className}`}
        >
          {/* Wider screens: the frame, blurred, around the phone-sized column. */}
          <div
            aria-hidden
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-60 blur-2xl"
            style={{ backgroundImage: `url(${video.poster})` }}
          />
          <div className="relative mx-auto h-full max-w-md">
            <video
              ref={videoRef}
              poster={video.poster}
              muted
              playsInline
              preload="auto"
              aria-hidden
              onCanPlayThrough={markReady}
              onWaiting={() => {
                clearTimeout(stall.current);
                if (state === "playing")
                  stall.current = setTimeout(reveal, MAX_STALL_MS);
              }}
              onPlaying={() => clearTimeout(stall.current)}
              onEnded={reveal}
              onError={() => state !== "closed" && reveal()}
              className="absolute inset-0 size-full object-cover"
            />
            <div
              aria-hidden
              className={`absolute inset-0 transition-opacity duration-700 group-data-[state=closed]:opacity-100 group-data-[state=loading]:opacity-100 ${overlayClass} opacity-0`}
            />

            {/* Hidden (not only transparent) while the video plays, so the
                text glow and the button's backdrop blur aren't redrawn over
                every video frame. */}
            <div
              data-font-reveal
              className={`relative flex h-full flex-col items-center px-6 text-center opacity-0 transition-[opacity,visibility] duration-500 group-data-[state=closed]:opacity-100 group-data-[state=loading]:opacity-100 group-data-[state=playing]:invisible group-data-[state=revealing]:invisible ${contentClass}`}
            >
              {children}
              {/* Its click bubbles to the cover; it's here for keyboards and screen readers. */}
              <button
                type="button"
                tabIndex={state === "closed" ? 0 : -1}
                className={`mt-10 inline-flex h-12 items-center rounded-full border px-7 text-sm font-medium tracking-wide transition-colors group-data-[state=loading]:animate-pulse ${buttonClass}`}
              >
                {t("cover.open")}
              </button>
            </div>

            {state === "playing" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  videoRef.current?.pause();
                  reveal();
                }}
                className={`absolute right-4 bottom-6 rounded-full border px-4 py-1.5 text-xs tracking-wide opacity-80 ${buttonClass}`}
              >
                {t("cover.skip")}
              </button>
            )}
          </div>
        </div>
      )}
      {/* Without JavaScript the cover can't open, so it isn't shown. */}
      <noscript>
        <style>{"[data-video-cover]{display:none}"}</style>
      </noscript>

      {musicUrl && isOpen && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={playing ? t("music.pause") : t("music.play")}
          data-music-button
          className={`fixed right-4 bottom-4 z-30 flex size-12 items-center justify-center rounded-full shadow-lg backdrop-blur ${musicClass}`}
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

/** Reduced motion and data saver open the page without the video. */
function skipVideo() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !!(navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData
  );
}
