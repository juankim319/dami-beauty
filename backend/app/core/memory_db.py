"""In-memory Firestore substitute for local dev without Firebase credentials."""

from __future__ import annotations

import copy
import uuid
from datetime import datetime, timezone
from typing import Any, Iterator

from app.core.seed_samples import seed_memory_db


class MemorySnapshot:
    def __init__(self, doc_id: str, data: dict[str, Any] | None, exists: bool = True):
        self.id = doc_id
        self._data = data
        self.exists = exists

    def to_dict(self) -> dict[str, Any] | None:
        return copy.deepcopy(self._data) if self._data is not None else None


class MemoryDocumentRef:
    def __init__(self, store: MemoryStore, collection: str, doc_id: str):
        self._store = store
        self._collection = collection
        self._doc_id = doc_id
        self.id = doc_id

    def get(self, transaction=None) -> MemorySnapshot:
        data = self._store._get_doc(self._collection, self._doc_id)
        return MemorySnapshot(self._doc_id, data, data is not None)

    def update(self, updates: dict[str, Any]) -> None:
        self._store._update_doc(self._collection, self._doc_id, updates)

    def delete(self) -> None:
        self._store._delete_doc(self._collection, self._doc_id)

    def collection(self, name: str) -> MemoryCollection:
        path = f"{self._collection}/{self._doc_id}/{name}"
        return MemoryCollection(self._store, path)


class MemoryQuery:
    def __init__(self, store: MemoryStore, collection: str):
        self._store = store
        self._collection = collection
        self._filters: list[tuple[str, str, Any]] = []
        self._order_field: str | None = None
        self._order_desc = False
        self._limit: int | None = None

    def where(self, filter=None, **kwargs) -> MemoryQuery:
        q = copy.copy(self)
        if filter is not None:
            q._filters = self._filters + [
                (filter.field_path, filter.op_string, filter.value)
            ]
        elif kwargs:
            field, op, value = kwargs.get("field_path"), kwargs.get("op_string"), kwargs.get("value")
            if field is None and len(kwargs) == 3:
                # legacy: not used in our code with kwargs dict
                pass
        # legacy positional: .where("active", "==", True)
        return q

    def _where_legacy(self, field: str, op: str, value: Any) -> MemoryQuery:
        q = copy.copy(self)
        q._filters = self._filters + [(field, op, value)]
        return q

    def order_by(self, field: str, direction=None) -> MemoryQuery:
        q = copy.copy(self)
        q._order_field = field
        desc = direction
        if desc is not None and str(desc).endswith("DESCENDING"):
            q._order_desc = True
        elif desc == "DESCENDING":
            q._order_desc = True
        else:
            q._order_desc = self._order_desc
        return q

    def limit(self, n: int) -> MemoryQuery:
        q = copy.copy(self)
        q._limit = n
        return q

    def stream(self) -> Iterator[MemorySnapshot]:
        docs = self._store._query(
            self._collection,
            self._filters,
            self._order_field,
            self._order_desc,
            self._limit,
        )
        for doc_id, data in docs:
            yield MemorySnapshot(doc_id, data)


class MemoryCollection:
    def __init__(self, store: MemoryStore, name: str):
        self._store = store
        self._name = name

    def where(self, filter=None, field_path=None, op_string=None, value=None, **kwargs) -> MemoryQuery:
        q = MemoryQuery(self._store, self._name)
        if filter is not None:
            return q.where(filter=filter)
        if field_path and op_string is not None:
            return MemoryQuery(self._store, self._name)._where_legacy(field_path, op_string, value)
        # Support .where("active", "==", True) via *args - handled below
        return q

    def __getattr__(self, name: str):
        raise AttributeError(name)

    def _where_three(self, field: str, op: str, value: Any) -> MemoryQuery:
        q = MemoryQuery(self._store, self._name)
        q._filters = [(field, op, value)]
        return q

    def order_by(self, *args, **kwargs) -> MemoryQuery:
        return MemoryQuery(self._store, self._name).order_by(*args, **kwargs)

    def limit(self, n: int) -> MemoryQuery:
        return MemoryQuery(self._store, self._name).limit(n)

    def stream(self) -> Iterator[MemorySnapshot]:
        return MemoryQuery(self._store, self._name).stream()

    def add(self, data: dict[str, Any]) -> tuple[Any, MemoryDocumentRef]:
        doc_id = uuid.uuid4().hex[:20]
        self._store._set_doc(self._name, doc_id, copy.deepcopy(data))
        return None, MemoryDocumentRef(self._store, self._name, doc_id)

    def document(self, doc_id: str) -> MemoryDocumentRef:
        return MemoryDocumentRef(self._store, self._name, doc_id)


