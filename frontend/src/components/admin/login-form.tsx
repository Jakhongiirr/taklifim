"use client";

import { useState } from "react";
import { ApiError, authApi } from "@/lib/api-client";
import { useTelegramLogin } from "@/lib/use-telegram-login";
import type { User } from "@/lib/api-types";
import { Alert } from "./ui";

function messageOf(error: unknown) {
  if (!error) return "";
  if (error instanceof ApiError) return error.fullMessage;
  return error instanceof Error ? error.message : "Something went wrong";
}

export default function LoginForm({ next }: { next: string }) {
  const [denied, setDenied] = useState(false);

  async function onDone(user: User) {
    if (user.role !== "admin") {
      await authApi("/logout");
      setDenied(true);
      return;
    }
    window.location.assign(next);
  }

  const login = useTelegramLogin("en", (user) => void onDone(user));

  return (
    <div className="flex flex-col gap-4">
      <a
        href={login.url ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!login.url}
        onClick={(e) => {
          if (!login.url) e.preventDefault();
          else {
            setDenied(false);
            login.opened();
          }
        }}
        className={`inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 ${login.url ? "" : "pointer-events-none opacity-60"}`}
      >
        {!login.url
          ? "Preparing…"
          : login.waiting
            ? "Open Telegram again"
            : "Log in with Telegram"}
      </a>

      {login.waiting && (
        <p role="status" className="text-sm text-zinc-500">
          Waiting for Telegram… In the bot, tap “📱 Share phone number”.
        </p>
      )}
      {login.expired && !login.waiting && (
        <p role="status" className="text-sm text-zinc-500">
          The link expired. Tap the button again.
        </p>
      )}

      <Alert>
        {denied
          ? "This account doesn't have admin access."
          : messageOf(login.error)}
      </Alert>
    </div>
  );
}
