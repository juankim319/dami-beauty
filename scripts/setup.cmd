@echo off
REM One-time setup after git clone — run from repo root: scripts\setup.cmd
setlocal
cd /d "%~dp0.."

echo.
echo === Dami Beauty - local setup ===
echo.

where python >nul 2>&1
if errorlevel 1 (
  echo ERROR: Python not found. Install Python 3.12+ and try again.
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo ERROR: npm not found. Install Node.js 18+ and try again.
  exit /b 1
)

echo [1/4] Backend environment...
cd backend
if not exist .env (
  copy /Y .env.example .env >nul
  echo   Created backend\.env from .env.example
) else (
  echo   backend\.env already exists
)

if not exist .venv (
  echo   Creating Python virtual environment...
  python -m venv .venv
)
call .venv\Scripts\activate.bat
python -m pip install --upgrade pip -q
pip install -r requirements.txt -q
cd ..

echo [2/4] Frontend environment...
cd frontend
if not exist .env.local (
  copy /Y .env.local.example .env.local >nul
  echo   Created frontend\.env.local from .env.local.example
) else (
  echo   frontend\.env.local already exists
)

echo [3/4] Installing npm packages...
call npm.cmd install
cd ..

echo [4/4] Done.
echo.
echo --- Start development ---
echo   Terminal 1: scripts\start-backend.cmd
echo   Terminal 2: scripts\start-frontend.cmd
echo   Shop:       http://localhost:3000
echo   API docs:   http://localhost:8000/docs
echo.
echo Mock DB is enabled by default (USE_MOCK_DB=true) — no Firebase key needed for the shop.
echo For admin login, add NEXT_PUBLIC_FIREBASE_* keys to frontend\.env.local
echo   (Firebase Console ^> Project settings ^> Your apps ^> Web app config).
echo.
