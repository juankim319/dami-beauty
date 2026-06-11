import pytest
from app.services.paytr import verify_callback_hash, generate_merchant_oid
from app.services.pricing import calculate_order_totals, calculate_shipping
from app.core.config import settings


def test_generate_merchant_oid_unique():
    a = generate_merchant_oid()
    b = generate_merchant_oid()
    assert a != b
    assert a.startswith("DB")


def test_calculate_shipping_free_above_threshold():
    assert calculate_shipping(settings.free_shipping_threshold_try) == 0
    assert calculate_shipping(settings.free_shipping_threshold_try - 1) == settings.default_shipping_try


def test_calculate_order_totals_with_gift_wrap():
    subtotal, shipping, total = calculate_order_totals(10000, gift_wrap=True)
    assert subtotal == 10000
    assert total == subtotal + shipping


def test_verify_callback_hash_without_credentials():
    # Without merchant key configured, hash verification uses empty key
    result = verify_callback_hash("DBTEST123", "success", "10000", "invalid")
    assert result is False
