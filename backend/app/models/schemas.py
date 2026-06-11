from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, EmailStr, Field


class ProductType(str, Enum):
    SINGLE = "single"
    GIFT_BOX = "gift_box"
    CURATION_SET = "curation_set"


class OrderStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class ProductVariant(BaseModel):
    sku: str
    options: dict[str, str] = Field(default_factory=dict)
    price_try: int
    stock: int = 0
    low_stock_threshold: int = 5


class ProductBase(BaseModel):
    name_tr: str
    slug: str
    type: ProductType
    description_tr: str = ""
    images: list[str] = Field(default_factory=list)
    base_price_try: int
    category_id: str | None = None
    variants: list[ProductVariant] = Field(default_factory=list)
    is_featured: bool = False
    campaign_id: str | None = None
    gift_wrap_available: bool = True
    active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name_tr: str | None = None
    slug: str | None = None
    type: ProductType | None = None
    description_tr: str | None = None
    images: list[str] | None = None
    base_price_try: int | None = None
    category_id: str | None = None
    variants: list[ProductVariant] | None = None
    is_featured: bool | None = None
    campaign_id: str | None = None
    gift_wrap_available: bool | None = None
    active: bool | None = None


class ProductResponse(ProductBase):
    id: str
    created_at: datetime | None = None
    updated_at: datetime | None = None


class CategoryBase(BaseModel):
    name_tr: str
    slug: str
    sort_order: int = 0
    active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: str


class CampaignBase(BaseModel):
    title_tr: str
    subtitle_tr: str | None = None
    banner_url: str = ""
    product_ids: list[str] = Field(default_factory=list)
    start_at: datetime | None = None
    end_at: datetime | None = None
    active: bool = True


class CampaignCreate(CampaignBase):
    pass


class CampaignUpdate(BaseModel):
    title_tr: str | None = None
    subtitle_tr: str | None = None
    banner_url: str | None = None
    product_ids: list[str] | None = None
    start_at: datetime | None = None
    end_at: datetime | None = None
    active: bool | None = None


class CampaignResponse(CampaignBase):
    id: str


class ShippingAddress(BaseModel):
    full_name: str
    phone: str
    email: EmailStr
    il: str
    ilce: str
    mahalle: str = ""
    street: str = ""
    building_no: str = ""
    floor: str = ""
    apartment: str = ""
    address_line: str
    postal_code: str = ""


class OrderItemInput(BaseModel):
    product_id: str
    variant_sku: str
    quantity: int = Field(ge=1, le=99)


class OrderItem(BaseModel):
    product_id: str
    variant_sku: str
    name_tr: str
    quantity: int
    unit_price_try: int
    options: dict[str, str] = Field(default_factory=dict)


class OrderCreate(BaseModel):
    items: list[OrderItemInput]
    shipping_address: ShippingAddress
    gift_wrap: bool = False
    gift_message: str | None = None
    customer_notes: str | None = None
    user_id: str | None = None


class OrderResponse(BaseModel):
    id: str
    user_id: str | None = None
    guest_email: str
    guest_phone: str
    items: list[OrderItem]
    subtotal_try: int
    shipping_try: int
    total_try: int
    shipping_address: ShippingAddress
    status: OrderStatus
    gift_wrap: bool = False
    gift_message: str | None = None
    customer_notes: str | None = None
    paytr_merchant_oid: str
    tracking_number: str | None = None
    notes: str | None = None
    created_at: datetime | None = None
    paid_at: datetime | None = None


class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    tracking_number: str | None = None
    notes: str | None = None


class OrderAdminUpdate(BaseModel):
    status: OrderStatus | None = None
    tracking_number: str | None = None
    notes: str | None = None
    guest_email: EmailStr | None = None
    guest_phone: str | None = None
    customer_notes: str | None = None
    shipping_address: ShippingAddress | None = None


class PayTRTokenRequest(BaseModel):
    order_id: str


class PayTRTokenResponse(BaseModel):
    token: str
    iframe_url: str


class InstagramPostBase(BaseModel):
    image_url: str
    post_url: str
    sort_order: int = 0
    active: bool = True


class InstagramPostCreate(InstagramPostBase):
    pass


class InstagramPostResponse(InstagramPostBase):
    id: str


class SocialProofItem(BaseModel):
    city: str
    product: str
    minutes_ago: int = Field(ge=1, le=120)


class AdminDashboard(BaseModel):
    orders_today: int
    pending_orders: int
    low_stock_products: list[dict[str, Any]]
    recent_orders: list[OrderResponse]
