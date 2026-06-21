export type ProductType = "single" | "gift_box" | "curation_set";

export interface ProductVariant {
  sku: string;
  options: Record<string, string>;
  price_try: number;
  stock: number;
  low_stock_threshold?: number;
}

export interface Product {
  id: string;
  name_tr: string;
  slug: string;
  type: ProductType;
  description_tr: string;
  images: string[];
  base_price_try: number;
  category_id?: string | null;
  variants: ProductVariant[];
  is_featured: boolean;
  campaign_id?: string | null;
  gift_wrap_available: boolean;
  active: boolean;
  created_at?: string;
  tags?: string[];
}

export interface Campaign {
  id: string;
  title_tr: string;
  subtitle_tr?: string | null;
  banner_url: string;
  product_ids: string[];
  active: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  variantSku: string;
  options: Record<string, string>;
  unitPriceTry: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  email: string;
  il: string;
  ilce: string;
  mahalle: string;
  street: string;
  building_no: string;
  floor: string;
  apartment: string;
  address_line: string;
  postal_code?: string;
}

export interface OrderItem {
  product_id: string;
  variant_sku: string;
  name_tr: string;
  quantity: number;
  unit_price_try: number;
  options?: Record<string, string>;
}

export interface Order {
  id: string;
  guest_email: string;
  guest_phone: string;
  items: OrderItem[];
  subtotal_try: number;
  shipping_try: number;
  total_try: number;
  shipping_address: ShippingAddress;
  status: string;
  gift_wrap: boolean;
  gift_message?: string | null;
  customer_notes?: string | null;
  paytr_merchant_oid: string;
  tracking_number?: string | null;
  notes?: string | null;
  created_at?: string;
  paid_at?: string | null;
}

export interface InstagramPost {
  id: string;
  image_url: string;
  post_url: string;
  sort_order: number;
  active: boolean;
}

export interface AdminDashboard {
  orders_today: number;
  pending_orders: number;
  low_stock_products: Array<{
    product_id: string;
    product_name: string;
    sku: string;
    stock: number;
    threshold: number;
  }>;
  recent_orders: Order[];
}
