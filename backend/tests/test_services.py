import pytest
from unittest.mock import patch

from app.services.paytr import (
    generate_merchant_oid,
    get_paytr_callback_url,
    get_paytr_mode,
    is_paytr_configured,
    verify_callback_hash,
)
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
    result = verify_callback_hash("DBTEST123", "success", "10000", "invalid")
    assert result is False


def test_is_paytr_configured_requires_all_three():
    with patch.object(settings, "paytr_merchant_id", "123"):
        with patch.object(settings, "paytr_merchant_key", ""):
            with patch.object(settings, "paytr_merchant_salt", "salt"):
                assert is_paytr_configured() is False


def test_get_paytr_mode_test_when_configured():
    with patch.object(settings, "paytr_merchant_id", "123"):
        with patch.object(settings, "paytr_merchant_key", "key"):
            with patch.object(settings, "paytr_merchant_salt", "salt"):
                with patch.object(settings, "paytr_test_mode", True):
                    with patch.object(settings, "paytr_allow_dev_mock", False):
                        assert get_paytr_mode() == "test"


def test_get_paytr_mode_unconfigured_by_default():
    with patch.object(settings, "paytr_merchant_id", ""):
        with patch.object(settings, "paytr_allow_dev_mock", False):
            assert get_paytr_mode() == "unconfigured"


def test_get_paytr_mode_dev_mock_when_allowed():
    with patch.object(settings, "paytr_merchant_id", ""):
        with patch.object(settings, "paytr_allow_dev_mock", True):
            assert get_paytr_mode() == "dev_mock"


def test_get_paytr_callback_url():
    with patch.object(settings, "backend_url", "https://api.example.com"):
        url = get_paytr_callback_url()
        assert url.endswith("/api/v1/payment/paytr/callback")
