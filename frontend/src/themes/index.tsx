import ArcadeTheme from "./arcade";
import AuroraTheme from "./aurora";
import ClassicTheme from "./classic";
import DoveTheme from "./dove";
import VioletTheme from "./violet";
import HavenTheme from "./haven";
import LavelTheme from "./lavel";
import ParisTheme from "./paris";
import PlovTheme from "./plov";
import PlainInvitation from "./plain";
import FontReveal from "./shared/font-reveal";
import type { Theme, ThemeProps } from "./types";

/**
 * Designs by the backend theme's `themeId` (set in the admin panel). Add a
 * theme here and create a theme with the same `themeId` in the admin.
 * Themes open with their own background video (shared/video-cover.tsx, with
 * the files in public/themes/<themeId>/); "classic" opens a sealed envelope,
 * "lavel" a folded card and "plov" a lidded platter, drawn in CSS and SVG
 * instead.
 *
 * Theme fonts (themes/<id>/fonts.ts) set `preload: false`: every theme ships
 * with the invitation route, so preloading would make each guest download all
 * themes' fonts before their own. Without it the browser fetches only the
 * fonts the open invitation uses.
 */
const THEMES: Record<string, Theme> = {
  aurora: AuroraTheme,
  dove: DoveTheme,
  haven: HavenTheme,
  arcade: ArcadeTheme,
  violet: VioletTheme,
  paris: ParisTheme,
  classic: ClassicTheme,
  lavel: LavelTheme,
  plov: PlovTheme,
};

/**
 * Renders the invitation in its theme's design. Unknown ids fall back to the
 * plain layout, so an invitation always renders.
 */
export function ThemedInvitation({ taklif, preview }: ThemeProps) {
  const Theme = THEMES[taklif.theme.themeId] ?? PlainInvitation;
  return (
    <>
      <FontReveal />
      <Theme taklif={taklif} preview={preview} />
    </>
  );
}
