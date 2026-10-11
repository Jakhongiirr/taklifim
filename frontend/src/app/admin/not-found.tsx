import Link from "next/link";

export default function AdminNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <Link href="/admin" className="text-sm underline">
        Back to the admin panel
      </Link>
    </main>
  );
}
