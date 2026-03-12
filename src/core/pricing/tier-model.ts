import type { Locale, PackageId, TierDefinition, TierId } from "@/core/site.types";

export const tierCatalog: Record<TierId, TierDefinition> = {
  starter: {
    id: "starter",
    publicName: "Starter",
    priceRange: {
      min: 199,
      max: 299,
      currency: "ILS",
      period: "month",
    },
  },
  business: {
    id: "business",
    publicName: "Business",
    priceRange: {
      min: 449,
      max: 799,
      currency: "ILS",
      period: "month",
    },
  },
  growth: {
    id: "growth",
    publicName: "Growth",
    priceRange: {
      min: 1490,
      max: 2990,
      currency: "ILS",
      period: "month",
    },
  },
};

export const legacyPackageToTier: Record<PackageId, TierId> = {
  "quick-start-system": "starter",
  "content-whatsapp-funnel": "business",
  "qr-menu-mini-site": "business",
  "beauty-booking-flow": "business",
  "business-launch-setup": "growth",
};

export function getTierDefinition(tierId: TierId): TierDefinition {
  return tierCatalog[tierId];
}

export function mapLegacyPackageToTier(packageId: PackageId): TierId {
  return legacyPackageToTier[packageId];
}

export function formatTierPriceRangeLabel(tierId: TierId, locale: Locale): string {
  const tier = getTierDefinition(tierId);
  const formatter = new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US", {
    style: "currency",
    currency: tier.priceRange.currency,
    maximumFractionDigits: 0,
  });
  const range = `${formatter.format(tier.priceRange.min)}-${formatter.format(tier.priceRange.max)}`;
  return locale === "he" ? `${range} לחודש` : `${range} / month`;
}
