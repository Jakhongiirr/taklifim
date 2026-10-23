import type { Metadata } from "next";
import LegalPage from "@/components/site/legal-page";
import { TERMS } from "@/content/legal/terms";
import { localeAlternates } from "@/lib/seo";
import { inLocale } from "@/lib/uz-cyrillic";

const docFor = (locale: string) => inLocale(TERMS, locale);

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
