"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A design's opening video on a phone screen. Plays once, muted (the
 * videos are one-way shots, not loops), then offers a replay; with reduced
 * motion it waits for a tap. Starts on the first frame, ends on the last.
 */
export default function DesignVideo({
  themeId,
  label,
  replayLabel,
}: {
  themeId: string;
  label: string;
  replayLabel: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.current?.play().catch(() => {});
  }, []);

  const play = () => {
    const el = video.current;
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
  };

  return (
    <div className="relative mx-auto aspect-[9/19] w-[240px] overflow-hidden rounded-[2.6rem] border-[7px] border-ink bg-ink shadow-[0_30px_60px_-25px_rgba(42,39,35,0.55)] sm:w-[270px]">
      <video
        ref={video}
        src={`/themes/${themeId}/opening.mp4`}
        poster={`/themes/${themeId}/opening-start.jpg`}
        muted
        playsInline
        preload="auto"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        className="size-full object-cover"
      />
      {!playing && (
        <button
          type="button"
          onClick={play}
          className="absolute bottom-5 left-1/2 inline-flex h-10 -translate-x-1/2 items-center gap-2 rounded-full bg-paper/90 px-4 text-sm font-medium text-ink shadow-md backdrop-blur transition-colors hover:bg-paper"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="size-4">
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
          {replayLabel}
        </button>
      )}
    </div>
  );
}
