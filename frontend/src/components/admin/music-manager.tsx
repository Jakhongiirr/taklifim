"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import type { Music, MusicStatus } from "@/lib/api-types";
import { formatBytes, formatDateTime } from "@/lib/format";
import MusicForm from "./music-form";
import {
  Alert,
  Badge,
  Button,
  cx,
  EmptyState,
  Input,
  Modal,
  Spinner,
} from "./ui";

const tabs: { status: MusicStatus; label: string }[] = [
  { status: "all", label: "All" },
  { status: "active", label: "Active" },
  { status: "archived", label: "Archived" },
];

type Editing = { mode: "create" } | { mode: "edit"; track: Music } | null;

export default function MusicManager() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<MusicStatus>("all");
  const [editing, setEditing] = useState<Editing>(null);
  const [search, setSearch] = useState("");

  const music = useQuery({
    queryKey: ["music", status],
    queryFn: () => api<Music[]>(`/music?status=${status}`),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["music"] });

  // Small lists: filter in the browser, case-insensitive.
  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const all = music.data ?? [];
    if (!needle) return all;
    return all.filter((track) =>
      [track.id, track.title, track.artist ?? "", track.file.originalName].some(
        (value) => value.toLowerCase().includes(needle),
      ),
    );
  }, [music.data, search]);

  // Moves a track one place up or down and saves the whole order.
  const reorder = useMutation({
    mutationFn: ({ index, by }: { index: number; by: -1 | 1 }) => {
      const ids = (music.data ?? []).map((track) => track.id);
      [ids[index], ids[index + by]] = [ids[index + by], ids[index]];
      return api<Music[]>("/music/order", { method: "PATCH", json: { ids } });
    },
    onSuccess: refresh,
  });
  // Ordering works on the full list, so it's off while searching.
  const canReorder = !search.trim() && !reorder.isPending;

  const toggleArchive = useMutation({
    mutationFn: (track: Music) =>
      api<Music>(
        `/music/${track.id}/${track.archivedAt ? "unarchive" : "archive"}`,
        { method: "POST" },
      ),
    onSuccess: refresh,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Music</h1>
          <p className="text-sm text-zinc-500">
            Shown in the invitation builder in this order: use the arrows to
            move a track. Archived tracks are hidden from users and can be
            restored.
          </p>
        </div>
        <Button onClick={() => setEditing({ mode: "create" })}>
          Add track
        </Button>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.status}
              type="button"
              onClick={() => setStatus(tab.status)}
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
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, artist or file"
          aria-label="Search title, artist or file"
          autoComplete="off"
          className="mb-2 h-9 w-full sm:w-72"
        />
      </div>

      {reorder.isError && (
        <Alert>
          {reorder.error instanceof ApiError
            ? reorder.error.fullMessage
            : "Could not save the order"}
        </Alert>
      )}

      {toggleArchive.isError && (
        <Alert>
          {toggleArchive.error instanceof ApiError
            ? toggleArchive.error.fullMessage
            : "Could not update the track"}
        </Alert>
      )}

      {music.isPending ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : music.isError ? (
        <Alert>
          {music.error instanceof ApiError
            ? music.error.fullMessage
            : "Could not load music"}
        </Alert>
      ) : music.data.length === 0 ? (
        <EmptyState>
          {status === "archived"
            ? "No archived tracks."
            : "No tracks yet. Add the first one."}
        </EmptyState>
      ) : visible.length === 0 ? (
        <EmptyState>No tracks match “{search.trim()}”.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-800">
              <tr>
                <th className="w-20 px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Track</th>
                <th className="px-4 py-3 font-medium">Audio</th>
                <th className="px-4 py-3 font-medium">Added</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {visible.map((track, index) => {
                const busy =
                  toggleArchive.isPending &&
                  toggleArchive.variables.id === track.id;
                return (
                  <tr key={track.id} className="align-middle">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="w-5 text-zinc-400 tabular-nums">
                          {index + 1}
                        </span>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            aria-label={`Move ${track.title} up`}
                            disabled={!canReorder || index === 0}
                            onClick={() => reorder.mutate({ index, by: -1 })}
                            className="rounded px-1.5 leading-none text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-25 disabled:hover:bg-transparent dark:hover:bg-zinc-800"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            aria-label={`Move ${track.title} down`}
                            disabled={
                              !canReorder || index === visible.length - 1
                            }
                            onClick={() => reorder.mutate({ index, by: 1 })}
                            className="rounded px-1.5 leading-none text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-25 disabled:hover:bg-transparent dark:hover:bg-zinc-800"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{track.title}</div>
                      <div className="text-zinc-500">
                        {track.artist ?? "Unknown artist"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <audio
                        controls
                        preload="none"
                        src={track.file.url}
                        className="h-9 w-64"
                      />
                      <div
                        className="mt-1 max-w-64 truncate text-xs text-zinc-500"
                        title={track.file.originalName}
                      >
                        {track.file.originalName} ·{" "}
                        {formatBytes(track.file.size)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-500">
                      {formatDateTime(track.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {track.archivedAt ? (
                        <Badge tone="amber">Archived</Badge>
                      ) : (
                        <Badge tone="green">Active</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditing({ mode: "edit", track })}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          loading={busy}
                          onClick={() => toggleArchive.mutate(track)}
                        >
                          {track.archivedAt ? "Restore" : "Archive"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={editing !== null}
        title={editing?.mode === "edit" ? "Edit track" : "Add track"}
        onClose={() => setEditing(null)}
      >
        {editing && (
          <MusicForm
            key={editing.mode === "edit" ? editing.track.id : "new"}
            track={editing.mode === "edit" ? editing.track : undefined}
            onCancel={() => setEditing(null)}
            onDone={() => {
              setEditing(null);
              void refresh();
            }}
          />
        )}
      </Modal>
    </div>
  );
}
