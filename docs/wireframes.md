# Mobile-First Wireframes — Dami Beauty

Target viewport: **375px** (iPhone). All flows optimized for Instagram bio link traffic.

---

## 1. Homepage `/`

```
┌─────────────────────────┐
│  ☰        DAMI BEAUTY  🛒│  ← sticky header
├─────────────────────────┤
│                         │
│   [Featured Set Hero]   │  ← full-width video/image
│   "Sevgililer Günü      │     campaign banner
│    Özel Seti"           │
│   [Hemen Keşfet →]      │
│                         │
├─────────────────────────┤
│  Öne Çıkan Setler       │
│  ┌─────┐ ┌─────┐       │  ← horizontal scroll
│  │ img │ │ img │       │
│  └─────┘ └─────┘       │
├─────────────────────────┤
│  Kategoriler            │
│  [Hediye Kutuları]      │
│  [Kürasyon Setleri]     │
│  [Tekli Ürünler]        │
├─────────────────────────┤
│  @damibeautyy           │
│  ┌──┬──┬──┐            │  ← Instagram grid (3x2)
│  │  │  │  │            │
│  └──┴──┴──┘            │
├─────────────────────────┤
│  Footer + WhatsApp FAB  │  ← floating action button
└─────────────────────────┘
```

---

## 2. Product List `/products`

```
┌─────────────────────────┐
│  ← Ürünler              │
├─────────────────────────┤
│ [Tümü][Kutu][Set][Tek]  │  ← filter chips
├─────────────────────────┤
│  ┌──────────┐           │
│  │  image   │  ₺899,00  │  ← 2-column grid on mobile
│  │  name    │           │
│  └──────────┘           │
│  ┌──────────┐           │
│  │  image   │  ₺1.299   │
│  └──────────┘           │
└─────────────────────────┘
```

---

## 3. Product Detail `/products/[slug]`

```
┌─────────────────────────┐
│  ←              ♡  🛒  │
├─────────────────────────┤
│  [Image carousel]       │  ← swipeable
├─────────────────────────┤
│  Romantik Hediye Kutusu │
│  ₺1.299,00              │
│  ★★★★★ (12 yorum)       │
├─────────────────────────┤
│  Koku: [Gül ▼]          │  ← variant selectors
│  Kart Mesajı: [____]    │
│  ☐ Hediye Paketi (+₺50) │
├─────────────────────────┤
│  Açıklama...            │
├─────────────────────────┤
│  [- 1 +]  [Sepete Ekle] │  ← sticky bottom bar
└─────────────────────────┘
```

---

## 4. Cart `/cart`

```
┌─────────────────────────┐
│  ← Sepetim (2)          │
├─────────────────────────┤
│  [img] Ürün adı         │
│        Varyant: Gül     │
│        ₺899  [- 1 +] 🗑 │
├─────────────────────────┤
│  Ara Toplam    ₺1.798   │
│  Kargo         ₺49      │
│  ─────────────────────  │
│  Toplam        ₺1.847   │
├─────────────────────────┤
│  [Ödemeye Geç →]        │  ← full-width CTA
└─────────────────────────┘
```

---

## 5. Checkout `/checkout`

```
┌─────────────────────────┐
│  ← Ödeme                │
├─────────────────────────┤
│  İletişim Bilgileri     │
│  Ad Soyad [________]    │
│  E-posta  [________]    │
│  Telefon  [________]    │
├─────────────────────────┤
│  Teslimat Adresi        │
│  İl [İstanbul ▼]        │
│  İlçe [Kadıköy ▼]       │
│  Adres [___________]    │
├─────────────────────────┤
│  ☑ Mesafeli Satış       │
│    Sözleşmesi'ni okudum │
│  ☑ KVKK Aydınlatma      │
├─────────────────────────┤
│  [PayTR ile Öde →]      │
└─────────────────────────┘
        ↓
┌─────────────────────────┐
│  [PayTR iFrame]         │  ← embedded payment
└─────────────────────────┘
```

---

## 6. Order Success `/order/[id]`

```
┌─────────────────────────┐
│       ✓ Sipariş Alındı  │
│  Sipariş #DB-2024-001   │
│  Onay e-postası gönderildi
├─────────────────────────┤
│  [Sipariş Detayları]    │
│  [Alışverişe Devam]     │
│  [WhatsApp ile Sor]     │
└─────────────────────────┘
```

---

## 7. Brand Story `/story`

```
┌─────────────────────────┐
│  Hikayemiz              │
├─────────────────────────┤
│  [Hero image/video]     │
│  "Hediye kutusunu       │
│   açtığınız an..."      │
├─────────────────────────┤
│  Scroll narrative       │
│  with pink gradients    │
└─────────────────────────┘
```

---

## 8. Admin Dashboard `/admin`

```
┌─────────────────────────┐
│  DAMI Admin    [Çıkış]  │
├─────────────────────────┤
│  Bugün: 5 sipariş       │
│  Bekleyen: 2            │
│  Düşük stok: 3 ürün     │
├─────────────────────────┤
│  Siparişler (Kanban)    │
│  [Yeni][Hazırlanıyor]   │
│  [Kargoda][Tamamlandı]  │
├─────────────────────────┤
│  [Ürünler] [Kampanyalar]│
│  [Instagram] [Ayarlar]  │
└─────────────────────────┘
```

---

## User Flow

```mermaid
flowchart TD
  IG[Instagram Bio Link] --> Home[Homepage]
  Home --> Featured[Featured Set]
  Home --> Products[Product List]
  Products --> Detail[Product Detail]
  Detail --> Cart[Cart]
  Cart --> Checkout[Checkout]
  Checkout --> PayTR[PayTR iFrame]
  PayTR -->|success| OrderSuccess[Order Success]
  PayTR -->|fail| Checkout
  Home --> Story[Brand Story]
  Home --> WA[WhatsApp Chat]
```
