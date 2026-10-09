import type { Metadata } from "next";
import LegalPage from "@/components/site/legal-page";
import { TERMS } from "@/content/legal/terms";
import { routing } from "@/i18n/routing";

const docFor = (locale: string) =>
  TERMS[locale] ?? TERMS[routing.defaultLocale];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/terms">): Promise<Metadata> {
  return { title: docFor((await params).locale).title };
}

export default async function TermsPage({
  params,
}: PageProps<"/[locale]/terms">) {
  return <LegalPage doc={docFor((await params).locale)} />;
}
