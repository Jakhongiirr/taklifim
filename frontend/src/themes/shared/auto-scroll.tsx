"use client";

import { useEffect } from "react";

/** Pixels per second: slow enough to read along. */
const SPEED = 32;
/** Lets the hero's entrance finish before the page starts moving. */
const START_DELAY_MS = 2500;

/**
 * Once the invitation is open, the page drifts slowly down on its own, so
 * guests see there is more below. It stops for good the moment the guest
 * touches, clicks, uses the wheel or keys, or scrolls any other way, and at
 * the bottom of the page. Reduced motion turns it off.
 */
export default function AutoScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let pos = 0;
    let last = 0;
    const events = ["wheel", "touchstart", "pointerdown", "keydown"] as const;

    function stop() {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      for (const e of events) window.removeEventListener(e, stop);
    }

    function step(now: number) {
      // Anything but our own movement (a scrollbar drag, a link) means the
      // guest has taken over.
      if (Math.abs(window.scrollY - pos) > 4) return stop();
      // A hidden tab pauses frames; don't jump when it comes back.
      const dt = Math.min(now - last, 100);
      last = now;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      pos = Math.min(pos + (SPEED * dt) / 1000, max);
      window.scrollTo({ top: pos, behavior: "instant" });
      if (pos >= max) return stop();
      frame = requestAnimationFrame(step);
    }

    const timer = setTimeout(() => {
      pos = window.scrollY;
      last = performance.now();
      frame = requestAnimationFrame(step);
    }, START_DELAY_MS);
    for (const e of events) window.addEventListener(e, stop, { passive: true });
    return stop;
  }, []);
  return null;
}
