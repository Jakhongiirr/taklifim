import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/admin-nav";
import LogoutButton from "@/components/admin/logout-button";
import { getCurrentUser } from "@/lib/server/current-user";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  if (user.role !== "admin") {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-semibold">No admin access</h1>
        <p className="text-sm text-zinc-500">
          {user.phone} is not an admin account.
        </p>
        <LogoutButton />
      </main>
    );
  }

  return (
    <>
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
          <Link
            href="/admin/users"
            className="flex items-center gap-2 font-semibold"
          >
            <Image
              src="/brand/logo-mark.svg"
              alt=""
              width={852}
              height={843}
              unoptimized
              className="h-7 w-auto"
            />
            Taklifim Admin
          </Link>
          <AdminNav />
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="hidden text-zinc-500 sm:inline">{user.phone}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>
    </>
  );
}
