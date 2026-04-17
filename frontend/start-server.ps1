# Next.js dev server — run from the frontend folder.
Set-Location $PSScriptRoot
Write-Host "Frontend: $PSScriptRoot" -ForegroundColor Green
Write-Host "Open: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    npm install
}
npm run dev
