import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * The owner's free plov invitations (one per paid invitation), with a
 * button to make one in the plov design.
 */
export default async function GiftBanner({
  count,
  themeId,
}: {
  count: number;
  /** The plov design's theme id, preselected in the builder. */
  themeId: string;
}) {
  const t = await getTranslations("Cabinet.gift");
  return (
    <section className="mt-8 flex items-center gap-4 rounded-3xl bg-gradient-to-br from-[#fbf3e2] to-[#f3e3c3] p-4 ring-1 ring-gold/40 sm:p-5">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-full ring-2 ring-gold/60 sm:size-24">
        <Image
          src="/themes/plov/plov.webp"
          alt=""
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
          🎁 {t("eyebrow")}
        </p>
        <h2 className="mt-1 font-serif text-2xl leading-tight text-ink">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm text-muted">{t("text", { count })}</p>
        <Link
          href={`/cabinet/new?theme=${themeId}`}
          className="mt-3 inline-flex h-10 items-center rounded-full bg-sage px-5 text-sm font-medium text-paper transition-colors hover:bg-sage-dark"
        >
          {t("button")}
        </Link>
      </div>
    </section>
  );
}
