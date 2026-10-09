import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getTaklifPreview } from "@/lib/server/taklif";
import { ThemedInvitation } from "@/themes";
import { invitationMetadata } from "../invitation-metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/taklif/[slug]/preview">) {
  const taklif = await getTaklifPreview((await params).slug);
  return taklif ? invitationMetadata(taklif) : {};
}

/** The owner's preview, in any status. The proxy requires a session here. */
export default async function InvitationPreviewPage({
  params,
}: PageProps<"/[locale]/taklif/[slug]/preview">) {
  const taklif = await getTaklifPreview((await params).slug);
  if (!taklif) notFound();
  const t = await getTranslations("Invitation.preview");

  return (
    <>
      {/* Above the theme's cover, so the owner can always get back. */}
      <div className="sticky top-0 z-50 flex items-center justify-between gap-3 bg-ink px-4 py-2.5 text-xs text-paper">
        <span>{t("banner")}</span>
        <span className="flex shrink-0 gap-2">
          <Link
            href={`/cabinet/edit/${taklif.slug}`}
            className="rounded-full bg-paper px-3 py-1 text-ink hover:bg-paper/90"
          >
            {t("edit")}
          </Link>
          <Link
            href="/cabinet"
            className="rounded-full px-3 py-1 ring-1 ring-paper/40 hover:bg-paper/10"
          >
            {t("back")}
          </Link>
        </span>
      </div>
      <ThemedInvitation taklif={taklif} />
    </>
  );
}
