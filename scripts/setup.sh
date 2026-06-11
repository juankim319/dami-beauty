#!/usr/bin/env bash
# One-time setup after git clone — run from repo root: ./scripts/setup.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo ""
echo "=== Dami Beauty - local setup ==="
echo ""

command -v python3 >/dev/null || { echo "ERROR: python3 not found. Install Python 3.12+."; exit 1; }
command -v npm >/dev/null || { echo "ERROR: npm not found. Install Node.js 18+."; exit 1; }

echo "[1/4] Backend environment..."
cd "$ROOT/backend"
if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "  Created backend/.env from .env.example"
else
  echo "  backend/.env already exists"
fi

if [[ ! -d .venv ]]; then
  echo "  Creating Python virtual environment..."
  python3 -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate
python -m pip install --upgrade pip -q
pip install -r requirements.txt -q

echo "[2/4] Frontend environment..."
cd "$ROOT/frontend"
if [[ ! -f .env.local ]]; then
  cp .env.local.example .env.local
  echo "  Created frontend/.env.local from .env.local.example"
else
  echo "  frontend/.env.local already exists"
fi

echo "[3/4] Installing npm packages..."
npm install

echo "[4/4] Done."
echo ""
echo "--- Start development ---"
echo "  Terminal 1: ./scripts/start-backend.sh"
echo "  Terminal 2: ./scripts/start-frontend.sh"
echo "  Shop:       http://localhost:3000"
echo "  API docs:   http://localhost:8000/docs"
echo ""
echo "Mock DB is enabled by default (USE_MOCK_DB=true) — no Firebase key needed for the shop."
echo "For admin login, add NEXT_PUBLIC_FIREBASE_* keys to frontend/.env.local"
echo "  (Firebase Console > Project settings > Your apps > Web app config)."
echo ""
