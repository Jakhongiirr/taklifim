#!/usr/bin/env bash
# Nightly backup: a Postgres dump and a mirror of the uploaded files, kept
# under BACKUP_DIR, then (if RESTIC_REPOSITORY is set) copied off the server
# with restic. Redis isn't backed up: it only holds login codes and limits.
#
# Cron (01:00 Tashkent time, before the API's 03:00 cleanup; the server
# clock is set to Asia/Tashkent, see README):
#   0 1 * * * /opt/taklifim/deploy/backup.sh >> /var/log/taklifim-backup.log 2>&1
set -euo pipefail

cd "$(dirname "$0")"
set -a
. ./.env
set +a

BACKUP_DIR=${BACKUP_DIR:-/var/backups/taklifim}
KEEP_DUMPS_DAYS=${KEEP_DUMPS_DAYS:-14}
stamp=$(date +%Y-%m-%d_%H%M)

mkdir -p "$BACKUP_DIR/db" "$BACKUP_DIR/files"
echo "[$(date "+%F %T")] backup started"

# Database: custom format, restore with pg_restore (see README).
dump="$BACKUP_DIR/db/taklifim_$stamp.dump"
docker compose exec -T postgres \
  sh -c 'pg_dump -U "$POSTGRES_USER" -Fc "$POSTGRES_DB"' > "$dump.part"
mv "$dump.part" "$dump"
find "$BACKUP_DIR/db" -name '*.dump' -mtime +"$KEEP_DUMPS_DAYS" -delete
echo "database: $dump ($(du -h "$dump" | cut -f1))"

# Files: an incremental mirror of the bucket (deleted objects go too;
# restic's snapshots keep the history).
docker compose run --rm --no-deps -T --user root \
  -v "$BACKUP_DIR/files:/backup" \
  --entrypoint mc minio-init \
  mirror --quiet --overwrite --remove "local/$S3_BUCKET" /backup
echo "files: $(du -sh "$BACKUP_DIR/files" | cut -f1)"

# Off the server.
if [ -n "${RESTIC_REPOSITORY:-}" ]; then
  export RESTIC_REPOSITORY RESTIC_PASSWORD
  restic snapshots >/dev/null 2>&1 || restic init
  restic backup --quiet --tag taklifim "$BACKUP_DIR"
  restic forget --quiet --prune --keep-daily 7 --keep-weekly 4 --keep-monthly 6
  echo "restic: copied to $RESTIC_REPOSITORY"
else
  echo "restic: RESTIC_REPOSITORY not set, backup stays on this server"
fi

echo "[$(date "+%F %T")] backup done"
