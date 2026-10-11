"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import type {
  AdminOrder,
  OrderStatus,
  Page,
  PaymeState,
} from "@/lib/api-types";
import { formatDateTime, formatPrice } from "@/lib/format";
import { Alert, Badge, Button, cx, EmptyState, Spinner } from "./ui";

const PAGE_SIZE = 20;

const tabs: { status: OrderStatus | "all"; label: string }[] = [
  { status: "all", label: "All" },
  { status: "paid", label: "Paid" },
  { status: "pending", label: "Pending" },
];

/** Payme's transaction states, as words. */
const paymeStates: Record<PaymeState, string> = {
  1: "Waiting for payment",
  2: "Paid",
  [-1]: "Cancelled",
  [-2]: "Cancelled after payment",
};

/** Payme's cancel reasons that are worth spelling out. */
const reasons: Record<number, string> = {
  3: "payment error",
  4: "timed out (12 h)",
  5: "refund",
};

/**
 * Orders made by "Pay and publish", newest first. Pending ones are checkouts
 * that weren't (or not yet) paid; a free design makes a paid order at 0.
 */
export default function PaymentsManager() {
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);
  const orders = useQuery({
    queryKey: ["payments", status, page],
    queryFn: () => {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (status !== "all") query.set("status", status);
      return api<Page<AdminOrder>>(`/payments?${query}`);
    },
    placeholderData: keepPreviousData,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="text-sm text-zinc-500">
          Orders from “Pay and publish” through Payme. Paying publishes the
          invitation; payments aren’t refundable.
        </p>
      </div>

      <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
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

      {orders.isPending ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : orders.isError ? (
        <Alert>
          {orders.error instanceof ApiError
            ? orders.error.fullMessage
            : "Could not load payments"}
        </Alert>
      ) : orders.data.items.length === 0 ? (
        <EmptyState>
          {status === "all"
            ? "No orders yet."
            : `No ${status} orders.`}
        </EmptyState>
      ) : (
        <div
          className={cx(
            "flex flex-col gap-3 transition-opacity",
            orders.isPlaceholderData && "opacity-60",
          )}
        >
          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium">Theme</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Payme</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {orders.data.items.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{order.title}</div>
                      {order.taklif ? (
                        <Link
                          href={`/admin/invitations?q=${order.taklif.slug}`}
                          className="font-mono text-xs text-zinc-500 hover:underline"
                        >
                          {order.taklif.slug}
                        </Link>
                      ) : (
                        <span className="text-xs text-zinc-400">
                          Invitation deleted
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap tabular-nums">
                      {order.user ? (
                        <Link
                          href={`/admin/users/${order.user.id}`}
                          className="hover:underline"
                        >
                          {order.user.phone}
                        </Link>
                      ) : (
                        <span className="text-zinc-400">Deleted</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {order.themeId ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap tabular-nums">
                      {formatPrice(order.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={order.status === "paid" ? "green" : "amber"}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {order.payme ? (
                        <>
                          <div className="whitespace-nowrap">
                            {paymeStates[order.payme.state]}
                            {order.payme.reason !== null &&
                              reasons[order.payme.reason] &&
                              ` · ${reasons[order.payme.reason]}`}
                          </div>
                          <div
                            className="max-w-40 truncate font-mono text-xs text-zinc-400"
                            title={order.payme.id}
                          >
                            {order.payme.id}
                          </div>
                        </>
                      ) : order.amount === 0 ? (
                        "Free design"
                      ) : (
                        "Not started"
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-500">
                      {formatDateTime(order.paidAt ?? order.createdAt)}
                      <div className="text-xs text-zinc-400">
                        {order.paidAt ? "paid" : "created"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-sm text-zinc-500">
            <span>
              {(orders.data.page - 1) * orders.data.limit + 1}–
              {(orders.data.page - 1) * orders.data.limit +
                orders.data.items.length}{" "}
              of {orders.data.total}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page * PAGE_SIZE >= orders.data.total}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
