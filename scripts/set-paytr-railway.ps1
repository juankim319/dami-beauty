# Set PayTR credentials on Railway (official test mode)
# Usage:
#   .\scripts\set-paytr-railway.ps1 -MerchantId "123456" -MerchantKey "xxx" -MerchantSalt "yyy"

param(
    [Parameter(Mandatory = $true)]
    [string]$MerchantId,
    [Parameter(Mandatory = $true)]
    [string]$MerchantKey,
    [Parameter(Mandatory = $true)]
    [string]$MerchantSalt,
    [string]$Service = "dami-beauty-api",
    [string]$BackendUrl = "https://dami-beauty-api-production.up.railway.app",
    [string]$FrontendUrl = "https://dami-beauty.vercel.app"
)

$ErrorActionPreference = "Stop"

Write-Host "=== PayTR Railway env (test mode) ===" -ForegroundColor Cyan

$vars = @{
    PAYTR_MERCHANT_ID       = $MerchantId
    PAYTR_MERCHANT_KEY      = $MerchantKey
    PAYTR_MERCHANT_SALT     = $MerchantSalt
    PAYTR_TEST_MODE         = "true"
    PAYTR_ALLOW_DEV_MOCK    = "false"
    BACKEND_URL             = $BackendUrl
    FRONTEND_URL            = $FrontendUrl
}

foreach ($key in $vars.Keys) {
    $val = $vars[$key]
    Write-Host "Setting $key..."
    npx @railway/cli variables set "${key}=${val}" --service $Service
}

Write-Host ""
Write-Host "Done. Register this Callback URL in PayTR panel:" -ForegroundColor Green
Write-Host "$BackendUrl/api/v1/payment/paytr/callback"
Write-Host ""
Write-Host "Verify:" -ForegroundColor Yellow
Write-Host "curl $BackendUrl/api/v1/payment/paytr/status"
Write-Host "curl $BackendUrl/health"
