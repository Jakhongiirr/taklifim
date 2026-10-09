"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import type { AdminTaklif, Page, TaklifStatus } from "@/lib/api-types";
import { formatDateTime, formatEventAt, coupleNames } from "@/lib/format";
import TaklifForm from "./taklif-form";
import {
  Alert,
  Button,
  cx,
  EmptyState,
  Input,
  Modal,
  Select,
  Spinner,
} from "./ui";

const PAGE_SIZE = 20;

const tabs: { status: TaklifStatus | "all"; label: string }[] = [
  { status: "all", label: "All" },
  { status: "draft", label: "Draft" },
  { status: "published", label: "Published" },
  { status: "unpublished", label: "Unpublished" },
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
  { mode: "create" } | { mode: "edit"; taklif: AdminTaklif } | null;

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

export default function TaklifManager() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<TaklifStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
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
    queryKey: ["taklif", status, q, page],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (status !== "all") params.set("status", status);
      if (q) params.set("q", q);
      return api<Page<AdminTaklif>>(`/taklif?${params}`);
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

      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.status}
              type="button"
              onClick={() => {
                setStatus(tab.status);
                setPage(1);
              }}
              className={cx(
                "-mb-px border-b-2 px-4 py-2 text-sm transition-colors",
                status === tab.status
                  ? "border-zinc-900 font-medium dark:border-zinc-100"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Find by ID, slug or link"
          aria-label="Find by ID, slug or link"
          spellCheck={false}
          autoComplete="off"
          className="mb-2 h-9 w-full font-mono sm:w-72"
        />
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
            : status === "all"
              ? "No invitations yet."
              : `No ${statusLabels[status].toLowerCase()} invitations.`}
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
                  <th className="px-4 py-3 font-medium">Couple</th>
                  <th className="px-4 py-3 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium">Venue</th>
                  <th className="px-4 py-3 font-medium">Theme · Music</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {taklifs.data.items.map((taklif) => {
                  const statusBusy =
                    changeStatus.isPending &&
                    changeStatus.variables.id === taklif.id;
                  return (
                    <tr key={taklif.id} className="align-middle">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Thumbnail taklif={taklif} />
                          <div className="min-w-0">
                            <div className="font-medium whitespace-nowrap">
                              {coupleNames(taklif)}
                            </div>
                            <div className="text-zinc-500">
                              {taklif.hostName}
                            </div>
                            <CopySlug slug={taklif.slug} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {formatEventAt(taklif.eventAt)}
                        <div className="text-xs text-zinc-500">
                          Added {formatDateTime(taklif.createdAt)}
                        </div>
                      </td>
                      <td className="max-w-56 px-4 py-3">
                        <a
                          href={taklif.locationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium hover:underline"
                        >
                          {taklif.venueName}
                        </a>
                        <div
                          className="truncate text-zinc-500"
                          title={taklif.venueAddress}
                        >
                          {taklif.venueAddress}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono">{taklif.theme.themeId}</div>
                        <div
                          className="max-w-48 truncate text-zinc-500"
                          title={taklif.music?.title}
                        >
                          {taklif.music?.title ?? "No music"}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap tabular-nums">
                        {taklif.owner.phone}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
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
                            className={cx(
                              "h-8 w-40 shrink-0",
                              statusTones[taklif.status],
                            )}
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
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setEditing({ mode: "edit", taklif })}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              remove.reset();
                              setDeleting(taklif);
                            }}
                          >
                            Delete
                          </Button>
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
function CopySlug({ slug }: { slug: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 1500);
    return () => clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(slug);
      setState("copied");
    } catch {
      // Clipboard access needs HTTPS (or localhost) and permission.
      setState("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy slug"
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
            : "Copy"}
      </span>
    </button>
  );
}
