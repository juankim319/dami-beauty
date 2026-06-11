@echo off
setlocal
cd /d "%~dp0..\frontend"

echo === Dami Beauty - Vercel Deploy ===
echo.
echo First time: browser login will open.
echo.

if not defined NEXT_PUBLIC_API_URL (
  echo WARNING: Set backend URL first, e.g.:
  echo   set NEXT_PUBLIC_API_URL=https://your-api.up.railway.app/api/v1
  echo.
)

call npx.cmd --yes vercel deploy --prod --yes
if errorlevel 1 (
  echo.
  echo If login needed: npx.cmd vercel login
  exit /b 1
)

echo.
echo === Alias: dami-beauty.vercel.app ===
for /f "tokens=*" %%u in ('npx.cmd vercel ls --prod 2^>nul ^| findstr /R "https://dami-beauty-.*vercel.app"') do set DEPLOY_URL=%%u
if defined DEPLOY_URL (
  call npx.cmd vercel alias set %%DEPLOY_URL%% dami-beauty.vercel.app
  echo Production: https://dami-beauty.vercel.app
  echo Admin:       https://dami-beauty.vercel.app/admin
) else (
  echo WARNING: Could not detect deployment URL for alias.
)

echo.
echo Done. Always use https://dami-beauty.vercel.app
exit /b 0
