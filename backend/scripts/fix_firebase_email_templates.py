"""Fix Firebase Auth email templates (invalid replyTo, Korean copy)."""

from __future__ import annotations

import os
import sys
from pathlib import Path

import httpx
from google.auth.transport.requests import Request
from google.oauth2 import service_account

PROJECT_ID = os.environ.get("FIREBASE_PROJECT_ID", "dami-beauty-353b0")
API = "https://identitytoolkit.googleapis.com/admin/v2"
REPLY_TO = f"noreply@{PROJECT_ID}.firebaseapp.com"

RESET_BODY = """<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
<h2 style="color:#4A0E23">DAMI BEAUTY</h2>
<p>Merhaba,</p>
<p><strong>%EMAIL%</strong> hesabınız için şifre sıfırlama talebinde bulundunuz.</p>
<p><a href="%LINK%" style="display:inline-block;background:#4A0E23;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px">Şifremi Sıfırla</a></p>
<p style="color:#888;font-size:12px">Bu talebi siz yapmadıysanız bu e-postayı yok sayabilirsiniz.</p>
<p style="color:#888;font-size:12px">Dami Beauty</p>
</div>"""

VERIFY_BODY = """<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
<h2 style="color:#4A0E23">DAMI BEAUTY</h2>
<p>Merhaba %DISPLAY_NAME%,</p>
<p>Dami Beauty'e hoş geldiniz! E-posta adresinizi doğrulamak için aşağıdaki butona tıklayın.</p>
<p><a href="%LINK%" style="display:inline-block;background:#4A0E23;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px">E-postamı Doğrula</a></p>
<p style="color:#888;font-size:12px">Bu talebi siz yapmadıysanız bu e-postayı yok sayabilirsiniz.</p>
<p style="color:#888;font-size:12px">Dami Beauty</p>
</div>"""


def token() -> str:
    raw = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "./service-account-dev.json")
    path = Path(raw)
    if not path.is_absolute():
        path = Path(__file__).resolve().parents[1] / path
    creds = service_account.Credentials.from_service_account_file(
        str(path), scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    creds.refresh(Request())
    if not creds.token:
        raise RuntimeError("No access token")
    return creds.token


def main() -> None:
    t = token()
    headers = {
        "Authorization": f"Bearer {t}",
        "Content-Type": "application/json",
        "X-Goog-User-Project": PROJECT_ID,
    }

    payload = {
        "notification": {
            "sendEmail": {
                "resetPasswordTemplate": {
                    "senderLocalPart": "noreply",
                    "subject": "[DAMI BEAUTY] Şifre Sıfırlama",
                    "body": RESET_BODY,
                    "bodyFormat": "HTML",
                    "replyTo": REPLY_TO,
                },
                "verifyEmailTemplate": {
                    "senderLocalPart": "noreply",
                    "subject": "[DAMI BEAUTY] E-posta Doğrulama",
                    "body": VERIFY_BODY,
                    "bodyFormat": "HTML",
                    "replyTo": REPLY_TO,
                },
            },
            "defaultLocale": "tr",
        }
    }

    mask = (
        "notification.sendEmail.resetPasswordTemplate.subject,"
        "notification.sendEmail.resetPasswordTemplate.body,"
        "notification.sendEmail.resetPasswordTemplate.replyTo,"
        "notification.sendEmail.verifyEmailTemplate.subject,"
        "notification.sendEmail.verifyEmailTemplate.body,"
        "notification.sendEmail.verifyEmailTemplate.replyTo,"
        "notification.defaultLocale"
    )

    resp = httpx.patch(
        f"{API}/projects/{PROJECT_ID}/config?updateMask={mask}",
        headers=headers,
        json=payload,
        timeout=30,
    )
    if resp.status_code >= 400:
        raise RuntimeError(f"Patch failed ({resp.status_code}): {resp.text}")

    print("Firebase email templates updated (Turkish + fixed replyTo).")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)
