@echo off
cd /d "%~dp0.."
echo Firebase CLI login (browser will open)...
call npx.cmd --yes firebase-tools login
if errorlevel 1 exit /b 1
echo.
echo Deploying Firestore + Storage rules...
call npx.cmd --yes firebase-tools deploy --only firestore:rules,storage --project dami-beauty-353b0
exit /b %ERRORLEVEL%
