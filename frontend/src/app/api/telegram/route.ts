import { API_URL, internalHeaders } from "@/lib/server/session";

// The login bot's webhook: Telegram posts each new message here (the backend
// registers SITE_URL/api/telegram when TELEGRAM_WEBHOOK_SECRET is set). Passed
// to the backend as is, with Telegram's secret header, which the backend
// checks. Anything but a 2xx makes Telegram send the update again later.

const SECRET_HEADER = "x-telegram-bot-api-secret-token";

export async function POST(request: Request) {
  const secret = request.headers.get(SECRET_HEADER);
  if (!secret) return new Response(null, { status: 403 });

  try {
    const res = await fetch(new URL("/telegram/webhook", API_URL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [SECRET_HEADER]: secret,
        ...internalHeaders(null, request.headers.get("x-request-id")),
      },
      body: await request.text(),
      cache: "no-store",
    });
    return new Response(null, { status: res.ok ? 200 : res.status });
  } catch {
    return new Response(null, { status: 502 });
  }
}
