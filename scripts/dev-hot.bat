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
echo ============================================================
echo   Next.js HOT RELOAD -^> http://localhost:3000
echo   (Not the Docker frontend on FRONTEND_PORT -^> rebuild image to see changes there.)
echo   Ctrl+C stops Next only; API/db containers keep running.
echo ============================================================
echo.
call npm run dev
endlocal
