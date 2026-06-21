@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0..\frontend"

echo === Dami Beauty - Vercel Deploy ===
echo.

if not defined NEXT_PUBLIC_API_URL (
  echo WARNING: Set backend URL first, e.g.:
  echo   set NEXT_PUBLIC_API_URL=https://your-api.up.railway.app/api/v1
  echo.
)

set DEPLOY_LOG=%TEMP%\dami-vercel-deploy.log
call npx.cmd --yes vercel deploy --prod --yes > "%DEPLOY_LOG%" 2>&1
type "%DEPLOY_LOG%"

for /f "delims=" %%u in ('powershell -NoProfile -Command "$log=Get-Content -Raw '%DEPLOY_LOG%'; if ($log -match 'https://dami-beauty-[a-z0-9-]+\.vercel\.app') { $Matches[0] }"') do set "DEPLOY_URL=%%u"

if not defined DEPLOY_URL (
  echo.
  echo ERROR: Could not detect deployment URL.
  exit /b 1
)

echo.
echo Deployed: !DEPLOY_URL!

echo.
echo === Alias: dami-beauty.vercel.app ===
call npx.cmd vercel alias set "!DEPLOY_URL!" dami-beauty.vercel.app
if errorlevel 1 exit /b 1

echo Production: https://dami-beauty.vercel.app
echo Admin:       https://dami-beauty.vercel.app/admin
exit /b 0
