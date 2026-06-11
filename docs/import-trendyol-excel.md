# Trendyol Excel → Firestore import

Import file: Trendyol `urunlerimiz.xlsx` (sheet: Ürünler)

## Prerequisites

1. Firestore database created in Firebase Console (`dami-beauty-353b0`)
2. `backend/service-account-dev.json` in place
3. `backend/.env`: `USE_MOCK_DB=false`

## Run import

```powershell
cd backend
python scripts/import_trendyol_excel.py "C:\Users\asus\Downloads\urunlerimiz.xlsx"
```

Options:

- `--dry-run` — preview counts only
- `--clear-existing` — delete all products before import (use with care)

## Mapping

| Excel column | Firestore |
|--------------|-----------|
| Model Kodu | product group → document ID / slug |
| Barkod | variant `sku` |
| Ürün Adı | `name_tr` |
| Ürün Açıklaması | `description_tr` |
| Trendyol'da Satılacak Fiyat | `price_try` (kuruş) |
| Ürün Stok Adedi | variant `stock` |
| Ürün Rengi / Beden | variant `options` |
| Görsel 1–8 | `images[]` |
| Kategori İsmi | `categories` collection |
| Durum (blocked) | `active: false` |

486 rows → **312 products** (variants grouped by Model Kodu), **69 categories**.

Re-run the same command to **update** prices/stock (upsert by slug).

## After import

Restart frontend (for `cdn.dsmcdn.com` images in `next.config.mjs`).
