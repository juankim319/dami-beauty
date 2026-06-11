"""Sample catalog data shared by memory DB and seed script."""

from datetime import datetime, timezone

SAMPLE_PRODUCTS = [
    {
        "name_tr": "Romantik Hediye Kutusu",
        "slug": "romantik-hediye-kutusu",
        "type": "gift_box",
        "description_tr": "Sevdiklerinize özel hazırlanmış romantik hediye kutusu. Gül kokulu mum, el yapımı sabun ve özel not kartı içerir.",
        "images": [],
        "base_price_try": 129900,
        "category_id": None,
        "variants": [
            {"sku": "RHK-GUL", "options": {"koku": "Gül"}, "price_try": 129900, "stock": 25, "low_stock_threshold": 5},
            {"sku": "RHK-LAV", "options": {"koku": "Lavanta"}, "price_try": 129900, "stock": 20, "low_stock_threshold": 5},
        ],
        "is_featured": True,
        "gift_wrap_available": True,
        "active": True,
    },
    {
        "name_tr": "Doğum Günü Kürasyon Seti",
        "slug": "dogum-gunu-kurasyon-seti",
        "type": "curation_set",
        "description_tr": "Doğum gününe özel 5 parçalık kürasyon seti. Kişiselleştirilebilir kart mesajı ile.",
        "images": [],
        "base_price_try": 89900,
        "category_id": None,
        "variants": [
            {"sku": "DGK-STD", "options": {"boyut": "Standart"}, "price_try": 89900, "stock": 30, "low_stock_threshold": 5},
            {"sku": "DGK-PRM", "options": {"boyut": "Premium"}, "price_try": 119900, "stock": 15, "low_stock_threshold": 3},
        ],
        "is_featured": True,
        "gift_wrap_available": True,
        "active": True,
    },
    {
        "name_tr": "El Yapımı Gül Sabunu",
        "slug": "el-yapimi-gul-sabunu",
        "type": "single",
        "description_tr": "Doğal malzemelerle el yapımı gül sabunu. 100g.",
        "images": [],
        "base_price_try": 14900,
        "category_id": None,
        "variants": [
            {"sku": "GUL-SAB-100", "options": {}, "price_try": 14900, "stock": 100, "low_stock_threshold": 10},
        ],
        "is_featured": False,
        "gift_wrap_available": True,
        "active": True,
    },
]


def seed_memory_db(store) -> None:
    """Populate memory store with sample data (idempotent)."""
    now = datetime.now(timezone.utc)
    products_col = store._collections.setdefault("products", {})
    if products_col:
        return

    for product in SAMPLE_PRODUCTS:
        import uuid

        doc_id = uuid.uuid4().hex[:20]
        data = {**product, "created_at": now, "updated_at": now}
        products_col[doc_id] = data

    store._collections["campaigns"] = {
        "camp1": {
            "title_tr": "Sevgililer Günü Özel Seti",
            "subtitle_tr": "Hediye kutusunu açtığınız an mutluluk başlar",
            "banner_url": "",
            "product_ids": [],
            "start_at": now,
            "end_at": None,
            "active": True,
        }
    }

    store._collections["instagram_posts"] = {
        f"ig{i}": {
            "image_url": f"https://picsum.photos/seed/dami{i}/400/400",
            "post_url": "https://www.instagram.com/damibeautyy/",
            "sort_order": i,
            "active": True,
        }
        for i in range(6)
    }
