# PayTR Integration Guide

Documentation: [PayTR Dev Portal](https://dev.paytr.com/)

## Modes (how the backend behaves)

| Mode | Env | What happens |
|------|-----|--------------|
| **test** | Keys set + `PAYTR_TEST_MODE=true` | Real PayTR iframe, test cards, callback → `paid` |
| **live** | Keys set + `PAYTR_TEST_MODE=false` | Real payments |
| **unconfigured** | No keys (production default) | Checkout shows clear error — add keys |
| **dev_mock** | `PAYTR_ALLOW_DEV_MOCK=true` + no keys | Local UI bypass only — **never on Railway** |

Check current mode:

```bash
curl https://dami-beauty-api-production.up.railway.app/health
curl https://dami-beauty-api-production.up.railway.app/api/v1/payment/paytr/status
```

## Step 1 — Get credentials from PayTR

From PayTR merchant panel:

| Variable | Description |
|----------|-------------|
| `PAYTR_MERCHANT_ID` | Merchant ID |
| `PAYTR_MERCHANT_KEY` | Merchant Key |
| `PAYTR_MERCHANT_SALT` | Merchant Salt |

## Step 2 — Railway environment variables

Set on **dami-beauty-api** service:

```env
PAYTR_MERCHANT_ID=your_id
PAYTR_MERCHANT_KEY=your_key
PAYTR_MERCHANT_SALT=your_salt
PAYTR_TEST_MODE=true
PAYTR_ALLOW_DEV_MOCK=false
FRONTEND_URL=https://dami-beauty.vercel.app
BACKEND_URL=https://dami-beauty-api-production.up.railway.app
```

Quick script (PowerShell, from repo root):

```powershell
.\scripts\set-paytr-railway.ps1 `
  -MerchantId "YOUR_ID" `
  -MerchantKey "YOUR_KEY" `
  -MerchantSalt "YOUR_SALT"
```

Railway redeploys automatically after variable changes.

## Step 3 — Register Callback URL (Bildirim URL)

In PayTR panel → **Bildirim URL**:

```
https://dami-beauty-api-production.up.railway.app/api/v1/payment/paytr/callback
```

Must be **HTTPS**. PayTR POSTs payment result here.

Verify the same URL appears in:

```
GET /api/v1/payment/paytr/status → callback_url
```

## Step 4 — Test cards

Use test card numbers from PayTR panel (Test Mode section).  
Do **not** use real cards while `PAYTR_TEST_MODE=true`.

Frontend shows **PayTR Test Modu** banner on checkout iframe when test mode is active.

## Step 5 — QA checklist

Run at least 10 test transactions (`docs/qa-checklist.md`):

- [ ] Successful payment → order `paid`, stock decremented
- [ ] Failed payment → order `cancelled`
- [ ] Duplicate callback → no double stock deduction
- [ ] User closes iframe → order stays `pending`

## Go live

1. Complete PayTR merchant verification
2. Set `PAYTR_TEST_MODE=false` on Railway
3. Register **live** callback URL in PayTR panel (same path)
4. Run 1 real small-amount order

No code changes required — same integration path as test mode.

## Payment flow

1. Customer submits checkout → `POST /api/v1/orders`
2. Backend creates order (`status: pending`), stores `client_ip`, generates `merchant_oid`
3. Frontend calls `POST /api/v1/payment/paytr/token` with order ID
4. Backend calls PayTR `get-token` with `test_mode=1` (or `0` live)
5. Frontend embeds PayTR iFrame
6. PayTR POSTs to callback URL
7. Backend verifies HMAC hash → `paid` + stock decrement
8. Customer redirected to `{FRONTEND_URL}/order/{id}?status=success`

## Redirect URLs (auto-configured)

- Success: `{FRONTEND_URL}/order/{order_id}?status=success`
- Fail: `{FRONTEND_URL}/checkout?status=failed&order={order_id}`

## Hash verification (callback)

```python
hash_str = merchant_oid + merchant_salt + status + total_amount
expected = base64.b64encode(hmac.new(
    merchant_key.encode(), hash_str.encode(), hashlib.sha256
).digest()).decode()
assert expected == received_hash
```

## Idempotency

- `merchant_oid` unique per order (`DB` + hex prefix)
- Duplicate success callbacks return `OK` without double stock deduction
- All callbacks logged under `orders/{id}/paytr_callbacks`

## Local development

```env
# backend/.env
PAYTR_MERCHANT_ID=
PAYTR_MERCHANT_KEY=
PAYTR_MERCHANT_SALT=
PAYTR_TEST_MODE=true
PAYTR_ALLOW_DEV_MOCK=true   # optional: skip PayTR when no keys
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
```

For local PayTR callback testing, expose backend via ngrok and temporarily set `BACKEND_URL` to the ngrok HTTPS URL.
