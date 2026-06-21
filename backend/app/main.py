from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.firebase import get_db_mode, get_db
from app.services.paytr import get_paytr_mode, is_paytr_configured
from app.api import products, campaigns, orders, paytr, admin, auth, social_proof, address

api_router = APIRouter()
api_router.include_router(products.router)
api_router.include_router(products.categories_router)
api_router.include_router(campaigns.router)
api_router.include_router(orders.router)
api_router.include_router(paytr.router)
api_router.include_router(admin.router)
api_router.include_router(admin.instagram_router)
api_router.include_router(auth.router)
api_router.include_router(social_proof.router)
api_router.include_router(address.router)


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        debug=settings.debug,
        docs_url=f"{settings.api_v1_prefix}/docs",
        openapi_url=f"{settings.api_v1_prefix}/openapi.json",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_origin_regex=r"https://.*\.vercel\.app" if settings.cors_allow_vercel else None,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    async def health():
        mode = get_db_mode()
        firestore_ok = None
        if mode == "firebase":
            try:
                db = get_db()
                db.collection("_health").document("ping").get()
                firestore_ok = True
            except Exception:
                firestore_ok = False
        return {
            "status": "ok" if firestore_ok is not False else "degraded",
            "env": settings.app_env,
            "db": mode,
            "firestore_connected": firestore_ok,
            "paytr": {
                "mode": get_paytr_mode(),
                "configured": is_paytr_configured(),
                "test_mode": settings.paytr_test_mode,
            },
        }

    app.include_router(api_router, prefix=settings.api_v1_prefix)
    return app


app = create_app()
