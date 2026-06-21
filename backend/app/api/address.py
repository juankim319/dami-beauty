"""Turkish address lookup — proxies TurkiyeAPI (il/ilçe/mahalle/köy) + TR Adres API (cadde/sokak)."""

from __future__ import annotations

import time
from typing import Any

import httpx
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/address", tags=["address"])

TURKIYE_API = "https://api.turkiyeapi.dev/v2"
TR_ADRES_API = "https://mebularts.github.io/tr-adres-api/v1"

_CACHE: dict[str, tuple[float, Any]] = {}
_CACHE_TTL = 3600.0


def _cache_get(key: str) -> Any | None:
    entry = _CACHE.get(key)
    if not entry:
        return None
    ts, value = entry
    if time.monotonic() - ts > _CACHE_TTL:
        _CACHE.pop(key, None)
        return None
    return value


def _cache_set(key: str, value: Any) -> Any:
    _CACHE[key] = (time.monotonic(), value)
    return value


async def _fetch_all_pages(
    client: httpx.AsyncClient,
    path: str,
    *,
    params: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    offset = 0
    limit = 100
    base_params = dict(params or {})

    while True:
        query = {**base_params, "limit": limit, "offset": offset}
        res = await client.get(path, params=query)
        res.raise_for_status()
        body = res.json()
        batch = body.get("data") or []
        items.extend(batch)
        total = body.get("meta", {}).get("total", len(items))
        offset += limit
        if not batch or offset >= total:
            break

    return items


def _format_street(row: dict[str, Any]) -> str:
    tip = (row.get("tip") or "").strip()
    if tip:
        return tip.replace(" (", " ").replace(")", "")
    name = (row.get("ad") or "").strip()
    if not name:
        return ""
    return name


@router.get("/provinces")
async def list_provinces():
    cached = _cache_get("provinces")
    if cached is not None:
        return cached

    async with httpx.AsyncClient(timeout=20.0) as client:
        rows = await _fetch_all_pages(client, f"{TURKIYE_API}/provinces")

    result = [{"id": row["id"], "name": row["name"]} for row in rows]
    result.sort(key=lambda x: x["name"].casefold())
    return _cache_set("provinces", result)


@router.get("/districts")
async def list_districts(province_id: int = Query(..., ge=1)):
    key = f"districts:{province_id}"
    cached = _cache_get(key)
    if cached is not None:
        return cached

    async with httpx.AsyncClient(timeout=20.0) as client:
        rows = await _fetch_all_pages(
            client,
            f"{TURKIYE_API}/provinces/{province_id}/districts",
        )

    result = [{"id": row["id"], "name": row["name"]} for row in rows]
    result.sort(key=lambda x: x["name"].casefold())
    return _cache_set(key, result)


@router.get("/settlements")
async def list_settlements(district_id: int = Query(..., ge=1)):
    """Mahalle + köy list for a district."""
    key = f"settlements:{district_id}"
    cached = _cache_get(key)
    if cached is not None:
        return cached

    async with httpx.AsyncClient(timeout=30.0) as client:
        neighborhoods = await _fetch_all_pages(
            client,
            f"{TURKIYE_API}/districts/{district_id}/neighborhoods",
        )
        villages = await _fetch_all_pages(
            client,
            f"{TURKIYE_API}/districts/{district_id}/villages",
        )

    result: list[dict[str, Any]] = []
    for row in neighborhoods:
        result.append(
            {
                "id": row["id"],
                "name": row["name"],
                "kind": "mahalle",
                "postal_code": row.get("postalCode"),
            }
        )
    for row in villages:
        result.append(
            {
                "id": row["id"],
                "name": row["name"],
                "kind": "koy",
                "postal_code": row.get("postalCode"),
            }
        )

    result.sort(key=lambda x: (0 if x["kind"] == "mahalle" else 1, x["name"].casefold()))
    return _cache_set(key, result)


@router.get("/streets")
async def list_streets(
    district_id: int = Query(..., ge=1),
    settlement_id: int = Query(..., ge=1),
):
    key = f"streets:{district_id}:{settlement_id}"
    cached = _cache_get(key)
    if cached is not None:
        return cached

    district_key = f"yollar:{district_id}"
    rows = _cache_get(district_key)
    if rows is None:
        async with httpx.AsyncClient(timeout=60.0) as client:
            res = await client.get(f"{TR_ADRES_API}/yollar/by-ilce/{district_id}.json")
            if res.status_code == 404:
                return _cache_set(key, [])
            res.raise_for_status()
            rows = res.json()
        _cache_set(district_key, rows)

    seen: set[str] = set()
    result: list[dict[str, Any]] = []
    for row in rows:
        if row.get("mahalle_id") != settlement_id:
            continue
        name = _format_street(row)
        if not name or name in seen:
            continue
        seen.add(name)
        result.append({"id": row["id"], "name": name})

    result.sort(key=lambda x: x["name"].casefold())
    return _cache_set(key, result)
