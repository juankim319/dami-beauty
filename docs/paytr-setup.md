# PayTR Integration Guide

Documentation: [PayTR Dev Portal](https://dev.paytr.com/)

## Required Credentials

Obtain from PayTR merchant panel:

| Variable | Description |
|----------|-------------|
| `PAYTR_MERCHANT_ID` | Merchant ID |
| `PAYTR_MERCHANT_KEY` | Merchant Key |
| `PAYTR_MERCHANT_SALT` | Merchant Salt |

## Test Mode

Set `PAYTR_TEST_MODE=true` in backend `.env` for sandbox payments.

Test card numbers are provided in PayTR merchant panel under Test Mode section.

## Callback URL (Bildirim URL)

Register in PayTR panel:
- **Staging**: `https://api-staging.damibeauty.com/api/v1/payment/paytr/callback`
- **Production**: `https://api.damibeauty.com/api/v1/payment/paytr/callback`

Must be HTTPS. PayTR sends POST with payment result.

## Payment Flow

1. Customer submits checkout → `POST /api/v1/orders`
2. Backend creates order (`status: pending`), generates `merchant_oid`
3. Frontend calls `POST /api/v1/payment/paytr/token` with order ID
4. Backend computes HMAC hash, requests token from PayTR
5. Frontend embeds PayTR iFrame with token
6. PayTR POSTs to callback URL on completion
7. Backend verifies hash, updates order to `paid`, decrements stock
8. Customer redirected to success/fail page

## Hash Verification (Callback)

```python
hash_str = merchant_oid + merchant_salt + status + total_amount
expected = base64.b64encode(hmac.new(
    merchant_key.encode(), hash_str.encode(), hashlib.sha256
).digest()).decode()
assert expected == received_hash
```

## Idempotency

- `merchant_oid` must be unique per order
- If callback received twice with `status=success`, return OK without double stock deduction
- Log all callbacks to `paytr_callbacks` subcollection for audit

## Success / Fail Redirect URLs

Configured in token request:
- `merchant_ok_url`: `{FRONTEND_URL}/order/{order_id}?status=success`
- `merchant_fail_url`: `{FRONTEND_URL}/checkout?status=failed&order={order_id}`
