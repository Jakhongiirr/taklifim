import { API_URL, internalHeaders } from "@/lib/server/session";

// Payme's Merchant API endpoint (set it in the Payme cabinet as
// SITE_URL/api/payme). Passed to the backend as is, Authorization included:
// the /api/backend gateway would swap that header for a user's token. JSON
// errors are answered here in JSON-RPC form, with HTTP 200 as Payme expects.

const rpcError = (code: number, en: string, ru: string, uz: string) =>
  Response.json({
    jsonrpc: "2.0",
    id: null,
    error: { code, message: { ru, uz, en } },
  });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return rpcError(-32700, "Parse error", "Ошибка разбора JSON", "JSON xatosi");
  }

  const authorization = request.headers.get("authorization");
  let res: Response;
  try {
    res = await fetch(new URL("/payments/payme", API_URL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authorization && { Authorization: authorization }),
        ...internalHeaders(null, request.headers.get("x-request-id")),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return rpcError(-32400, "System error", "Системная ошибка", "Tizim xatosi");
  }
  return new Response(res.body, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/** Anything but POST is an RPC error, not a 405 page. */
export function GET() {
  return rpcError(
    -32300,
    "Only POST is allowed",
    "Метод запроса не POST",
    "Faqat POST soʻrovi qabul qilinadi",
  );
}
