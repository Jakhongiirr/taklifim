import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminNav, { SidebarNav } from "@/components/admin/admin-nav";
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

  const brand = (
    <Link href="/admin" className="flex items-center gap-2.5 font-semibold">
      <Image
        src="/brand/logo-mark.webp"
        alt=""
        width={320}
        height={240}
        unoptimized
        className="h-7 w-auto"
      />
      <span>
        Taklifim <span className="font-normal text-zinc-400">Admin</span>
      </span>
    </Link>
  );

  return (
    <div className="flex min-h-dvh">
      {/* Desktop: a fixed sidebar with the sections and the account. */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-zinc-200 bg-white md:flex dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-14 items-center border-b border-zinc-200 px-5 dark:border-zinc-800">
          {brand}
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav />
        </div>
        <div className="flex flex-col gap-3 border-t border-zinc-200 p-4 text-sm dark:border-zinc-800">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            View site ↗
          </a>
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate font-medium tabular-nums">
                {user.phone}
              </div>
              <div className="text-xs text-zinc-400">Administrator</div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Phones: a top bar, and the sections in a scrollable row. */}
        <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur md:hidden dark:border-zinc-800 dark:bg-zinc-900/95">
          <div className="flex h-14 items-center justify-between gap-3 px-4">
            {brand}
            <LogoutButton />
          </div>
          <div className="overflow-x-auto border-t border-zinc-100 px-3 py-2 [scrollbar-width:none] dark:border-zinc-800">
            <AdminNav />
          </div>
        </header>
        {/* Every admin table: rows light up under the pointer, headers stay on one line. */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8 [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-zinc-50 dark:[&_tbody_tr:hover]:bg-zinc-800/40 [&_th]:whitespace-nowrap">
          {children}
        </main>
      </div>
    </div>
  );
}
