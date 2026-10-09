import type { Metadata } from "next";
import LegalPage from "@/components/site/legal-page";
import { PRIVACY } from "@/content/legal/privacy";
import { routing } from "@/i18n/routing";

const docFor = (locale: string) =>
  PRIVACY[locale] ?? PRIVACY[routing.defaultLocale];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  return { title: docFor((await params).locale).title };
}

export default async function PrivacyPage({
  params,
}: PageProps<"/[locale]/privacy">) {
  return <LegalPage doc={docFor((await params).locale)} />;
}
