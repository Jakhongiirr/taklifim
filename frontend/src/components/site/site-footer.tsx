import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Logo from "./logo";

export default async function SiteFooter() {
  const t = await getTranslations("Site");

  return (
    <footer className="border-t border-line bg-cream/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-sm">
          <Logo className="h-10" />
          <p className="mt-2 text-sm text-muted">{t("footer.tagline")}</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <Link href="/#templates" className="hover:text-ink">
            {t("nav.templates")}
          </Link>
          <Link href="/#how" className="hover:text-ink">
            {t("nav.how")}
          </Link>
          <Link href="/#faq" className="hover:text-ink">
            {t("nav.faq")}
          </Link>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 text-xs text-muted sm:px-6">
          <span>{t("footer.rights", { year: new Date().getFullYear() })}</span>
          <span className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/terms" className="hover:text-ink">
              {t("legal.terms")}
            </Link>
            <Link href="/privacy" className="hover:text-ink">
              {t("legal.privacy")}
            </Link>
            <a href="#top" className="hover:text-ink">
              {t("footer.top")} ↑
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
