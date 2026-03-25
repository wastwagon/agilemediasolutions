@echo off
setlocal
cd /d "%~dp0\.."
if not exist .env (
  copy /Y .env.example .env
  echo Created .env from .env.example.
)
echo Starting API + database ^(Docker^)...
docker compose --env-file .env up -d postgres redis backend
cd frontend
if not exist .env.local (
  copy /Y env.local.example .env.local
  echo Created frontend\.env.local
)
call npm install
echo.
echo Next.js dev server: http://localhost:3000  ^(hot reload^)
echo Press Ctrl+C to stop. Leave Docker running for the API.
call npm run dev
endlocal
