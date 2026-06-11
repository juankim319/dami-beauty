#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/frontend"

if [[ ! -f .env.local ]]; then
  cp .env.local.example .env.local
  echo "Created .env.local from example — edit if needed."
fi

if [[ ! -d node_modules ]]; then
  npm install
fi

exec npm run dev
