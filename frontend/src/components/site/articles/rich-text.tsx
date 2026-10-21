import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

const LINK = /\[([^\]]+)\]\((\/[^)]*)\)/g;

/** Article text with its [label](/path) links to pages of the site. */
export default function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    parts.push(text.slice(last, match.index));
    parts.push(
      <Link
        key={match.index}
        href={match[2]}
        className="font-medium text-sage underline decoration-sage/40 underline-offset-4 hover:decoration-sage"
      >
        {match[1]}
      </Link>,
    );
    last = match.index + match[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}
