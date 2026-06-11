#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/backend"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from example — edit for Firebase / PayTR keys."
fi

if [[ ! -d .venv ]]; then
  echo "Run ./scripts/setup.sh first."
  exit 1
fi

# shellcheck disable=SC1091
source .venv/bin/activate
exec python -m uvicorn app.main:app --reload --port 8000
