"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import { copyText } from "@/lib/copy-text";
import type { AdminTaklif, Page, TaklifStatus, Theme } from "@/lib/api-types";
import { formatDateTime, formatEventAt, coupleNames } from "@/lib/format";
import { guestMusic } from "@/lib/own-music";
import { invitationUrl, repliesUrl } from "./links";
import TaklifForm from "./taklif-form";
import {
  Alert,
  Button,
  cx,
  EmptyState,
  IconButton,
  iconPaths,
  Input,
  Modal,
  Select,
  Spinner,
} from "./ui";

const PAGE_SIZE = 20;

type Tab = TaklifStatus | "all" | "mine";

const tabs: { tab: Tab; label: string }[] = [
  { tab: "mine", label: "Mine" },
  { tab: "all", label: "All" },
  { tab: "draft", label: "Draft" },
  { tab: "published", label: "Published" },
  { tab: "unpublished", label: "Unpublished" },
];

const statusLabels: Record<TaklifStatus, string> = {
  draft: "Draft",
  published: "Published",
  unpublished: "Unpublished",
};

const statusTones: Record<TaklifStatus, string> = {
  draft: "border-zinc-300 dark:border-zinc-700",
  published:
    "border-emerald-400 text-emerald-800 dark:border-emerald-700 dark:text-emerald-300",
  unpublished:
    "border-amber-400 text-amber-800 dark:border-amber-700 dark:text-amber-300",
};

type Editing =
  | { mode: "create" }
  | { mode: "edit"; taklif: AdminTaklif }
  | null;

const errorText = (error: unknown, fallback: string) =>
  error instanceof ApiError ? error.fullMessage : fallback;

/**
 * Search text -> `q`: an id or (part of) a slug. A pasted link works too:
 * "https://…/taklif/k7m2xq9p?x=1" -> "k7m2xq9p".
 */
