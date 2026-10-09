import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  clearSessionCookies,
  clientIpFrom,
  REFRESH_COOKIE,
  revokeRefreshToken,
} from "@/lib/server/session";

export async function POST() {
  const refreshToken = (await cookies()).get(REFRESH_COOKIE)?.value;
  if (refreshToken) {
    const clientIp = clientIpFrom((await headers()).get("x-forwarded-for"));
    await revokeRefreshToken(refreshToken, clientIp);
  }
  const response = new NextResponse(null, { status: 204 });
  clearSessionCookies(response.cookies);
  return response;
}
