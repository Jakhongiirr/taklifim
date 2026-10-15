import "server-only";
import { DESIGN_COPY, DESIGN_IDS, designName } from "@/content/designs";
import { routing } from "@/i18n/routing";
import type { ApiBody, Demo, Theme } from "@/lib/api-types";
import { getThemes } from "./catalog";
import { API_URL, internalHeaders } from "./session";

/**
 * Active demos for the public site, newest first. Cached for 5 minutes, so
 * visitors don't each hit the backend.
 * Returns [] if the backend is down; the page shows an empty state.
 */
export async function getDemos(): Promise<Demo[]> {
  try {
    const res = await fetch(`${API_URL}/demos`, {
      headers: internalHeaders(),
      next: { revalidate: 300 },
    });
    const body = (await res.json()) as ApiBody<Demo[]>;
    return body.success ? body.data : [];
  } catch {
    return [];
  }
}

/** A design on the home page's grid: an admin's demo or a built-in one. */
export interface ShowcaseItem {
  key: string;
  title: string;
  text: string;
  imageUrl: string;
  demoUrl: string;
  theme: Pick<Theme, "id" | "price">;
}

/**
 * Every active design for the home page: the admins' demos in their order,
 * then the designs that have none, with their built-in demo, art and
 * tagline. [] if the backend is down; the page shows an empty state.
 */
export async function getShowcase(locale: string): Promise<ShowcaseItem[]> {
  const [demos, themes] = await Promise.all([getDemos(), getThemes()]);
  const shown = new Set(demos.map((demo) => demo.theme.id));
  const builtIn = DESIGN_IDS.flatMap((design) => {
    const theme = themes.find((item) => item.themeId === design);
    if (!theme || shown.has(theme.id)) return [];
    const copy =
      DESIGN_COPY[design][locale] ?? DESIGN_COPY[design][routing.defaultLocale];
    return [
      {
        key: design,
        title: designName(design),
        text: copy.tagline,
        imageUrl: `/themes/${design}/opening-end.jpg`,
        demoUrl: `/${locale}/designs/${design}/demo`,
        theme,
      },
    ];
  });
  return [
    ...demos.map((demo) => ({
      key: demo.id,
      title: demo.title,
      text: demo.text,
      imageUrl: demo.image.url,
      demoUrl: demo.demoUrl,
      theme: demo.theme,
    })),
    ...builtIn,
  ];
}
