"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import type { AdminUser } from "@/lib/api-types";
import { formatDateTime } from "@/lib/format";
import TaklifManager from "./taklif-manager";
import { Alert, Badge, Button, Modal, Spinner } from "./ui";

const errorText = (error: unknown, fallback: string) =>
  error instanceof ApiError ? error.fullMessage : fallback;

/** One user: the account, their role, and all their invitations. */
export default function UserDetail({
  id,
  selfId,
}: {
  id: string;
  selfId: string;
}) {
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);
  const user = useQuery({
    queryKey: ["users", id],
    queryFn: () => api<AdminUser>(`/users/${id}`),
  });

  const setRole = useMutation({
    mutationFn: (role: AdminUser["role"]) =>
      api<AdminUser>(`/users/${id}/role`, {
        method: "PATCH",
        json: { role },
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["users", id], updated);
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      setConfirming(false);
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/admin/users"
        className="w-fit text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        ← All users
      </Link>

      {user.isPending ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : user.isError ? (
        <Alert>{errorText(user.error, "Could not load the user")}</Alert>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-mono text-2xl font-semibold">
                  {user.data.phone}
                </h1>
                <Badge tone={user.data.role === "admin" ? "blue" : "neutral"}>
                  {user.data.role}
                </Badge>
              </div>
              <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-500">
                <div>
                  <dt className="inline">Joined </dt>
                  <dd className="inline text-zinc-700 dark:text-zinc-300">
                    {formatDateTime(user.data.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="inline">Last login </dt>
                  <dd className="inline text-zinc-700 dark:text-zinc-300">
                    {formatDateTime(user.data.lastLoginAt)}
                  </dd>
                </div>
                <div>
                  <dt className="inline">Invitations </dt>
                  <dd className="inline text-zinc-700 tabular-nums dark:text-zinc-300">
                    {user.data.taklifCount} · {user.data.publishedCount}{" "}
                    published
                  </dd>
                </div>
              </dl>
            </div>
            {id === selfId ? (
              <p className="text-sm text-zinc-500">
                This is you. Another admin can change your role.
              </p>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  setRole.reset();
                  setConfirming(true);
                }}
              >
                {user.data.role === "admin" ? "Remove admin" : "Make admin"}
              </Button>
            )}
          </div>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Invitations</h2>
            <TaklifManager userId={id} />
          </section>

          <Modal
            open={confirming}
            title={
              user.data.role === "admin"
                ? "Remove admin access?"
                : "Make this user an admin?"
            }
            onClose={() => setConfirming(false)}
          >
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {user.data.role === "admin"
                ? `${user.data.phone} will become a regular user and lose access to this panel.`
                : `${user.data.phone} will get full access to this panel: every invitation, user, theme and demo.`}{" "}
              It takes effect within a few minutes (on their next session
              refresh).
            </p>
            {setRole.isError && (
              <Alert>
                {errorText(setRole.error, "Could not change the role")}
              </Alert>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setConfirming(false)}
                disabled={setRole.isPending}
              >
                Cancel
              </Button>
              <Button
                variant={user.data.role === "admin" ? "danger" : "primary"}
                loading={setRole.isPending}
                onClick={() =>
                  setRole.mutate(user.data.role === "admin" ? "user" : "admin")
                }
              >
                {user.data.role === "admin" ? "Remove admin" : "Make admin"}
              </Button>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}
