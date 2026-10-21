"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const VISITOR_KEY = "taklifim:visitor";
const COUNTED_DAY_KEY = "taklifim:visit-day";

/** A guest page, shared or personal, with or without a locale prefix. */
const INVITATION =
  /^\/(?:[a-z]{2}\/)?taklif\/([a-z0-9]+)(?:\/[a-z2-9]{8})?\/?$/;

// Without storage (blocked, private mode) the id lasts until the tab closes.
let fallbackId: string | undefined;

/** Where this tab came from, as of the first page it opened. */
let landing: { referrer?: string; utm?: string } | undefined;

function landingSource() {
  if (!landing) {
    const params = new URLSearchParams(location.search);
    let referrer: string | undefined = document.referrer;
    try {
      // Our own pages (a reload, a login redirect) say nothing of the source.
      if (new URL(referrer).origin === location.origin) referrer = undefined;
    } catch {
      referrer = undefined;
    }
    landing = {
      referrer: referrer?.slice(0, 512),
      utm: (params.get("utm_source") ?? params.get("ref"))?.slice(0, 64),
    };
  }
  return landing;
}

function randomId() {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID().replaceAll("-", "")
    : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) =>
        b.toString(16).padStart(2, "0"),
      ).join("");
}

function storage(key: string, value?: string) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch {}
  return null;
}

function visitorId() {
  let id = storage(VISITOR_KEY);
  if (!id) {
    id = fallbackId ??= randomId();
    storage(VISITOR_KEY, id);
  }
  return id;
}

/**
 * Counts the visit for the admin's numbers, and on an invitation a view for
 * its owner. The backend counts each visitor once a day, under the source the
 * tab came from (utm_source, referrer; it reads the in-app browser from the
 * user agent); outside invitations the browser skips the request once today
 * is counted.
 */
export default function VisitBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (navigator.webdriver) return;
    const slug = INVITATION.exec(pathname)?.[1];
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Tashkent",
    });
    if (!slug && storage(COUNTED_DAY_KEY) === today) return;
    const source = landingSource();
    fetch("/api/backend/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: visitorId(), slug, ...source }),
      keepalive: true,
    })
      .then((res) => {
        if (res.ok) storage(COUNTED_DAY_KEY, today);
      })
      .catch(() => {});
  }, [pathname]);

  return null;
}
