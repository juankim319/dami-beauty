from pydantic import BaseModel, EmailStr

from fastapi import APIRouter, HTTPException

from app.services.auth_email import (
    send_password_reset_email,
    send_verification_via_firebase,
)

router = APIRouter(prefix="/auth", tags=["auth"])


class PasswordResetRequest(BaseModel):
    email: EmailStr


class VerificationRequest(BaseModel):
    id_token: str


@router.post("/password-reset")
async def password_reset(body: PasswordResetRequest):
    try:
        method = await send_password_reset_email(body.email)
        return {"ok": True, "method": method}
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.post("/send-verification")
async def send_verification(body: VerificationRequest):
    """Send verification email using idToken from signed-up / logged-in user."""
    try:
        method = await send_verification_via_firebase(body.id_token)
        return {"ok": True, "method": method}
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
