import { NextResponse } from "next/server";
import type { ApiBody } from "@/lib/api-types";
import { forward } from "@/lib/server/forward";
import {
  TELEGRAM_LOGIN_COOKIE,
  telegramLoginCookie,
} from "@/lib/server/telegram-login";

interface Started {
  token: string;
  secret: string;
  url: string;
  expiresIn: number;
}

/** Starts a bot login: the page gets the link, the cookie keeps the rest. */
export async function POST(request: Request) {
  const res = await forward(request, "/auth/telegram/start");
  const body = (await res.json()) as ApiBody<Started>;
  if (!body.success) return NextResponse.json(body, { status: res.status });

  const { token, secret, url, expiresIn } = body.data;
  const response = NextResponse.json({
    success: true,
    data: { url, expiresIn },
  });
  response.cookies.set(
    TELEGRAM_LOGIN_COOKIE,
    `${token}.${secret}`,
    telegramLoginCookie(expiresIn),
  );
  return response;
}
