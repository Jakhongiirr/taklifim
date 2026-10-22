import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { designName, designPreview } from "@/content/designs";
import { Link } from "@/i18n/navigation";
import { formatSum } from "@/lib/format";
import { DESIGN_NAME_FONT } from "./design-fonts";

/** A design in a list: its opened invitation's art, name and tagline. */
export default async function DesignCard({
  id,
  tagline,
  price,
}: {
  id: string;
  tagline: string;
  /** Whole so'm; null when the catalog couldn't be loaded. */
  price: number | null;
}) {
  const t = await getTranslations("Designs");

  return (
    <Link
      href={`/designs/${id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_10px_30px_-18px_rgba(42,39,35,0.45)] ring-1 ring-line transition-shadow duration-300 hover:shadow-[0_22px_45px_-20px_rgba(42,39,35,0.5)]"
    >
      <span className="relative block aspect-[4/5] overflow-hidden bg-cream">
        <Image
          src={designPreview(id)}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        {price !== null && (
          <span className="absolute top-3 left-3 rounded-full bg-paper/90 px-2.5 py-1 text-xs font-medium text-ink backdrop-blur">
            {price === 0 ? t("free") : t("price", { price: formatSum(price) })}
          </span>
        )}
        <span
          className={`absolute inset-x-4 bottom-3 text-4xl leading-tight text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.35)] ${DESIGN_NAME_FONT[id] ?? "font-serif"}`}
        >
          {designName(id)}
        </span>
      </span>
      <span className="flex flex-1 flex-col gap-3 p-4">
        <span className="text-sm leading-snug text-muted">{tagline}</span>
        <span className="mt-auto text-sm font-medium text-sage">
          {t("more")} <span aria-hidden>→</span>
        </span>
      </span>
    </Link>
  );
}
