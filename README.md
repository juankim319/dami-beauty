# Dami Beauty — Python · Firebase · PayTR E-Commerce

Turkish gift box & curation set store. Mobile-first, Instagram-driven traffic.

**Repo:** https://github.com/juankim319/dami-beauty

## Stack

- **Backend**: FastAPI + Firebase Admin SDK
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Database**: Firestore (or in-memory mock for local dev)
- **Payments**: PayTR (TRY)
- **Deploy**: Vercel (frontend) + Cloud Run / Railway (backend)

## Clone & work on any machine

```bash
git clone https://github.com/juankim319/dami-beauty.git
cd dami-beauty
```

### One-time setup

**Windows (PowerShell / CMD):**

```powershell
scripts\setup.cmd
```

**macOS / Linux:**

```bash
chmod +x scripts/*.sh
./scripts/setup.sh
```

This will:

- Create `backend/.env` and `frontend/.env.local` from examples (if missing)
- Create Python venv + install `requirements.txt`
- Run `npm install` in `frontend/`

### Run dev servers (two terminals)

| Terminal | Windows | macOS / Linux |
|----------|---------|---------------|
| API (8000) | `scripts\start-backend.cmd` | `./scripts/start-backend.sh` |
| Shop (3000) | `scripts\start-frontend.cmd` | `./scripts/start-frontend.sh` |

- Shop: http://localhost:3000  
- API docs: http://localhost:8000/docs  

**Default:** `USE_MOCK_DB=true` — sample products work without Firebase credentials.

### Optional: Firebase (admin panel + production DB)

1. Download service account JSON from Firebase Console.
2. Save as `backend/service-account-dev.json` (gitignored).
3. In `backend/.env`: set `USE_MOCK_DB=false` and `GOOGLE_APPLICATION_CREDENTIALS=./service-account-dev.json`
4. In `frontend/.env.local`: fill `NEXT_PUBLIC_FIREBASE_*` from Firebase Console → Project settings → Web app.

Copy these files manually between machines (never commit them).

### Optional: PayTR

Add `PAYTR_MERCHANT_ID`, `PAYTR_MERCHANT_KEY`, `PAYTR_MERCHANT_SALT` to `backend/.env`.  
See [docs/paytr-setup.md](docs/paytr-setup.md).

## Project structure

```
dami-beauty/
├── backend/          FastAPI API server
├── frontend/         Next.js shop + admin
├── firebase/         Firestore & Storage rules
├── scripts/          setup & start helpers
└── docs/             ERD, wireframes, setup guides
```

## What is in Git vs local-only

| In Git (pull gets this) | Local only (gitignored) |
|-------------------------|-------------------------|
| All source code | `backend/.env` |
| `.env.example` templates | `frontend/.env.local` |
| `package-lock.json` | `service-account*.json` |
| Docs & scripts | `node_modules/`, `.next/`, `.venv/` |

After pull on a new machine: run **setup** once, then **start** scripts.

## Documentation

- [Firebase Setup](docs/firebase-setup.md)
- [PayTR Setup](docs/paytr-setup.md)
- [Deployment](docs/deployment.md)
- [Firestore ERD](docs/firestore-erd.md)
- [QA Checklist](docs/qa-checklist.md)

## License

Proprietary — Dami Beauty
