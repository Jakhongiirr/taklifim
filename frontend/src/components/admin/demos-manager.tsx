"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import type { Demo, DemoStatus } from "@/lib/api-types";
import { formatDateTime } from "@/lib/format";
import DemoForm from "./demo-form";
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

const tabs: { status: DemoStatus; label: string }[] = [
  { status: "all", label: "All" },
  { status: "active", label: "Active" },
  { status: "archived", label: "Archived" },
];

type Editing = { mode: "create" } | { mode: "edit"; demo: Demo } | null;

export default function DemosManager() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<DemoStatus>("all");
  const [editing, setEditing] = useState<Editing>(null);
  const [search, setSearch] = useState("");

  const demos = useQuery({
    queryKey: ["demos", status],
    queryFn: () => api<Demo[]>(`/demos?status=${status}`),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["demos"] });

  // Small lists: filter in the browser, case-insensitive.
  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const all = demos.data ?? [];
    if (!needle) return all;
    return all.filter((demo) =>
      [demo.id, demo.title, demo.text, demo.demoUrl, demo.theme.themeId].some(
        (value) => value.toLowerCase().includes(needle),
      ),
    );
  }, [demos.data, search]);

  const toggleArchive = useMutation({
    mutationFn: (demo: Demo) =>
      api<Demo>(
        `/demos/${demo.id}/${demo.archivedAt ? "unarchive" : "archive"}`,
        { method: "POST" },
      ),
    onSuccess: refresh,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Demos</h1>
          <p className="text-sm text-zinc-500">
            Archived demos are hidden from users and can be restored.
          </p>
        </div>
        <Button onClick={() => setEditing({ mode: "create" })}>Add demo</Button>
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
          placeholder="Search title, text, URL or theme"
          aria-label="Search title, text, URL or theme"
          autoComplete="off"
          className="mb-2 h-9 w-full sm:w-72"
        />
      </div>

      {toggleArchive.isError && (
        <Alert>
          {toggleArchive.error instanceof ApiError
            ? toggleArchive.error.fullMessage
            : "Could not update the demo"}
        </Alert>
      )}

      {demos.isPending ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : demos.isError ? (
        <Alert>
          {demos.error instanceof ApiError
            ? demos.error.fullMessage
            : "Could not load demos"}
        </Alert>
      ) : demos.data.length === 0 ? (
        <EmptyState>
          {status === "archived"
            ? "No archived demos."
            : "No demos yet. Add the first one."}
        </EmptyState>
      ) : visible.length === 0 ? (
        <EmptyState>No demos match “{search.trim()}”.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3 font-medium">Demo</th>
                <th className="px-4 py-3 font-medium">Theme</th>
                <th className="px-4 py-3 font-medium">Added</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {visible.map((demo) => {
                const busy =
                  toggleArchive.isPending &&
                  toggleArchive.variables.id === demo.id;
                return (
                  <tr key={demo.id} className="align-middle">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element -- user uploads */}
                        <img
                          src={demo.image.url}
                          alt=""
                          className="aspect-video w-24 shrink-0 rounded border border-zinc-200 bg-zinc-100 object-cover dark:border-zinc-800 dark:bg-zinc-800"
                        />
                        <div className="min-w-0">
                          <div className="font-medium">{demo.title}</div>
                          <div
                            className="max-w-80 truncate text-zinc-500"
                            title={demo.text}
                          >
                            {demo.text}
                          </div>
                          <a
                            href={demo.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block max-w-80 truncate text-xs text-zinc-500 underline-offset-2 hover:text-zinc-900 hover:underline dark:hover:text-zinc-100"
                          >
                            {demo.demoUrl}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs">{demo.theme.themeId}</code>
                      {demo.theme.archivedAt && (
                        <div className="text-xs text-amber-600">
                          Theme archived
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-500">
                      {formatDateTime(demo.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {demo.archivedAt ? (
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
                          onClick={() => setEditing({ mode: "edit", demo })}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          loading={busy}
                          onClick={() => toggleArchive.mutate(demo)}
                        >
                          {demo.archivedAt ? "Restore" : "Archive"}
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
        title={editing?.mode === "edit" ? "Edit demo" : "Add demo"}
        onClose={() => setEditing(null)}
      >
        {editing && (
          <DemoForm
            key={editing.mode === "edit" ? editing.demo.id : "new"}
            demo={editing.mode === "edit" ? editing.demo : undefined}
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
