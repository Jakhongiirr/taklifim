# Taklifim Backend

NestJS 11 · TypeORM · PostgreSQL 17 · Redis 7 · Docker

## Quick start (Docker)

```bash
cp .env.example .env      # adjust values
docker compose up -d --build
curl localhost:3000/health
```

The `api` container runs `start:dev` with hot reload (source is bind-mounted).

### Production

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Uses the multi-stage `production` target (compiled `dist`, prod deps only, non-root user, healthcheck) and doesn't publish the Postgres/Redis ports.

## Local (without Docker for the API)

```bash
docker compose up -d postgres redis
npm install
npm run start:dev
```

## API docs

Swagger UI at [localhost:3000/docs](http://localhost:3000/docs), OpenAPI JSON at `/docs-json`. Click **Authorize** and paste an access token to call protected routes.

Controlled by `SWAGGER_ENABLED` (defaults to `true` in development, `false` in production). The `@nestjs/swagger` CLI plugin builds schemas from DTO and entity classes (`*.dto.ts`, `*.entity.ts`) automatically, including JSDoc comments as descriptions and `@example` tags. Add `@ApiBearerAuth()` to controllers with protected routes.

## Responses

Every response uses the same shape. Success (204 responses have no body):

```json
{ "success": true, "data": { "id": "…" } }
```

Error, from any source (exceptions, validation, auth, rate limits, unknown routes, malformed JSON):

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "code": "VALIDATION_FAILED",
    "message": "Validation failed",
    "details": ["phone must be a valid phone number"]
  },
  "path": "/auth/otp/request",
  "timestamp": "2026-10-08T09:00:00.000Z"
}
```

`code` is the HTTP status name (`BAD_REQUEST`, `UNAUTHORIZED`, `NOT_FOUND`, `TOO_MANY_REQUESTS`, …) or `VALIDATION_FAILED`, in which case `details` lists one message per invalid field. `details` also carries extra fields from an exception, e.g. `{ "retryAfter": 42 }` on OTP cooldown or the failed checks on a 503 from `/health`. Unexpected errors return a generic 500 and are logged with their stack; their message is never sent to the client.

Just return data from controllers and throw Nest's HTTP exceptions; `ResponseInterceptor` and `AllExceptionsFilter` (`src/common/http/`) do the wrapping, and Swagger shows the wrapped shapes.

## File storage

Public files live in S3-compatible storage. Locally that's the `minio` container (console at [localhost:9001](http://localhost:9001), log in with `S3_ACCESS_KEY` / `S3_SECRET_KEY`). The one-off `minio-init` container creates the bucket and makes it publicly readable. For production, point the `S3_*` values at AWS S3, Cloudflare R2, etc. and set `S3_PUBLIC_URL` to the bucket or CDN URL.

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/files` | `multipart/form-data` with a `file` field. Returns `{ id, url, ... }`. Audio: admin only |
| GET | `/files/:id` | File details. Uploader or admin (404 for anyone else) |
| DELETE | `/files/:id` | Uploader or admin only |

Any logged-in user can upload images (JPEG, PNG, WebP); audio (MP3, M4A, AAC, OGG, Opus, FLAC, WAV) is admin only. Types are checked against the file's contents, not its name or the type the client claims; edit `src/modules/files/file-types.ts` to change them. Max size: images `UPLOAD_IMAGE_MAX_SIZE_MB` (default 10), audio `UPLOAD_AUDIO_MAX_SIZE_MB` (default 50). Uploads are held in memory before going to storage. Store a file's `id` on other entities to reference it.

A file used by another record (e.g. a music track) can't be deleted (409).

The official MinIO images were discontinued in 2025, so compose uses Chainguard's maintained build (`cgr.dev/chainguard/minio`).

## Music

