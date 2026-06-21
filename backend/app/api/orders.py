from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from google.cloud.firestore_v1 import FieldFilter

from app.core.firebase import get_db
from app.core.security import get_current_user, require_admin
from app.core.utils import doc_to_dict, utc_now
from app.models.schemas import (
    OrderAdminUpdate,
    OrderCreate,
    OrderResponse,
    OrderStatus,
    OrderStatusUpdate,
)
from app.services.email import send_order_confirmation_email
from app.services.inventory import decrement_stock, increment_stock
from app.services.paytr import generate_merchant_oid
from app.services.pricing import calculate_order_totals
from app.core.client_ip import get_client_ip

router = APIRouter(prefix="/orders", tags=["orders"])


def _serialize_order(data: dict) -> OrderResponse:
    return OrderResponse(**data)


async def _build_order_items(items_input: list) -> tuple[list[dict], int]:
    db = get_db()
    order_items = []
    subtotal = 0

    for item in items_input:
        product_ref = db.collection("products").document(item.product_id)
        product_doc = product_ref.get()
        if not product_doc.exists:
            raise HTTPException(404, f"Product {item.product_id} not found")

        product = product_doc.to_dict()
        variant = None
        for v in product.get("variants", []):
            if v.get("sku") == item.variant_sku:
                variant = v
                break

        if not variant:
            raise HTTPException(400, f"Variant {item.variant_sku} not found")

        if variant.get("stock", 0) < item.quantity:
            raise HTTPException(400, f"Insufficient stock for {product.get('name_tr')}")

        unit_price = variant.get("price_try", product.get("base_price_try", 0))
        order_items.append(
            {
                "product_id": item.product_id,
                "variant_sku": item.variant_sku,
                "name_tr": product.get("name_tr"),
                "quantity": item.quantity,
                "unit_price_try": unit_price,
                "options": variant.get("options", {}),
            }
        )
        subtotal += unit_price * item.quantity

    return order_items, subtotal


@router.post("", response_model=OrderResponse, status_code=201)
async def create_order(
    body: OrderCreate,
    request: Request,
    user: Annotated[dict | None, Depends(get_current_user)] = None,
):
    order_items, subtotal = await _build_order_items(body.items)
    subtotal_try, shipping_try, total_try = calculate_order_totals(subtotal, body.gift_wrap)

    merchant_oid = generate_merchant_oid()
    now = utc_now()

    order_data = {
        "user_id": (user or {}).get("uid") or body.user_id,
        "guest_email": body.shipping_address.email,
        "guest_phone": body.shipping_address.phone,
        "items": order_items,
        "subtotal_try": subtotal_try,
        "shipping_try": shipping_try,
        "total_try": total_try,
        "shipping_address": body.shipping_address.model_dump(),
        "status": OrderStatus.PENDING.value,
        "gift_wrap": body.gift_wrap,
        "gift_message": body.gift_message,
        "customer_notes": body.customer_notes,
        "paytr_merchant_oid": merchant_oid,
        "paytr_status": None,
        "tracking_number": None,
        "notes": None,
        "created_at": now,
        "paid_at": None,
        "client_ip": get_client_ip(request),
    }

    db = get_db()
    _, ref = db.collection("orders").add(order_data)
    order_data["id"] = ref.id
    return _serialize_order(order_data)


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    user: Annotated[dict | None, Depends(get_current_user)] = None,
):
    db = get_db()
    doc = db.collection("orders").document(order_id).get()
    if not doc.exists:
        raise HTTPException(404, "Order not found")

    data = doc_to_dict(doc)
    if user and user.get("role") != "admin":
        if data.get("user_id") and data.get("user_id") != user.get("uid"):
            raise HTTPException(403, "Access denied")

    return _serialize_order(data)


@router.get("", response_model=list[OrderResponse])
async def list_orders(admin: Annotated[dict, Depends(require_admin)]):
    db = get_db()
    docs = db.collection("orders").order_by("created_at", direction="DESCENDING").limit(100).stream()
    return [_serialize_order(doc_to_dict(d)) for d in docs]


@router.patch("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: str,
    body: OrderAdminUpdate,
    admin: Annotated[dict, Depends(require_admin)],
):
    db = get_db()
    ref = db.collection("orders").document(order_id)
    doc = ref.get()
    if not doc.exists:
        raise HTTPException(404, "Order not found")

    updates = {k: v for k, v in body.model_dump(exclude_unset=True).items()}
    if "shipping_address" in updates and updates["shipping_address"] is not None:
        updates["shipping_address"] = body.shipping_address.model_dump()

    if not updates:
        raise HTTPException(400, "No fields to update")

    ref.update(updates)
    log_admin_action(admin["uid"], "order.update", "order", order_id, updates)
    return _serialize_order(doc_to_dict(ref.get()))


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: str,
    body: OrderStatusUpdate,
    admin: Annotated[dict, Depends(require_admin)],
):
    db = get_db()
    ref = db.collection("orders").document(order_id)
    doc = ref.get()
    if not doc.exists:
        raise HTTPException(404, "Order not found")

    updates: dict = {"status": body.status.value}
    if body.tracking_number is not None:
        updates["tracking_number"] = body.tracking_number
    if body.notes is not None:
        updates["notes"] = body.notes

    ref.update(updates)
    log_admin_action(
        admin["uid"],
        "order.status_change",
        "order",
        order_id,
        {"new_status": body.status.value},
    )
    return _serialize_order(doc_to_dict(ref.get()))


_STOCK_RESTORED_STATUSES = {
    OrderStatus.PAID.value,
    OrderStatus.PROCESSING.value,
    OrderStatus.SHIPPED.value,
    OrderStatus.DELIVERED.value,
}


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(
    order_id: str,
    admin: Annotated[dict, Depends(require_admin)],
):
    db = get_db()
    ref = db.collection("orders").document(order_id)
    doc = ref.get()
    if not doc.exists:
        raise HTTPException(404, "Order not found")

    data = doc.to_dict() or {}
    if data.get("status") in _STOCK_RESTORED_STATUSES:
        for item in data.get("items", []):
            increment_stock(item["product_id"], item["variant_sku"], item["quantity"])

    ref.delete()
    log_admin_action(
        admin["uid"],
        "order.delete",
        "order",
        order_id,
        {"status": data.get("status"), "total_try": data.get("total_try")},
    )


async def process_payment_success(order_id: str, merchant_oid: str) -> bool:
    db = get_db()
    ref = db.collection("orders").document(order_id)
    doc = ref.get()
    if not doc.exists:
        return False

    data = doc.to_dict()
    if data.get("status") == OrderStatus.PAID.value:
        return True  # Idempotent

    if data.get("paytr_merchant_oid") != merchant_oid:
        return False

    for item in data.get("items", []):
        ok = decrement_stock(item["product_id"], item["variant_sku"], item["quantity"])
        if not ok:
            ref.update({"status": OrderStatus.CANCELLED.value, "notes": "Stock deduction failed"})
            return False

    now = utc_now()
    ref.update(
        {
            "status": OrderStatus.PAID.value,
            "paytr_status": "success",
            "paid_at": now,
        }
    )

    addr = data.get("shipping_address", {})
    await send_order_confirmation_email(
        to_email=data.get("guest_email", addr.get("email", "")),
        order_id=order_id,
        total_try=data.get("total_try", 0),
        customer_name=addr.get("full_name", "Müşteri"),
    )
    return True
