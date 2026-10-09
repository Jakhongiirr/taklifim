/** Liveness probe for the container healthcheck. */
export function GET() {
  return Response.json({ status: "ok" });
}
