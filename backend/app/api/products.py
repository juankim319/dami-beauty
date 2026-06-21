from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from google.cloud.firestore_v1 import FieldFilter

from app.core.firebase import get_db
from app.core.security import require_admin
from app.core.utils import doc_to_dict, utc_now
from app.models.schemas import (
    CategoryCreate,
    CategoryResponse,
    ProductCreate,
    ProductResponse,
    ProductType,
    ProductUpdate,
)

router = APIRouter(prefix="/products", tags=["products"])


def _serialize_product(data: dict) -> ProductResponse:
    return ProductResponse(**data)


@router.get("", response_model=list[ProductResponse])
async def list_products(
    type: ProductType | None = None,
    category_id: str | None = None,
    featured: bool | None = None,
    tag: str | None = None,
    limit: int = Query(default=50, le=100),
):
    db = get_db()
    query = db.collection("products").where(filter=FieldFilter("active", "==", True))

    if type:
        query = query.where(filter=FieldFilter("type", "==", type.value))
    if category_id:
        query = query.where(filter=FieldFilter("category_id", "==", category_id))
    if featured is not None:
        query = query.where(filter=FieldFilter("is_featured", "==", featured))

    docs = query.limit(limit).stream()
    products = [_serialize_product(doc_to_dict(d)) for d in docs]
    if tag:
        products = [p for p in products if tag in (p.tags or [])]
    products.sort(key=lambda p: p.created_at or utc_now(), reverse=True)
    return products


@router.get("/{slug}", response_model=ProductResponse)
async def get_product_by_slug(slug: str):
    db = get_db()
    docs = (
        db.collection("products")
        .where(filter=FieldFilter("slug", "==", slug))
        .where(filter=FieldFilter("active", "==", True))
        .limit(1)
        .stream()
    )
    for doc in docs:
        return _serialize_product(doc_to_dict(doc))
    raise HTTPException(status_code=404, detail="Product not found")


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    body: ProductCreate,
    admin: Annotated[dict, Depends(require_admin)],
):
    db = get_db()
    now = utc_now()
    data = body.model_dump()
    data["created_at"] = now
    data["updated_at"] = now
    _, ref = db.collection("products").add(data)
    data["id"] = ref.id
    return _serialize_product(data)


@router.put("/id/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    body: ProductUpdate,
    admin: Annotated[dict, Depends(require_admin)],
):
    db = get_db()
    ref = db.collection("products").document(product_id)
    doc = ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Product not found")

    updates = {k: v for k, v in body.model_dump(exclude_unset=True).items()}
    updates["updated_at"] = utc_now()
    ref.update(updates)
    return _serialize_product(doc_to_dict(ref.get()))


@router.delete("/id/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    admin: Annotated[dict, Depends(require_admin)],
):
    db = get_db()
    ref = db.collection("products").document(product_id)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Product not found")
    ref.update({"active": False, "updated_at": utc_now()})


categories_router = APIRouter(prefix="/categories", tags=["categories"])


@categories_router.get("", response_model=list[CategoryResponse])
async def list_categories():
    db = get_db()
    docs = (
        db.collection("categories")
        .where(filter=FieldFilter("active", "==", True))
        .stream()
    )
    categories = [CategoryResponse(**doc_to_dict(d)) for d in docs]
    categories.sort(key=lambda c: c.sort_order)
    return categories


@categories_router.post("", response_model=CategoryResponse, status_code=201)
async def create_category(
    body: CategoryCreate,
    admin: Annotated[dict, Depends(require_admin)],
):
    db = get_db()
    _, ref = db.collection("categories").add(body.model_dump())
    data = body.model_dump()
    data["id"] = ref.id
    return CategoryResponse(**data)
