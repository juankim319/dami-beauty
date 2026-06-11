# Dami Beauty — Python · Firebase · PayTR E-Commerce

Turkish gift box & curation set store. Mobile-first, Instagram-driven traffic.

## Stack

- **Backend**: FastAPI + Firebase Admin SDK
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Database**: Firestore
- **Payments**: PayTR (TRY)
- **Deploy**: Vercel (frontend) + Cloud Run (backend)

## Project Structure

```
dami-beauty/
├── backend/          FastAPI API server
├── frontend/         Next.js shop + admin
├── firebase/         Firestore & Storage rules
└── docs/             ERD, wireframes, setup guides
```

## Quick Start

Project layout: `frontend/` and `backend/` are **siblings** under `dami-beauty/`, not nested.

```
dami-beauty/
├── backend/     ← API (port 8000)
├── frontend/    ← Next.js (port 3000)
└── scripts/     ← Windows helpers
```

### Backend (terminal 1)

Requires **Python 3.12+** (3.14 supported).

```powershell
cd C:\Users\asus\Desktop\dami-beauty\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env    # then edit .env
python -m uvicorn app.main:app --reload --port 8000
```

Or from repo root: `scripts\start-backend.cmd`

### Frontend (terminal 2)

```powershell
cd C:\Users\asus\Desktop\dami-beauty\frontend
Copy-Item .env.local.example .env.local
npm.cmd install
npm.cmd run dev
```

Open http://localhost:3000

**If you are already in `backend/`**, go up one level first:

```powershell
cd ..\frontend
```

**If `npm` fails with “running scripts is disabled”** (PowerShell execution policy), use `npm.cmd` instead of `npm`, or run `scripts\start-frontend.cmd` from the repo root.

### Firebase Emulators (optional)

```powershell
npm.cmd install -g firebase-tools
firebase emulators:start --only firestore,auth,storage
```

## Environment

See `backend/.env.example` and `frontend/.env.local.example`.

## Documentation

- [Firestore ERD](docs/firestore-erd.md)
- [Wireframes](docs/wireframes.md)
- [Firebase Setup](docs/firebase-setup.md)
- [PayTR Setup](docs/paytr-setup.md)
- [Legal Pages](docs/legal-pages-checklist.md)
- [Deployment](docs/deployment.md)
- [QA Checklist](docs/qa-checklist.md)

## License

Proprietary — Dami Beauty
