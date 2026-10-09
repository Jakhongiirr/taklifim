import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  clearSessionCookies,
  clientIpFrom,
  REFRESH_COOKIE,
  refreshTokens,
  setSessionCookies,
} from "@/lib/server/session";

/** Renews the session cookies; 401 (and cookies cleared) if that fails. */
export async function POST() {
  const refreshToken = (await cookies()).get(REFRESH_COOKIE)?.value;
  const clientIp = clientIpFrom((await headers()).get("x-forwarded-for"));
  const tokens = refreshToken
    ? await refreshTokens(refreshToken, clientIp)
    : null;
  if (!tokens) {
    const response = NextResponse.json(
      {
        success: false,
        error: {
          statusCode: 401,
          code: "UNAUTHORIZED",
          message: "Session expired",
        },
      },
      { status: 401 },
    );
    clearSessionCookies(response.cookies);
    return response;
  }
  const response = new NextResponse(null, { status: 204 });
  setSessionCookies(response.cookies, tokens);
  return response;
}
