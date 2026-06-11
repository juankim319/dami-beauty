@echo off
REM Run from repo root: scripts\start-backend.cmd
cd /d "%~dp0..\backend"
if not exist .env (
  copy .env.example .env
  echo Created .env from example — add Firebase / PayTR keys.
)
if exist .venv\Scripts\python.exe (
  .venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
) else (
  python -m uvicorn app.main:app --reload --port 8000
)
