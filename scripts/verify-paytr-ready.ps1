# PayTR readiness check + env prep (no merchant keys required)
# Run from repo root after deploy

$BackendUrl = "https://dami-beauty-api-production.up.railway.app"
$FrontendUrl = "https://dami-beauty.vercel.app"
$Service = "dami-beauty-api"

Write-Host "=== PayTR prep — Railway env (without merchant keys) ===" -ForegroundColor Cyan

$vars = @{
    PAYTR_TEST_MODE      = "true"
    PAYTR_ALLOW_DEV_MOCK = "false"
    BACKEND_URL          = $BackendUrl
    FRONTEND_URL         = $FrontendUrl
}

foreach ($key in $vars.Keys) {
    Write-Host "Setting $key..."
    npx @railway/cli variables set "${key}=${($vars[$key])}" --service $Service
}

Write-Host ""
Write-Host "=== Health check ===" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$BackendUrl/health" -TimeoutSec 15
    $health | ConvertTo-Json -Depth 4
} catch {
    Write-Host "Health check failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== PayTR status ===" -ForegroundColor Yellow
try {
    $status = Invoke-RestMethod -Uri "$BackendUrl/api/v1/payment/paytr/status" -TimeoutSec 15
    $status | ConvertTo-Json -Depth 4
} catch {
    Write-Host "PayTR status failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Next: when PayTR sends keys ===" -ForegroundColor Green
Write-Host ".\scripts\set-paytr-railway.ps1 -MerchantId ID -MerchantKey KEY -MerchantSalt SALT"
Write-Host ""
Write-Host "Callback URL for PayTR panel:" -ForegroundColor Green
Write-Host "$BackendUrl/api/v1/payment/paytr/callback"
Write-Host ""
Write-Host "Guide: docs/PAYTR-QUICKSTART-KO.md"
