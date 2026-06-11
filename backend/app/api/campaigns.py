from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from google.cloud.firestore_v1 import FieldFilter

from app.core.firebase import get_db
from app.core.security import require_admin
from app.core.utils import doc_to_dict, utc_now
from app.models.schemas import (
    CampaignCreate,
    CampaignResponse,
    CampaignUpdate,
)

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


@router.get("/active", response_model=CampaignResponse | None)
async def get_active_campaign():
    db = get_db()
    now = utc_now()
    docs = (
        db.collection("campaigns")
        .where(filter=FieldFilter("active", "==", True))
        .stream()
    )
    for doc in docs:
        data = doc_to_dict(doc)
        start = data.get("start_at")
        end = data.get("end_at")
        if start and start.replace(tzinfo=utc_now().tzinfo) > now:
            continue
        if end and end.replace(tzinfo=utc_now().tzinfo) < now:
            continue
        return CampaignResponse(**data)
    return None


@router.get("", response_model=list[CampaignResponse])
async def list_campaigns(admin: Annotated[dict, Depends(require_admin)]):
    db = get_db()
    docs = db.collection("campaigns").stream()
    return [CampaignResponse(**doc_to_dict(d)) for d in docs]


@router.post("", response_model=CampaignResponse, status_code=201)
async def create_campaign(
    body: CampaignCreate,
    admin: Annotated[dict, Depends(require_admin)],
):
    db = get_db()
    _, ref = db.collection("campaigns").add(body.model_dump())
    data = body.model_dump()
    data["id"] = ref.id
    return CampaignResponse(**data)


@router.put("/{campaign_id}", response_model=CampaignResponse)
async def update_campaign(
    campaign_id: str,
    body: CampaignUpdate,
    admin: Annotated[dict, Depends(require_admin)],
):
    db = get_db()
    ref = db.collection("campaigns").document(campaign_id)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Campaign not found")
    updates = {k: v for k, v in body.model_dump(exclude_unset=True).items()}
    ref.update(updates)
    return CampaignResponse(**doc_to_dict(ref.get()))
