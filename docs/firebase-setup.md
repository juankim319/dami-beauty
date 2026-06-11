# Firebase Setup Guide

## Current Firebase project (Console)

| Field | Value |
|-------|--------|
| Project name | Dami-beauty |
| **Project ID** | `dami-beauty-353b0` |
| Project number | `294200908439` |

Use **Project ID** in all `.env` files and `firebase use`.

| Environment | Project ID (suggested) | Purpose |
|-------------|------------------------|---------|
| dev / current | `dami-beauty-353b0` | Dami-beauty (Firebase Console) |
| staging | *(optional later)* | Pre-production |
| prod | *(optional later)* | Live store |

## Setup Steps

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create three projects (dev, staging, prod)
3. Enable services per project:
   - **Authentication** → Email/Password, Google (optional)
   - **Firestore Database** → **데이터베이스 만들기** (필수!)  
     region: `europe-west1` · [Console 링크](https://console.firebase.google.com/project/dami-beauty-353b0/firestore)  
     *(만들기 전에는 `/health`가 `db: firebase`여도 import/API가 404)*  
   - **Storage** → Default bucket
   - **Hosting** (optional, frontend uses Vercel)

4. Generate service account key:
   - Project Settings → Service Accounts → Generate new private key
   - Save as `backend/service-account-dev.json` (gitignored)
   - For CI: store JSON in GitHub Secrets as `FIREBASE_SERVICE_ACCOUNT`

5. Deploy rules (pick one):

   **A — Service account script (no browser login):**
   ```powershell
   scripts\deploy-firebase-rules.cmd
   ```
   Uses `backend/service-account-dev.json` via Firebase Rules API.

   **B — Firebase CLI (browser login once):**
   ```powershell
   scripts\deploy-firebase-rules-cli.cmd
   ```
   PowerShell에서 `npx`가 막히면 `npx.cmd`를 사용하세요 (`npx` 대신 `npx.cmd`).

   Rules files: `firebase/firestore.rules`, `firebase/storage.rules`

6. Create first admin user:
   ```bash
   cd backend
   python scripts/set_admin_claim.py --email admin@damibeauty.com
   ```

## Web App Config (Frontend)

Firebase Web app **Dami Beauty Web** is registered in project `dami-beauty-353b0`.

Copy from Firebase Console → Project Settings → Your apps → Web app, or run:

```powershell
npx.cmd --yes firebase-tools apps:sdkconfig WEB 1:294200908439:web:3d17104ce7aff4ba3f27d2 --project dami-beauty-353b0
```

Set in `frontend/.env.local` and Vercel → Environment Variables (Production):

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dami-beauty-353b0.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dami-beauty-353b0
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dami-beauty-353b0.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=1:294200908439:web:3d17104ce7aff4ba3f27d2
```

Redeploy frontend after setting env vars:

```powershell
scripts\setup-firebase-production.cmd
```

## Production Auth (required for `/admin`)

1. [Firebase Console → Authentication](https://console.firebase.google.com/project/dami-beauty-353b0/authentication) → **시작하기**
2. **Sign-in method** → **이메일/비밀번호** → 사용 설정
3. **Settings** → **Authorized domains** → add `dami-beauty.vercel.app`
4. **Users** → add admin account (e.g. your Gmail)
5. Grant admin role:

```powershell
cd backend
set GOOGLE_APPLICATION_CREDENTIALS=service-account-dev.json
python scripts\set_admin_claim.py --email YOUR_EMAIL@example.com
```

Or after Auth is enabled, add authorized domain via script:

```powershell
cd backend
python scripts\setup_firebase_auth.py dami-beauty.vercel.app
```

## Emulators (Local Dev)

```bash
firebase emulators:start --only firestore,auth,storage
```

Set in `backend/.env`:
```
FIRESTORE_EMULATOR_HOST=localhost:8080
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199
```
