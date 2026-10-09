import { cookies } from "next/headers";
import { forward } from "@/lib/server/forward";
import { ACCESS_COOKIE } from "@/lib/server/session";

/**
 * Same-origin gateway to the backend for browser code: /api/backend/music
 * -> API_URL/music, with the access token from the httpOnly cookie attached.
 * A 401 is passed back as is; the client refreshes and retries.
 */
async function handler(
  request: Request,
  ctx: RouteContext<"/api/backend/[...path]">,
) {
  const { path } = await ctx.params;
  const accessToken = (await cookies()).get(ACCESS_COOKIE)?.value;
  return forward(
    request,
    "/" + path.map(encodeURIComponent).join("/"),
    accessToken,
  );
}

export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT,
};
