from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import PlainTextResponse
from google.cloud.firestore_v1 import FieldFilter

from app.core.firebase import get_db
from app.models.schemas import PayTRTokenRequest, PayTRTokenResponse
from app.services.paytr import PAYTR_IFRAME_URL, create_payment_token, verify_callback_hash
from app.api.orders import process_payment_success

router = APIRouter(prefix="/payment/paytr", tags=["payment"])


@router.post("/token", response_model=PayTRTokenResponse)
async def get_paytr_token(body: PayTRTokenRequest, request: Request):
    db = get_db()
    doc = db.collection("orders").document(body.order_id).get()
    if not doc.exists:
        raise HTTPException(404, "Order not found")

    data = doc.to_dict()
    if data.get("status") != "pending":
        raise HTTPException(400, "Order is not pending payment")

    addr = data.get("shipping_address", {})
    basket = []
    for item in data.get("items", []):
        price_tl = item["unit_price_try"] / 100
        basket.append([item["name_tr"], f"{price_tl:.2f}", item["quantity"]])

    if data.get("gift_wrap"):
        from app.core.config import settings
        basket.append(["Hediye Paketi", f"{settings.gift_wrap_price_try / 100:.2f}", 1])

    if data.get("shipping_try", 0) > 0:
        basket.append(["Kargo", f"{data['shipping_try'] / 100:.2f}", 1])

    user_ip = data.get("client_ip") or (request.client.host if request.client else "127.0.0.1")

    try:
        result = await create_payment_token(
            merchant_oid=data["paytr_merchant_oid"],
            email=addr.get("email", data.get("guest_email", "")),
            user_name=addr.get("full_name", "Müşteri"),
            user_address=addr.get("address_line", "Turkey"),
            user_phone=addr.get("phone", data.get("guest_phone", "")),
            payment_amount_kurus=data["total_try"],
            user_ip=user_ip,
            order_id=body.order_id,
            basket=basket,
        )
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc

    token = result["token"]
    return PayTRTokenResponse(token=token, iframe_url=f"{PAYTR_IFRAME_URL}/{token}")


@router.post("/callback")
async def paytr_callback(request: Request):
    form = await request.form()
    merchant_oid = form.get("merchant_oid", "")
    status = form.get("status", "")
    total_amount = form.get("total_amount", "")
    hash_value = form.get("hash", "")

    if not verify_callback_hash(str(merchant_oid), str(status), str(total_amount), str(hash_value)):
        return PlainTextResponse("PAYTR notification failed: bad hash", status_code=400)

    db = get_db()
    orders = (
        db.collection("orders")
        .where(filter=FieldFilter("paytr_merchant_oid", "==", merchant_oid))
        .limit(1)
        .stream()
    )

    order_id = None
    for doc in orders:
        order_id = doc.id
        break

    if not order_id:
        return PlainTextResponse("OK")

    # Log callback
    db.collection("orders").document(order_id).collection("paytr_callbacks").add(
        {
            "merchant_oid": merchant_oid,
            "status": status,
            "total_amount": total_amount,
            "raw": dict(form),
        }
    )

    if status == "success":
        await process_payment_success(order_id, str(merchant_oid))
    else:
        db.collection("orders").document(order_id).update(
            {"paytr_status": status, "status": "cancelled"}
        )

    return PlainTextResponse("OK")
