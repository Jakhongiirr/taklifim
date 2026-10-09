import { forward } from "@/lib/server/forward";

export async function POST(request: Request) {
  return forward(request, "/auth/otp/request");
}
