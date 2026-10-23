// Polls the API's /health (database, Redis, file storage) and posts to the
// alert chat when it goes down and again when it recovers. Started once from
// instrumentation.ts, so it also catches the API container being gone.
// No "server-only" import: instrumentation.ts loads it.
import { alertsEnabled, sendNotice } from "./alerts";

const API_URL = process.env.API_URL ?? "http://localhost:3000";
const INTERVAL_MS = 60 * 1000;
/** Failed checks in a row before alerting, so a restart or blip stays quiet. */
const FAILURES_TO_ALERT = 2;
/** While still down, remind this often. */
const REMIND_MS = 60 * 60 * 1000;

let failures = 0;
let downSince: number | null = null;
let lastAlert = 0;

type TerminusBody = {
  error?: Record<string, { status?: string; message?: string }>;
};

/** null when healthy, else what is wrong, one line per failing part. */
async function check(): Promise<string[] | null> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    return [`API not reachable: ${(err as Error).message}`];
  }
  if (res.ok) return null;
  const body = (await res.json().catch(() => null)) as TerminusBody | null;
  const parts = Object.entries(body?.error ?? {}).map(
    ([name, info]) => `${name}: ${info.message ?? info.status ?? "down"}`,
  );
  return parts.length ? parts : [`API /health answered ${res.status}`];
}

function minutes(ms: number) {
  return `${Math.max(1, Math.round(ms / 60_000))} min`;
}

async function tick() {
  const problems = await check();
  const now = Date.now();

  if (!problems) {
    if (downSince !== null) {
      await sendNotice("🟢", "API · RECOVERED", [
        `Down for about ${minutes(now - downSince)}.`,
      ]);
    }
    failures = 0;
    downSince = null;
    return;
  }

  failures++;
  if (failures < FAILURES_TO_ALERT) return;
  if (downSince === null) {
    downSince = now - (FAILURES_TO_ALERT - 1) * INTERVAL_MS;
    lastAlert = now;
    await sendNotice("🔴", "API · DOWN", problems);
  } else if (now - lastAlert >= REMIND_MS) {
    lastAlert = now;
    await sendNotice("🔴", "API · STILL DOWN", [
      `For about ${minutes(now - downSince)}.`,
      ...problems,
    ]);
  }
}

let started = false;

export function startHealthWatch() {
  if (!alertsEnabled || started) return;
  started = true;
  const run = () => {
    tick()
      .catch(() => {})
      .finally(() => setTimeout(run, INTERVAL_MS).unref());
  };
  // The API is healthy before web starts (compose depends_on).
  setTimeout(run, INTERVAL_MS).unref();
}
