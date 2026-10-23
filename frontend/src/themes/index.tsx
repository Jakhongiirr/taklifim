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
import LanguageSwitcher, {
  type SwitcherColors,
} from "./shared/language-switcher";
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

/** The language switcher in each theme's colours (the plain layout's last). */
const SWITCHER: Record<string, SwitcherColors> = {
  aurora: {
    pill: "bg-[#fffaf0]/85 text-[#7a5a2c] ring-1 ring-[#b08a4e]/40",
    on: "bg-[#7a5a2c] text-[#f1e0c5]",
  },
  dove: {
    pill: "bg-[#fff7f2]/85 text-[#6b3f4a] ring-1 ring-[#c98b8b]/50",
    on: "bg-[#6b3f4a] text-[#fdfaf4]",
  },
  haven: {
    pill: "bg-[#f4efe6]/90 text-[#5a2a30] ring-1 ring-[#2b2a28]/30",
    on: "bg-[#5a2a30] text-[#f3e6cf]",
  },
  arcade: {
    pill: "bg-[#fffaf6]/90 text-[#4d3a52] ring-1 ring-[#d27f93]/50",
    on: "bg-[#c04c68] text-white",
  },
  violet: {
    pill: "bg-[#141c3e]/85 text-[#c9d2f4] ring-1 ring-[#9fb0f0]/40",
    on: "bg-[#c9d2f4] text-[#0f1631]",
  },
  paris: {
    pill: "bg-[#fbf7f2]/90 text-[#2c3550] ring-1 ring-[#b8925a]/50",
    on: "bg-[#2c3550] text-[#fbf7f2]",
  },
  classic: {
    pill: "bg-[#fffdf8]/90 text-[#7a1f2b] ring-1 ring-[#a8894f]/50",
    on: "bg-[#2b2420] text-[#faf6ee]",
  },
  lavel: {
    pill: "bg-[#fbf8fe]/90 text-[#6f58a8] ring-1 ring-[#a690d4]/50",
    on: "bg-[#6f58a8] text-[#fbf8fe]",
  },
  plov: {
    pill: "bg-[#fffaf0]/90 text-[#765a27] ring-1 ring-[#b08a45]/50",
    on: "bg-[#3b2a1a] text-[#faf6ec]",
  },
  plain: {
    pill: "bg-paper/90 text-ink ring-1 ring-line",
    on: "bg-ink text-paper",
  },
};

/**
 * Renders the invitation in its theme's design. Unknown ids fall back to the
 * plain layout, so an invitation always renders. Guests switch the language
 * of its fixed wording themselves.
 */
export function ThemedInvitation({ taklif, preview, guest }: ThemeProps) {
  const Theme = THEMES[taklif.theme.themeId] ?? PlainInvitation;
  return (
    <>
      <FontReveal />
      <LanguageSwitcher
        colors={SWITCHER[taklif.theme.themeId] ?? SWITCHER.plain}
      />
      <Theme taklif={taklif} preview={preview} guest={guest} />
    </>
  );
}
