import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BuilderPage from "@/components/site/builder/builder-page";
import { getDesigns } from "@/components/site/builder/designs";
import { getMusic } from "@/lib/server/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Builder");
  return { title: t("metaNew"), robots: { index: false, follow: false } };
}

/** New invitation. `?theme=<theme id>` preselects a design (template cards). */
export default async function NewInvitationPage({
  searchParams,
}: PageProps<"/[locale]/cabinet/new">) {
  const [{ theme }, designs, tracks] = await Promise.all([
    searchParams,
    getDesigns(),
    getMusic(),
  ]);
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
