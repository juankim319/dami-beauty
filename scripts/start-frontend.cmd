@echo off
REM Run from repo root: scripts\start-frontend.cmd
cd /d "%~dp0..\frontend"
if not exist .env.local (
  copy .env.local.example .env.local
  echo Created .env.local from example — edit if needed.
)
call npm.cmd install
call npm.cmd run dev
