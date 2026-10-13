import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * The closing "Made with Taklifim.uz", linking to the site's home page. In a
 * new tab, so the invitation (and its music) stays open behind it.
 */
export default async function MadeWith({ className }: { className: string }) {
  const t = await getTranslations("Invitation");
  return (
    <p className={className}>
      <Link
        href="/"
        target="_blank"
        className="underline-offset-4 hover:underline"
      >
        {t("madeWith")}
      </Link>
    </p>
  );
}
