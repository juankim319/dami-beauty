@echo off
echo Account: dongzino319@gmail.com
echo.
cd /d "%~dp0..\backend"
echo Railway:
call npx.cmd @railway/cli whoami 2>nul || echo   NOT logged in
cd /d "%~dp0..\frontend"
echo Vercel:
call npx.cmd vercel whoami 2>nul || echo   NOT logged in
