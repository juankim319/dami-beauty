from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from google.cloud.firestore_v1 import FieldFilter

from app.core.firebase import get_db
from app.core.security import require_admin
from app.core.utils import doc_to_dict, utc_now
from app.models.schemas import (
    AdminDashboard,
    InstagramPostCreate,
    InstagramPostResponse,
    OrderResponse,
    ProductResponse,
)
from app.services.inventory import get_low_stock_products
from app.services.audit import log_admin_action

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/dashboard", response_model=AdminDashboard)
async def get_dashboard(admin: Annotated[dict, Depends(require_admin)]):
    db = get_db()
    today_start = utc_now().replace(hour=0, minute=0, second=0, microsecond=0)

    all_orders = list(db.collection("orders").order_by("created_at", direction="DESCENDING").limit(50).stream())
    orders_today = 0
    pending_orders = 0
    recent = []

    for doc in all_orders:
        data = doc_to_dict(doc)
        created = data.get("created_at")
        if created and created.replace(tzinfo=today_start.tzinfo) >= today_start:
            orders_today += 1
        if data.get("status") in ("paid", "processing"):
            pending_orders += 1
        if len(recent) < 10:
            recent.append(OrderResponse(**data))

    return AdminDashboard(
        orders_today=orders_today,
        pending_orders=pending_orders,
        low_stock_products=get_low_stock_products(),
        recent_orders=recent,
    )


@router.get("/products", response_model=list[ProductResponse])
async def list_all_products(admin: Annotated[dict, Depends(require_admin)]):
    db = get_db()
    docs = db.collection("products").limit(200).stream()
    products = [ProductResponse(**doc_to_dict(d)) for d in docs]
    products.sort(key=lambda p: p.created_at or utc_now(), reverse=True)
    return products


instagram_router = APIRouter(prefix="/instagram", tags=["instagram"])


@instagram_router.get("", response_model=list[InstagramPostResponse])
async def list_instagram_posts():
    db = get_db()
    docs = (
        db.collection("instagram_posts")
        .where(filter=FieldFilter("active", "==", True))
        .stream()
    )
    posts = [InstagramPostResponse(**doc_to_dict(d)) for d in docs]
    posts.sort(key=lambda p: p.sort_order)
    return posts


@instagram_router.post("", response_model=InstagramPostResponse, status_code=201)
async def create_instagram_post(
    body: InstagramPostCreate,
    admin: Annotated[dict, Depends(require_admin)],
):
    db = get_db()
    _, ref = db.collection("instagram_posts").add(body.model_dump())
    data = body.model_dump()
    data["id"] = ref.id
    log_admin_action(admin["uid"], "instagram.create", "instagram_post", ref.id)
    return InstagramPostResponse(**data)


@instagram_router.delete("/{post_id}", status_code=204)
async def delete_instagram_post(
    post_id: str,
    admin: Annotated[dict, Depends(require_admin)],
):
    db = get_db()
    ref = db.collection("instagram_posts").document(post_id)
    if not ref.get().exists:
        raise HTTPException(404, "Post not found")
    ref.update({"active": False})
