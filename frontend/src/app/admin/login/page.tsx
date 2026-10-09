import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/login-form";
import { getCurrentUser, safeAdminPath } from "@/lib/server/current-user";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const next = safeAdminPath((await searchParams).next);
  const user = await getCurrentUser();
  if (user?.role === "admin") redirect(next);

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold">Taklifim Admin</h1>
        <p className="mt-1 mb-6 text-sm text-zinc-500">
          Log in with your phone number. The code arrives in Telegram.
        </p>
        <LoginForm next={next} />
      </div>
    </main>
  );
}
