from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.firebase import get_db
from app.core.utils import doc_to_dict, utc_now
from app.models.schemas import SocialProofItem

router = APIRouter(prefix="/social-proof", tags=["social-proof"])

VALID_STATUSES = {"paid", "processing", "shipped", "delivered"}


def _minutes_ago(created_at) -> int:
    if created_at is None:
        return 5
    if hasattr(created_at, "timestamp"):
        created_at = datetime.fromtimestamp(created_at.timestamp(), tz=timezone.utc)
    elif isinstance(created_at, str):
        try:
            created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
        except ValueError:
            return 5
    if isinstance(created_at, datetime) and created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)
    if not isinstance(created_at, datetime):
        return 5
    delta = utc_now() - created_at
    return max(1, min(int(delta.total_seconds() // 60), 120))


@router.get("/recent", response_model=list[SocialProofItem])
async def recent_purchases():
    db = get_db()
    docs = (
        db.collection("orders")
        .order_by("created_at", direction="DESCENDING")
        .limit(30)
        .stream()
    )

    items: list[SocialProofItem] = []
    for doc in docs:
        data = doc_to_dict(doc)
        if data.get("status") not in VALID_STATUSES:
            continue
        order_items = data.get("items") or []
        if not order_items:
            continue
        addr = data.get("shipping_address") or {}
        city = (addr.get("il") or addr.get("ilce") or "").strip()
        if not city:
            continue
        product = order_items[0].get("name_tr") or "Ürün"
        items.append(
            SocialProofItem(
                city=city,
                product=product,
                minutes_ago=_minutes_ago(data.get("created_at")),
            )
        )
        if len(items) >= 8:
            break

    return items
