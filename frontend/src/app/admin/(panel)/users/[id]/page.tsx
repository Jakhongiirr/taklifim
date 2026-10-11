import type { Metadata } from "next";
import UserDetail from "@/components/admin/user-detail";
import { getCurrentUser } from "@/lib/server/current-user";

export const metadata: Metadata = { title: "User" };

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, me] = await Promise.all([params, getCurrentUser()]);
  return <UserDetail id={id} selfId={me?.id ?? ""} />;
}
