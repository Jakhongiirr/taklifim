# Taklifim frontend

Next.js 16 (App Router), Tailwind 4, next-intl, TanStack Query.

## Run with Docker

Start the backend first (`cd ../backend && docker compose up -d`): this container joins its network (`taklifim_default`, override with `BACKEND_NETWORK`) and calls the API at `http://api:3000`.

```bash
docker compose up -d --build      # dev server with hot reload, http://localhost:3001
docker compose logs -f web
```

Source is bind-mounted; `node_modules` and `.next` stay inside the container, so host installs and builds don't interfere. After changing dependencies, rebuild with fresh volumes: `docker compose up -d --build -V`.

### Production

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Builds a standalone Next.js server (`output: "standalone"`, ~225 MB image, runs as a non-root user, healthcheck on `/api/health`). Session cookies are `Secure` in production, so serve it over HTTPS (browsers make an exception only for `localhost`). Host port: `WEB_HOST_PORT` (default 3001).

## Run locally (without Docker)

```bash
cp .env.example .env.local   # API_URL = backend base URL
npm install
npm run dev                  # http://localhost:3001
```

The backend must be running (see `../backend`).

## Site (i18n)

Public pages live under `src/app/[locale]` and are served at `/uz`, `/ru` and `/en` (default `uz`). `/` redirects using the `NEXT_LOCALE` cookie, then `Accept-Language`. Translations are in `messages/{uz,ru,en}.json`; keys are type-checked from `en.json`. Use `Link`, `redirect`, `useRouter` from `@/i18n/navigation` so links keep the locale.

## Admin panel

English only, at [/admin](http://localhost:3001/admin) (its own root layout in `src/app/admin`, not under `[locale]`). Log in with an admin phone number; non-admin accounts are logged straight out.

- **Invitations**: list all / draft / published / unpublished, newest first, 20 per page, with the owner's phone; find one by ID, slug (or its start) or a pasted link; click a slug to copy it; create and edit (names, date and time, venue, location link, optional music, theme, phone, card number, up to 6 photos that can be reordered), change the status from the table, delete. Event times are entered and shown in Tashkent time (UTC+5) whatever the browser's time zone. New photos are uploaded when you save and deleted again if saving fails; the backend deletes photos you remove.
- **Music**: list all / active / archived, search by title, artist or file name, add a track (uploads the audio, then creates the track), edit title / artist / audio, archive and restore. Replacing the audio deletes the old file; if saving fails, a fresh upload is deleted again.
- **Themes**: list all / active / archived, search by theme ID, add a theme with its `themeId` (e.g. `classic`; lowercase letters, digits and hyphens) and price in so'm (0 = free), edit both, archive and restore.
- **Users** (the landing page): all users with role and last login, searchable by phone.

### How auth works

The browser never sees the JWTs. They live in httpOnly cookies set by the Next.js server:

| Route | Does |
|---|---|
| `POST /api/auth/otp/request` | Forwards to the backend |
| `POST /api/auth/otp/verify` | Logs in, sets `access_token` + `refresh_token` cookies, returns `{ user }` |
| `POST /api/auth/refresh` | Rotates the tokens |
| `POST /api/auth/logout` | Revokes the refresh token, clears cookies |
| `/api/backend/*` | Forwards any call to the backend with the access token attached (bodies are streamed, so large uploads work) |

The access cookie expires 30 s before the token does. `src/proxy.ts` refreshes it before rendering `/admin` pages; browser calls (`src/lib/api-client.ts`) refresh once on a 401 and retry, sharing one refresh between parallel calls because refresh tokens are single use.

The gateway forwards `X-Forwarded-For`. Set the backend's `TRUST_PROXY` so it counts the Next.js server as a hop, otherwise all users share one rate limit (the Next.js server's IP).
