import type { ReactNode } from "react";
import type { PublicTaklif } from "@/lib/api-types";
import { venueMapUrl } from "@/lib/venue-map";

/**
 * The venue on a map, in a new tab: the owner's link, else their pin in
 * Yandex Maps. Nothing when the invitation has neither.
 */
export default function MapLink({
  taklif,
  className = "",
  children,
}: {
  taklif: PublicTaklif;
  className?: string;
  children: ReactNode;
}) {
  const url = venueMapUrl(taklif);
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
