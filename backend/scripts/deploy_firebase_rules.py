"""Deploy Firestore + Storage rules via Firebase Rules API (service account)."""

from __future__ import annotations

import os
import sys
import time
from pathlib import Path

import httpx
from google.auth.transport.requests import Request
from google.oauth2 import service_account

PROJECT_ID = os.environ.get("FIREBASE_PROJECT_ID", "dami-beauty-353b0")
STORAGE_BUCKET = os.environ.get(
    "FIREBASE_STORAGE_BUCKET", f"{PROJECT_ID}.firebasestorage.app"
)
ROOT = Path(__file__).resolve().parents[2]
RULES_DIR = ROOT / "firebase"
SCOPES = ["https://www.googleapis.com/auth/cloud-platform"]
API_BASE = "https://firebaserules.googleapis.com/v1"
MAX_RETRIES = 5


def request_with_retry(method: str, url: str, **kwargs) -> httpx.Response:
    last_error: Exception | None = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = httpx.request(method, url, **kwargs)
            return resp
        except httpx.HTTPError as exc:
            last_error = exc
            if attempt < MAX_RETRIES:
                wait = attempt * 2
                print(f"  network retry {attempt}/{MAX_RETRIES} in {wait}s...", file=sys.stderr)
                time.sleep(wait)
    raise RuntimeError(f"Network error after {MAX_RETRIES} attempts: {last_error}") from last_error


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


def create_ruleset(token: str, files: list[tuple[str, str]]) -> str:
    payload = {
        "source": {
            "files": [{"name": name, "content": content} for name, content in files]
        }
    }
    resp = request_with_retry(
        "POST",
        f"{API_BASE}/projects/{PROJECT_ID}/rulesets",
        headers={"Authorization": f"Bearer {token}"},
        json=payload,
        timeout=60,
    )
    if resp.status_code >= 400:
        raise RuntimeError(f"Create ruleset failed ({resp.status_code}): {resp.text}")
    return resp.json()["name"]


def publish_release(token: str, release_name: str, ruleset_name: str) -> None:
    headers = {"Authorization": f"Bearer {token}"}
    body = {"release": {"name": release_name, "rulesetName": ruleset_name}}

    patch = request_with_retry(
        "PATCH",
        f"{API_BASE}/{release_name}",
        headers=headers,
        json=body,
        timeout=60,
    )
    if patch.status_code < 400:
        return

    if patch.status_code != 404:
        raise RuntimeError(f"Update release failed ({patch.status_code}): {patch.text}")

    create = request_with_retry(
        "POST",
        f"{API_BASE}/projects/{PROJECT_ID}/releases",
        headers=headers,
        json={"name": release_name, "rulesetName": ruleset_name},
        timeout=60,
    )
    if create.status_code >= 400:
        raise RuntimeError(f"Create release failed ({create.status_code}): {create.text}")


def main() -> int:
    firestore_rules = (RULES_DIR / "firestore.rules").read_text(encoding="utf-8")
    storage_rules = (RULES_DIR / "storage.rules").read_text(encoding="utf-8")

    print(f"Project: {PROJECT_ID}")
    token = access_token()

    print("Creating Firestore ruleset...")
    firestore_ruleset = create_ruleset(token, [("firestore.rules", firestore_rules)])
    print(f"  ruleset: {firestore_ruleset}")

    print("Creating Storage ruleset...")
    storage_ruleset = create_ruleset(token, [("storage.rules", storage_rules)])
    print(f"  ruleset: {storage_ruleset}")

    firestore_release = f"projects/{PROJECT_ID}/releases/cloud.firestore"
    storage_release = f"projects/{PROJECT_ID}/releases/firebase.storage/{STORAGE_BUCKET}"

    print("Publishing Firestore rules...")
    publish_release(token, firestore_release, firestore_ruleset)

    print(f"Publishing Storage rules (bucket: {STORAGE_BUCKET})...")
    publish_release(token, storage_release, storage_ruleset)

    print("Done — Firestore + Storage rules deployed.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