# Patch where() to accept both FieldFilter and legacy 3-arg positional form
def _collection_where(self: MemoryCollection, filter=None, *args, **kwargs) -> MemoryQuery:
    # FieldFilter-style: .where(filter=FieldFilter("field", "==", value))
    if filter is not None and hasattr(filter, "field_path"):
        q = MemoryQuery(self._store, self._name)
        q._filters = [(filter.field_path, filter.op_string, filter.value)]
        return q
    # Legacy 3-arg positional: .where("field", "==", value)
    # In this call style, filter receives the field name string as first arg,
    # and args receives (op_string, value).
    if filter is not None and isinstance(filter, str) and len(args) == 2:
        field, op, value = filter, args[0], args[1]
        q = MemoryQuery(self._store, self._name)
        q._filters = [(field, op, value)]
        return q
    # Explicit keyword legacy form: .where(field_path=..., op_string=..., value=...)
    if len(args) == 3:
        field, op, value = args
        q = MemoryQuery(self._store, self._name)
        q._filters = [(field, op, value)]
        return q
    return MemoryQuery(self._store, self._name)


MemoryCollection.where = _collection_where  # type: ignore[method-assign]


class MemoryStore:
    """Minimal Firestore-compatible store for development."""

    def __init__(self) -> None:
        self._collections: dict[str, dict[str, dict[str, Any]]] = {}
        self._seeded = False

    def collection(self, name: str) -> MemoryCollection:
        if not self._seeded:
            seed_memory_db(self)
            self._seeded = True
        return MemoryCollection(self, name)

    def transaction(self):
        return MemoryTransaction(self)

    def _get_doc(self, collection: str, doc_id: str) -> dict[str, Any] | None:
        col = self._collections.get(collection, {})
        data = col.get(doc_id)
        return copy.deepcopy(data) if data is not None else None

    def _set_doc(self, collection: str, doc_id: str, data: dict[str, Any]) -> None:
        self._collections.setdefault(collection, {})[doc_id] = copy.deepcopy(data)

    def _update_doc(self, collection: str, doc_id: str, updates: dict[str, Any]) -> None:
        col = self._collections.setdefault(collection, {})
        if doc_id not in col:
            col[doc_id] = {}
        col[doc_id].update(copy.deepcopy(updates))

    def _delete_doc(self, collection: str, doc_id: str) -> None:
        col = self._collections.get(collection, {})
        col.pop(doc_id, None)

    def _query(
        self,
        collection: str,
        filters: list[tuple[str, str, Any]],
        order_field: str | None,
        order_desc: bool,
        limit: int | None,
    ) -> list[tuple[str, dict[str, Any]]]:
        col = self._collections.get(collection, {})
        results: list[tuple[str, dict[str, Any]]] = []
        for doc_id, data in col.items():
            if self._matches(data, filters):
                results.append((doc_id, copy.deepcopy(data)))
        if order_field:
            results.sort(
                key=lambda x: x[1].get(order_field) or datetime.min.replace(tzinfo=timezone.utc),
                reverse=order_desc,
            )
        if limit is not None:
            results = results[:limit]
        return results

    @staticmethod
    def _matches(data: dict[str, Any], filters: list[tuple[str, str, Any]]) -> bool:
        for field, op, value in filters:
            actual = data.get(field)
            if op == "==" and actual != value:
                return False
            if op == "!=" and actual == value:
                return False
        return True


class MemoryTransaction:
    def __init__(self, store: MemoryStore):
        self._store = store


_memory_store: MemoryStore | None = None


def get_memory_db() -> MemoryStore:
    global _memory_store
    if _memory_store is None:
        _memory_store = MemoryStore()
    return _memory_store


def is_memory_db(db: Any) -> bool:
    return isinstance(db, MemoryStore)
