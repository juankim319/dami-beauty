# Quick Deploy (no custom domain)

Public URLs only — custom domain can be added later.

## Order

1. **Backend (Railway)** → get `https://xxxx.up.railway.app`
2. **Frontend (Vercel)** → set `NEXT_PUBLIC_API_URL` → get `https://xxxx.vercel.app`
3. **Firebase Console** → Auth → Authorized domains → add your `*.vercel.app` host

## 1. Backend — Railway

```powershell
cd c:\Users\asus\Desktop\dami-beauty
scripts\deploy-railway.cmd
```

After deploy, note the URL and test:

```
https://YOUR-URL.up.railway.app/health
```

Should return `"db": "firebase"`, `"firestore_connected": true`.

## 2. Frontend — Vercel

Set API URL (replace with your Railway URL):

```powershell
set NEXT_PUBLIC_API_URL=https://YOUR-URL.up.railway.app/api/v1
set NEXT_PUBLIC_SITE_URL=https://YOUR-PROJECT.vercel.app
scripts\deploy-vercel.cmd
```

Or set env vars in [Vercel Dashboard](https://vercel.com) → Project → Settings → Environment Variables:

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | `https://xxx.up.railway.app/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | `https://xxx.vercel.app` |
| `NEXT_PUBLIC_LOCALE` | `ko` |
| `NEXT_PUBLIC_FIREBASE_*` | From Firebase Console → Web app |

## 3. Firebase Authorized Domains

Firebase Console → Authentication → Settings → Authorized domains:

- Add your Vercel URL host (e.g. `dami-beauty.vercel.app`)

## Alternative: Render (backend)

1. Push repo to GitHub
2. [Render Dashboard](https://dashboard.render.com) → New Blueprint → connect repo
3. Set `FIREBASE_SERVICE_ACCOUNT_JSON` secret (paste JSON from `service-account-dev.json`)

## PayTR callback (when keys ready)

Register in PayTR panel:

```
https://YOUR-RAILWAY-URL.up.railway.app/api/v1/payment/paytr/callback
```

## Local vs production

| | Local | Production |
|---|-------|------------|
| Frontend | localhost:3000 | *.vercel.app |
| Backend | localhost:8000 | *.up.railway.app |
| Domain | — | damibeauty.com (later) |
