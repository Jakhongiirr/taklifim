import { getLocale, getTranslations } from "next-intl/server";
import type { PublicTaklif } from "@/lib/api-types";
import { venuePin, yandexEmbedUrl } from "@/lib/venue-map";

/**
 * The venue on an embedded Yandex map, for invitations with a pin (or a map
 * link that carries one). `className` frames it in the theme's style.
 */
export default async function VenueMap({
  taklif,
  className = "",
}: {
  taklif: PublicTaklif;
  className?: string;
}) {
  const pin = venuePin(taklif);
  if (!pin) return null;
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Invitation"),
  ]);
  return (
    <div
      className={`relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden ${className}`}
    >
      <iframe
        src={yandexEmbedUrl(pin, locale)}
        title={t("venue.title")}
        loading="lazy"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />
    </div>
  );
}
