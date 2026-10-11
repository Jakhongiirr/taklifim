"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import type { StatsDetails } from "@/lib/api-types";
import { formatSum } from "@/lib/format";
import { Alert, cx, Spinner } from "./ui";

// One data hue for every chart (each shows a single series): validated for
// colour-vision deficiency and >= 3:1 contrast on the white and zinc-900
// card surfaces. Text never wears it: values stay in ink colours.
const BAR = "bg-[#2a78d6] dark:bg-[#3987e5]";

const PERIODS: { days: StatsDetails["days"]; label: string }[] = [
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
  { days: 365, label: "12 months" },
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const percent = (part: number, whole: number) =>
  whole ? `${Math.round((part / whole) * 100)}%` : "—";

/** Trends, what's used most, the funnel, guests, checkout, wedding timing. */
export default function Statistics() {
  const [days, setDays] = useState<StatsDetails["days"]>(30);
  const stats = useQuery({
    queryKey: ["stats-details", days],
    queryFn: () => api<StatsDetails>(`/stats/details?days=${days}`),
    placeholderData: keepPreviousData,
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
          : "Could not load statistics"}
      </Alert>
    );
  }
  const s = stats.data;
  const label = (date: string) => {
    const [y, m, d] = date.split("-").map(Number);
    return s.unit === "month"
      ? `${MONTHS[m - 1]} ${y}`
      : `${d} ${MONTHS[m - 1]}`;
  };
  const trend = (key: "invitations" | "paid" | "revenue" | "users" | "replies") =>
    s.trend.map((p) => ({ label: label(p.date), value: p[key] }));
  const sum = (key: "invitations" | "paid" | "revenue" | "users" | "replies") =>
    s.trend.reduce((total, p) => total + p[key], 0);
  const maxTheme = Math.max(1, ...s.themes.map((t) => t.total));
  const maxMusic = Math.max(1, ...s.music.map((m) => m.invitations));
  const f = s.features;
  const g = s.guests;

  return (
    <div
      className={cx(
        "flex flex-col gap-8 transition-opacity",
        stats.isPlaceholderData && "opacity-60",
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Statistics</h1>
          <p className="text-sm text-zinc-500">
            Trends cover the chosen period; everything else is all time. Dates
            are in Tashkent time.
          </p>
        </div>
        <div
          role="radiogroup"
          aria-label="Period"
          className="flex rounded-md bg-zinc-100 p-1 text-sm dark:bg-zinc-800"
        >
          {PERIODS.map((p) => (
            <button
              key={p.days}
              type="button"
              role="radio"
              aria-checked={days === p.days}
              onClick={() => setDays(p.days)}
              className={cx(
                "rounded px-3 py-1.5 transition-colors",
                days === p.days
                  ? "bg-white font-medium shadow-sm dark:bg-zinc-900"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trends: one measure per chart, never two scales on one axis. */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Panel title="New invitations" total={formatSum(sum("invitations"))}>
          <ColumnChart points={trend("invitations")} />
        </Panel>
        <Panel title="Paid invitations" total={formatSum(sum("paid"))}>
          <ColumnChart points={trend("paid")} />
        </Panel>
        <Panel title="Revenue" total={`${formatSum(sum("revenue"))} so'm`}>
          <ColumnChart
            points={trend("revenue")}
            format={(v) => `${formatSum(v)} so'm`}
          />
        </Panel>
        <Panel title="New users" total={formatSum(sum("users"))}>
          <ColumnChart points={trend("users")} />
        </Panel>
        <Panel title="Guest replies" total={formatSum(sum("replies"))}>
          <ColumnChart points={trend("replies")} />
        </Panel>
        <Panel title="From sign-up to payment" note="Users, all time">
          <BarList
            max={Math.max(1, s.funnel.users)}
            rows={[
              { label: "Signed up", value: s.funnel.users },
              {
                label: "Made an invitation",
                value: s.funnel.created,
                note: percent(s.funnel.created, s.funnel.users),
              },
              {
                label: "Published one",
                value: s.funnel.published,
                note: percent(s.funnel.published, s.funnel.users),
              },
              {
                label: "Paid",
                value: s.funnel.paid,
                note: percent(s.funnel.paid, s.funnel.users),
              },
            ]}
          />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Most used themes" note="Invitations · paid · revenue">
          <BarList
            max={maxTheme}
            rows={s.themes.map((t) => ({
              label: t.themeId,
              mono: true,
              muted: t.archived,
              value: t.total,
              note: `${t.paid} paid · ${formatSum(t.revenue)} so'm`,
            }))}
            empty="No themes."
          />
        </Panel>
        <Panel title="Most used music" note="Invitations using each track">
          <BarList
            max={maxMusic}
            rows={s.music.map((m) => ({
              label: m.id ? m.title ?? "" : "No music",
              sub: m.artist ?? undefined,
              muted: !m.id || m.archived,
              value: m.invitations,
            }))}
            empty="No music."
          />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="What invitations include"
          note={`Share of all ${formatSum(f.total)} invitations`}
        >
          <BarList
            max={Math.max(1, f.total)}
            rows={[
              {
                label: "Photos",
                value: f.withPhotos,
                note: `${percent(f.withPhotos, f.total)} · avg ${f.avgPhotos.toFixed(1)}`,
              },
              {
                label: "Music",
                value: f.withMusic,
                note: percent(f.withMusic, f.total),
              },
              {
                label: "Map link",
                value: f.withMap,
                note: percent(f.withMap, f.total),
              },
              {
                label: "Gift card number",
                value: f.withCard,
                note: percent(f.withCard, f.total),
              },
              {
                label: "Contact phone",
                value: f.withPhone,
                note: percent(f.withPhone, f.total),
              },
            ]}
          />
        </Panel>
        <Panel title="Guests" note="Replies to published invitations">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Tile
              label="Got replies"
              value={percent(g.withReplies, g.invitations)}
              note={`${g.withReplies} of ${g.invitations} invitations`}
            />
            <Tile
              label="Replies"
              value={formatSum(g.replies)}
              note={
                g.withReplies
                  ? `${(g.replies / g.withReplies).toFixed(1)} per invitation`
                  : "—"
              }
            />
            <Tile
              label="Coming"
              value={percent(g.attending, g.replies)}
              note={`${g.attending} of ${g.replies} replies`}
            />
            <Tile
              label="People coming"
              value={formatSum(g.guests)}
              note={
                g.attending
                  ? `${(g.guests / g.attending).toFixed(1)} per reply`
                  : "—"
              }
            />
            <Tile
              label="Wishes"
              value={formatSum(g.wishes)}
              note={`${percent(g.wishes, g.replies)} of replies`}
            />
            <Tile
              label="Liked by owners"
              value={formatSum(g.liked)}
              note={`${percent(g.liked, g.wishes)} of wishes`}
            />
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <Panel title="Checkout" note="“Pay and publish” through Payme">
          <div className="grid grid-cols-2 gap-3">
            <Tile label="Started" value={formatSum(s.checkout.orders)} />
            <Tile
              label="Paid"
              value={formatSum(s.checkout.paid)}
              note={`${percent(s.checkout.paid, s.checkout.orders)} of started`}
            />
            <Tile label="Cancelled" value={formatSum(s.checkout.cancelled)} />
            <Tile
              label="Timed out"
              value={formatSum(s.checkout.timedOut)}
              note="not paid within 12 h"
            />
          </div>
        </Panel>
        <Panel title="When weddings are held" note="All invitations, Tashkent time">
          <div className="grid gap-6 sm:grid-cols-[2fr_3fr]">
            <div>
              <SubTitle>Weekday</SubTitle>
              <ColumnChart
                points={s.eventWeekdays.map((w) => ({
                  label: WEEKDAYS[w.key - 1],
                  value: w.count,
                }))}
                allLabels
              />
            </div>
            <div>
              <SubTitle>Month</SubTitle>
              <ColumnChart
                points={s.eventMonths.map((m) => ({
                  label: MONTHS[m.key - 1],
                  value: m.count,
                }))}
                allLabels
              />
            </div>
          </div>
          <div className="mt-6">
            <SubTitle>Start time</SubTitle>
            <ColumnChart
              points={s.eventHours.map((h) => ({
                label: `${String(h.key).padStart(2, "0")}:00`,
                value: h.count,
              }))}
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Panel({
  title,
  note,
  total,
  children,
}: {
  title: string;
  note?: string;
  /** The period's total, beside the title. */
  total?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          {note && <p className="text-xs text-zinc-500">{note}</p>}
        </div>
        {total !== undefined && (
          <span className="text-lg font-semibold tabular-nums">{total}</span>
        )}
      </div>
      {children}
    </section>
  );
}

function SubTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">
      {children}
    </h3>
  );
}

function Tile({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-md bg-zinc-50 p-3 dark:bg-zinc-800/50">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-0.5 text-xl font-semibold tabular-nums">{value}</div>
      {note && <div className="mt-0.5 text-xs text-zinc-500">{note}</div>}
    </div>
  );
}

/**
 * Columns from one baseline, one per point: <= 24px wide, 4px rounded tops,
 * a hover tooltip per column (the whole slot is the target), the peak
 * labelled, and a table for screen readers.
 */
function ColumnChart({
  points,
  format = (v) => formatSum(v),
  allLabels = false,
}: {
  points: { label: string; value: number }[];
  format?: (value: number) => string;
  /** Label every column (few columns) instead of the ends and middle. */
  allLabels?: boolean;
}) {
  const max = Math.max(...points.map((p) => p.value), 0);
  return (
    <figure>
      <div className="relative">
        <span className="absolute -top-1 left-0 text-[11px] text-zinc-400 tabular-nums">
          {max > 0 ? `peak ${format(max)}` : ""}
        </span>
        <div
          aria-hidden
          className="flex h-32 items-end gap-0.5 border-b border-zinc-200 pt-4 dark:border-zinc-700"
        >
          {points.map((p, i) => (
            <div
              key={i}
              className="group relative flex h-full min-w-0 flex-1 items-end justify-center"
            >
              <div
                className={cx(
                  "w-full max-w-6 rounded-t-[4px] transition-opacity group-hover:opacity-80",
                  BAR,
                )}
                style={{
                  height: max ? `${(p.value / max) * 100}%` : 0,
                  minHeight: p.value > 0 ? 2 : 0,
                }}
              />
              {/* Tooltip, above the slot; edge ones lean inwards. */}
              <div
                className={cx(
                  "pointer-events-none absolute bottom-full z-10 mb-1 hidden rounded-md bg-zinc-900 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg group-hover:block dark:bg-zinc-100 dark:text-zinc-900",
                  i < points.length / 3
                    ? "left-0"
                    : i > (points.length * 2) / 3
                      ? "right-0"
                      : "left-1/2 -translate-x-1/2",
                )}
              >
                <span className="text-zinc-400 dark:text-zinc-500">
                  {p.label}
                </span>{" "}
                <span className="font-medium tabular-nums">
                  {format(p.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
        {allLabels ? (
          <div
            aria-hidden
            className="mt-1.5 flex gap-0.5 text-[11px] text-zinc-500"
          >
            {points.map((p, i) => (
              <span key={i} className="min-w-0 flex-1 truncate text-center">
                {p.label}
              </span>
            ))}
          </div>
        ) : (
          // Long ranges: the first, middle and last label only, on their
          // own row so the ends can't run past the chart.
          <div
            aria-hidden
            className="mt-1.5 flex justify-between gap-2 text-[11px] whitespace-nowrap text-zinc-500"
          >
            <span>{points[0]?.label}</span>
            {points.length > 2 && (
              <span>{points[Math.floor((points.length - 1) / 2)].label}</span>
            )}
            <span>{points.at(-1)?.label}</span>
          </div>
        )}
      </div>
      <table className="sr-only">
        <tbody>
          {points.map((p, i) => (
            <tr key={i}>
              <th>{p.label}</th>
              <td>{format(p.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** Labelled horizontal bars from one baseline, value written at the end. */
function BarList({
  rows,
  max,
  empty = "Nothing yet.",
}: {
  rows: {
    label: string;
    sub?: string;
    note?: string;
    value: number;
    mono?: boolean;
    /** Archived or "none" rows: label dimmed. */
    muted?: boolean;
  }[];
  max: number;
  empty?: string;
}) {
  if (!rows.length) return <p className="text-sm text-zinc-500">{empty}</p>;
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <li key={i}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span
              className={cx(
                "min-w-0 truncate",
                r.mono && "font-mono",
                r.muted && "text-zinc-500",
              )}
            >
              {r.label}
              {r.sub && <span className="text-zinc-400"> · {r.sub}</span>}
            </span>
            <span className="shrink-0 tabular-nums">
              <span className="font-medium">{formatSum(r.value)}</span>
              {r.note && <span className="text-zinc-500"> · {r.note}</span>}
            </span>
          </div>
          <div className="h-2.5 rounded-r-[4px] bg-zinc-100 dark:bg-zinc-800">
            <div
              className={cx("h-full rounded-r-[4px]", BAR)}
              style={{
                width: `${(r.value / max) * 100}%`,
                minWidth: r.value > 0 ? 3 : 0,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
