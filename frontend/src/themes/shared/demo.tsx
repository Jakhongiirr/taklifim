"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { PublicWish } from "@/lib/api-types";

/**
 * Set around a design's built-in demo: the RSVP shows these sample wishes
 * and acts out a reply without sending anything.
 */
const DemoContext = createContext<{ wishes: PublicWish[] } | null>(null);

export function DemoProvider({
  wishes,
  children,
}: {
  wishes: PublicWish[];
  children: ReactNode;
}) {
  return <DemoContext value={{ wishes }}>{children}</DemoContext>;
}

/** The demo's sample data, or null on a real invitation. */
export const useDemo = () => useContext(DemoContext);
