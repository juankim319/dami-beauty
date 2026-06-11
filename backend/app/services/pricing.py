from app.core.config import settings


def calculate_shipping(subtotal_try: int) -> int:
    if subtotal_try >= settings.free_shipping_threshold_try:
        return 0
    return settings.default_shipping_try


def calculate_order_totals(
    subtotal_try: int,
    gift_wrap: bool = False,
) -> tuple[int, int, int]:
    shipping = calculate_shipping(subtotal_try)
    gift_wrap_cost = settings.gift_wrap_price_try if gift_wrap else 0
    total = subtotal_try + shipping + gift_wrap_cost
    return subtotal_try, shipping + gift_wrap_cost, total
