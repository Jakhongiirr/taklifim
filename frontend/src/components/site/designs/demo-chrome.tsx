import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * The slim bar over a design's built-in demo: back to the design's page,
 * what this is, and "create with this design". It sits above the cover.
 */
export default async function DemoChrome({
  design,
  themeId,
}: {
  /** The design's id (its page). */
  design: string;
  /** The backend theme's id, for the builder's ?theme=; null if unknown. */
  themeId: string | null;
}) {
  const t = await getTranslations("Designs");
  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-ink/85 text-paper backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-3xl items-center justify-between gap-2 px-3">
        <Link
          href={`/designs/${design}`}
          className="flex min-w-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm text-paper/80 transition-colors hover:bg-white/10 hover:text-paper"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="size-4 shrink-0">
            <path
              d="M15 6l-6 6 6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="truncate">{t("demoPage.back")}</span>
        </Link>

        <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs tracking-wide text-paper/90 sm:inline">
          {t("demoPage.label")}
        </span>

        <Link
          href={
            themeId
              ? { pathname: "/cabinet/new", query: { theme: themeId } }
              : "/cabinet/new"
          }
          className="shrink-0 rounded-full bg-paper px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-cream"
        >
          {t("choose")}
        </Link>
      </div>
    </div>
  );
}
