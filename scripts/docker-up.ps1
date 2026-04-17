# PowerShell: from repo root via scripts folder
Set-Location (Split-Path $PSScriptRoot -Parent)
if (-not (Test-Path .env)) {
    Write-Host "Creating .env from .env.example — edit secrets before production."
    Copy-Item .env.example .env
}
Write-Host "Building and starting stack..."
docker compose --env-file .env up -d --build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host ""
Write-Host "Open the site URL from your .env (default http://localhost:8085)"
