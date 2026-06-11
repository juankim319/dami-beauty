@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0..\backend"

echo === Dami Beauty - Railway Backend Deploy ===
echo.

set SA_FILE=service-account-dev.json
if not exist "%SA_FILE%" (
  echo ERROR: %SA_FILE% not found in backend\
  exit /b 1
)

echo Checking Railway CLI...
call npx.cmd --yes @railway/cli --version >nul 2>&1
if errorlevel 1 (
  echo Failed to load Railway CLI.
  exit /b 1
)

echo.
echo Step 1: Login to Railway (browser opens on first run)
call npx.cmd @railway/cli login
if errorlevel 1 exit /b 1

echo.
echo Step 2: Init project (skip if already linked)
if not exist ".railway" (
  call npx.cmd @railway/cli init --name dami-beauty-api
)

echo.
echo Step 3: Set environment variables...
for /f "delims=" %%i in ('python -c "import json;print(json.dumps(json.load(open('service-account-dev.json'))))"') do set SA_JSON=%%i

call npx.cmd @railway/cli variables set APP_ENV=production DEBUG=false USE_MOCK_DB=false FIREBASE_PROJECT_ID=dami-beauty-353b0 CORS_ALLOW_VERCEL=true PAYTR_TEST_MODE=true
call npx.cmd @railway/cli variables set FIREBASE_SERVICE_ACCOUNT_JSON="!SA_JSON!"

echo.
echo Step 4: Deploy...
call npx.cmd @railway/cli up --detach
if errorlevel 1 exit /b 1

echo.
echo Step 5: Get public URL...
call npx.cmd @railway/cli domain
echo.
echo Copy the Railway URL and set frontend:
echo   set NEXT_PUBLIC_API_URL=https://YOUR-URL.up.railway.app/api/v1
echo   scripts\deploy-vercel.cmd
exit /b 0
