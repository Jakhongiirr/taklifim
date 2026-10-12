import type { Instrumentation } from "next";
import { sendAlert } from "@/lib/server/alerts";

/**
 * A server error while rendering a page or running a route: one JSON line
 * (like the backend's, under the same request ID) and a Telegram alert.
 * Next.js still prints its own message too.
 */
export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  const err = error instanceof Error ? error : new Error(String(error));
  const digest = (error as { digest?: string } | null)?.digest;
  const requestId = request.headers["x-request-id"];
  const reqId = typeof requestId === "string" ? requestId : undefined;
  // Path only: query strings can hold names.
  const path = request.path.split("?")[0];
  const msg = `${request.method} ${path} failed (${context.routeType} ${context.routePath})`;

  console.error(
    JSON.stringify({
      level: 50,
      time: new Date().toISOString(),
      service: "web",
      reqId,
      digest,
      msg,
      err: { type: err.name, message: err.message, stack: err.stack },
    }),
  );

  await sendAlert(`${context.routePath}|${err.message}`, [
    msg,
    err.message,
    reqId && `Request: ${reqId}`,
    digest && `Digest: ${digest}`,
    err.stack?.split("\n").slice(1, 8).join("\n"),
  ]);
};
