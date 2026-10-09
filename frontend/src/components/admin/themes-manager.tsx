"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import type { Theme, ThemeStatus } from "@/lib/api-types";
import { formatDateTime, formatPrice } from "@/lib/format";
import ThemeForm from "./theme-form";
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

const tabs: { status: ThemeStatus; label: string }[] = [
  { status: "all", label: "All" },
  { status: "active", label: "Active" },
  { status: "archived", label: "Archived" },
];

type Editing = { mode: "create" } | { mode: "edit"; theme: Theme } | null;

export default function ThemesManager() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ThemeStatus>("all");
  const [editing, setEditing] = useState<Editing>(null);
  const [search, setSearch] = useState("");

  const themes = useQuery({
    queryKey: ["themes", status],
    queryFn: () => api<Theme[]>(`/themes?status=${status}`),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["themes"] });

  // Small lists: filter in the browser, case-insensitive.
  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const all = themes.data ?? [];
    if (!needle) return all;
    return all.filter((theme) =>
      [theme.id, theme.themeId].some((value) =>
        value.toLowerCase().includes(needle),
      ),
    );
  }, [themes.data, search]);

  const toggleArchive = useMutation({
    mutationFn: (theme: Theme) =>
      api<Theme>(
        `/themes/${theme.id}/${theme.archivedAt ? "unarchive" : "archive"}`,
        { method: "POST" },
      ),
    onSuccess: refresh,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Themes</h1>
          <p className="text-sm text-zinc-500">
            Archived themes are hidden from users and can be restored.
          </p>
        </div>
        <Button onClick={() => setEditing({ mode: "create" })}>
          Add theme
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
          placeholder="Search theme ID"
          aria-label="Search theme ID"
          autoComplete="off"
          className="mb-2 h-9 w-full sm:w-72"
        />
      </div>

      {toggleArchive.isError && (
        <Alert>
          {toggleArchive.error instanceof ApiError
            ? toggleArchive.error.fullMessage
            : "Could not update the theme"}
        </Alert>
      )}

      {themes.isPending ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : themes.isError ? (
        <Alert>
          {themes.error instanceof ApiError
            ? themes.error.fullMessage
            : "Could not load themes"}
        </Alert>
      ) : themes.data.length === 0 ? (
        <EmptyState>
          {status === "archived"
            ? "No archived themes."
            : "No themes yet. Add the first one."}
        </EmptyState>
      ) : visible.length === 0 ? (
        <EmptyState>No themes match “{search.trim()}”.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3 font-medium">Theme ID</th>
                <th className="px-4 py-3 text-right font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Added</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {visible.map((theme) => {
                const busy =
                  toggleArchive.isPending &&
                  toggleArchive.variables.id === theme.id;
                return (
                  <tr key={theme.id} className="align-middle">
                    <td className="px-4 py-3 font-mono font-medium">
                      {theme.themeId}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap tabular-nums">
                      {formatPrice(theme.price)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-500">
                      {formatDateTime(theme.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-500">
                      {formatDateTime(theme.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      {theme.archivedAt ? (
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
                          onClick={() => setEditing({ mode: "edit", theme })}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          loading={busy}
                          onClick={() => toggleArchive.mutate(theme)}
                        >
                          {theme.archivedAt ? "Restore" : "Archive"}
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
        title={editing?.mode === "edit" ? "Edit theme" : "Add theme"}
        onClose={() => setEditing(null)}
      >
        {editing && (
          <ThemeForm
            key={editing.mode === "edit" ? editing.theme.id : "new"}
            theme={editing.mode === "edit" ? editing.theme : undefined}
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
