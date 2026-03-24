@echo off
cd /d "%~dp0"
echo Serving from: %CD%
echo Open: http://localhost:8080/index.html  (then click Careers)
echo Press Ctrl+C to stop.
echo.
start http://localhost:8080/index.html
python -m http.server 8080 2>nul || (echo Python not found. Trying npx... && npx -y serve -p 8080)
