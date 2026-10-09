import ClassicTheme from "./classic";
import IslamicTheme from "./islamic";
import type { Theme, ThemeProps } from "./types";

/**
 * Designs by the backend theme's `themeId` (set in the admin panel). Add a
 * theme here and create a theme with the same `themeId` in the admin.
 */
const THEMES: Record<string, Theme> = {
  classic: ClassicTheme,
  islamic: IslamicTheme,
};

/**
 * Renders the invitation in its theme's design. Unknown ids fall back to
 * classic, so an invitation always renders.
 */
export function ThemedInvitation({ taklif }: ThemeProps) {
  const Theme = THEMES[taklif.theme.themeId] ?? ClassicTheme;
  return <Theme taklif={taklif} />;
}
