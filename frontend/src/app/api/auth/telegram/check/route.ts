import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { ApiBody, AuthTokens, User } from "@/lib/api-types";
import {
  API_URL,
  clientIpFrom,
  internalHeaders,
  setSessionCookies,
} from "@/lib/server/session";
import { TELEGRAM_LOGIN_COOKIE } from "@/lib/server/telegram-login";

type Status =
  | { status: "pending" | "expired" }
  | ({ status: "done"; user: User } & AuthTokens);

/**
 * Polled by the login page while the user is in Telegram. When the number
 * has been shared, sets the session cookies (only the user is returned).
 */
export async function POST(request: Request) {
  const [token, secret] =
    (await cookies()).get(TELEGRAM_LOGIN_COOKIE)?.value.split(".") ?? [];
  if (!token || !secret) {
    return NextResponse.json({ success: true, data: { status: "expired" } });
  }

  let res: Response;
  try {
    res = await fetch(new URL("/auth/telegram/check", API_URL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...internalHeaders(
          clientIpFrom(request.headers.get("x-forwarded-for")),
          request.headers.get("x-request-id"),
        ),
      },
      body: JSON.stringify({ token, secret }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          statusCode: 502,
          code: "BAD_GATEWAY",
          message: "Backend is unreachable",
        },
      },
      { status: 502 },
    );
  }
  const body = (await res.json()) as ApiBody<Status>;
  if (!body.success) return NextResponse.json(body, { status: res.status });

  const data = body.data;
  const response = NextResponse.json({
    success: true,
    data:
      data.status === "done"
        ? { status: "done", user: data.user }
        : { status: data.status },
  });
  if (data.status === "done") setSessionCookies(response.cookies, data);
  if (data.status !== "pending") {
    response.cookies.delete({
      name: TELEGRAM_LOGIN_COOKIE,
      path: "/api/auth/telegram",
    });
  }
  return response;
}
