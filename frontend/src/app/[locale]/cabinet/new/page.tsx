import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BuilderPage from "@/components/site/builder/builder-page";
import { getDesigns } from "@/components/site/builder/designs";
import { getMusic } from "@/lib/server/catalog";
import { getMyGifts } from "@/lib/server/gifts";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Builder");
  return { title: t("metaNew"), robots: { index: false, follow: false } };
}

/**
 * New invitation. `?theme=<theme id>` preselects a design (template cards).
 * The plov design is hidden, except for a gift from the cabinet
 * (`?theme=<plov's id>` while the owner has one): then it's the only one.
 */
export default async function NewInvitationPage({
  searchParams,
}: PageProps<"/[locale]/cabinet/new">) {
  const [{ theme }, gifts, tracks] = await Promise.all([
    searchParams,
    getMyGifts(),
    getMusic(),
  ]);
  const gift = !!gifts?.available && !!gifts.themeId && gifts.themeId === theme;
  const designs = (await getDesigns(undefined, { gift })).filter(
    (design) => !gift || design.id === theme,
  );
  const initialThemeId =
    designs.find((design) => design.id === theme)?.id ??
    (designs.length === 1 ? designs[0].id : undefined);

  return (
    <BuilderPage
      designs={designs}
      tracks={tracks}
      initialThemeId={initialThemeId}
    />
  );
}
