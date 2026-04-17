@echo off
cd /d "%~dp0"
echo Next.js dev server (Agile Media frontend)
echo Open: http://localhost:3000
echo Press Ctrl+C to stop.
echo.
if not exist node_modules (
  echo Installing dependencies...
  call npm install
)
start http://localhost:3000
call npm run dev
