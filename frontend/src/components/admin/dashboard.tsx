"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import type { ReactNode } from "react";
import { api, ApiError } from "@/lib/api-client";
import type { Stats, TaklifStatus } from "@/lib/api-types";
import {
  coupleNames,
  formatDateTime,
  formatEventAt,
  formatSum,
} from "@/lib/format";
import { invitationUrl, repliesUrl } from "./links";
import { Alert, Badge, cx, EmptyState, Spinner } from "./ui";

const sourceNames: Record<string, string> = {
  direct: "Direct / unknown",
  chatgpt: "ChatGPT",
  perplexity: "Perplexity",
  gemini: "Gemini",
  claude: "Claude",
  copilot: "Copilot",
  deepseek: "DeepSeek",
  google: "Google",
  yandex: "Yandex",
  bing: "Bing",
  telegram: "Telegram",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  twitter: "X (Twitter)",
  vk: "VK",
  whatsapp: "WhatsApp",
  gmail: "Gmail",
};

const statusTone: Record<TaklifStatus, "neutral" | "green" | "amber"> = {
  draft: "neutral",
  published: "green",
  unpublished: "amber",
};

/** The admin home: what's happening, and a way into each part of it. */
export default function Dashboard() {
  const stats = useQuery({
    queryKey: ["stats"],
    queryFn: () => api<Stats>("/stats"),
    // Fresh numbers when coming back to the tab.
    refetchOnWindowFocus: true,
  });

  if (stats.isPending) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }
  if (stats.isError) {
    return (
      <Alert>
        {stats.error instanceof ApiError
          ? stats.error.fullMessage
          : "Could not load the dashboard"}
      </Alert>
    );
  }
  const s = stats.data;
  const maxTheme = Math.max(1, ...s.themes.map((t) => t.total));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-zinc-500">
          Everything at a glance. Numbers cover all time unless they say “this
          week” (the last 7 days).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Kpi
          href="/admin/users"
          label="Users"
          value={s.users.total}
          note={`+${s.users.new7d} this week · ${s.users.active7d} active`}
        />
        <Kpi
          href="/admin/invitations?status=all"
          label="Invitations"
          value={s.invitations.total}
          note={`+${s.invitations.new7d} this week`}
        />
        <Kpi
          href="/admin/payments"
          label="Revenue, so'm"
          value={s.revenue.total}
          note={`+${formatSum(s.revenue.week)} this week · ${s.revenue.orders} paid`}
        />
        <Kpi
          label="Guest replies"
          value={s.responses.total}
          note={`+${s.responses.new7d} this week · ${s.responses.guests} guests coming`}
        />
        <Kpi
          label="Site visitors today"
          value={s.visits.today}
          note={`${formatSum(s.visits.week)} this week · ${formatSum(s.visits.month)} in 30 days`}
          title="Unique visitors per day, added up: someone who comes back the next day counts again"
        />
        <Kpi
          label="Invitation views"
          value={s.views.total}
          note={`+${formatSum(s.views.week)} this week · ${formatSum(s.views.today)} today`}
          title="Guest page views of all invitations: each visitor once a day per invitation; owners and admins aren't counted"
        />
      </div>

      <Panel title="Invitations by status">
        <StatusBar invitations={s.invitations} />
      </Panel>

      <Panel
        title="Where visitors come from"
        note="The last 30 days: each visitor once a day, by how they arrived · this week"
      >
        <Sources sources={s.sources} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Upcoming weddings" note="Published, in the next 30 days">
          {s.upcoming.length === 0 ? (
            <Empty>No weddings in the next 30 days.</Empty>
          ) : (
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {s.upcoming.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <a
                      href={invitationUrl(t.slug, "published")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {coupleNames(t)}
                    </a>
                    <div className="text-xs text-zinc-500">
                      {formatEventAt(t.eventAt)} ·{" "}
                      <span className="font-mono">{t.themeId}</span>
                    </div>
                  </div>
                  <a
                    href={repliesUrl(t.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    {t.responseCount}{" "}
                    {t.responseCount === 1 ? "reply" : "replies"} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Themes" note="Invitations per theme · published">
          {s.themes.length === 0 ? (
            <Empty>No active themes.</Empty>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {s.themes.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/admin/invitations?theme=${t.id}`}
                    className="group flex items-center gap-3"
                  >
                    <span className="w-16 shrink-0 font-mono text-sm group-hover:underline">
                      {t.themeId}
                    </span>
                    <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-zinc-300 dark:bg-zinc-600"
                        style={{ width: `${(t.total / maxTheme) * 100}%` }}
                      />
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                        style={{ width: `${(t.published / maxTheme) * 100}%` }}
                      />
                    </span>
                    <span className="w-14 shrink-0 text-right text-sm tabular-nums">
                      {t.total}{" "}
                      <span className="text-zinc-500">· {t.published}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Latest invitations"
          action={<Link href="/admin/invitations?status=all">All →</Link>}
        >
          {s.recentInvitations.length === 0 ? (
            <Empty>No invitations yet.</Empty>
          ) : (
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {s.recentInvitations.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/invitations?q=${t.slug}`}
                      className="font-medium hover:underline"
                    >
                      {coupleNames(t)}
                    </Link>
                    <div className="truncate text-xs text-zinc-500">
                      {formatDateTime(t.createdAt)} ·{" "}
                      <span className="font-mono">{t.themeId}</span> ·{" "}
                      <Link
                        href={`/admin/users/${t.ownerId}`}
                        className="tabular-nums hover:underline"
                      >
                        {t.ownerPhone}
                      </Link>
                    </div>
                  </div>
                  <Badge tone={statusTone[t.status]}>{t.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Latest replies" note="Guests' answers and wishes">
          {s.recentResponses.length === 0 ? (
            <Empty>No replies yet.</Empty>
          ) : (
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {s.recentResponses.map((r) => (
                <li key={r.id} className="flex gap-3 py-2.5">
                  <span
                    aria-label={r.attending ? "Coming" : "Not coming"}
                    className={cx(
                      "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs",
                      r.attending
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800",
                    )}
                  >
                    {r.attending ? "✓" : "✕"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm">
                      <span className="font-medium">{r.name}</span>
                      {r.attending && r.guests > 1 && (
                        <span className="text-zinc-500">
                          {" "}
                          · {r.guests} people
                        </span>
                      )}
                    </div>
                    {r.message && (
                      <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                        “{r.message}”
                      </p>
                    )}
                    <a
                      href={repliesUrl(r.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 hover:underline"
                    >
                      {coupleNames(r)} · {formatDateTime(r.createdAt)} ↗
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Kpi({
  href,
  label,
  value,
  note,
  title,
}: {
  href?: string;
  label: string;
  value: number;
  note: string;
  /** How the number is counted, on hover. */
  title?: string;
}) {
  const body = (
    <>
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="mt-1 text-3xl font-semibold tabular-nums">
        {formatSum(value)}
      </div>
      <div className="mt-1 text-xs text-zinc-500">{note}</div>
    </>
  );
  const box =
    "rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900";
  return href ? (
    <Link
      href={href}
      title={title}
      className={cx(
        box,
        "transition-colors hover:border-zinc-400 dark:hover:border-zinc-600",
      )}
    >
      {body}
    </Link>
  ) : (
    <div className={box} title={title}>
      {body}
    </div>
  );
}

function Panel({
  title,
  note,
  action,
  children,
}: {
  title: string;
  note?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          {note && <p className="text-xs text-zinc-500">{note}</p>}
        </div>
        {action && (
          <div className="shrink-0 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            {action}
          </div>
        )}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <EmptyState>{children}</EmptyState>;
}

/** One bar split by status, each part linking to that list. */
function StatusBar({ invitations }: { invitations: Stats["invitations"] }) {
  const parts: { status: TaklifStatus; label: string; color: string }[] = [
    { status: "published", label: "Published", color: "bg-emerald-500" },
    { status: "draft", label: "Draft", color: "bg-zinc-400" },
    { status: "unpublished", label: "Unpublished", color: "bg-amber-400" },
  ];
  const total = Math.max(1, invitations.total);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        {parts.map((p) => (
          <span
            key={p.status}
            className={p.color}
            style={{ width: `${(invitations[p.status] / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
        {parts.map((p) => (
          <Link
            key={p.status}
            href={`/admin/invitations?status=${p.status}`}
            className="flex items-center gap-2 hover:underline"
          >
            <span className={cx("size-2.5 rounded-full", p.color)} />
            {p.label}
            <span className="tabular-nums text-zinc-500">
              {invitations[p.status]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Visitors per source, split into those who landed on the site and those who
 * opened someone's invitation (mostly guests following a shared link).
 */
function Sources({ sources }: { sources: Stats["sources"] }) {
  if (sources.length === 0) {
    return <Empty>No visits counted yet.</Empty>;
  }
  const max = Math.max(1, ...sources.map((r) => r.site + r.invitation));
  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2.5">
        {sources.map((r) => (
          <li key={r.source} className="flex items-center gap-3">
            <span className="w-32 shrink-0 truncate text-sm" title={r.source}>
              {sourceNames[r.source] ?? r.source}
            </span>
            <span className="relative flex h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <span
                className="bg-sky-500"
                style={{ width: `${(r.site / max) * 100}%` }}
              />
              <span
                className="bg-violet-400"
                style={{ width: `${(r.invitation / max) * 100}%` }}
              />
            </span>
            <span className="w-24 shrink-0 text-right text-sm tabular-nums">
              {formatSum(r.site + r.invitation)}{" "}
              <span className="text-zinc-500">· {formatSum(r.week)}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-500">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-sky-500" />
          Landed on the site
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-violet-400" />
          Opened an invitation
        </span>
        <span>
          Telegram and WhatsApp links often arrive with no trace, so they land
          in “Direct / unknown”. Tag your own links with ?utm_source=…
        </span>
      </div>
    </div>
  );
}
