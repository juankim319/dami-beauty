import json
import logging
import os
from functools import lru_cache
from pathlib import Path
from typing import Any

import firebase_admin
from firebase_admin import credentials, firestore

from app.core.config import settings

logger = logging.getLogger(__name__)

BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent


def _resolve_credentials_path() -> Path | None:
    raw = settings.google_application_credentials or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not raw:
        return None
    path = Path(raw)
    if not path.is_absolute():
        path = BACKEND_ROOT / raw.lstrip("./")
    return path if path.is_file() else None


def _load_service_account_dict() -> dict | None:
    raw = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON") or settings.firebase_service_account_json
    if not raw:
        return None
    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise RuntimeError("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON") from exc


def _init_firebase_app() -> None:
    if firebase_admin._apps:
        return

    cred_path = _resolve_credentials_path()
    if cred_path:
        cred = credentials.Certificate(str(cred_path))
        firebase_admin.initialize_app(cred, options={"projectId": settings.firebase_project_id})
        logger.info("Firebase initialized with service account file: %s", cred_path.name)
        return

    sa_dict = _load_service_account_dict()
    if sa_dict:
        cred = credentials.Certificate(sa_dict)
        firebase_admin.initialize_app(cred, options={"projectId": settings.firebase_project_id})
        logger.info("Firebase initialized with FIREBASE_SERVICE_ACCOUNT_JSON env")
        return

    if settings.use_mock_db:
        return

    # Cloud Run / GCP: Application Default Credentials
    try:
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred, options={"projectId": settings.firebase_project_id})
        logger.info("Firebase initialized with Application Default Credentials")
    except Exception as exc:
        raise RuntimeError(
            "Firebase credentials missing. Set GOOGLE_APPLICATION_CREDENTIALS, "
            "FIREBASE_SERVICE_ACCOUNT_JSON, or USE_MOCK_DB=true"
        ) from exc


@lru_cache
def init_firebase() -> Any:
    cred_path = _resolve_credentials_path()
    sa_dict = _load_service_account_dict()
    has_file_or_json = bool(cred_path or sa_dict)

    if has_file_or_json or not settings.use_mock_db:
        _init_firebase_app()
        return firestore.client()

    if settings.use_mock_db:
        from app.core.memory_db import get_memory_db

        logger.warning(
            "Firebase credentials not found — using in-memory mock database."
        )
        return get_memory_db()

    raise RuntimeError("Firebase credentials missing and USE_MOCK_DB=false")


def get_db() -> Any:
    return init_firebase()


def get_db_mode() -> str:
    if _resolve_credentials_path() or _load_service_account_dict():
        return "firebase"
    if settings.use_mock_db:
        return "mock"
    try:
        _init_firebase_app()
        return "firebase"
    except Exception:
        return "unconfigured"
