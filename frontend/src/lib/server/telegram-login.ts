import "server-only";

/**
 * Holds the login's token and secret while the user is in Telegram. Only
 * the start/check routes see it; the secret never reaches the page's script
 * or a URL, so a leaked bot link alone can't finish someone's login.
 */
export const TELEGRAM_LOGIN_COOKIE = "tg_login";

export const telegramLoginCookie = (maxAge: number) =>
  ({
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/auth/telegram",
    maxAge,
  }) as const;