Admins add tracks from uploaded audio files and archive them instead of deleting.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/music` | Public, no login needed. All tracks, newest first. Everyone sees active tracks; admins can pass `status=archived` or `status=all` |
| GET | `/music/:id` | Public. Archived tracks: admin only (404 for others) |
| POST | `/music` | Admin. `{ title, artist?, fileId }`, where `fileId` is an audio file from `POST /files`. One track per file |
| PATCH | `/music/:id` | Admin. Any of `{ title, artist, fileId }`; `artist: null` clears it. Replacing `fileId` leaves the old file in storage (delete it via `DELETE /files/:id`) |
| POST | `/music/:id/archive` | Admin. Hides the track from users |
| POST | `/music/:id/unarchive` | Admin. Restores it |

## Themes

Admins create themes and archive them instead of deleting. `themeId` is a unique key such as `classic` (lowercase letters, digits and hyphens, max 50; input is trimmed and lowercased). `price` is a whole number of so'm (UZS), 0 to 1,000,000,000; 0 means free.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/themes` | Public. Newest first. Everyone sees active themes; admins can pass `status=archived` or `status=all` |
| GET | `/themes/:id` | Public. Archived themes: admin only (404 for others) |
| POST | `/themes` | Admin. `{ themeId, price }`. 409 if `themeId` is taken |
| PATCH | `/themes/:id` | Admin. Any of `{ themeId, price }`. 409 if `themeId` is taken |
| POST | `/themes/:id/archive` | Admin. Hides the theme from users |
| POST | `/themes/:id/unarchive` | Admin. Restores it |

## Demos

