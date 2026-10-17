import { notFound } from "next/navigation";
import { getInvitedGuest, getPublishedTaklif } from "@/lib/server/taklif";
import { ThemedInvitation } from "@/themes";
import { invitationMetadata } from "../invitation-metadata";

// Cached per personal link, like the shared one.
export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

/** Personal links end in an 8-character token (never "preview"). */
const TOKEN = /^[a-z2-9]{8}$/;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/taklif/[slug]/[guest]">) {
  const taklif = await getPublishedTaklif((await params).slug);
  return taklif ? invitationMetadata(taklif) : {};
}

/**
 * A named guest's personal link: the invitation greets them by name and
 * fills it in the RSVP. A link whose guest was removed still opens the
 * invitation, just without the name.
 */
export default async function PersonalInvitationPage({
  params,
}: PageProps<"/[locale]/taklif/[slug]/[guest]">) {
  const { slug, guest: token } = await params;
  if (!TOKEN.test(token)) notFound();
  const [taklif, guest] = await Promise.all([
    getPublishedTaklif(slug),
    getInvitedGuest(slug, token),
  ]);
  if (!taklif) notFound();
  return (
    <ThemedInvitation
      taklif={taklif}
      guest={guest ? { name: guest.name, token } : undefined}
    />
  );
}
