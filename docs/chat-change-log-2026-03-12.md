# Change Log (Chat Session) - 2026-03-12

This log captures all implementation work completed in this chat for the ScreenStudio site refactor to a tier-first productized service model.

## 1) Scope completed

- Refactored public pricing flow from package calculator to 3 fixed tiers:
  - `starter`
  - `business`
  - `growth`
- Reframed 48h promise to: **first output in 48 hours**.
- Added backward compatibility for legacy package payloads and legacy URLs.
- Kept HE/EN as UI locales; RU/AR remained in deliverable/output context only.
- Added `acquisitionChannel` to leads.
- Added internal CAC admin layer with monthly manual inputs + computed metrics.
- Did not add auth changes, payments, auto-posting, or client cabinet.

## 2) Core model and type changes

### Added tier-first domain types
- File: `src/core/site.types.ts`
- Added:
  - `TIER_IDS` + `TierId`
  - `INTAKE_SOURCES` + `IntakeSourceId`
  - `LANGUAGE_BUNDLES` + `LanguageBundleId`
  - `VOICE_MODES` + `VoiceModeId`
  - `ACQUISITION_CHANNELS` + `AcquisitionChannel`
  - `TierPriceRange`, `TierDefinition`
- Lead model updated:
  - Added `acquisitionChannel`
  - Quote in lead now stores `tierId + priceRange (+ optional legacyPackageId)`
  - Source now supports tier-first + legacy normalized sources

### Added tier mapping model
- New file: `src/core/pricing/tier-model.ts`
- Contains:3
  - Tier catalog with required ranges:
    - Starter: `199-299 ILS/month`
    - Business: `449-799 ILS/month`
    - Growth: `1490-2990 ILS/month`
  - Legacy package -> tier mapping:
    - `quick-start-system -> starter`
    - `content-whatsapp-funnel -> business`
    - `qr-menu-mini-site -> business`
    - `beauty-booking-flow -> business`
    - `business-launch-setup -> growth`

## 3) Public site refactor

### Pricing UI replaced with tier cards
- Replaced file: `src/components/landing/PricingSection.tsx`
- Removed calculator selection UI from pricing flow:
  - no niche/package/delivery/add-ons calculator controls
- Added:
  - 3 tier cards only
  - intake source / language bundle / voice mode / notes
  - CTA opens WhatsApp based on selected tier quote response

### Landing state/flow updated
- File: `src/components/landing/LandingPage.tsx`
- Changed selection state from calculator inputs to tier-first selection.
- Still keeps legacy package selection only to map SEO solution cards -> tier.
- Lead submission now posts tier-based quote + `acquisitionChannel`.

### Content/copy updates
- File: `src/core/site.content.ts`
- Updated pricing section copy to tier-first messaging.
- Updated process/FAQ language to align with:
  - "first output in 48 hours"
  - no full-project-in-48h implication

### Site meta copy updated
- File: `src/lib/site.ts`
- Updated main description/home description to tier-first + first-output-48h language.

## 4) API changes

### `/api/quote` refactor
- File: `src/app/api/quote/route.ts`
- New request shape:
  - `tierId`
  - `intakeSource`
  - `languageBundle`
  - `voiceMode`
  - `notes?`
- New response shape:
  - `tier`
  - `priceRange { min, max, currency, period }`
  - `whatsappText`
- Backward compatibility:
  - legacy package payload is accepted and temporarily mapped to `business`.

### WhatsApp template engine update
- File: `src/core/pricing/whatsapp-template.ts`
- Now builds tier-first messages and includes:
  - selected tier + monthly range
  - first-output-in-48h expectation
  - intake/language/voice context
  - legacy-mapping note if applicable

### `/api/leads` refactor
- File: `src/app/api/leads/route.ts`
- Added `acquisitionChannel` field validation and persistence.
- Accepts both:
  - new tier quote payload
  - legacy package quote payload (normalized to tier record)
- Normalizes legacy source `landing_calculator -> legacy_package_calculator`.

## 5) Admin CAC layer

### New CAC storage + computations
- New file: `src/lib/cac.ts`
- Added:
  - monthly entry store (`data/runtime/cac.json`)
  - upsert/delete/list operations
  - computed metrics:
    - leads
    - CPL
    - CAC
    - close rate
    - ROAS-like
  - lead aggregation from lead store by `acquisitionChannel`

### New CAC API
- New file: `src/app/api/cac/route.ts`
- Endpoints:
  - `GET` month view + aggregated metrics
  - `POST/PUT` monthly manual input
  - `DELETE` entry

### New CAC admin page
- New file: `src/app/admin/(protected)/cac/page.tsx`
- Features:
  - month filter
  - manual monthly input form
  - computed metrics table
  - saved entries list + delete

### Admin navigation
- File: `src/components/admin/AdminSidebar.tsx`
- Added `/admin/cac` link.

## 6) SEO and legacy route handling

### SEO mapping updates
- File: `src/lib/seo-data.ts`
- Added tier resolution from legacy package ids.
- Added price-range retrieval for tier pages.

### Product schema updated to AggregateOffer
- File: `src/app/products/[slug]/page.tsx`
- Switched structured data offer from single `Offer` price to:
  - `AggregateOffer`
  - `lowPrice`
  - `highPrice`
  - `priceCurrency: ILS`

### Legacy route redirects
- File: `next.config.js`
- Added redirects for legacy package/solution slugs to active product slugs.

## 7) Admin cleanup (calculator leftovers)

### Completed cleanup
- File: `src/app/admin/(protected)/solutions/page.tsx`
  - Removed global discount UI and pricing-settings API calls.
- File removed: `src/app/api/pricing-settings/route.ts`
- File: `src/app/api/solutions/route.ts`
  - Removed calculator rules dependency for default fallback pricing.
  - Fallback now uses tier minimum based on legacy->tier mapping.
- File: `src/lib/site-content-overrides.ts`
  - Removed pricing discount/calc coupling in override application logic.
- File: `src/app/admin/(protected)/content/page.tsx`
  - Pricing editor section simplified (removed old calculator labels from UI controls).

## 8) Tests and validation run

### Passed
- `npm run test` (15 tests)
- `npm run build`

### Known remaining lint issue (pre-existing)
- `npm run lint` fails on:
  - `scripts/playwright-smoke.js`
  - rule: `@typescript-eslint/no-require-imports`

## 9) Files added in this chat

- `docs/migration-notes-tier-first.md`
- `docs/chat-change-log-2026-03-12.md` (this file)
- `src/core/pricing/tier-model.ts`
- `src/lib/cac.ts`
- `src/app/api/cac/route.ts`
- `src/app/admin/(protected)/cac/page.tsx`

## 10) Files removed in this chat

- `src/app/api/pricing-settings/route.ts`

## 11) Notes

- Legacy package ids still exist internally for SEO route continuity and mapping.
- Quote engine/calculator legacy modules remain in codebase for compatibility/tests, but public pricing flow is tier-first.
