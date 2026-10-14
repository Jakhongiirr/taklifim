import "server-only";
import type { Demo, Theme } from "@/lib/api-types";
import { getThemes } from "./catalog";
import { getDemos } from "./demos";

export interface DesignOffer {
  /** The backend theme, for its price and the builder's ?theme=. */
  theme: Theme | null;
  /** Its live demo, if it has one. */
  demo: Demo | null;
}

/**
 * The backend's data for each design page, by `themeId`. Null when the
 * catalog loaded but the design isn't in it (archived or never created);
 * when the backend is down every design is offered without a price.
 */
export async function getDesignOffers(): Promise<
  (themeId: string) => DesignOffer | null
> {
  const [themes, demos] = await Promise.all([getThemes(), getDemos()]);
  return (themeId) => {
    const theme = themes.find((item) => item.themeId === themeId) ?? null;
    if (themes.length && !theme) return null;
    const demo = demos.find((item) => item.theme.themeId === themeId) ?? null;
    return { theme, demo };
  };
}
