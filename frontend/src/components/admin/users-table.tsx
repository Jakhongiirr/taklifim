"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import type { AdminUser } from "@/lib/api-types";
import { formatDateTime } from "@/lib/format";
import { Alert, Badge, EmptyState, Input, Spinner } from "./ui";

/** Everyone with an account; a row opens the user's page. */
export default function UsersTable() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const users = useQuery({
    queryKey: ["users"],
    queryFn: () => api<AdminUser[]>("/users"),
  });

  const filtered = useMemo(() => {
    const digits = search.replace(/\D/g, "");
    return (users.data ?? []).filter(
      (u) => !digits || u.phone.replace(/\D/g, "").includes(digits),
    );
  }, [users.data, search]);

  const admins = users.data?.filter((u) => u.role === "admin").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          {users.data && (
            <p className="text-sm text-zinc-500">
              {users.data.length} total · {admins} admin
              {admins === 1 ? "" : "s"}
            </p>
          )}
        </div>
        <Input
          type="search"
          placeholder="Search by phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {users.isPending ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : users.isError ? (
        <Alert>
          {users.error instanceof ApiError
            ? users.error.fullMessage
            : "Could not load users"}
        </Alert>
      ) : filtered.length === 0 ? (
        <EmptyState>No users found.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Invitations</th>
                <th className="px-4 py-3 font-medium">Last login</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                  className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="px-4 py-3 font-mono">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {user.phone}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={user.role === "admin" ? "blue" : "neutral"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {user.taklifCount}
                    {user.publishedCount > 0 && (
                      <span className="text-zinc-500">
                        {" "}
                        · {user.publishedCount} published
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {formatDateTime(user.lastLoginAt)}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {formatDateTime(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
