import httpx

from app.core.config import settings


async def send_html_email(to_email: str, subject: str, html: str) -> bool:
    if not settings.sendgrid_api_key:
        return False

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(
            "https://api.sendgrid.com/v3/mail/send",
            headers={
                "Authorization": f"Bearer {settings.sendgrid_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "personalizations": [{"to": [{"email": to_email}]}],
                "from": {"email": settings.from_email, "name": "Dami Beauty"},
                "subject": subject,
                "content": [{"type": "text/html", "value": html}],
            },
        )
        return response.status_code in (200, 202)


async def send_order_confirmation_email(
    to_email: str,
    order_id: str,
    total_try: int,
    customer_name: str,
) -> bool:
    total_display = f"₺{total_try / 100:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

    html = f"""
    <h2>Siparişiniz Alındı!</h2>
    <p>Merhaba {customer_name},</p>
    <p>Sipariş numaranız: <strong>{order_id}</strong></p>
    <p>Toplam: <strong>{total_display}</strong></p>
    <p>En kısa sürede hazırlayıp kargoya vereceğiz.</p>
    <p>Sevgiler,<br>Dami Beauty</p>
    """

    return await send_html_email(to_email, f"Sipariş Onayı — #{order_id[:8].upper()}", html)
