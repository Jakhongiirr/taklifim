import type { ReactNode } from "react";
import type { PublicTaklif } from "@/lib/api-types";

/** Themes get the public shape; the owner's preview passes a full Taklif. */
export interface ThemeProps {
  taklif: PublicTaklif;
  /** The owner's preview: guest actions (RSVP) are shown but disabled. */
  preview?: boolean;
}

/** A theme's design: a (server) component that renders a whole invitation. */
export type Theme = (props: ThemeProps) => ReactNode | Promise<ReactNode>;
