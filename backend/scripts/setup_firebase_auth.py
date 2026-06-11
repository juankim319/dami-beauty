"""Add Vercel (or other) hosts to Firebase Auth authorized domains."""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

import httpx
from google.auth.transport.requests import Request
from google.oauth2 import service_account

PROJECT_ID = os.environ.get("FIREBASE_PROJECT_ID", "dami-beauty-353b0")
SCOPES = ["https://www.googleapis.com/auth/cloud-platform"]
API = "https://identitytoolkit.googleapis.com/admin/v2"


def credentials_path() -> Path:
    raw = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "./service-account-dev.json")
    path = Path(raw)
    if not path.is_absolute():
        path = Path(__file__).resolve().parents[1] / path
    if not path.exists():
        raise FileNotFoundError(f"Service account not found: {path}")
    return path


def access_token() -> str:
    creds = service_account.Credentials.from_service_account_file(
        str(credentials_path()), scopes=SCOPES
    )
    creds.refresh(Request())
    if not creds.token:
        raise RuntimeError("Failed to obtain access token")
    return creds.token


def get_config(token: str) -> dict:
    resp = httpx.get(
        f"{API}/projects/{PROJECT_ID}/config",
        headers={"Authorization": f"Bearer {token}"},
        timeout=30,
    )
    if resp.status_code == 404:
        return {}
    if resp.status_code >= 400:
        raise RuntimeError(f"Get config failed ({resp.status_code}): {resp.text}")
    return resp.json()


def ensure_auth_enabled(token: str) -> None:
    """Initialize Identity Platform and enable email/password sign-in."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "X-Goog-User-Project": PROJECT_ID,
    }
    init = httpx.post(
        f"https://identitytoolkit.googleapis.com/v2/projects/{PROJECT_ID}/identityPlatform:initializeAuth",
        headers=headers,
        json={},
        timeout=30,
    )
    if init.status_code not in (200, 204, 409):
        print(f"Note: initializeAuth ({init.status_code}): {init.text[:200]}")

    patch = httpx.patch(
        f"{API}/projects/{PROJECT_ID}/config?updateMask=signIn.email.enabled",
        headers=headers,
        json={"signIn": {"email": {"enabled": True}}},
        timeout=30,
    )
    if patch.status_code >= 400:
        raise RuntimeError(f"Enable email sign-in failed ({patch.status_code}): {patch.text}")
    print("Email/password sign-in enabled.")


def add_domains(token: str, domains: list[str]) -> list[str]:
    config = get_config(token)
    current = list(config.get("authorizedDomains") or [])
    merged = current[:]
    added: list[str] = []
    for domain in domains:
        domain = domain.strip().lower()
        if domain and domain not in merged:
            merged.append(domain)
            added.append(domain)
    if not added:
        print("No new domains to add.")
        return merged

    resp = httpx.patch(
        f"{API}/projects/{PROJECT_ID}/config?updateMask=authorizedDomains",
        headers={"Authorization": f"Bearer {token}"},
        json={"authorizedDomains": merged},
        timeout=30,
    )
    if resp.status_code >= 400:
        raise RuntimeError(f"Update config failed ({resp.status_code}): {resp.text}")

    print("Added authorized domains:", ", ".join(added))
    return merged


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "domains",
        nargs="*",
        default=["dami-beauty.vercel.app", "localhost"],
        help="Hostnames to authorize (default: dami-beauty.vercel.app localhost)",
    )
    args = parser.parse_args()

    token = access_token()
    ensure_auth_enabled(token)
    final = add_domains(token, args.domains)
    print("Authorized domains:", ", ".join(final))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)
