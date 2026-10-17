/** A point on the map, in degrees. */
export type Pin = { lat: number; lng: number };

/** Where the map opens when there's no pin and no location: Tashkent. */
export const TASHKENT: Pin = { lat: 41.311151, lng: 69.279737 };

type WithLocation = {
  locationUrl: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

const valid = (lat: number, lng: number): Pin | null =>
  Number.isFinite(lat) &&
  Number.isFinite(lng) &&
  Math.abs(lat) <= 90 &&
  Math.abs(lng) <= 180
    ? { lat, lng }
    : null;

/** "69.24,41.31" (Yandex order: longitude first). */
const lngLat = (value: string | null) => {
  const [lng, lat] = (value ?? "").split(",").map(Number);
  return value ? valid(lat, lng) : null;
};

/**
 * The marked point in a full Yandex or Google Maps link, for links pasted
 * before the map picker. Short links (maps.app.goo.gl, yandex.uz/maps/-/…)
 * and links that only show an area carry none: those only get the button.
 */
export function pinFromUrl(url: string): Pin | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const query = parsed.searchParams;
  if (/(^|\.)yandex\.[a-z]+$/.test(parsed.hostname)) {
    return (
      lngLat(query.get("pt")?.split("~")[0] ?? null) ??
      lngLat(query.get("whatshere[point]"))
    );
  }
  if (/(^|\.)google\.[a-z.]+$/.test(parsed.hostname)) {
    // A place's own point; "@lat,lng" is only where the view was.
    const place = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/.exec(parsed.pathname);
    if (place) return valid(Number(place[1]), Number(place[2]));
    const q = /^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/.exec(
      query.get("q") ?? query.get("query") ?? "",
    );
    if (q) return valid(Number(q[1]), Number(q[2]));
  }
  return null;
}

/** The venue's pin: picked on the map, or read from its map link. */
export function venuePin(taklif: WithLocation): Pin | null {
  if (taklif.latitude != null && taklif.longitude != null) {
    return { lat: taklif.latitude, lng: taklif.longitude };
  }
  return taklif.locationUrl ? pinFromUrl(taklif.locationUrl) : null;
}

const point = ({ lat, lng }: Pin) => `${lng},${lat}`;

/** Opens the point in Yandex Maps (the app on phones). */
export const yandexMapsUrl = (pin: Pin) =>
  `https://yandex.uz/maps/?pt=${point(pin)}&z=17&l=map`;

/** The link guests open: the owner's own link, else the pin in Yandex Maps. */
export function venueMapUrl(taklif: WithLocation): string | null {
  if (taklif.locationUrl) return taklif.locationUrl;
  const pin = venuePin(taklif);
  return pin && yandexMapsUrl(pin);
}

/** Yandex's language for a site locale; Uzbek pages get Russian names. */
export const yandexLang = (locale: string) =>
  locale === "en" ? "en_US" : "ru_RU";

/** Yandex's embeddable map with the pin; needs no API key. */
export const yandexEmbedUrl = (pin: Pin, locale: string) =>
  `https://yandex.ru/map-widget/v1/?ll=${point(pin)}&z=16&pt=${point(pin)},pm2rdm&lang=${yandexLang(locale)}`;
