from datetime import datetime, timezone

from app.core.firebase import get_db


def log_admin_action(
    admin_uid: str,
    action: str,
    resource_type: str,
    resource_id: str,
    details: dict | None = None,
) -> None:
    db = get_db()
    db.collection("admin_audit").add(
        {
            "admin_uid": admin_uid,
            "action": action,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "details": details or {},
            "created_at": datetime.now(timezone.utc),
        }
    )
