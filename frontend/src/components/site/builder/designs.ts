import "server-only";
import type { Theme } from "@/lib/api-types";
import { getThemes } from "@/lib/server/catalog";
import { GIFT_THEME_ID } from "@/lib/server/gifts";
import { getDemos } from "@/lib/server/demos";
import type { Design } from "./types";

// The picker's order, by theme id. Designs not listed (plov when it's a
// gift, an archived current theme) come first, newest first as before.
const ORDER = [
  "haven",
  "aurora",
  "arcade",
  "dove",
  "lavel",
  "classic",
  "violet",
  "paris",
  "anor",
];
const rank = (theme: Theme) => ORDER.indexOf(theme.themeId);

/**
 * Active themes as pickable designs, named and pictured by their demo when
 * there is one. The plov design is only a gift, so it's left out unless
 * `gift` (the owner is using one); `current` (an invitation's theme) is
 * kept even if archived or plov.
 */
export async function getDesigns(
  current?: Theme,
  { gift = false } = {},
): Promise<Design[]> {
  const [all, demos] = await Promise.all([getThemes(), getDemos()]);
  const themes = all.filter(
    (theme) =>
      gift || theme.themeId !== GIFT_THEME_ID || theme.id === current?.id,
  );
  if (current && !themes.some((theme) => theme.id === current.id)) {
    themes.unshift(current);
  }
  themes.sort((a, b) => rank(a) - rank(b));
  return themes.map((theme) => {
    const demo = demos.find((d) => d.theme.id === theme.id);
    return {
      id: theme.id,
      key: theme.themeId,
      name:
        demo?.title ??
        theme.themeId.charAt(0).toUpperCase() + theme.themeId.slice(1),
      price: theme.price,
      imageUrl: demo?.image.url ?? null,
      demoUrl: demo?.demoUrl ?? null,
    };
  });
}
