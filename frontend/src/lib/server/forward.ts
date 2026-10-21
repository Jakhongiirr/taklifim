import "server-only";
import { API_URL, clientIpFrom, internalHeaders } from "./session";

// Response headers worth passing back to the browser.
const PASSTHROUGH_HEADERS = ["content-type", "retry-after", "x-request-id"];

/**
 * Sends the incoming request to the backend at `path` (query string kept),
 * streaming the body, and returns the backend's response as is.
 */
export async function forward(
  request: Request,
  path: string,
  accessToken?: string,
): Promise<Response> {
  const url = new URL(path, API_URL);
  url.search = new URL(request.url).search;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  // Visit counting tells in-app browsers (Instagram, Telegram) apart by it.
  const userAgent = request.headers.get("user-agent");
  if (userAgent) headers.set("User-Agent", userAgent);
  // Lets the backend rate-limit per visitor instead of per Next.js server.
  const clientIp = clientIpFrom(request.headers.get("x-forwarded-for"));
  const requestId = request.headers.get("x-request-id");
  for (const [name, value] of Object.entries(
    internalHeaders(clientIp, requestId),
  )) {
    headers.set(name, value);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  let res: Response;
  try {
    res = await fetch(url, {
      method: request.method,
      headers,
      body: hasBody ? request.body : undefined,
      // Required by Node to stream a request body.
      ...(hasBody && { duplex: "half" }),
      cache: "no-store",
    } as RequestInit);
  } catch {
    return Response.json(
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

  const out = new Headers();
  for (const name of PASSTHROUGH_HEADERS) {
    const value = res.headers.get(name);
    if (value) out.set(name, value);
  }
  return new Response(res.status === 204 ? null : res.body, {
    status: res.status,
    headers: out,
  });
}
