# Tier-First Audit + Change Log (2026-03-12)

This document consolidates the full refactor work done in this chat for the ScreenStudio site.

## 1) Audit: What needed to change before implementation

### Core domain/types
- `src/core/site.types.ts`
- `src/core/site.content.ts`
- `src/lib/site.ts`

### Pricing model + mapping
- `src/core/pricing/tier-model.ts` (new)
- `src/lib/seo-data.ts`

### Public site pricing flow
- `src/components/landing/PricingSection.tsx`
- `src/components/landing/LandingPage.tsx`

### API layer
- `src/app/api/quote/route.ts`
- `src/app/api/leads/route.ts`
- `src/app/api/solutions/route.ts`

### Admin
- `src/app/admin/(protected)/content/page.tsx`
- `src/app/admin/(protected)/solutions/page.tsx`
- `src/components/admin/AdminSidebar.tsx`
- `src/app/admin/(protected)/cac/page.tsx` (new)
- `src/app/api/cac/route.ts` (new)
- `src/lib/cac.ts` (new)

### SEO / routes
- `src/app/products/[slug]/page.tsx`
- `next.config.js`

### Tests and docs
- `src/app/api/quote/route.test.ts`
- `src/app/api/leads/route.test.ts`
- `src/core/pricing/whatsapp-template.ts`
- `src/core/pricing/whatsapp-template.test.ts`
- `docs/migration-notes-tier-first.md`

## 2) Implemented changes

### Tier-first product model
- Added 3 tiers and ranges (ILS/month):
  - `starter`: `199-299`
  - `business`: `449-799`
  - `growth`: `1490-2990`
- Added legacy mapping:
  - `quick-start-system -> starter`
  - `content-whatsapp-funnel -> business`
  - `qr-menu-mini-site -> business`
  - `beauty-booking-flow -> business`
  - `business-launch-setup -> growth`

### Public site
- Replaced calculator-based pricing UX with 3 tier cards.
- Kept gallery/proof and solutions sections.
- Updated copy to "first output in 48 hours" (not full delivery in 48h).
- HE/EN remain UI locales; RU/AR stay as output/deliverable languages.

### API
- Refactored `/api/quote`:
  - Request: `tierId`, `intakeSource`, `languageBundle`, `voiceMode`, `notes?`
  - Response: `tier`, `priceRange { min, max, currency, period }`, `whatsappText`
  - Backward compatibility: legacy package payload maps to `business` temporarily.
- Updated `/api/leads`:
  - Added `acquisitionChannel`.
  - Supports new tier payload + legacy quote normalization.

### Leads + CAC
- Added `acquisitionChannel` to lead model and validation:
  - `outbound_instagram_whatsapp`
  - `partnerships`
  - `marketplaces_fiverr_upwork`
  - `experts_wix_squarespace`
  - `paid_ads`
  - `other`
- Added internal CAC stack:
  - `/admin/cac` page
  - `/api/cac` endpoints
  - monthly manual inputs + auto lead aggregation
  - computed metrics: leads, CPL, CAC, close rate, ROAS-like

### SEO and routing
- Kept legacy routes working via redirects and mapping.
- Updated product structured data to `AggregateOffer` with ILS `lowPrice/highPrice`.

### Cleanup of old pricing engine in main flow
- Removed public package-selection calculator flow from pricing path.
- Removed admin discount/pricing-settings dependency from solutions UI.
- Deleted `src/app/api/pricing-settings/route.ts`.
- Kept legacy identifiers only for compatibility/SEO mapping.

## 3) Validation summary

- Passed: `npm run test`
- Passed: `npm run build`
- Known pre-existing lint issue:
  - `scripts/playwright-smoke.js`
  - rule: `@typescript-eslint/no-require-imports`

## 4) Files added

- `src/core/pricing/tier-model.ts`
- `src/lib/cac.ts`
- `src/app/api/cac/route.ts`
- `src/app/admin/(protected)/cac/page.tsx`
- `docs/migration-notes-tier-first.md`
- `docs/chat-change-log-2026-03-12.md`
- `docs/tier-first-audit-and-change-log-2026-03-12.md` (this file)

## 5) Files removed

- `src/app/api/pricing-settings/route.ts`
