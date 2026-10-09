import { notFound } from "next/navigation";
import { getPublishedTaklif } from "@/lib/server/taklif";
import { ThemedInvitation } from "@/themes";
import { invitationMetadata } from "./invitation-metadata";

// Rendered on first visit, then served from cache and refreshed at most every
// minute (like the data fetch), so a busy link barely touches the backend.
export const revalidate = 60;

// None at build time; without this the route renders on every request.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/taklif/[slug]">) {
  const taklif = await getPublishedTaklif((await params).slug);
  return taklif ? invitationMetadata(taklif) : {};
}

/** The invitation guests open from the shared link. Published only. */
export default async function InvitationPage({
  params,
}: PageProps<"/[locale]/taklif/[slug]">) {
  const taklif = await getPublishedTaklif((await params).slug);
  if (!taklif) notFound();
  return <ThemedInvitation taklif={taklif} />;
}
