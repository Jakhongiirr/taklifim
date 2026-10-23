import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { PublicTaklif } from "@/lib/api-types";
import { coupleNames } from "@/lib/format";
import { INVITATION_OG_IMAGES } from "@/lib/seo";
import { tashkentParts } from "@/lib/tashkent-date";
import { occasionMessages } from "@/themes/shared/occasion";

/**
 * Title and description for link previews in Telegram and other messengers
 * (the image is the shared og-invitation.jpg, not the site's og.jpg). Not
 * indexed: invitations are private.
 */
export async function invitationMetadata(
  taklif: PublicTaklif,
): Promise<Metadata> {
  const [t, tDates] = await Promise.all([
    getTranslations(occasionMessages(taklif)),
    getTranslations("Dates"),
  ]);
  const months = tDates.raw("months") as string[];
  const { year, month, day, time } = tashkentParts(taklif.eventAt);
  const title = t("metaTitle", {
    names: coupleNames(taklif),
  });
  const description = `${tDates("dateTime", { day, month: months[month], year, time })} · ${taklif.venueName}`;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "taklifim.uz",
      images: INVITATION_OG_IMAGES,
    },
    twitter: { card: "summary_large_image", images: INVITATION_OG_IMAGES },
  };
}
