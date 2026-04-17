@echo off
setlocal
cd /d "%~dp0\.."
if not exist .env (
  copy /Y .env.example .env
  echo Created .env from .env.example.
)
echo Full stack Docker + Next dev ^(hot reload on FRONTEND_PORT, default 8085^)...
docker compose -f docker-compose.dev.yml --env-file .env up --build %*
endlocal
