"use client";

import { useTranslations } from "next-intl";

/**
 * The "scroll down" sign at the foot of a theme's hero: a small label over
 * a capsule whose dot glides down, in the theme's accent (`className` sets
 * its colour, e.g. "text-[#b08a4e]"). Tapping it moves the page one screen
 * down. Its motion lives in globals.css and stops with reduced motion.
 */
export default function ScrollHint({ className = "" }: { className?: string }) {
  const t = useTranslations("Invitation");
  return (
    <button
      type="button"
      onClick={() =>
        window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" })
      }
      className={`scroll-hint mx-auto flex flex-col items-center gap-2.5 ${className}`}
    >
      <span className="text-[10px] font-semibold tracking-[0.3em] uppercase">
        {t("scroll")}
      </span>
      <span
        aria-hidden
        className="relative flex h-10 w-6 justify-center rounded-full border-[1.5px] border-current bg-white/30 shadow-[0_2px_12px_rgb(0_0_0/0.08)] backdrop-blur-sm"
      >
        <span className="scroll-hint-dot mt-2 size-1.5 rounded-full bg-current" />
      </span>
    </button>
  );
}
