import type { ReactNode } from "react";
import type { PublicTaklif } from "@/lib/api-types";

/** Themes get the public shape; the owner's preview passes a full Taklif. */
export interface ThemeProps {
  taklif: PublicTaklif;
  /** The owner's preview: guest actions (RSVP) are shown but disabled. */
  preview?: boolean;
  /** Opened from a named guest's personal link: greets them by name. */
  guest?: InvitedGuest;
}

/** The guest a personal link (/taklif/{slug}/{token}) is for. */
export interface InvitedGuest {
  name: string;
  token: string;
}

/** A theme's design: a (server) component that renders a whole invitation. */
export type Theme = (props: ThemeProps) => ReactNode | Promise<ReactNode>;
