"""Deploy backend to Railway with Firebase credentials from local JSON file."""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
SA_FILE = BACKEND_ROOT / "service-account-dev.json"


def run(cmd: list[str], *, cwd: Path | None = None, env: dict | None = None) -> None:
    print(f"$ {' '.join(cmd[:4])}...")
    subprocess.run(cmd, cwd=cwd or BACKEND_ROOT, check=True, env=env)


def railway(*args: str) -> None:
    cmd = ["npx.cmd", "--yes", "@railway/cli", *args]
    run(cmd, env=os.environ.copy())


def main() -> int:
    if not SA_FILE.exists():
        print(f"ERROR: {SA_FILE} not found", file=sys.stderr)
        return 1

    sa_json = json.dumps(json.loads(SA_FILE.read_text(encoding="utf-8")))

    print("=== Railway backend deploy ===\n")

    try:
        railway("whoami")
    except subprocess.CalledProcessError:
        if os.environ.get("RAILWAY_TOKEN"):
            print("RAILWAY_TOKEN set but whoami failed — check token.")
            return 1
        print("Not logged in. Login with dongzino319@gmail.com:")
        railway("login")

    print("Logged in as (see above).")

    linked = (BACKEND_ROOT / ".railway").exists()
    cfg = Path.home() / ".railway" / "config.json"
    if cfg.exists():
        import json as _json
        data = _json.loads(cfg.read_text(encoding="utf-8"))
        projects = data.get("projects", {})
        linked = linked or str(BACKEND_ROOT) in projects

    if not linked:
        railway("init", "--name", "dami-beauty-api")

    env = {
        "APP_ENV": "production",
        "DEBUG": "false",
        "USE_MOCK_DB": "false",
        "FIREBASE_PROJECT_ID": "dami-beauty-353b0",
        "CORS_ALLOW_VERCEL": "true",
        "PAYTR_TEST_MODE": "true",
        "PAYTR_ALLOW_DEV_MOCK": "false",
        "BACKEND_URL": "https://dami-beauty-api-production.up.railway.app",
        "FRONTEND_URL": "https://dami-beauty.vercel.app",
        "FIREBASE_WEB_API_KEY": "AIzaSyDqrhqJY1YKRnmy-3tBldJODPeC-al17EQ",
        "FREE_SHIPPING_THRESHOLD_TRY": "99999",
        "FIREBASE_SERVICE_ACCOUNT_JSON": sa_json,
    }
    service = "dami-beauty-api"
    for key, value in env.items():
        railway("variables", "set", f"{key}={value}", "--service", service)

    railway("up", "--detach", "--service", service)

    print("\n=== Public URL (run if empty) ===")
    try:
        result = subprocess.run(
            ["npx.cmd", "--yes", "@railway/cli", "domain"],
            cwd=BACKEND_ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        print(result.stdout or result.stderr)
    except Exception:
        print("Run: npx.cmd @railway/cli domain")

    print("\nHealth check: https://YOUR-URL.up.railway.app/health")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
