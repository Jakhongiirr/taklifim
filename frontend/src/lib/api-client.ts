import { routing } from "@/i18n/routing";
import type { ApiBody, FileDto } from "./api-types";

/** An error response from the backend (or the Next.js gateway). */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }

  /** The message plus any validation details, for showing to the user. */
  get fullMessage() {
    return Array.isArray(this.details) && this.details.length
      ? this.details.join(". ")
      : this.message;
  }
}

async function parse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const body = (await res.json().catch(() => null)) as ApiBody<T> | null;
  if (body?.success) return body.data;
  const error = body?.error;
  throw new ApiError(
    res.status,
    error?.code ?? "ERROR",
    error?.message ?? `Request failed (${res.status})`,
    error?.details,
  );
}

// Concurrent 401s share one refresh: the backend rotates refresh tokens,
// so a second refresh with the same token would fail.
let refreshing: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  refreshing ??= fetch("/api/auth/refresh", { method: "POST" })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

/** The login page for where the user is: the admin panel or /{locale}/... */
export function loginPathFor(pathname: string) {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return "/admin/login";
  }
  return `/${pathname.split("/")[1] || routing.defaultLocale}/login`;
}

function toLogin() {
  const { pathname, search } = window.location;
  const next = encodeURIComponent(pathname + search);
  // Not in a component, so no router; a full load also drops cached data.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(`${loginPathFor(pathname)}?next=${next}`);
}

/** Runs `send`, refreshing the session once on 401. */
async function withSession(send: () => Promise<Response>) {
  let res = await send();
  if (res.status === 401 && (await refreshSession())) res = await send();
  if (res.status === 401) toLogin();
  return res;
}

/** Calls the backend through /api/backend; returns the unwrapped `data`. */
export async function api<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const { json, ...rest } = init;
  const request: RequestInit =
    json === undefined
      ? rest
      : {
          ...rest,
          headers: { "Content-Type": "application/json", ...rest.headers },
          body: JSON.stringify(json),
        };
  return parse<T>(
    await withSession(() => fetch(`/api/backend${path}`, request)),
  );
}

/** Calls a Next.js auth route (/api/auth/...). */
export async function authApi<T>(path: string, json?: unknown): Promise<T> {
  const res = await fetch(`/api/auth${path}`, {
    method: "POST",
    headers:
      json === undefined ? undefined : { "Content-Type": "application/json" },
    body: json === undefined ? undefined : JSON.stringify(json),
  });
  return parse<T>(res);
}

/** Uploads a file to POST /files, reporting progress (0..1). */
export async function uploadFile(
  file: File,
  onProgress?: (fraction: number) => void,
): Promise<FileDto> {
  const send = () =>
    new Promise<Response>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/backend/files");
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress?.(e.loaded / e.total);
      };
      xhr.onload = () =>
        resolve(
          new Response(xhr.status === 204 ? null : xhr.responseText, {
            status: xhr.status,
            headers: { "Content-Type": "application/json" },
          }),
        );
      xhr.onerror = () => reject(new ApiError(0, "NETWORK", "Upload failed"));
      const form = new FormData();
      form.append("file", file);
      xhr.send(form);
    });
  return parse<FileDto>(await withSession(send));
}
