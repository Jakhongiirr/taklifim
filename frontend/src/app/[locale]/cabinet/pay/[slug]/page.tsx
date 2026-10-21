import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import PaymentPage from "@/components/site/cabinet/payment-page";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";
import { getCurrentUser } from "@/lib/server/current-user";
import { GIFT_THEME_ID, getMyGifts } from "@/lib/server/gifts";
import { getTaklifPreview } from "@/lib/server/taklif";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pay");
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

/**
 * Paying for a draft: the order, the ways to pay, and the support
 * Telegram for those who can't pay online. Only its owner gets here; a
 * paid one goes to the cabinet.
 */
export default async function PayPage({
  params,
}: PageProps<"/[locale]/cabinet/pay/[slug]">) {
  const { locale, slug } = await params;
  const [taklif, user] = await Promise.all([
    getTaklifPreview(slug),
    getCurrentUser(),
  ]);
  if (!taklif || user?.id !== taklif.userId) notFound();
  // Already paid (back from Payme, say): the cabinet confirms it.
  if (taklif.paidAt) redirect(`/${locale}/cabinet#paid-${taklif.slug}`);
  if (taklif.status !== "draft") redirect(`/${locale}/cabinet`);
  // A plov draft goes out free while its owner has a gift for it.
  const gift =
    taklif.theme.themeId === GIFT_THEME_ID && !!(await getMyGifts())?.available;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 pt-8 pb-16 sm:px-6 sm:pt-12">
        <PaymentPage taklif={taklif} gift={gift} />
      </main>
      <SiteFooter />
    </>
  );
}
