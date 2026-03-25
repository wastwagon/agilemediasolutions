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
echo "Starting Next.js dev server (hot reload) at http://localhost:3000"
echo "Press Ctrl+C to stop. Leave Docker running for the API."
exec npm run dev
