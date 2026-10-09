import type { Metadata } from "next";
import TaklifManager from "@/components/admin/taklif-manager";

export const metadata: Metadata = { title: "Invitations" };

export default function InvitationsPage() {
  return <TaklifManager />;
}
