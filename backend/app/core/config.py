from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Dami Beauty API"
    app_env: str = "development"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"

    cors_origins: str = "http://localhost:3000"
    cors_allow_vercel: bool = True

    firebase_project_id: str = "dami-beauty-353b0"
    google_application_credentials: str | None = None
    firebase_service_account_json: str | None = None

    paytr_merchant_id: str = ""
    paytr_merchant_key: str = ""
    paytr_merchant_salt: str = ""
    paytr_test_mode: bool = True

    frontend_url: str = "http://localhost:3000"
    backend_url: str = "http://localhost:8000"

    default_shipping_try: int = 4900
    free_shipping_threshold_try: int = 99999
    gift_wrap_price_try: int = 5000

    whatsapp_number: str = "905XXXXXXXXX"

    sendgrid_api_key: str = ""
    from_email: str = "orders@damibeauty.com"
    firebase_web_api_key: str = ""

    low_stock_default: int = 5

    # When true (default in development), use in-memory DB if Firebase creds are missing
    use_mock_db: bool = True

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
