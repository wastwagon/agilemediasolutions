#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ ! -f .env ]]; then
  echo "Creating .env from .env.example — edit secrets before production."
  cp .env.example .env
fi
echo "Building and starting stack..."
docker compose --env-file .env up -d --build
echo ""
echo "Open http://localhost:8085 (or FRONTEND_PORT from your .env)"
echo "Tip: the frontend container serves a production build — UI code changes need an image rebuild, or use:"
echo "  ./scripts/dev-hot.sh        (Next on :3000 + API in Docker)"
echo "  ./scripts/dev-docker.sh     (full stack, next dev on FRONTEND_PORT)"
