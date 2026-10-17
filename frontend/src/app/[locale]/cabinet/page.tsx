import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import LogoutButton from "@/components/site/cabinet/logout-button";
import GiftBanner from "@/components/site/cabinet/gift-banner";
import PaymentReturn from "@/components/site/cabinet/payment-return";
import TaklifCard from "@/components/site/cabinet/taklif-card";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/server/current-user";
import { GIFT_THEME_ID, getMyGifts } from "@/lib/server/gifts";
import { getMyTaklifs } from "@/lib/server/taklif";

// Mirrors the backend's MAX_DRAFTS.
const MAX_DRAFTS = 30;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Cabinet");
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

export default async function CabinetPage({
  params,
}: PageProps<"/[locale]/cabinet">) {
  const { locale } = await params;
  // The proxy already sends visitors without a session to the login page;
  // this catches a token the backend rejects.
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/${locale}/cabinet`);

  const [t, taklifs, gifts] = await Promise.all([
    getTranslations("Cabinet"),
    getMyTaklifs(),
    getMyGifts(),
  ]);
  const drafts = taklifs?.filter((x) => x.status === "draft").length ?? 0;
  // Free plov invitations, given for paid ones: a plov draft is then
  // published with one instead of paying.
  const giftsLeft = gifts?.themeId ? gifts.available : 0;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-8 pb-16 sm:px-6 sm:pt-12">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted">{user.phone}</p>
          <LogoutButton />
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-medium text-ink">
              {t("title")}
            </h1>
            {!!taklifs?.length && (
              <p className="mt-1 text-sm text-muted">
                {t("drafts", { count: drafts, max: MAX_DRAFTS })}
              </p>
            )}
          </div>
          {!!taklifs?.length && (
            <Link
              href="/cabinet/new"
              className="inline-flex h-11 items-center rounded-full bg-sage px-5 text-sm font-medium text-paper transition-colors hover:bg-sage-dark"
            >
              + {t("create")}
            </Link>
          )}
        </div>

        {/* Back from Payme: confirms the payment. */}
        <PaymentReturn />

        {giftsLeft > 0 && gifts?.themeId && (
          <GiftBanner count={giftsLeft} themeId={gifts.themeId} />
        )}

        {taklifs === null ? (
          <p
            role="alert"
            className="mt-8 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {t("loadError")}
          </p>
        ) : taklifs.length ? (
          <ul className="mt-8 flex flex-col gap-4">
            {taklifs.map((taklif) => (
              <li key={taklif.id}>
                <TaklifCard
                  taklif={taklif}
                  gift={giftsLeft > 0 && taklif.theme.themeId === GIFT_THEME_ID}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-[2rem] border border-dashed border-line px-6 py-14 text-center">
            <h2 className="font-serif text-2xl text-ink">{t("empty.title")}</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm text-muted">
              {t("empty.text")}
            </p>
            <Link
              href="/cabinet/new"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-sage px-6 text-sm font-medium text-paper transition-colors hover:bg-sage-dark"
            >
              {t("empty.button")}
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
