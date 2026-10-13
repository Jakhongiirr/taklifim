import type { Metadata } from "next";
import LegalPage from "@/components/site/legal-page";
import { TERMS } from "@/content/legal/terms";
import { routing } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";

const docFor = (locale: string) =>
  TERMS[locale] ?? TERMS[routing.defaultLocale];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/terms">): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: docFor(locale).title,
    alternates: localeAlternates(locale, "/terms"),
  };
}

export default async function TermsPage({
  params,
}: PageProps<"/[locale]/terms">) {
  return <LegalPage doc={docFor((await params).locale)} />;
}
