@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0.."

echo ============================================================
echo   Dami Beauty Deploy (Vercel + Railway)
echo   Account: dongzino319@gmail.com
echo ============================================================
echo.

echo --- Railway ---
cd backend
call npx.cmd @railway/cli whoami
if errorlevel 1 (
  echo Login: npx.cmd @railway/cli login
  call npx.cmd @railway/cli login
)
cd ..

echo.
echo --- Vercel ---
cd frontend
call npx.cmd vercel whoami
if errorlevel 1 (
  echo Login: npx.cmd vercel login
  call npx.cmd vercel login
)
cd ..

echo.
echo [1/3] Railway backend...
cd backend
python scripts\deploy_railway.py
if errorlevel 1 exit /b 1
cd ..

echo.
echo [2/3] Railway URL...
cd backend
for /f "delims=" %%u in ('npx.cmd @railway/cli domain 2^>nul') do set RAILWAY_OUT=%%u
call npx.cmd @railway/cli domain
cd ..

echo.
set /p BACKEND_HOST="Backend URL (https://xxx.up.railway.app): "
if "!BACKEND_HOST!"=="" exit /b 1
set NEXT_PUBLIC_API_URL=!BACKEND_HOST!/api/v1

echo.
echo [3/3] Vercel frontend...
cd frontend
call npx.cmd vercel deploy --prod --yes -e NEXT_PUBLIC_API_URL=!NEXT_PUBLIC_API_URL! -e NEXT_PUBLIC_LOCALE=tr -e NEXT_PUBLIC_SITE_URL=https://dami-beauty.vercel.app
if errorlevel 1 exit /b 1

echo.
echo === Alias: dami-beauty.vercel.app ===
for /f "tokens=*" %%u in ('npx.cmd vercel ls --prod 2^>nul ^| findstr /R "https://dami-beauty-.*vercel.app"') do set DEPLOY_URL=%%u
if defined DEPLOY_URL call npx.cmd vercel alias set %%DEPLOY_URL%% dami-beauty.vercel.app
cd ..

echo.
echo Done.
echo Shop:  https://dami-beauty.vercel.app/
echo Admin: https://dami-beauty.vercel.app/admin
exit /b 0
