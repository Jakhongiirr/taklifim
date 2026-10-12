"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { authApi } from "./api-client";
import type {
  TelegramLoginStarted,
  TelegramLoginStatus,
  User,
} from "./api-types";

const POLL_MS = 2000;

/**
 * Login through the site's Telegram bot, shared by the admin and the public
 * login forms. A bot link is fetched up front, so the button is a plain link
 * (opening Telegram after an await would be blocked as a pop-up). Once it's
 * opened, the page checks every 2 s, and again whenever it's shown, until
 * the user has shared their number with the bot. An expired or used link is
 * replaced by a new one (a used one, in case the page stays, e.g. when an
 * admin login is refused). `error` is the raw error; each form words it.
 */
export function useTelegramLogin(locale: string, onDone: (user: User) => void) {
  const [url, setUrl] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const onDoneRef = useRef(onDone);
  const checking = useRef(false);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  /** A new link, replacing the current one. */
  const start = useCallback(async () => {
    setUrl(null);
    setError(null);
    try {
      const started = await authApi<TelegramLoginStarted>("/telegram/start", {
        locale,
      });
      setUrl(started.url);
    } catch (e) {
      setError(e);
    }
  }, [locale]);

  const check = useCallback(async () => {
    if (checking.current) return;
    checking.current = true;
    try {
      const result = await authApi<TelegramLoginStatus>("/telegram/check");
      if (result.status === "done") {
        setWaiting(false);
        onDoneRef.current(result.user);
        void start();
      } else if (result.status === "expired") {
        setWaiting(false);
        setExpired(true);
        void start();
      }
    } catch (e) {
      setError(e);
    } finally {
      checking.current = false;
    }
  }, [start]);

  // The first link, as soon as the form shows.
  useEffect(() => {
    let active = true;
    authApi<TelegramLoginStarted>("/telegram/start", { locale }).then(
      (started) => active && setUrl(started.url),
      (e: unknown) => active && setError(e),
    );
    return () => {
      active = false;
    };
  }, [locale]);

  useEffect(() => {
    if (!waiting) return;
    const timer = setInterval(() => void check(), POLL_MS);
    const onShow = () => {
      if (document.visibilityState === "visible") void check();
    };
    document.addEventListener("visibilitychange", onShow);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onShow);
    };
  }, [waiting, check]);

  /** Call when the user opens the bot link. */
  function opened() {
    setExpired(false);
    setError(null);
    setWaiting(true);
  }

  return { url, waiting, expired, error, opened, retry: start };
}
