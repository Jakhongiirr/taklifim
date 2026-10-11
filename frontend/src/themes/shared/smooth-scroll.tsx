"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/**
 * Smooth, eased scrolling for the whole page (Lenis) while mounted: mouse
 * wheels and in-page links glide instead of jumping. Touch keeps the
 * native scroll, and with reduced motion nothing changes. Inner scroll
 * areas opt out with `data-lenis-prevent`.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09, anchors: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
