import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/** A short nudge above the samples: send them with an online invitation. */
export default async function WordingNudge() {
  const t = await getTranslations("Wording.nudge");

  return (
    <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-sage/10 p-5 ring-1 ring-sage/20 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <p className="max-w-2xl leading-relaxed text-ink/85">{t("text")}</p>
      <Link
        href="/cabinet/new"
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-sage px-6 text-sm font-medium text-paper transition-colors hover:bg-sage-dark"
      >
        {t("button")}
      </Link>
    </div>
  );
}
