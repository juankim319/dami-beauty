# QA Checklist — Pre-Launch

## Mobile Browser Testing

- [ ] iOS Safari — homepage load, product browse, add to cart
- [ ] iOS Safari — full checkout flow (PayTR test mode)
- [ ] Android Chrome — same flows as above
- [ ] Instagram in-app browser — bio link → homepage → product → cart

## Payment (PayTR Test Mode)

- [ ] Successful payment — order status `paid`, stock decremented
- [ ] Failed payment — order status `cancelled`, stock unchanged
- [ ] Duplicate callback — idempotent, no double stock deduction
- [ ] Payment timeout / user closes iframe — order remains `pending`

Run minimum **10 test transactions** covering success and failure.

## Inventory

- [ ] Product with stock 0 — "Sepete Ekle" disabled
- [ ] Order quantity exceeds stock — API returns 400
- [ ] Low stock appears in admin dashboard

## Admin Panel

- [ ] Non-admin user cannot access `/admin` routes
- [ ] Unauthenticated user redirected to `/admin/login`
- [ ] Product CRUD works
- [ ] Order status transitions work (paid → processing → shipped)
- [ ] Tracking number saved on ship
- [ ] Campaign and Instagram CRUD works

## Legal & Compliance

- [ ] Footer links to all 4 legal pages
- [ ] Checkout requires Mesafeli Satış + KVKK checkboxes
- [ ] Cookie consent banner on first visit
- [ ] Replace `[PLACEHOLDER]` text with lawyer-reviewed copy

## Performance & SEO

- [ ] Lighthouse Mobile Performance ≥ 80
- [ ] Lighthouse Accessibility ≥ 90
- [ ] `/sitemap.xml` accessible
- [ ] `/robots.txt` accessible
- [ ] Open Graph tags on product pages
- [ ] Favicon set

## Production Readiness

- [ ] SSL on www and api domains
- [ ] Firebase prod rules deployed
- [ ] PayTR live callback URL registered
- [ ] GA4 and Meta Pixel firing (prod only)
- [ ] Firestore backup schedule enabled
- [ ] Error monitoring configured (optional: Sentry)

## Post-Launch Smoke Test

- [ ] Place 1 real order with live PayTR
- [ ] Verify order confirmation email
- [ ] Verify admin sees new order
- [ ] WhatsApp button opens correct number
