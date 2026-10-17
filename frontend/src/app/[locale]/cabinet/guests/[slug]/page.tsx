import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import GuestsList from "@/components/site/cabinet/guests-list";
import StatusBadge from "@/components/site/cabinet/status-badge";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";
import { Link } from "@/i18n/navigation";
import { coupleNames } from "@/lib/format";
import { getTaklifGuests, getTaklifPreview } from "@/lib/server/taklif";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Guests");
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

/** The owner's named guests, each with a personal link. */
export default async function GuestsPage({
  params,
}: PageProps<"/[locale]/cabinet/guests/[slug]">) {
  const taklif = await getTaklifPreview((await params).slug);
  if (!taklif) notFound();
  const [t, guests] = await Promise.all([
    getTranslations("Guests"),
    getTaklifGuests(taklif.id),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-8 pb-16 sm:px-6 sm:pt-12">
        <Link href="/cabinet" className="text-sm text-muted hover:text-ink">
          ← {t("back")}
        </Link>
        <h1 className="mt-3 font-serif text-4xl font-medium text-ink">
          {t("title")}
        </h1>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <p className="font-serif text-xl text-sage italic">
            {coupleNames(taklif)}
          </p>
          <StatusBadge status={taklif.status} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">{t("intro")}</p>

        {guests === null ? (
          <p
            role="alert"
            className="mt-8 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {t("loadError")}
          </p>
        ) : (
          <GuestsList
            taklifId={taklif.id}
            slug={taklif.slug}
            published={taklif.status === "published"}
            guests={guests}
          />
        )}
      </main>
      <SiteFooter />
    </>
  );
}
