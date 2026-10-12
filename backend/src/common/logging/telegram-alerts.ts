import { Writable } from 'stream';

/** The same problem is reported at most once per this window. */
const REPEAT_WINDOW_MS = 10 * 60 * 1000;
/** And no more than this many alerts an hour in total. */
const MAX_PER_HOUR = 30;
// Telegram's limit is 4096 characters.
const MAX_LENGTH = 3500;

interface LogLine {
  level?: number;
  msg?: string;
  context?: string;
  reqId?: string;
  res?: unknown;
  err?: { type?: string; message?: string; stack?: string };
}

/**
 * A log destination that posts errors to a Telegram chat through a bot.
 * Request lines (they carry `res`) are skipped: the error that caused a 500
 * is logged on its own, with its stack. Failing to send is ignored, since
 * logging about it would only make more alerts.
 */
export function telegramAlertStream(opts: {
  botToken: string;
  chatId: string;
  /** Shown first, e.g. "taklifim.uz api". */
  source: string;
}): Writable {
  const lastSent = new Map<string, number>();
  let hourStart = Date.now();
  let sentThisHour = 0;

  const shouldSend = (key: string) => {
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
  };

  const send = (text: string) =>
    fetch(`https://api.telegram.org/bot${opts.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: opts.chatId, text }),
      signal: AbortSignal.timeout(10_000),
    }).catch(() => undefined);

  return new Writable({
    write(chunk: Buffer, _encoding, done) {
      try {
        const line = JSON.parse(chunk.toString()) as LogLine;
        if (!line.res) {
          const msg = line.msg ?? line.err?.message ?? 'Error';
          // IDs and numbers vary between repeats of the same problem.
          const key = `${line.context}|${msg.replace(/[\da-f-]{8,}/gi, '#')}`;
          if (shouldSend(key)) void send(format(opts.source, line, msg));
        }
      } catch {
        // Not JSON: nothing to report.
      }
      done();
    },
  });
}

function format(source: string, line: LogLine, msg: string) {
  const level = (line.level ?? 50) >= 60 ? 'FATAL' : 'ERROR';
  const stack = line.err?.stack?.split('\n').slice(0, 8).join('\n');
  const text = [
    `🔴 ${source} · ${level}${line.context ? ` · ${line.context}` : ''}`,
    msg,
    line.reqId && `Request: ${line.reqId}`,
    stack,
  ]
    .filter(Boolean)
    .join('\n\n');
  return text.length > MAX_LENGTH ? `${text.slice(0, MAX_LENGTH)}…` : text;
}
