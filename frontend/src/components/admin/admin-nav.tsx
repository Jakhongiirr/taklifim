"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef } from "react";
import { cx } from "./ui";

/** 20×20 line icons (Lucide-style), drawn in the current colour. */
const icon = (paths: ReactNode) => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    className="size-[18px] shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {paths}
  </svg>
);

const icons = {
  dashboard: icon(
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>,
  ),
  invitations: icon(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>,
  ),
  users: icon(
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6" />
    </>,
  ),
  demos: icon(
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-4.5-4.5L6 21" />
    </>,
  ),
  themes: icon(
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.6 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5C21 6.6 17 3 12 3Z" />
      <circle cx="7.5" cy="11" r="1" />
      <circle cx="10" cy="7" r="1" />
      <circle cx="15" cy="7.5" r="1" />
    </>,
  ),
  statistics: icon(
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>,
  ),
  payments: icon(
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M2.5 10h19M6.5 15h3" />
    </>,
  ),
  music: icon(
    <>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </>,
  ),
};

/** Grouped the way an admin's day goes: overview, content, then setup. */
const groups: {
  label: string;
  links: { href: string; label: string; icon: ReactNode; exact?: boolean }[];
}[] = [
  {
    label: "Overview",
    links: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: icons.dashboard,
        exact: true,
      },
      {
        href: "/admin/statistics",
        label: "Statistics",
        icon: icons.statistics,
      },
    ],
  },
  {
    label: "Content",
    links: [
      {
        href: "/admin/invitations",
        label: "Invitations",
        icon: icons.invitations,
      },
      { href: "/admin/users", label: "Users", icon: icons.users },
      { href: "/admin/payments", label: "Payments", icon: icons.payments },
    ],
  },
  {
    label: "Catalog",
    links: [
      { href: "/admin/demos", label: "Demos", icon: icons.demos },
      { href: "/admin/themes", label: "Themes", icon: icons.themes },
      { href: "/admin/music", label: "Music", icon: icons.music },
    ],
  },
];

function useActive() {
  const pathname = usePathname();
  return (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);
}

/** Desktop: the sidebar's grouped, vertical list. */
export function SidebarNav() {
  const isActive = useActive();
  return (
    <nav className="flex flex-col gap-5 px-3 text-sm">
      {groups.map((group) => (
        <div key={group.label}>
          <div className="mb-1 px-3 text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
            {group.label}
          </div>
          <ul className="flex flex-col gap-0.5">
            {group.links.map(({ href, label, icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "relative flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                      active
                        ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100",
                    )}
                  >
                    {active && (
                      <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-sage dark:bg-emerald-400" />
                    )}
                    {icon}
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** Phones: every section in one scrollable row of pills. */
export default function AdminNav() {
  const isActive = useActive();
  const pathname = usePathname();
  const nav = useRef<HTMLElement>(null);
  // Later sections start off-screen: bring the current one into view.
  useEffect(() => {
    nav.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [pathname]);
  return (
    <nav ref={nav} className="flex gap-1 text-sm whitespace-nowrap">
      {groups
        .flatMap((group) => group.links)
        .map(({ href, label, icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cx(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors",
                active
                  ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
              )}
            >
              {icon}
              {label}
            </Link>
          );
        })}
    </nav>
  );
}
