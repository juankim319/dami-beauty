@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0.."

echo ============================================================
echo   Dami Beauty - Login + Deploy
echo   Use account: dongzino319@gmail.com
echo ============================================================
echo.

echo [Step A] Railway login
cd backend
call npx.cmd @railway/cli whoami 2>nul
if errorlevel 1 (
  echo Open browser and login with dongzino319@gmail.com
  call npx.cmd @railway/cli login
)
call npx.cmd @railway/cli whoami
cd ..
echo.

echo [Step B] Vercel login
cd frontend
call npx.cmd vercel whoami 2>nul
if errorlevel 1 (
  echo Open browser and login with dongzino319@gmail.com
  call npx.cmd vercel login
)
call npx.cmd vercel whoami
cd ..
echo.

echo [Step C] Deploy backend...
cd backend
python scripts\deploy_railway.py
if errorlevel 1 (
  echo Backend deploy failed.
  pause
  exit /b 1
)
cd ..

echo.
echo [Step D] Get Railway URL...
cd backend
call npx.cmd @railway/cli domain
cd ..
echo.

set /p BACKEND_HOST="Paste Railway URL (https://....up.railway.app): "
if "!BACKEND_HOST!"=="" (
  echo No URL entered.
  pause
  exit /b 1
)

echo.
echo [Step E] Deploy frontend...
cd frontend
call npx.cmd vercel deploy --prod --yes -e NEXT_PUBLIC_API_URL=!BACKEND_HOST!/api/v1 -e NEXT_PUBLIC_LOCALE=ko
cd ..

echo.
echo ============================================================
echo   DONE
echo   Health: !BACKEND_HOST!/health
echo   Add Vercel URL to Firebase Auth authorized domains
echo ============================================================
pause