Admins showcase themes with demos and archive them instead of deleting. Fields: `title` (max 200), `text` (max 5000), `demoUrl` (http/https, max 500), `imageId` (an image from `POST /files`) and `themeId` (an active theme's `id`). Responses include the full `image` (with its `url`) and `theme`. No pagination.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/demos` | Public. Newest first. Everyone sees active demos; admins can pass `status=archived` or `status=all` |
| GET | `/demos/:id` | Public. Archived demos: admin only (404 for others) |
| POST | `/demos` | Admin. `{ title, text, demoUrl, imageId, themeId }` |
| PATCH | `/demos/:id` | Admin. Any of `{ title, text, demoUrl, imageId, themeId }`. Replacing `imageId` leaves the old file in storage (delete it via `DELETE /files/:id`) |
| POST | `/demos/:id/archive` | Admin. Hides the demo from users |
| POST | `/demos/:id/unarchive` | Admin. Restores it |

## Invitations (taklif)

Users create wedding invitations; admins manage all of them. Each one gets a generated `slug` (8 characters, lowercase letters and digits without look-alikes, e.g. `k7m2xq9p`) for its public URL.

Fields: `brideName`, `groomName`, `hostName`, `eventAt` (ISO 8601 with a time zone, e.g. `2026-10-20T18:00:00+05:00`; returned in UTC), `venueName`, `venueAddress`, `locationUrl` (http/https), `themeId` (an active theme's `id`), and optionally `musicId` (an active track; `music` is null without one), `photoIds` (up to 6 images, in display order), `cardNumber` (16 digits; spaces and hyphens are removed) and `phone` (normalized to E.164 like login phones).

`status` is `draft` (new invitations), `published` or `unpublished`. A draft becomes `published` only after payment (not built yet). After that, owners unpublish and republish their own invitations; `POST /taklif/:id/publish` on a draft returns 402. Admins can set any status via `PATCH /taklif/:id/status`, including publishing a draft or moving one back to `draft`. Published invitations are public; drafts and unpublished ones are visible only to their owner and admins (404 for everyone else).

Once an invitation is first published, its `eventAt` at that moment is kept (`lockedEventAt`). Owners can then move the event earlier freely, but at most 30 days later than that date (400 otherwise); `eventAtLimit` in owner responses tells the builder. Admins aren't limited. This keeps a paid invitation from living forever by pushing its date, since it's deleted a month after the event.

Every night at 03:00 Tashkent time `TaklifCleanupService` deletes, with their photos:

- drafts not edited for 24 hours;
- invitations of any status whose `eventAt` was more than 1 month ago.
- images uploaded more than 24 hours ago that nothing references. "Referenced" means any foreign key to `files` (invitation photos, demo images, and any table added later), read from TypeORM metadata. Audio is never touched. A file only counts as used through a real foreign key, so store file ids as FK columns.

With several API instances a Redis lock makes only one run it.

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/taklif` | Logged in. Creates a draft owned by the caller. Users can have at most 30 drafts at a time (409); admins aren't limited |
| GET | `/taklif/mine` | Logged in. The caller's invitations, newest first |
| GET | `/taklif/:slug` | Public invitation page. Published only: 404 for any other status, even for the owner and admins. Returns only what guests see (`PublicTaklifDto`): no owner, status, internal ids, uploaders or filenames |
| GET | `/taklif/preview/:slug` | Owner or admin, any status (404 for others) |
| PATCH | `/taklif/:id` | Owner or admin. Any of the fields; `cardNumber`/`phone`/`musicId`: null clears. `photoIds` replaces the list (order matters, `[]` removes all) |
| POST | `/taklif/:id/publish` | Owner or admin. Unpublished invitations (402 for a draft: published after payment) |
| POST | `/taklif/:id/unpublish` | Owner or admin. Published invitations (409 for a draft) |
| GET | `/taklif` | Admin. Newest first, paginated: `page` (default 1), `limit` (default 20, max 100), optional `status` and `q` (a full UUID finds that id; anything else finds slugs starting with it, case-insensitive). Returns `{ items, total, page, limit }`; items include the owner's phone |
| PATCH | `/taklif/:id/status` | Admin. `{ status }`, any status |
| DELETE | `/taklif/:id` | Owner: their own drafts only (409 otherwise). Admin: any invitation. Also deletes its photos |

Photos are uploaded first via `POST /files`. Users can only attach images they uploaded themselves; a file can be a photo of only one invitation (409). Photos removed from an invitation, or of a deleted one, are deleted from storage. Archiving a track or theme doesn't affect invitations that already use it.

## Rate limiting

Requests are rate limited per client (Redis-backed, `ThrottlerModule`; stricter limits on the OTP routes). Browsers reach the API through the Next.js server, so `AppThrottlerGuard` (`src/common/throttle/`) recognizes it by `INTERNAL_API_SECRET` (sent as `X-Internal-Secret`, same value in the frontend) and limits per the visitor it names in `X-Client-IP`. The server's own requests (cached public pages: demos, catalog, published invitations) aren't limited. Anyone else, including direct API callers, is limited by their connection IP (`req.ip`, see `TRUST_PROXY`) and can't claim another IP: `X-Client-IP` is ignored without the secret.

## Migrations

Migrations run automatically on app start (`migrationsRun: true`).

```bash
npm run migration:generate --name=CreateUsers   # diff entities against the DB
npm run migration:create --name=SeedSomething   # empty migration
npm run migration:run
npm run migration:revert
```

Entities are auto-discovered from `src/**/*.entity.ts`.

## Redis

Inject the shared ioredis client anywhere:

```ts
constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}
```

## Auth

Phone + OTP login. Codes are delivered via the [Telegram Gateway API](https://core.telegram.org/gateway) (set `TELEGRAM_GATEWAY_TOKEN`). In development, if the token is empty, the code is printed to the API logs.

| Method | Path | Body | Notes |
| --- | --- | --- | --- |
| POST | `/auth/otp/request` | `{ phone }` | 60s resend cooldown, max 5 per hour per phone |
| POST | `/auth/otp/verify` | `{ phone, code }` | Returns `{ user, accessToken, refreshToken, expiresIn }`. Creates the user on first login. Max 5 attempts per code |
| POST | `/auth/refresh` | `{ refreshToken }` | Rotates: the old refresh token stops working |
| POST | `/auth/logout` | `{ refreshToken }` | Revokes the refresh token |
| GET | `/users/me` | | Any logged-in user |
| GET | `/users` | | Admin only |

Phones are normalized to E.164; numbers without a country code are treated as Uzbek (`90 123 45 67` → `+998901234567`).

All routes require `Authorization: Bearer <accessToken>` unless marked `@Public()`. Restrict a route with `@Roles(Role.Admin)`; admins pass every role check. Get the caller with `@CurrentUser()`.

### Making an admin

```sql
UPDATE users SET role = 'admin' WHERE phone = '+998901234567';
```

The new role takes effect on the user's next `/auth/refresh` (access tokens live 15 minutes).

## Structure

```
src/
  config/      env loading + Joi validation
  database/    TypeORM module, CLI data source, migrations/
  redis/       global ioredis provider (REDIS_CLIENT), Redis rate-limit storage
  common/http/ response envelope, global exception filter, Swagger envelope
  modules/
    auth/      OTP login, JWT access/refresh tokens, guards, decorators
    users/     User entity, roles, /users endpoints
    telegram/  Telegram Gateway API client
    storage/   S3 client (upload, delete, public URLs)
    files/     Upload endpoints, files table
    music/     Music tracks (admin add/archive)
    themes/    Themes (admin create/archive)
    taklif/    Invitations (owner create/edit/publish, admin manages all)
    demos/     Theme demos (admin create/edit/archive)
    health/    GET /health — checks Postgres, Redis and storage
```
