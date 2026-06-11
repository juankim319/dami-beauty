@echo off
setlocal
cd /d "%~dp0..\frontend"

echo === Vercel env vars (production) ===

call :add NEXT_PUBLIC_API_URL https://dami-beauty-api-production.up.railway.app/api/v1
call :add NEXT_PUBLIC_SITE_URL https://dami-beauty.vercel.app
call :add NEXT_PUBLIC_LOCALE tr
call :add NEXT_PUBLIC_FIREBASE_API_KEY AIzaSyDqrhqJY1YKRnmy-3tBldJODPeC-al17EQ
call :add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN dami-beauty-353b0.firebaseapp.com
call :add NEXT_PUBLIC_FIREBASE_PROJECT_ID dami-beauty-353b0
call :add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET dami-beauty-353b0.firebasestorage.app
call :add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID 294200908439
call :add NEXT_PUBLIC_FIREBASE_APP_ID 1:294200908439:web:3d17104ce7aff4ba3f27d2

echo.
echo === Redeploy production ===
call npx.cmd vercel deploy --prod --yes
if errorlevel 1 exit /b 1

echo.
echo === Alias dami-beauty.vercel.app ===
for /f "tokens=*" %%u in ('npx.cmd vercel ls --prod 2^>nul ^| findstr /R "https://dami-beauty-.*vercel.app"') do set DEPLOY_URL=%%u
call npx.cmd vercel alias set %DEPLOY_URL% dami-beauty.vercel.app
echo Done: https://dami-beauty.vercel.app/admin/login
exit /b 0

:add
call npx.cmd vercel env add %1 production --value "%~2" --yes --force --no-sensitive >nul 2>&1
echo   %1
exit /b 0
