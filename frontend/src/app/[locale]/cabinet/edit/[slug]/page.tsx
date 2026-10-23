import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import BuilderPage from "@/components/site/builder/builder-page";
import { getDesigns } from "@/components/site/builder/designs";
import { getMusic } from "@/lib/server/catalog";
import { getTaklifPreview } from "@/lib/server/taklif";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Builder");
  return { title: t("metaEdit"), robots: { index: false, follow: false } };
}

/** Edits the owner's invitation (any status); 404 for anyone else. */
export default async function EditInvitationPage({
  params,
}: PageProps<"/[locale]/cabinet/edit/[slug]">) {
  const taklif = await getTaklifPreview((await params).slug);
  if (!taklif) notFound();
  const [designs, active] = await Promise.all([
    getDesigns(taklif.theme),
    getMusic(),
  ]);
  // Keep the invitation's track listed even if it was archived since.
  const tracks =
    taklif.music && !active.some((m) => m.id === taklif.music!.id)
      ? [taklif.music, ...active]
      : active;

  return (
    <BuilderPage
      designs={designs}
      tracks={tracks}
      taklif={taklif}
      draftKey={`edit:${taklif.id}`}
    />
  );
}
