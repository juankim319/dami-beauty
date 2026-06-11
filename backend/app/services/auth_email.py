"""Auth-related emails: password reset & email verification."""

from __future__ import annotations

import logging

import httpx
from firebase_admin import auth
from firebase_admin.auth import ActionCodeSettings

from app.core.firebase import _init_firebase_app
from app.core.config import settings
from app.services.email import send_html_email

logger = logging.getLogger(__name__)


def _ensure_firebase() -> None:
    _init_firebase_app()


def _action_settings() -> ActionCodeSettings:
    return ActionCodeSettings(
        url=f"{settings.frontend_url.rstrip('/')}/",
        handle_code_in_app=False,
    )


async def send_password_reset_email(to_email: str) -> str:
    """Send password reset. Returns delivery method: sendgrid | firebase."""
    _ensure_firebase()
    email = to_email.strip().lower()

    if settings.sendgrid_api_key:
        try:
            link = auth.generate_password_reset_link(email, _action_settings())
            html = f"""
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
              <h2 style="color:#4A0E23">DAMI BEAUTY</h2>
              <p>Merhaba,</p>
              <p>Şifre sıfırlama talebinde bulundunuz.</p>
              <p><a href="{link}" style="display:inline-block;background:#4A0E23;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px">Şifremi Sıfırla</a></p>
              <p style="color:#888;font-size:12px">Bu talebi siz yapmadıysanız bu e-postayı yok sayabilirsiniz.</p>
            </div>
            """
            if await send_html_email(email, "[DAMI BEAUTY] Şifre Sıfırlama", html):
                return "sendgrid"
        except auth.UserNotFoundError:
            return "sendgrid"
        except Exception as exc:
            logger.warning("SendGrid password reset failed: %s", exc)

    if not settings.firebase_web_api_key:
        raise RuntimeError("Email service not configured")

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(
            f"https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={settings.firebase_web_api_key}",
            json={
                "requestType": "PASSWORD_RESET",
                "email": email,
                "continueUrl": f"{settings.frontend_url.rstrip('/')}/",
            },
        )
        if resp.status_code >= 400:
            detail = resp.json().get("error", {}).get("message", resp.text)
            logger.error("Firebase password reset failed: %s", detail)
            raise RuntimeError(detail)
    return "firebase"


async def send_verification_email_for_user(uid: str) -> str:
    """Send verification email via SendGrid + Admin SDK link."""
    _ensure_firebase()
    user = auth.get_user(uid)
    if not user.email:
        raise ValueError("User has no email")

    if not settings.sendgrid_api_key:
        raise RuntimeError("SendGrid not configured — use client verification")

    link = auth.generate_email_verification_link(user.email, _action_settings())
    name = user.display_name or "Değerli Müşterimiz"
    html = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h2 style="color:#4A0E23">DAMI BEAUTY</h2>
      <p>Merhaba {name},</p>
      <p>Dami Beauty'e hoş geldiniz! E-posta adresinizi doğrulamak için aşağıdaki butona tıklayın.</p>
      <p><a href="{link}" style="display:inline-block;background:#4A0E23;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px">E-postamı Doğrula</a></p>
      <p style="color:#888;font-size:12px">Bu talebi siz yapmadıysanız bu e-postayı yok sayabilirsiniz.</p>
    </div>
    """
    if await send_html_email(user.email, "[DAMI BEAUTY] E-posta Doğrulama", html):
        return "sendgrid"
    raise RuntimeError("Failed to send verification email")


async def send_verification_via_firebase(id_token: str) -> str:
    """Fallback: trigger Firebase built-in verification email."""
    if not settings.firebase_web_api_key:
        raise RuntimeError("Email service not configured")

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(
            f"https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={settings.firebase_web_api_key}",
            json={"requestType": "VERIFY_EMAIL", "idToken": id_token},
        )
        if resp.status_code >= 400:
            detail = resp.json().get("error", {}).get("message", resp.text)
            raise RuntimeError(detail)
    return "firebase"
