import type { Metadata } from "next";
import LegalPage from "@/components/site/legal-page";
import { PRIVACY } from "@/content/legal/privacy";
import { localeAlternates } from "@/lib/seo";
import { inLocale } from "@/lib/uz-cyrillic";

const docFor = (locale: string) => inLocale(PRIVACY, locale);

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: docFor(locale).title,
    alternates: localeAlternates(locale, "/privacy"),
  };
}

export default async function PrivacyPage({
  params,
}: PageProps<"/[locale]/privacy">) {
  return <LegalPage doc={docFor((await params).locale)} />;
}
