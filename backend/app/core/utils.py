from datetime import datetime, timezone
from typing import Any

from google.cloud.firestore_v1 import DocumentSnapshot


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def doc_to_dict(doc: DocumentSnapshot) -> dict[str, Any]:
    data = doc.to_dict() or {}
    data["id"] = doc.id
    for key in ("created_at", "updated_at", "start_at", "end_at", "paid_at"):
        if key in data and data[key] is not None:
            data[key] = data[key]
    return data


def slugify(text: str) -> str:
    import re
    import unicodedata

    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^\w\s-]", "", text.lower())
    return re.sub(r"[-\s]+", "-", text).strip("-")
