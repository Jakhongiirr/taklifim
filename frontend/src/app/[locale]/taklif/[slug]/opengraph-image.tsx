import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ogLocale } from "@/lib/og/assets";
import { cardAssets, PREVIEW_SIZE, PreviewCard } from "@/lib/og/card";
import { getPublishedTaklif } from "@/lib/server/taklif";
import { tashkentParts } from "@/lib/tashkent-date";

// The invitation's link preview (what guests see in Telegram before opening
// it): names, date and venue on the shared card background (lib/og/card).
// Published invitations only, like the page.
export const alt = "taklifim.uz";
export const size = PREVIEW_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = ogLocale(raw);
  const taklif = await getPublishedTaklif(slug);
  if (!taklif) notFound();

  const [t, tDates, assets] = await Promise.all([
    getTranslations({ locale, namespace: "Invitation" }),
    getTranslations({ locale, namespace: "Dates" }),
    cardAssets(),
  ]);
  const months = tDates.raw("months") as string[];
  const { year, month, day, time } = tashkentParts(taklif.eventAt);

  return new ImageResponse(
    <PreviewCard
      assets={assets}
      groom={taklif.groomName}
      bride={taklif.brideName}
      date={tDates("dateTime", { day, month: months[month], year, time })}
      venue={taklif.venueName}
      ad={t("cardAd")}
    />,
    { ...size, fonts: assets.fonts },
  );
}
