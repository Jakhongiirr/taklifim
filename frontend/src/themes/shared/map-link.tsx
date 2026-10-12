import type { ReactNode } from "react";

/** The venue on a map, in a new tab; nothing when the owner gave no link. */
export default function MapLink({
  url,
  className = "",
  children,
}: {
  url: string | null;
  className?: string;
  children: ReactNode;
}) {
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
