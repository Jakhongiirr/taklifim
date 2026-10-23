import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { ogLocale } from "@/lib/og/assets";
import { cardAssets, STORY_SIZE, StoryCard } from "@/lib/og/card";
import { getTaklifPreview } from "@/lib/server/taklif";
import { tashkentParts } from "@/lib/tashkent-date";
import { cyrillicOwnerText } from "@/lib/uz-cyrillic";
import { occasionMessages } from "@/themes/shared/occasion";

// The invitation as a PNG the owner can save and send anywhere (a story or
// phone-screen size): names, date, venue and host on the shared card
// background (lib/og/card), in the page's language. Published only, owner
// or admin; the proxy renews the session for /cabinet paths.

export async function GET(
  _request: Request,
  ctx: RouteContext<"/[locale]/cabinet/download/[slug]">,
) {
  const { locale: raw, slug } = await ctx.params;
  const locale = ogLocale(raw);
  const found = await getTaklifPreview(slug);
  if (!found) return new Response("Not found", { status: 404 });
  // Names and venue in the card's script, like its wording.
  const taklif = locale === "uz-Cyrl" ? cyrillicOwnerText(found) : found;
  // Paying publishes: no image of an unpaid draft or a withdrawn invitation.
  if (taklif.status !== "published") {
    return new Response("Not published", { status: 403 });
  }

  const [t, tDates, assets] = await Promise.all([
    getTranslations({ locale, namespace: occasionMessages(taklif) }),
    getTranslations({ locale, namespace: "Dates" }),
    cardAssets(),
  ]);
  const months = tDates.raw("months") as string[];
  const weekdays = tDates.raw("weekdays") as string[];
  const { year, month, day, weekday, time } = tashkentParts(taklif.eventAt);

  const image = new ImageResponse(
    <StoryCard
      assets={assets}
      groom={taklif.groomName}
      bride={taklif.brideName}
      weekday={weekdays[weekday]}
      day={day}
      month={months[month]}
      year={year}
      time={time}
      venue={taklif.venueName}
      address={taklif.venueAddress}
      signature={t("signature", { host: taklif.hostName })}
    />,
    { ...STORY_SIZE, fonts: assets.fonts },
  );

  const headers = new Headers(image.headers);
  headers.set(
    "Content-Disposition",
    `attachment; filename="taklifim-${taklif.slug}.png"`,
  );
  // Personal and changes with every edit.
  headers.set("Cache-Control", "private, no-store");
  return new Response(image.body, { status: image.status, headers });
}
