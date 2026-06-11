@echo off
REM Run from repo root: scripts\start-backend.cmd
cd /d "%~dp0..\backend"
if not exist .env (
  copy /Y .env.example .env >nul
  echo Created .env from example — add Firebase / PayTR keys for production features.
)
if not exist .venv (
  echo Virtual env missing. Run scripts\setup.cmd first.
  exit /b 1
)
call .venv\Scripts\activate.bat
python -m uvicorn app.main:app --reload --port 8000
