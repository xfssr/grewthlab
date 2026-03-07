import type {
  AddonId,
  CalculatorInput,
  CalculatorRules,
  Locale,
  PriceBreakdownItem,
  QuoteResult,
} from "@/core/site.types";

export class QuoteEngineError extends Error {
  constructor(
    public readonly code: "UNKNOWN_PACKAGE" | "UNKNOWN_NICHE" | "UNKNOWN_DELIVERY_MODE" | "UNKNOWN_ADDON",
    message: string,
  ) {
    super(message);
    this.name = "QuoteEngineError";
  }
}

const breakdownLabels: Record<
  Locale,
  {
    base: string;
    niche: string;
    delivery: string;
    addons: string;
    rounding: string;
  }
> = {
  en: {
    base: "Base package",
    niche: "Niche multiplier",
    delivery: "Delivery mode",
    addons: "Add-ons",
    rounding: "Rounding",
  },
  he: {
    base: "חבילת בסיס",
    niche: "התאמת נישה",
    delivery: "מצב אספקה",
    addons: "תוספות",
    rounding: "עיגול",
  },
};

function roundToNearest(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function roundCurrency(value: number): number {
  return Math.round(value);
}

function uniqueAddons(addons: AddonId[]): AddonId[] {
  return Array.from(new Set(addons));
}

export function calculateQuote(input: CalculatorInput, rules: CalculatorRules): QuoteResult {
  const packagePriceMap = new Map(rules.packages.map((item) => [item.id, item.basePrice]));
  const addonPriceMap = new Map(rules.addons.map((item) => [item.id, item.price]));

  const basePrice = packagePriceMap.get(input.packageId);
  if (typeof basePrice !== "number") {
    throw new QuoteEngineError("UNKNOWN_PACKAGE", `Unknown package: ${input.packageId}`);
  }

  const nicheMultiplier = rules.nicheMultipliers[input.niche];
  if (typeof nicheMultiplier !== "number") {
    throw new QuoteEngineError("UNKNOWN_NICHE", `Unknown niche: ${input.niche}`);
  }

  const deliveryMultiplier = rules.deliveryMultipliers[input.deliveryMode];
  if (typeof deliveryMultiplier !== "number") {
    throw new QuoteEngineError("UNKNOWN_DELIVERY_MODE", `Unknown delivery mode: ${input.deliveryMode}`);
  }

  const addons = uniqueAddons(input.addons);
  const addonsTotal = addons.reduce((sum, addonId) => {
    const addonPrice = addonPriceMap.get(addonId);
    if (typeof addonPrice !== "number") {
      throw new QuoteEngineError("UNKNOWN_ADDON", `Unknown add-on: ${addonId}`);
    }

    return sum + addonPrice;
  }, 0);

  const nicheAdjustedBase = basePrice * nicheMultiplier;
  const deliveryAdjustedBase = nicheAdjustedBase * deliveryMultiplier;

  const baseLine = roundCurrency(basePrice);
  const nicheAdjustment = roundCurrency(nicheAdjustedBase - basePrice);
  const deliveryAdjustment = roundCurrency(deliveryAdjustedBase - nicheAdjustedBase);
  const addonsLine = roundCurrency(addonsTotal);

  const subtotal = roundCurrency(baseLine + nicheAdjustment + deliveryAdjustment + addonsLine);
  const total = roundToNearest(subtotal, rules.roundTo);
  const roundingAdjustment = total - subtotal;

  const labels = breakdownLabels[input.locale];

  const breakdown: PriceBreakdownItem[] = [
    { label: labels.base, amount: baseLine },
    { label: labels.niche, amount: nicheAdjustment },
    { label: labels.delivery, amount: deliveryAdjustment },
    { label: labels.addons, amount: addonsLine },
  ];

  if (roundingAdjustment !== 0) {
    breakdown.push({ label: labels.rounding, amount: roundingAdjustment });
  }

  return {
    currency: rules.currency,
    subtotal,
    total,
    breakdown,
    vatIncluded: false,
  };
}