function toQuery(input: string) {
  const text = input.trim().split(/[?#]/)[0];
  return text.split("/").filter(Boolean).pop() ?? "";
}

const isStatus = (value: string | null): value is TaklifStatus =>
  value === "draft" || value === "published" || value === "unpublished";

/**
 * All invitations, or one user's (`userId`, on their page: no header, no
 * owner column). On its own page the filters live in the URL
 * (?status, ?theme, ?q), so the dashboard can link to a filtered list and a
 * view can be shared or reloaded. It opens on "Mine", the logged-in admin's
 * own (`selfId`), unless the URL has a filter: links that search or filter
 * mean everyone's.
 */
export default function TaklifManager({
  userId,
  selfId,
}: { userId?: string; selfId?: string } = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const embedded = !!userId;
  const [tab, setTab] = useState<Tab>(() => {
    if (embedded) return "all";
    const value = params.get("status");
    if (isStatus(value) || value === "all") return value;
    return selfId && !params.has("theme") && !params.has("q") ? "mine" : "all";
  });
  const status = tab === "mine" ? "all" : tab;
  const [themeId, setThemeId] = useState(() =>
    embedded ? "" : (params.get("theme") ?? ""),
  );
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(() =>
    embedded ? "" : (params.get("q") ?? ""),
  );
  const [q, setQ] = useState(() => toQuery(search));
  const ownerId = userId ?? (tab === "mine" ? selfId : undefined);

  // Mirror the filters in the URL (replace: no history entry per keystroke).
  useEffect(() => {
    if (embedded) return;
    const next = new URLSearchParams();
    if (tab !== "mine") next.set("status", tab);
    if (themeId) next.set("theme", themeId);
    if (q) next.set("q", q);
    const url = next.size ? `${pathname}?${next}` : pathname;
    router.replace(url, { scroll: false });
  }, [embedded, tab, themeId, q, pathname, router]);

  const themes = useQuery({
    queryKey: ["themes", "all"],
    queryFn: () => api<Theme[]>("/themes?status=all"),
  });
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(debounce.current), []);

  function onSearch(value: string) {
    setSearch(value);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setQ(toQuery(value));
      setPage(1);
    }, 300);
  }
  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<AdminTaklif | null>(null);

  const taklifs = useQuery({
    queryKey: ["taklif", status, q, themeId, ownerId, page],
    queryFn: () => {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (status !== "all") query.set("status", status);
      if (q) query.set("q", q);
      if (themeId) query.set("themeId", themeId);
      if (ownerId) query.set("userId", ownerId);
      return api<Page<AdminTaklif>>(`/taklif?${query}`);
    },
    // Keep the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["taklif"] });

  /** After the last row of a later page goes away, step back a page. */
  const afterRemoval = () => {
    if (page > 1 && taklifs.data?.items.length === 1) setPage(page - 1);
    void refresh();
  };

  const changeStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaklifStatus }) =>
      api(`/taklif/${id}/status`, { method: "PATCH", json: { status } }),
    // On a status tab, the row leaves the list.
    onSuccess: () => (status === "all" ? void refresh() : afterRemoval()),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api(`/taklif/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      setDeleting(null);
      afterRemoval();
    },
  });

  return (
    <div className="flex flex-col gap-6">
      {!embedded && (
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Invitations</h1>
            <p className="text-sm text-zinc-500">
              Only published invitations are public; drafts and unpublished ones
              are visible to their owner and admins.
            </p>
          </div>
          <Button onClick={() => setEditing({ mode: "create" })}>
            New invitation
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-1">
          {tabs
            .filter((t) => t.tab !== "mine" || (!embedded && selfId))
            .map((t) => (
              <button
                key={t.tab}
                type="button"
                onClick={() => {
                  setTab(t.tab);
                  setPage(1);
                }}
                className={cx(
                  "-mb-px border-b-2 px-4 py-2 text-sm transition-colors",
                  tab === t.tab
                    ? "border-zinc-900 font-medium dark:border-zinc-100"
                    : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
                )}
              >
                {t.label}
              </button>
            ))}
        </div>
        <div className="mb-2 flex w-full gap-2 sm:w-auto">
          {/* Select is full width by default: the wrapper sizes it. */}
          <div className="w-36 shrink-0">
            <Select
              aria-label="Theme"
              value={themeId}
              onChange={(e) => {
                setThemeId(e.target.value);
                setPage(1);
              }}
              className="h-9"
            >
              <option value="">All themes</option>
              {themes.data?.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.themeId}
                  {theme.archivedAt ? " (archived)" : ""}
                </option>
              ))}
            </Select>
          </div>
          <Input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Find by ID, slug or link"
            aria-label="Find by ID, slug or link"
            spellCheck={false}
            autoComplete="off"
            className="h-9 w-full min-w-0 font-mono sm:w-64"
          />
        </div>
      </div>

      {changeStatus.isError && (
        <Alert>
          {errorText(changeStatus.error, "Could not change the status")}
        </Alert>
      )}

      {taklifs.isPending ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : taklifs.isError ? (
        <Alert>{errorText(taklifs.error, "Could not load invitations")}</Alert>
      ) : taklifs.data.items.length === 0 ? (
        <EmptyState>
          {q
            ? `No ${status === "all" ? "" : `${statusLabels[status].toLowerCase()} `}invitation matches “${q}”.`
            : status === "all" && !themeId
              ? embedded
                ? "This user has no invitations."
                : tab === "mine"
                  ? "You have no invitations."
                  : "No invitations yet."
              : `No ${status === "all" ? "" : `${statusLabels[status].toLowerCase()} `}invitations${tab === "mine" ? " of yours" : ""}${themeId ? " in this theme" : ""}.`}
        </EmptyState>
      ) : (
        <div
          className={cx(
            "flex flex-col gap-3 transition-opacity",
            taklifs.isPlaceholderData && "opacity-60",
          )}
        >
          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-3 font-medium">Couple</th>
                  <th className="px-3 py-3 font-medium">Event · Venue</th>
                  <th className="px-3 py-3 font-medium">Theme · Music</th>
                  {!embedded && (
                    <th className="px-3 py-3 font-medium">Owner</th>
                  )}
                  <th className="px-3 py-3 font-medium">Replies</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {taklifs.data.items.map((taklif) => {
                  const statusBusy =
                    changeStatus.isPending &&
                    changeStatus.variables.id === taklif.id;
                  return (
                    <tr key={taklif.id} className="align-middle">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <Thumbnail taklif={taklif} />
                          <div className="min-w-0">
                            <a
                              href={invitationUrl(taklif.slug, taklif.status)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={
                                taklif.status === "published"
                                  ? "Open the guest page"
                                  : "Open the preview"
                              }
                              className="font-medium whitespace-nowrap hover:underline"
                            >
                              {coupleNames(taklif)} ↗
                            </a>
                            <div className="text-zinc-500">
                              {taklif.hostName}
                            </div>
                            <CopyLink slug={taklif.slug} />
                          </div>
                        </div>
                      </td>
                      <td className="max-w-60 px-3 py-3">
                        <div className="whitespace-nowrap">
                          {formatEventAt(taklif.eventAt)}
                        </div>
                        {taklif.locationUrl ? (
                          <a
                            href={taklif.locationUrl}
                            target="_blank"
                            rel="noreferrer"
                            title={taklif.venueAddress}
                            className="block truncate text-zinc-500 hover:underline"
                          >
                            {taklif.venueName} · {taklif.venueAddress}
                          </a>
                        ) : (
                          <div
                            title={taklif.venueAddress}
                            className="truncate text-zinc-500"
                          >
                            {taklif.venueName} · {taklif.venueAddress}
                          </div>
                        )}
                        <div className="text-xs whitespace-nowrap text-zinc-400">
                          Added {formatDateTime(taklif.createdAt)}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-mono">{taklif.theme.themeId}</div>
                        <div
                          className="max-w-48 truncate text-zinc-500"
                          title={guestMusic(taklif)?.title}
                        >
                          {taklif.customMusic && "Own: "}
                          {guestMusic(taklif)?.title ?? "No music"}
                        </div>
                      </td>
                      {!embedded && (
                        <td className="px-3 py-3 whitespace-nowrap tabular-nums">
                          <Link
                            href={`/admin/users/${taklif.owner.id}`}
                            className="hover:underline"
                          >
                            {taklif.owner.phone}
                          </Link>
                        </td>
                      )}
                      <td className="px-3 py-3 whitespace-nowrap tabular-nums">
                        {taklif.responseCount > 0 ? (
                          <a
                            href={repliesUrl(taklif.slug)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {taklif.responseCount} ↗
                          </a>
                        ) : (
                          <span className="text-zinc-400">0</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex w-32 items-center gap-2">
                          <Select
                            aria-label="Status"
                            value={taklif.status}
                            disabled={statusBusy}
                            onChange={(e) =>
                              changeStatus.mutate({
                                id: taklif.id,
                                status: e.target.value as TaklifStatus,
                              })
                            }
                            className={cx("h-8", statusTones[taklif.status])}
                          >
                            {Object.entries(statusLabels).map(
                              ([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ),
                            )}
                          </Select>
                          {statusBusy && <Spinner />}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-1">
                          <IconButton
                            label="Edit"
                            onClick={() => setEditing({ mode: "edit", taklif })}
                          >
                            {iconPaths.edit}
                          </IconButton>
                          <IconButton
                            label="Delete"
                            tone="danger"
                            onClick={() => {
                              remove.reset();
                              setDeleting(taklif);
                            }}
                          >
                            {iconPaths.trash}
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            page={taklifs.data.page}
            limit={taklifs.data.limit}
            total={taklifs.data.total}
            onPage={setPage}
          />
        </div>
      )}

      <Modal
        open={editing !== null}
        size="lg"
        title={editing?.mode === "edit" ? "Edit invitation" : "New invitation"}
        onClose={() => setEditing(null)}
      >
        {editing && (
          <TaklifForm
            key={editing.mode === "edit" ? editing.taklif.id : "new"}
            taklif={editing.mode === "edit" ? editing.taklif : undefined}
            onCancel={() => setEditing(null)}
            onDone={() => {
              setEditing(null);
              void refresh();
            }}
          />
        )}
      </Modal>

      <Modal
        open={deleting !== null}
        title="Delete invitation?"
        onClose={() => setDeleting(null)}
      >
        {deleting && (
          <>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {coupleNames(deleting)} (
              <span className="font-mono">/{deleting.slug}</span>) and its{" "}
              {deleting.photos.length === 1
                ? "photo"
                : `${deleting.photos.length} photos`}{" "}
              will be deleted permanently. To only hide it, set the status to
              Unpublished instead.
            </p>
            {remove.isError && (
              <Alert>{errorText(remove.error, "Could not delete")}</Alert>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setDeleting(null)}
                disabled={remove.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                loading={remove.isPending}
                onClick={() => remove.mutate(deleting.id)}
              >
                Delete
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

function Thumbnail({ taklif }: { taklif: AdminTaklif }) {
  const [first] = taklif.photos;
  return (
    <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
      {first ? (
        // eslint-disable-next-line @next/next/no-img-element -- user uploads
        <img
          src={first.url}
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      ) : (
        <span className="flex size-full items-center justify-center text-xs text-zinc-400">
          —
        </span>
      )}
      {taklif.photos.length > 1 && (
        <span className="absolute right-0.5 bottom-0.5 rounded bg-black/60 px-1 text-[10px] text-white">
          {taklif.photos.length}
        </span>
      )}
    </div>
  );
}

function Pagination({
  page,
  limit,
  total,
  onPage,
}: {
  page: number;
  limit: number;
  total: number;
  onPage: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / limit));
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  return (
    <div className="flex items-center justify-between gap-4 text-sm text-zinc-500">
      <span className="tabular-nums">
        {from}–{to} of {total}
      </span>
      {pages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
          >
            Previous
          </Button>
          <span className="tabular-nums">
            Page {page} of {pages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= pages}
            onClick={() => onPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

/** The slug as a button that copies it, with brief "Copied" feedback. */
/**
 * Shows the slug and copies the invitation's full link, the short form
 * owners share (it opens in Uzbek; guests switch language on the page).
 */
function CopyLink({ slug }: { slug: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 1500);
    return () => clearTimeout(timer);
  }, [state]);

  async function copy() {
    const link = `${window.location.origin}/taklif/${slug}`;
    setState((await copyText(link)) ? "copied" : "failed");
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy the invitation link"
      className="group inline-flex items-center gap-1 rounded font-mono text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
    >
      {slug}
      <span
        aria-live="polite"
        className={cx(
          "font-sans",
          state === "idle" && "opacity-0 group-hover:opacity-100",
          state === "copied" && "text-emerald-600 dark:text-emerald-400",
          state === "failed" && "text-red-600 dark:text-red-400",
        )}
      >
        {state === "copied"
          ? "Copied"
          : state === "failed"
            ? "Copy failed"
            : "Copy link"}
      </span>
    </button>
  );
}
