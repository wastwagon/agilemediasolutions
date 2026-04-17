#!/usr/bin/env bash
# Full stack in Docker with ./frontend bind-mounted and `next dev` (hot reload on FRONTEND_PORT, default 8085).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example — review ports and secrets."
fi

exec docker compose -f docker-compose.dev.yml --env-file .env up --build "$@"
