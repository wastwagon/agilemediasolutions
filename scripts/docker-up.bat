@echo off
setlocal
cd /d "%~dp0\.."
if not exist .env (
  echo Creating .env from .env.example — edit secrets before production.
  copy /Y .env.example .env
)
echo Building and starting stack...
docker compose --env-file .env up -d --build
if errorlevel 1 exit /b 1
echo.
echo Defaults: site http://localhost:8085  API http://localhost:4005
echo If you changed FRONTEND_PORT or BACKEND_EXT_PORT in .env, use those instead.
echo Tip: Docker frontend is a production build -^> rebuild image after UI edits, or use:
echo   scripts\dev-hot.bat   ^(Next :3000 + API in Docker^)
echo   scripts\dev-docker.bat ^(full stack, next dev on FRONTEND_PORT^)
endlocal
