import base64
import hashlib
import hmac
import uuid
from typing import Any

import httpx

from app.core.config import settings


PAYTR_IFRAME_URL = "https://www.paytr.com/odeme/guvenli"


def generate_merchant_oid() -> str:
    return f"DB{uuid.uuid4().hex[:16].upper()}"


def _compute_token_hash(params: dict[str, str]) -> str:
    hash_str = (
        params["merchant_id"]
        + params["user_ip"]
        + params["merchant_oid"]
        + params["email"]
        + params["payment_amount"]
        + params["payment_type"]
        + params["installment_count"]
        + params["currency"]
        + params["test_mode"]
        + params["non_3d"]
    )
    paytr_token = hash_str + settings.paytr_merchant_salt
    token = base64.b64encode(
        hmac.new(
            settings.paytr_merchant_key.encode("utf-8"),
            paytr_token.encode("utf-8"),
            hashlib.sha256,
        ).digest()
    ).decode("utf-8")
    return token


def verify_callback_hash(
    merchant_oid: str,
    status: str,
    total_amount: str,
    received_hash: str,
) -> bool:
    hash_str = merchant_oid + settings.paytr_merchant_salt + status + total_amount
    expected = base64.b64encode(
        hmac.new(
            settings.paytr_merchant_key.encode("utf-8"),
            hash_str.encode("utf-8"),
            hashlib.sha256,
        ).digest()
    ).decode("utf-8")
    return hmac.compare_digest(expected, received_hash)


async def create_payment_token(
    *,
    merchant_oid: str,
    email: str,
    user_name: str,
    user_address: str,
    user_phone: str,
    payment_amount_kurus: int,
    user_ip: str,
    order_id: str,
    basket: list[list[Any]],
) -> dict[str, str]:
    if not settings.paytr_merchant_id:
        # Dev mode mock token
        return {
            "status": "success",
            "token": "TEST_TOKEN_" + merchant_oid,
        }

    import json

    test_mode = "1" if settings.paytr_test_mode else "0"
    params = {
        "merchant_id": settings.paytr_merchant_id,
        "user_ip": user_ip,
        "merchant_oid": merchant_oid,
        "email": email,
        "payment_amount": str(payment_amount_kurus),
        "payment_type": "card",
        "installment_count": "0",
        "currency": "TL",
        "test_mode": test_mode,
        "non_3d": "0",
        "merchant_ok_url": f"{settings.frontend_url}/order/{order_id}?status=success",
        "merchant_fail_url": f"{settings.frontend_url}/checkout?status=failed&order={order_id}",
        "user_name": user_name[:60],
        "user_address": user_address[:400],
        "user_phone": user_phone[:20],
        "user_basket": base64.b64encode(
            json.dumps(basket, ensure_ascii=False).encode("utf-8")
        ).decode("utf-8"),
        "debug_on": "1" if settings.debug else "0",
        "lang": "tr",
    }
    params["paytr_token"] = _compute_token_hash(params)

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://www.paytr.com/odeme/api/get-token",
            data=params,
        )
        result = response.json()

    if result.get("status") != "success":
        reason = result.get("reason", "PayTR token request failed")
        raise ValueError(reason)

    return result
