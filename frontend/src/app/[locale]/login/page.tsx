import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import LoginForm from "@/components/site/login-form";
import SiteHeader from "@/components/site/site-header";
import { getCurrentUser, safeSitePath } from "@/lib/server/current-user";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth");
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

export default async function LoginPage({
  params,
  searchParams,
}: PageProps<"/[locale]/login">) {
  const { locale } = await params;
  const next = safeSitePath((await searchParams).next, locale);
  if (await getCurrentUser()) redirect(next);
  const t = await getTranslations("Auth");

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-start justify-center px-4 pt-10 pb-16 sm:items-center sm:pt-0">
        <div className="w-full max-w-sm rounded-[2rem] bg-white/70 p-6 ring-1 ring-line sm:p-8">
          <h1 className="font-serif text-3xl font-medium text-ink">
            {t("title")}
          </h1>
          <p className="mt-2 mb-7 text-sm text-muted">{t("subtitle")}</p>
          <LoginForm next={next} />
        </div>
      </main>
    </>
  );
}
