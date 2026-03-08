import type { CalculatorRules } from "@/core/site.types";
import { prisma } from "@/lib/db";

const PRICING_SETTINGS_ID = "default";

export type PricingSettings = {
  discountPercent: number;
};

export const DEFAULT_PRICING_SETTINGS: PricingSettings = {
  discountPercent: 0,
};

export function normalizeDiscountPercent(value: unknown): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(numeric)));
}

export function applyDiscount(amount: number, discountPercent: number): number {
  const normalizedDiscount = normalizeDiscountPercent(discountPercent);
  const discounted = amount * ((100 - normalizedDiscount) / 100);
  return Number(discounted.toFixed(2));
}

export function applyDiscountToRules(rules: CalculatorRules, discountPercent: number): CalculatorRules {
  const normalizedDiscount = normalizeDiscountPercent(discountPercent);
  if (normalizedDiscount <= 0) {
    return rules;
  }

  return {
    ...rules,
    packages: rules.packages.map((item) => ({
      ...item,
      basePrice: applyDiscount(item.basePrice, normalizedDiscount),
    })),
    addons: rules.addons.map((item) => ({
      ...item,
      price: applyDiscount(item.price, normalizedDiscount),
    })),
  };
}

export async function getPricingSettings(): Promise<PricingSettings> {
  if (!process.env.DATABASE_URL) {
    return DEFAULT_PRICING_SETTINGS;
  }

  try {
    const row = await prisma.pricingSettings.findUnique({
      where: { id: PRICING_SETTINGS_ID },
      select: { discountPercent: true },
    });

    return {
      discountPercent: normalizeDiscountPercent(row?.discountPercent),
    };
  } catch {
    return DEFAULT_PRICING_SETTINGS;
  }
}

export async function savePricingSettings(discountPercent: unknown): Promise<PricingSettings> {
  const normalizedDiscount = normalizeDiscountPercent(discountPercent);

  const row = await prisma.pricingSettings.upsert({
    where: { id: PRICING_SETTINGS_ID },
    create: {
      id: PRICING_SETTINGS_ID,
      discountPercent: normalizedDiscount,
    },
    update: {
      discountPercent: normalizedDiscount,
    },
    select: {
      discountPercent: true,
    },
  });

  return {
    discountPercent: normalizeDiscountPercent(row.discountPercent),
  };
}
