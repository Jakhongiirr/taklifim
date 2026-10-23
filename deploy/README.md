# Deploying Taklifim

Everything runs on one server with Docker Compose, as two projects:

- Caddy, from its own repository
  ([Jakhongiirr/caddy](https://github.com/Jakhongiirr/caddy), checked out at
  e.g. `/home/jony/caddy`): the only thing reachable from the internet. It
  owns ports 80/443 for every site on the server, gets HTTPS certificates by
  itself, and reads each site's routes from `sites/<site>.caddy`; taklifim's
  are in `sites/taklifim.caddy` there.
- `compose.yml` (this folder): taklifim itself. It publishes no ports; `web`
  and `minio` join Caddy's shared `edge` network as `taklifim-web` and
  `taklifim-minio`, everything else stays on taklifim's own network.

```
Internet ──:80/:443──► caddy (edge) ─┬─ taklifim.uz ──────► web (Next.js) ──► api (NestJS) ──► postgres, redis, minio
                                     ├─ files.taklifim.uz ─► minio (read-only: GET/HEAD on the bucket)
                                     └─ other sites (see the caddy repository)
```

- The API isn't public: browsers reach it through Next's `/api/backend`,
  Payme through `/api/payme` and the login bot's webhook through
  `/api/telegram`.
- Files are served from `https://files.<domain>/<bucket>/...`; uploads and
  MinIO's admin API stay on the private network.
- The API runs pending database migrations when it starts.

Hosting: a DiCloud VDS in Uzbekistan. The privacy policy promises Uzbek
users' data is stored in Uzbekistan (as the law requires), so the server and
the off-site backups (`RESTIC_REPOSITORY`) must both stay there. If that ever
changes, update frontend/src/content/legal/privacy.ts too.

## 1. Server

Ubuntu 24.04, about 4 vCPU / 8 GB RAM / 100 GB SSD to start (uploads are what
grows). As root:

```sh
# Docker
curl -fsSL https://get.docker.com | sh

# Firewall: SSH and web only. (Docker opens ports it publishes by itself,
# which is why only Caddy publishes any, for every site on the server.)
ufw allow OpenSSH && ufw allow 80/tcp && ufw allow 443/tcp && ufw allow 443/udp
ufw enable

# Security updates, and restic for off-site backups
apt install -y unattended-upgrades restic

# Tashkent time, so cron times (backups at 01:00) mean local time
timedatectl set-timezone Asia/Tashkent

# Container logs go to the journal: keep them on disk for exactly 30 days
# (the period the privacy policy states), at most 2 GB
mkdir -p /etc/systemd/journald.conf.d
printf '[Journal]\nStorage=persistent\nMaxRetentionSec=30day\nSystemMaxUse=2G\n' \
  > /etc/systemd/journald.conf.d/taklifim.conf
systemctl restart systemd-journald
apt install -y jq
```

Use SSH keys only (`PasswordAuthentication no` in `/etc/ssh/sshd_config`).

## 2. DNS

Point A records for `taklifim.uz`, `www.taklifim.uz` and `files.taklifim.uz`
at the server **before** the first start, so Caddy can get certificates.

## 3. First start

First create the login bot: in Telegram, message
[@BotFather](https://t.me/BotFather), send `/newbot`, pick a name (e.g.
"Taklifim") and a username ending in `bot`, and put the token it gives you in
`.env` as `TELEGRAM_BOT_TOKEN`. Optionally, with `/setuserpic` and
`/setdescription`, give it the logo and a line like "Log in to taklifim.uz".
Also set `TELEGRAM_WEBHOOK_SECRET` (`openssl rand -hex 32`): on start the
API then tells Telegram to post the bot's messages to
`https://taklifim.uz/api/telegram` with that secret, so any number of API
containers can answer them. Without it the API polls Telegram instead, which
works on one container only. Use a separate bot for development (polling,
no secret): the bot sends its messages to one place only, so the same token
in two places makes logins flaky.

```sh
git clone <repo> /opt/taklifim
cd /opt/taklifim/deploy
cp .env.example .env
nano .env          # domains, secrets (openssl rand -hex 32), login bot, Payme
chmod 600 .env

docker network create edge   # once per server: shared by Caddy and the sites
docker compose up -d --build
docker compose ps  # all healthy; minio-init "exited (0)"

# Caddy, if it isn't running on this server yet
git clone https://github.com/Jakhongiirr/caddy /home/jony/caddy
cd /home/jony/caddy
cp .env.example .env && nano .env   # ACME_EMAIL
docker compose up -d
```

If the domains aren't `taklifim.uz`, change them in the caddy repository's
`sites/taklifim.caddy` too (and the bucket name, if `S3_BUCKET` isn't
`taklifim`).

Then open `https://taklifim.uz`, log in with Telegram and make yourself
admin:

```sh
docker compose exec postgres sh -c \
  'psql -U "$POSTGRES_USER" "$POSTGRES_DB" -c "UPDATE users SET role = '\''admin'\'' WHERE phone = '\''+998XXXXXXXXX'\''"'
```

Log out and in again for the role to apply.

The home page is built while the API isn't reachable, so it starts with no
demos and fills in within 5 minutes (it revalidates every 300 s).

## 4. Payme

In the Payme merchant cabinet set the endpoint to
`https://taklifim.uz/api/payme` and the key to `PAYME_KEY`. Run the sandbox
certification first with `PAYME_CHECKOUT_URL=https://checkout.test.paycom.uz`
and the test key, then switch to the production key and URL and
`docker compose up -d` again.

## 5. Updating

```sh
cd /opt/taklifim && git pull
cd deploy && docker compose up -d --build
docker image prune -f
```

Caddy's routes are updated from its own repository: `git pull` there, then
`docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile`
(every site stays up).

Builds keep npm's download cache and Next.js's build cache between runs, so a
code-only deploy recompiles just what changed. `docker image prune -f` keeps
them; `docker builder prune` or `docker system prune -a` wipes them and makes
the next build a slow, from-scratch one.

The build runs on the server. If it ever slows the live site down, build
images in CI, push them to a registry and only `docker compose pull` here.

The MinIO image is pinned by digest (Chainguard only publishes `:latest` for
free). To update it: `docker pull cgr.dev/chainguard/minio:latest`, put the new
digest from `docker images --digests` in `compose.yml` (both `minio` and
`minio-init`), then `docker compose up -d`.

## 6. Backups

`backup.sh` dumps the database and mirrors the files into
`/var/backups/taklifim`, then copies that off the server with restic when
`RESTIC_REPOSITORY` is set (kept: 7 daily, 4 weekly, 6 monthly snapshots).
Local database dumps are kept 14 days. Run it once by hand, then add it to
root's crontab. It runs at 01:00 Tashkent time, before the API's nightly
cleanup at 03:00:

```cron
0 1 * * * /opt/taklifim/deploy/backup.sh >> /var/log/taklifim-backup.log 2>&1
```

### Restore

```sh
cd /opt/taklifim/deploy
docker compose stop web api

# Database
docker compose exec -T postgres sh -c \
  'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists' \
  < /var/backups/taklifim/db/taklifim_<stamp>.dump

# Files
docker compose run --rm --no-deps -T --user root \
  -v /var/backups/taklifim/files:/backup --entrypoint mc minio-init \
  mirror --overwrite /backup "local/taklifim"

docker compose start api web
```

From restic first: `restic restore latest --target /` puts
`/var/backups/taklifim` back. Try a restore once before launch.

## Another site on this server

Other sites go through the same Caddy: they join the `edge` network under
their own alias, publish no ports, and get a routes file in the caddy
repository's `sites/`. Keep in mind they share the server's CPU, memory and
disk, and `backup.sh` backs up only taklifim.

## Everyday commands

```sh
docker compose ps                    # status and health
docker compose logs -f --tail 100 api
docker compose restart web
docker compose exec postgres sh -c 'psql -U "$POSTGRES_USER" "$POSTGRES_DB"'
cd /home/jony/caddy && docker compose logs -f --tail 100 caddy
```

For monitoring, an external uptime check on `https://taklifim.uz/api/health`
is enough to start with. That route only says the web server is up; the web
server itself polls the API's `/health` (database, Redis, MinIO) every minute
and posts to the alert chat (`ALERT_TELEGRAM_*`) after two failed checks in a
row, hourly while it stays down, and once more when it recovers.

## Logs and alerts

Every service logs to stdout; Docker hands it to the journal, which keeps
30 days. The API writes one JSON line per request (method, path without the
query string, status, time, user ID, visitor IP) and one per error, with its
stack. Headers and request bodies are never logged, and phone numbers are
masked.

Caddy gives each request an ID. Next.js passes it to the API, both log under
it, and API error responses include it as `requestId`, so a user's report
leads to every line of that request:

```sh
docker compose logs --no-log-prefix api | jq -c 'select(.level >= 50)'           # errors
docker compose logs --no-log-prefix api | jq -c 'select(.reqId == "<id>")'      # one request
docker compose logs --no-log-prefix api | jq -c 'select(.userId == "<user id>")' # one user
docker compose logs --no-log-prefix web | grep '^{' | jq -c .                    # website errors
```

Admin actions (role changes, deleting invitations or replies, status
changes) are logged as `Admin <id> ...` lines.

### Telegram alerts

Errors of the API and the website (5xx responses, failed cleanup steps,
Payme problems, Redis down) are also sent to a Telegram chat. The same
problem is sent at most once every 10 minutes, and at most 30 alerts an hour.

1. Create a bot with [@BotFather](https://t.me/BotFather) (`/newbot`); it
   gives the token.
2. Send the bot a message (or add it to a group), then get the chat ID:
   `curl -s https://api.telegram.org/bot<token>/getUpdates | jq '.result[].message.chat.id'`
3. Put both in `.env` (`ALERT_TELEGRAM_BOT_TOKEN`, `ALERT_TELEGRAM_CHAT_ID`)
   and run `docker compose up -d`.
