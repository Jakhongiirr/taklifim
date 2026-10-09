import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { PublicTaklif } from "@/lib/api-types";
import { coupleNames } from "@/lib/format";
import { tashkentParts } from "@/lib/tashkent-date";

/**
 * Title, description and image for link previews in Telegram and other
 * messengers. Not indexed: invitations are private.
 */
export async function invitationMetadata(
  taklif: PublicTaklif,
): Promise<Metadata> {
  const [t, tDates] = await Promise.all([
    getTranslations("Invitation"),
    getTranslations("Dates"),
  ]);
  const months = tDates.raw("months") as string[];
  const { year, month, day, time } = tashkentParts(taklif.eventAt);
  const title = t("metaTitle", {
    names: coupleNames(taklif),
  });
  const description = `${tDates("dateTime", { day, month: months[month], year, time })} · ${taklif.venueName}`;
  const image = taklif.photos[0]?.url;

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: "website",
      ...(image && { images: [{ url: image }] }),
    },
  };
}
