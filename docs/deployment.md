# Deployment Guide

## Architecture

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend (Next.js) | Vercel | `www.damibeauty.com` |
| Backend (FastAPI) | Google Cloud Run | `api.damibeauty.com` |
| Firebase | Google Cloud | Firestore, Auth, Storage |

## Backend — Cloud Run

```bash
cd backend
gcloud builds submit --tag gcr.io/PROJECT_ID/dami-beauty-api
gcloud run deploy dami-beauty-api \
  --image gcr.io/PROJECT_ID/dami-beauty-api \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars "FIREBASE_PROJECT_ID=dami-beauty-prod,..." \
  --set-secrets "PAYTR_MERCHANT_KEY=paytr-key:latest"
```

Required env vars: see `backend/.env.example`

Mount Firebase service account via Cloud Run secret or workload identity.

**PayTR callback URL**: `https://api.damibeauty.com/api/v1/payment/paytr/callback`

## Frontend — Vercel

1. Connect GitHub repo to Vercel
2. Root directory: `frontend`
3. Environment variables from `frontend/.env.local.example`
4. Custom domain: `www.damibeauty.com`

## Firebase Production

```bash
firebase use prod
firebase deploy --only firestore:rules,storage,firestore:indexes
```

Enable scheduled Firestore export:
- Firebase Console → Firestore → Import/Export → Schedule

## PayTR Live Transition

1. Complete PayTR merchant verification
2. Set `PAYTR_TEST_MODE=false` in production backend
3. Register live callback URL in PayTR panel
4. Run 3+ test transactions in staging with live keys before go-live

## DNS

| Record | Type | Value |
|--------|------|-------|
| www | CNAME | cname.vercel-dns.com |
| api | CNAME | ghs.googlehosted.com (Cloud Run mapping) |

## GitHub Actions Secrets

- `FIREBASE_SERVICE_ACCOUNT`
- `VERCEL_TOKEN` (optional, for deploy action)
- `GCP_SA_KEY` (for Cloud Run deploy)

## Railway Alternative (Backend)

```bash
railway login
railway init
railway up --dockerfile backend/Dockerfile
```

Set env vars in Railway dashboard. Map custom domain for PayTR callback.
