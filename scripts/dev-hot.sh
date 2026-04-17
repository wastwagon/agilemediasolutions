#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example — review ports and secrets."
fi

echo "Starting API + database (Docker)..."
docker compose --env-file .env up -d postgres redis backend

cd "$ROOT/frontend"
if [[ ! -f .env.local ]]; then
  cp env.local.example .env.local
  echo "Created frontend/.env.local — API proxy points at localhost backend port."
fi

npm install
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Next.js HOT RELOAD → http://localhost:3000"
echo "  (This is NOT the Docker frontend on FRONTEND_PORT — that image only updates after rebuild.)"
echo "  Stop this terminal with Ctrl+C; API/db containers keep running."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
exec npm run dev
