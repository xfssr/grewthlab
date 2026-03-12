# Tier-First Migration Notes

## What changed
- Public pricing flow moved from calculator/package selection to 3 fixed tiers:
  - `starter` (`₪199-₪299 / month`)
  - `business` (`₪449-₪799 / month`)
  - `growth` (`₪1490-₪2990 / month`)
- `48h` messaging now means **first output in 48 hours**, not full project completion.
- `/api/quote` now accepts:
  - `tierId`
  - `intakeSource`
  - `languageBundle`
  - `voiceMode`
  - `notes?`
- `/api/quote` now returns:
  - `tier`
  - `priceRange { min, max, currency, period }`
  - `whatsappText`

## Backward compatibility
- Legacy package quote payloads are still accepted by `/api/quote`.
- Any legacy package payload is temporarily mapped to `business` tier.
- Legacy lead payloads are accepted and normalized to tier-based lead records.

## Lead model changes
- Added `acquisitionChannel` to each lead.
- Lead quote payload now stores:
  - `tierId`
  - `priceRange`
  - optional `legacyPackageId`

## CAC admin
- Added `/admin/cac` for monthly channel tracking.
- Manual monthly inputs:
  - `month`
  - `channel`
  - `spendIls`
  - `dealsWon`
  - `revenueIls`
  - `notes`
- Auto lead aggregation from lead store.
- Computed metrics:
  - `leads`
  - `CPL`
  - `CAC`
  - `close rate`
  - `ROAS-like`

## Legacy SEO mapping
- Legacy package slugs mapped to tiers:
  - `quick-start-system -> starter`
  - `content-whatsapp-funnel -> business`
  - `qr-menu-mini-site -> business`
  - `beauty-booking-flow -> business`
  - `business-launch-setup -> growth`
- Legacy product and solution URLs are redirected to active product pages.
- Product structured data now uses `AggregateOffer` with `lowPrice/highPrice` in `ILS`.

## Notes for cleanup (next phase)
- Remove deprecated calculator rule usage from admin solution pricing internals.
- Simplify admin content fields by removing calculator labels no longer used publicly.
