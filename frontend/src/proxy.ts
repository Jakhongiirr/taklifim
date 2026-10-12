import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import {
  ACCESS_COOKIE,
  clearSessionCookies,
  clientIpFrom,
  REFRESH_COOKIE,
  refreshTokens,
  setSessionCookies,
} from "./lib/server/session";

// Redirects `/` and other unprefixed paths to the visitor's locale: the one
// they picked in the language switcher (cookie), else Uzbek. The browser's
// language isn't used: the site is for Uzbekistan, where many browsers are
// set to Russian or English.
const intl = createMiddleware(routing);
const intlIgnoringBrowserLanguage = (request: NextRequest) => {
  const headers = new Headers(request.headers);
  headers.delete("accept-language");
  return intl(new NextRequest(request, { headers }));
};

// Public-site pages that need the session: the cabinet and invitation
// previews (login required) and the login page (skipped when already logged
// in). Locale-prefixed, so the intl middleware has nothing to do for them.
const SITE_SESSION_PATH = new RegExp(
  `^/(${routing.locales.join("|")})/(cabinet|login|taklif/[^/]+/preview)(?:/|$)`,
);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return withSession(request, {
      loginPath: "/admin/login",
      isLogin: pathname === "/admin/login",
      // The admin home just redirects; no point coming back to it.
      keepNext: pathname !== "/admin",
    });
  }
  // Shared invitation links open in Uzbek whatever the guest's browser
  // language; guests switch on the invitation itself.
  if (pathname.startsWith("/taklif/")) {
    const url = request.nextUrl.clone();
    url.pathname = `/${routing.defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }
  const site = SITE_SESSION_PATH.exec(pathname);
  if (site) {
    const [, locale, page] = site;
    return withSession(request, {
      loginPath: `/${locale}/login`,
      isLogin: page === "login",
      keepNext: true,
    });
  }
  return intlIgnoringBrowserLanguage(request);
}

/**
 * Renews an expired access token before the page renders, so server
 * components always see a valid one; sends visitors without a session to the
 * login page. API calls from the browser refresh on their own (see
 * lib/api-client.ts). The admin panel is English only (no locale prefix).
 */
async function withSession(
  request: NextRequest,
  options: { loginPath: string; isLogin: boolean; keepNext: boolean },
) {
  const { isLogin } = options;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (request.cookies.has(ACCESS_COOKIE) || !refreshToken) {
    return isLogin || request.cookies.has(ACCESS_COOKIE)
      ? NextResponse.next()
      : toLogin(request, options);
  }

  const tokens = await refreshTokens(
    refreshToken,
    clientIpFrom(request.headers.get("x-forwarded-for")),
  );
  if (!tokens) {
    const response = isLogin ? NextResponse.next() : toLogin(request, options);
    clearSessionCookies(response.cookies);
    return response;
  }
  // Forward the new token to this render, and store it in the browser.
  request.cookies.set(ACCESS_COOKIE, tokens.accessToken);
  request.cookies.set(REFRESH_COOKIE, tokens.refreshToken);
  const response = NextResponse.next({ request: { headers: request.headers } });
  setSessionCookies(response.cookies, tokens);
  return response;
}

function toLogin(
  request: NextRequest,
  { loginPath, keepNext }: { loginPath: string; keepNext: boolean },
) {
  const url = new URL(loginPath, request.url);
  if (keepNext) {
    url.searchParams.set(
      "next",
      request.nextUrl.pathname + request.nextUrl.search,
    );
  }
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
