// Server errors to a Telegram chat, like the backend's alerts (same bot and
// chat: ALERT_TELEGRAM_BOT_TOKEN, ALERT_TELEGRAM_CHAT_ID). Production only.
// No "server-only" import: instrumentation.ts loads it.

const BOT_TOKEN = process.env.ALERT_TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.ALERT_TELEGRAM_CHAT_ID;
const ENABLED =
  !!BOT_TOKEN && !!CHAT_ID && process.env.NODE_ENV === "production";

/** The same problem is reported at most once per this window. */
const REPEAT_WINDOW_MS = 10 * 60 * 1000;
/** And no more than this many alerts an hour in total. */
const MAX_PER_HOUR = 30;
// Telegram's limit is 4096 characters.
const MAX_LENGTH = 3500;

const lastSent = new Map<string, number>();
let hourStart = Date.now();
let sentThisHour = 0;

function shouldSend(key: string) {
  const now = Date.now();
  if (now - hourStart > 60 * 60 * 1000) {
    hourStart = now;
    sentThisHour = 0;
    lastSent.clear();
  }
  const last = lastSent.get(key);
  if (last && now - last < REPEAT_WINDOW_MS) return false;
  if (sentThisHour >= MAX_PER_HOUR) return false;
  lastSent.set(key, now);
  sentThisHour++;
  return true;
}

/**
 * Posts an alert unless the same `key` was reported recently. Failing to
 * send is ignored.
 */
export async function sendAlert(key: string, lines: (string | undefined)[]) {
  if (!ENABLED || !shouldSend(key)) return;
  await post("🔴", "web · ERROR", lines);
}

/** Posts a message as is, with no repeat limit. Failing to send is ignored. */
export async function sendNotice(
  icon: string,
  title: string,
  lines: (string | undefined)[],
) {
  if (!ENABLED) return;
  await post(icon, title, lines);
}

export const alertsEnabled = ENABLED;

async function post(
  icon: string,
  title: string,
  lines: (string | undefined)[],
) {
  const host = process.env.SITE_URL ? new URL(process.env.SITE_URL).host : "";
  const text = [`${icon} ${host} ${title}`, ...lines]
    .filter(Boolean)
    .join("\n\n");
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text.length > MAX_LENGTH ? `${text.slice(0, MAX_LENGTH)}…` : text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    // Nothing more to do.
  }
}
