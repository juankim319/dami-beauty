@echo off
setlocal
cd /d "%~dp0..\frontend"

set CANONICAL=https://dami-beauty.vercel.app

echo === Pin production to %CANONICAL% ===
for /f "tokens=*" %%u in ('npx.cmd vercel ls --prod 2^>nul ^| findstr /R "https://dami-beauty-.*vercel.app"') do set DEPLOY_URL=%%u

if not defined DEPLOY_URL (
  echo ERROR: No production deployment found.
  exit /b 1
)

echo Latest: %DEPLOY_URL%
call npx.cmd vercel alias set %DEPLOY_URL% dami-beauty.vercel.app
if errorlevel 1 exit /b 1

echo.
echo Shop:  %CANONICAL%/
echo Admin: %CANONICAL%/admin
exit /b 0
