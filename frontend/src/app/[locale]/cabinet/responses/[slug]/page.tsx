import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ResponsesList from "@/components/site/cabinet/responses-list";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";
import { Link } from "@/i18n/navigation";
import { coupleNames } from "@/lib/format";
import { getTaklifPreview, getTaklifResponses } from "@/lib/server/taklif";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Responses");
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

/** Guests' replies to the owner's invitation, with totals. */
export default async function ResponsesPage({
  params,
}: PageProps<"/[locale]/cabinet/responses/[slug]">) {
  const taklif = await getTaklifPreview((await params).slug);
  if (!taklif) notFound();
  const [t, data] = await Promise.all([
    getTranslations("Responses"),
    getTaklifResponses(taklif.id),
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
        <p className="mt-1 font-serif text-xl text-sage italic">
          {coupleNames(taklif)}
        </p>

        {data === null ? (
          <p
            role="alert"
            className="mt-8 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {t("loadError")}
          </p>
        ) : (
          <>
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {(
                [
                  ["coming", data.attending],
                  ["declined", data.declined],
                  ["guests", data.guests],
                ] as const
              ).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-3xl bg-white/70 px-3 py-4 text-center ring-1 ring-line"
                >
                  <dd className="font-serif text-3xl text-ink">{value}</dd>
                  <dt className="mt-1 text-xs text-muted">{t(key)}</dt>
                </div>
              ))}
            </dl>
            <div className="mt-8">
              {data.items.length ? (
                <ResponsesList taklifId={taklif.id} items={data.items} />
              ) : (
                <p className="rounded-[2rem] border border-dashed border-line px-6 py-12 text-center text-sm text-muted">
                  {t("empty")}
                </p>
              )}
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
