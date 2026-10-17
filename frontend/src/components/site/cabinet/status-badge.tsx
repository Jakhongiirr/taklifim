import { useTranslations } from "next-intl";
import type { Taklif } from "@/lib/api-types";

const STYLES: Record<Taklif["status"], { badge: string; dot: string }> = {
  published: { badge: "bg-sage text-paper ring-sage", dot: "bg-paper" },
  draft: {
    badge: "bg-amber-100 text-amber-900 ring-amber-300",
    dot: "bg-amber-500",
  },
  unpublished: {
    badge: "bg-red-50 text-red-800 ring-red-200",
    dot: "bg-red-500",
  },
};

/** The invitation's status, coloured so a draft or hidden one stands out. */
export default function StatusBadge({ status }: { status: Taklif["status"] }) {
  const t = useTranslations("Cabinet");
  const style = STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ring-1 ${style.badge}`}
    >
      <span aria-hidden className={`size-2 rounded-full ${style.dot}`} />
      {t(`status.${status}`)}
    </span>
  );
}
