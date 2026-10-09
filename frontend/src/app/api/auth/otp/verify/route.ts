import { NextResponse } from "next/server";
import type { ApiBody, AuthTokens, User } from "@/lib/api-types";
import { forward } from "@/lib/server/forward";
import { setSessionCookies } from "@/lib/server/session";

type LoginResponse = AuthTokens & { user: User };

/** Logs in: tokens go into httpOnly cookies, only the user is returned. */
export async function POST(request: Request) {
  const res = await forward(request, "/auth/otp/verify");
  const body = (await res.json()) as ApiBody<LoginResponse>;
  if (!body.success) return NextResponse.json(body, { status: res.status });

  const response = NextResponse.json({
    success: true,
    data: { user: body.data.user },
  });
  setSessionCookies(response.cookies, body.data);
  return response;
}
