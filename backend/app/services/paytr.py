import base64
import hashlib
import hmac
import json
import logging
import uuid
from typing import Any, Literal

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

PAYTR_IFRAME_URL = "https://www.paytr.com/odeme/guvenli"
PAYTR_GET_TOKEN_URL = "https://www.paytr.com/odeme/api/get-token"

PayTRMode = Literal["live", "test", "dev_mock", "unconfigured"]


def generate_merchant_oid() -> str:
    return f"DB{uuid.uuid4().hex[:16].upper()}"


def is_paytr_configured() -> bool:
    return bool(
        settings.paytr_merchant_id.strip()
        and settings.paytr_merchant_key.strip()
        and settings.paytr_merchant_salt.strip()
    )


def get_paytr_mode() -> PayTRMode:
    if is_paytr_configured():
        return "test" if settings.paytr_test_mode else "live"
    if settings.paytr_allow_dev_mock:
        return "dev_mock"
    return "unconfigured"


def get_paytr_callback_url() -> str:
    base = settings.backend_url.rstrip("/")
    return f"{base}{settings.api_v1_prefix}/payment/paytr/callback"


def _compute_token_hash(params: dict[str, str]) -> str:
    """PayTR iFrame API token hash (see dev.paytr.com/iframe-api/iframe-api-1-adim)."""
    hash_str = (
        params["merchant_id"]
        + params["user_ip"]
        + params["merchant_oid"]
        + params["email"]
        + params["payment_amount"]
        + params["user_basket"]
        + params["no_installment"]
        + params["max_installment"]
        + params["currency"]
        + params["test_mode"]
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
    if not is_paytr_configured():
        return False

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
) -> dict[str, Any]:
    mode = get_paytr_mode()

    if mode == "unconfigured":
        raise ValueError(
            "PayTR yapılandırılmadı. PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY ve "
            "PAYTR_MERCHANT_SALT değerlerini backend ortam değişkenlerine ekleyin."
        )

    if mode == "dev_mock":
        logger.warning("PayTR dev mock token used — set merchant credentials for real test mode")
        return {
            "status": "success",
            "token": "DEV_MOCK_" + merchant_oid,
            "dev_mock": True,
            "test_mode": False,
        }

    test_mode = "1" if settings.paytr_test_mode else "0"
    user_basket_b64 = base64.b64encode(
        json.dumps(basket, ensure_ascii=False).encode("utf-8")
    ).decode("utf-8")

    params = {
        "merchant_id": settings.paytr_merchant_id,
        "user_ip": user_ip,
        "merchant_oid": merchant_oid,
        "email": email,
        "payment_amount": str(payment_amount_kurus),
        "currency": "TL",
        "user_basket": user_basket_b64,
        "no_installment": "0",
        "max_installment": "0",
        "test_mode": test_mode,
        "merchant_ok_url": f"{settings.frontend_url}/order/{order_id}?status=success",
        "merchant_fail_url": f"{settings.frontend_url}/checkout?status=failed&order={order_id}",
        "user_name": user_name[:60],
        "user_address": user_address[:400],
        "user_phone": user_phone[:20],
        "debug_on": "1" if (settings.debug or settings.paytr_test_mode) else "0",
        "timeout_limit": "30",
        "lang": "tr",
        "iframe_v2": "1",
        "iframe_v2_dark": "0",
    }
    params["paytr_token"] = _compute_token_hash(params)

    logger.info(
        "PayTR get-token request mode=%s oid=%s amount=%s",
        "test" if settings.paytr_test_mode else "live",
        merchant_oid,
        payment_amount_kurus,
    )

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(PAYTR_GET_TOKEN_URL, data=params)

    try:
        result = response.json()
    except Exception as exc:
        raise ValueError(f"PayTR yanıtı okunamadı (HTTP {response.status_code})") from exc

    if result.get("status") != "success":
        reason = result.get("reason", "PayTR token request failed")
        logger.error("PayTR get-token failed: %s", reason)
        raise ValueError(reason)

    result["dev_mock"] = False
    result["test_mode"] = settings.paytr_test_mode
    return result
