import type { Metadata } from "next";
import TaklifManager from "@/components/admin/taklif-manager";
import { getCurrentUser } from "@/lib/server/current-user";

export const metadata: Metadata = { title: "Invitations" };

export default async function InvitationsPage() {
  const me = await getCurrentUser();
  return <TaklifManager selfId={me?.id} />;
}
