"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "./ui";

const links = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/themes", label: "Themes" },
  { href: "/admin/demos", label: "Demos" },
  { href: "/admin/invitations", label: "Invitations" },
  { href: "/admin/music", label: "Music" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 text-sm">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cx(
            "rounded-md px-3 py-1.5 transition-colors",
            pathname.startsWith(href)
              ? "bg-zinc-100 font-medium dark:bg-zinc-800"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
