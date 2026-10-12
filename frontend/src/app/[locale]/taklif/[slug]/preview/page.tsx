import { notFound } from "next/navigation";
import PreviewChrome from "@/components/site/cabinet/preview-chrome";
import { getCurrentUser } from "@/lib/server/current-user";
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
  const { slug } = await params;
  const [taklif, user] = await Promise.all([
    getTaklifPreview(slug),
    getCurrentUser(),
  ]);
  if (!taklif) notFound();
  return (
    <>
      {/* Above the theme's cover, so the owner can always get back. */}
      <PreviewChrome
        id={taklif.id}
        slug={taklif.slug}
        status={taklif.status}
        price={taklif.theme.price}
        // Only the owner can pay: an admin looking at it can't.
        owner={user?.id === taklif.userId}
      />
      <ThemedInvitation taklif={taklif} preview />
    </>
  );
}
