"""Seed sample products for development."""
import os
import sys
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.firebase import get_db
from app.core.seed_samples import SAMPLE_PRODUCTS, seed_memory_db
from app.core.memory_db import is_memory_db


def main():
    db = get_db()
    now = datetime.now(timezone.utc)

    if is_memory_db(db):
        seed_memory_db(db)
        print("Memory DB seeded with sample data.")
        return

    for product in SAMPLE_PRODUCTS:
        existing = (
            db.collection("products")
            .where("slug", "==", product["slug"])
            .limit(1)
            .stream()
        )
        if any(True for _ in existing):
            print(f"Skip (exists): {product['slug']}")
            continue
        product["created_at"] = now
        product["updated_at"] = now
        _, ref = db.collection("products").add(product)
        print(f"Created: {product['name_tr']} ({ref.id})")

    campaigns = db.collection("campaigns").limit(1).stream()
    if not any(True for _ in campaigns):
        db.collection("campaigns").add(
            {
                "title_tr": "Sevgililer Günü Özel Seti",
                "subtitle_tr": "Hediye kutusunu açtığınız an mutluluk başlar",
                "banner_url": "",
                "product_ids": [],
                "start_at": now,
                "end_at": None,
                "active": True,
            }
        )
        print("Created sample campaign")

    posts = db.collection("instagram_posts").limit(1).stream()
    if not any(True for _ in posts):
        for i in range(6):
            db.collection("instagram_posts").add(
                {
                    "image_url": f"https://picsum.photos/seed/dami{i}/400/400",
                    "post_url": "https://www.instagram.com/damibeautyy/",
                    "sort_order": i,
                    "active": True,
                }
            )
        print("Created sample instagram posts")


if __name__ == "__main__":
    main()
