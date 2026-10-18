import { notFound } from "next/navigation";
import PreviewChrome from "@/components/site/cabinet/preview-chrome";
import { getCurrentUser } from "@/lib/server/current-user";
import { GIFT_THEME_ID, getMyGifts } from "@/lib/server/gifts";
import { guestMusic } from "@/lib/own-music";
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
  const owner = user?.id === taklif.userId;
  // A plov draft goes out free while its owner has a gift for it.
  const gift =
    owner &&
    taklif.status === "draft" &&
    taklif.theme.themeId === GIFT_THEME_ID &&
    !!(await getMyGifts())?.available;
  return (
    <>
      {/* Above the theme's cover, so the owner can always get back. */}
      <PreviewChrome
        id={taklif.id}
        slug={taklif.slug}
        status={taklif.status}
        price={gift ? 0 : taklif.theme.price}
        gift={gift}
        // Only the owner can pay: an admin looking at it can't.
        owner={owner}
      />
      <ThemedInvitation
        taklif={{ ...taklif, music: guestMusic(taklif) }}
        preview
      />
    </>
  );
}
