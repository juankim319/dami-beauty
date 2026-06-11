from google.cloud import firestore
from google.cloud.firestore_v1 import FieldFilter

from app.core.config import settings
from app.core.firebase import get_db
from app.core.memory_db import is_memory_db


def decrement_stock(product_id: str, variant_sku: str, quantity: int) -> bool:
    db = get_db()
    product_ref = db.collection("products").document(product_id)

    if is_memory_db(db):
        snapshot = product_ref.get()
        if not snapshot.exists:
            return False
        data = snapshot.to_dict() or {}
        variants = data.get("variants", [])
        for i, v in enumerate(variants):
            if v.get("sku") == variant_sku:
                new_stock = v.get("stock", 0) - quantity
                if new_stock < 0:
                    return False
                variants[i]["stock"] = new_stock
                product_ref.update({"variants": variants})
                return True
        return False

    @firestore.transactional
    def update_in_transaction(transaction, ref):
        snapshot = ref.get(transaction=transaction)
        if not snapshot.exists:
            return False
        data = snapshot.to_dict()
        variants = data.get("variants", [])
        updated = False
        for i, v in enumerate(variants):
            if v.get("sku") == variant_sku:
                new_stock = v.get("stock", 0) - quantity
                if new_stock < 0:
                    return False
                variants[i]["stock"] = new_stock
                updated = True
                break
        if not updated:
            return False
        transaction.update(ref, {"variants": variants})
        return True

    transaction = db.transaction()
    return update_in_transaction(transaction, product_ref)


def increment_stock(product_id: str, variant_sku: str, quantity: int) -> bool:
    db = get_db()
    product_ref = db.collection("products").document(product_id)

    if is_memory_db(db):
        snapshot = product_ref.get()
        if not snapshot.exists:
            return False
        data = snapshot.to_dict() or {}
        variants = data.get("variants", [])
        for i, v in enumerate(variants):
            if v.get("sku") == variant_sku:
                variants[i]["stock"] = v.get("stock", 0) + quantity
                product_ref.update({"variants": variants})
                return True
        return False

    @firestore.transactional
    def update_in_transaction(transaction, ref):
        snapshot = ref.get(transaction=transaction)
        if not snapshot.exists:
            return False
        data = snapshot.to_dict()
        variants = data.get("variants", [])
        updated = False
        for i, v in enumerate(variants):
            if v.get("sku") == variant_sku:
                variants[i]["stock"] = v.get("stock", 0) + quantity
                updated = True
                break
        if not updated:
            return False
        transaction.update(ref, {"variants": variants})
        return True

    transaction = db.transaction()
    return update_in_transaction(transaction, product_ref)


def get_low_stock_products() -> list[dict]:
    db = get_db()
    products = db.collection("products").where(filter=FieldFilter("active", "==", True)).stream()
    low_stock = []
    for doc in products:
        data = doc.to_dict()
        for v in data.get("variants", []):
            threshold = v.get("low_stock_threshold", settings.low_stock_default)
            stock = v.get("stock", 0)
            if stock <= threshold:
                low_stock.append(
                    {
                        "product_id": doc.id,
                        "product_name": data.get("name_tr"),
                        "sku": v.get("sku"),
                        "stock": stock,
                        "threshold": threshold,
                    }
                )
    return low_stock
