import ArcadeTheme from "./arcade";
import AuroraTheme from "./aurora";
import DoveTheme from "./dove";
import EtherTheme from "./ether";
import HeavenTheme from "./heaven";
import ParisTheme from "./paris";
import PlainInvitation from "./plain";
import type { Theme, ThemeProps } from "./types";

/**
 * Designs by the backend theme's `themeId` (set in the admin panel). Add a
 * theme here and create a theme with the same `themeId` in the admin.
 * Every theme opens with its own background video: shared/video-cover.tsx,
 * with the files in public/themes/<themeId>/.
 */
const THEMES: Record<string, Theme> = {
  aurora: AuroraTheme,
  dove: DoveTheme,
  heaven: HeavenTheme,
  arcade: ArcadeTheme,
  ether: EtherTheme,
  paris: ParisTheme,
};

/**
 * Renders the invitation in its theme's design. Unknown ids fall back to the
 * plain layout, so an invitation always renders.
 */
export function ThemedInvitation({ taklif, preview }: ThemeProps) {
  const Theme = THEMES[taklif.theme.themeId] ?? PlainInvitation;
  return <Theme taklif={taklif} preview={preview} />;
}
