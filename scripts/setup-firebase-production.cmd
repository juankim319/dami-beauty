@echo off
setlocal
cd /d "%~dp0..\frontend"

set API=https://dami-beauty-api-production.up.railway.app/api/v1
set SITE=https://dami-beauty.vercel.app
set KEY=AIzaSyDqrhqJY1YKRnmy-3tBldJODPeC-al17EQ
set AUTH_DOMAIN=dami-beauty-353b0.firebaseapp.com
set PROJECT_ID=dami-beauty-353b0
set BUCKET=dami-beauty-353b0.firebasestorage.app
set SENDER=294200908439
set APP_ID=1:294200908439:web:3d17104ce7aff4ba3f27d2

echo === Vercel production env + deploy ===
echo.

call npx.cmd vercel deploy --prod --yes ^
  -e NEXT_PUBLIC_API_URL=%API% ^
  -e NEXT_PUBLIC_SITE_URL=%SITE% ^
  -e NEXT_PUBLIC_LOCALE=ko ^
  -e NEXT_PUBLIC_FIREBASE_API_KEY=%KEY% ^
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=%AUTH_DOMAIN% ^
  -e NEXT_PUBLIC_FIREBASE_PROJECT_ID=%PROJECT_ID% ^
  -e NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=%BUCKET% ^
  -e NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=%SENDER% ^
  -e NEXT_PUBLIC_FIREBASE_APP_ID=%APP_ID%

if errorlevel 1 exit /b 1

echo.
echo Done: %SITE%
echo Admin: %SITE%/admin
exit /b 0
