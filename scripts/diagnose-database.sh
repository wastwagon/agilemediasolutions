#!/usr/bin/env bash
# Diagnose Postgres connectivity (Coolify / Docker / bare VPS).
#
# Usage:
#   export DATABASE_URL='postgres://agile_user:PASSWORD@HOST:5432/agile_db'
#   ./scripts/diagnose-database.sh
#
#   ./scripts/diagnose-database.sh /path/to/.env
#
# Optional:
#   BACKEND_HEALTH_URL=http://127.0.0.1:4000/api/health ./scripts/diagnose-database.sh
#   (/api/health = readiness, 503 if Postgres down; /api/health/live = liveness, always 200 if Node is up)

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

load_env_file() {
  local f="$1"
  [[ -f "$f" ]] || return 1
  set -a
  # shellcheck disable=SC1090
  source "$f" 2>/dev/null || true
  set +a
}

mask_database_url() {
  local url="${DATABASE_URL:-}"
  [[ -n "$url" ]] || {
    echo "(empty)"
    return
  }
  if [[ "$url" =~ ^postgres(ql)?://([^:]+):([^@]+)@(.+)$ ]]; then
    echo "postgres://${BASH_REMATCH[2]}:***@${BASH_REMATCH[4]}"
  else
    echo "(could not mask URI — still testing connection)"
  fi
}

echo "== Agile Media — database connectivity check =="
echo "Time (UTC): $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo

if [[ -n "${1:-}" ]]; then
  if [[ -f "$1" ]]; then
    echo "Loading env from: $1"
    load_env_file "$1"
  else
    echo "WARN: first argument is not a file: $1 (ignoring)"
  fi
elif [[ -f "$ROOT/.env" ]]; then
  echo "Loading env from: $ROOT/.env"
  load_env_file "$ROOT/.env"
elif [[ -f "$ROOT/backend/.env" ]]; then
  echo "Loading env from: $ROOT/backend/.env"
  load_env_file "$ROOT/backend/.env"
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL is not set."
  echo
  echo "  export DATABASE_URL='postgres://USER:PASS@HOST:5432/DBNAME'"
  echo "  $0 /path/to/.env"
  exit 1
fi

echo "DATABASE_URL (masked): $(mask_database_url)"
echo

echo "-- Hostname resolution (from this shell) --"
if [[ "${DATABASE_URL}" =~ @([^:/]+) ]]; then
  H="${BASH_REMATCH[1]}"
  echo "DB host from URI: $H"
  if command -v getent >/dev/null 2>&1; then
    getent hosts "$H" || echo "getent: no result (normal if DB is only reachable from another container)"
  elif command -v host >/dev/null 2>&1; then
    host "$H" || true
  else
    echo "(no getent/host — skip)"
  fi
else
  echo "(could not parse host from URI)"
fi
echo

if command -v docker >/dev/null 2>&1; then
  echo "-- Docker containers (names containing postgres) --"
  docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}' 2>/dev/null | head -1
  docker ps --format '{{.Names}}\t{{.Image}}' 2>/dev/null | grep -i postgres || echo "(none matched 'postgres' in name — list all above manually)"
  echo
fi

psql_probe() {
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 "$@"
}

if command -v psql >/dev/null 2>&1; then
  echo "-- psql: can DATABASE_URL connect? --"
  if psql_probe -c "SELECT 1 AS ok, current_user AS db_user, current_database() AS db_name;" 2>&1; then
    echo
    echo "OK: DATABASE_URL authenticates."
    psql_probe -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename LIMIT 25;" 2>/dev/null || true
  else
    echo
    echo "FAIL: psql returned an error (see above). If you see 28P01 / password authentication failed,"
    echo "     the password in DATABASE_URL does not match the role in this Postgres instance."
  fi
else
  echo "WARN: psql not installed on host."
  echo "      Debian/Ubuntu: sudo apt-get update && sudo apt-get install -y postgresql-client"
  echo
  if command -v docker >/dev/null 2>&1; then
    echo "-- Trying ephemeral postgres:16-alpine client in Docker --"
    if docker run --rm -e DATABASE_URL="$DATABASE_URL" postgres:16-alpine \
      psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "SELECT 1 AS ok, current_user, current_database();" 2>&1; then
      echo "OK: connection works via Docker psql."
    else
      echo "FAIL: Docker psql could not connect (check DATABASE_URL and network)."
    fi
  fi
fi

echo
if [[ -n "${BACKEND_HEALTH_URL:-}" ]]; then
  echo "-- Backend health: ${BACKEND_HEALTH_URL} --"
  curl -sS -i "${BACKEND_HEALTH_URL}" | head -n 30 || echo "curl failed"
  echo
fi

echo "== If password is wrong on an EXISTING volume =="
cat <<'EOF'

Coolify changing POSTGRES_PASSWORD does not update an old Postgres volume.
Pick ONE:

A) Set the role password inside Postgres to match DATABASE_URL (keep volume):

     # example: superuser often named postgres; DB name from your URL
     docker exec -it <postgres_container> psql -U postgres -d agile_db -c \
       "ALTER USER agile_user WITH PASSWORD 'same_password_as_in_DATABASE_URL';"

   Then restart the backend container.

B) Change DATABASE_URL to the password Postgres already has (if you know it).

C) Recreate the Postgres volume / database (DATA LOSS unless you have backups)
   so init scripts run again with new POSTGRES_PASSWORD.

EOF

exit 0
