# Run this from PowerShell. Serves the site from THIS folder.
# Then open: http://localhost:8080/index.html?t=1
Set-Location $PSScriptRoot
Write-Host "Serving from: $PSScriptRoot" -ForegroundColor Green
Write-Host "In your browser open: http://localhost:8080/index.html?t=1" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop." -ForegroundColor Yellow
try { python -m http.server 8080 } catch { npx -y serve -p 8080 }
