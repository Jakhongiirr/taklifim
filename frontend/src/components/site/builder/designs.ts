import "server-only";
import { getLocale } from "next-intl/server";
import { DESIGN_IDS } from "@/content/designs";
import type { Theme } from "@/lib/api-types";
import { getThemes } from "@/lib/server/catalog";
import { getDemos } from "@/lib/server/demos";
import type { Design } from "./types";

/**
 * Active themes as pickable designs, named and pictured by their demo when
 * there is one. `current` (an invitation's theme) is kept even if archived.
 * Designs without an admin demo link to their built-in one.
 */
export async function getDesigns(current?: Theme): Promise<Design[]> {
  const [themes, demos, locale] = await Promise.all([
    getThemes(),
    getDemos(),
    getLocale(),
  ]);
  if (current && !themes.some((theme) => theme.id === current.id)) {
    themes.unshift(current);
  }
  return themes.map((theme) => {
    const demo = demos.find((d) => d.theme.id === theme.id);
    return {
      id: theme.id,
      name:
        demo?.title ??
        theme.themeId.charAt(0).toUpperCase() + theme.themeId.slice(1),
      price: theme.price,
      imageUrl: demo?.image.url ?? null,
      demoUrl:
        demo?.demoUrl ??
        (DESIGN_IDS.includes(theme.themeId)
          ? `/${locale}/designs/${theme.themeId}/demo`
          : null),
    };
  });
}
