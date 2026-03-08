import rulesRaw from "@/data/calculator.rules.json";
import type { CalculatorRules } from "@/core/site.types";
import { applyDiscount, applyDiscountToRules, normalizeDiscountPercent } from "@/lib/pricing-settings";

const rules = rulesRaw as CalculatorRules;

describe("pricing-settings", () => {
  it("clamps discount percent to a safe range", () => {
    expect(normalizeDiscountPercent(-10)).toBe(0);
    expect(normalizeDiscountPercent(17.6)).toBe(18);
    expect(normalizeDiscountPercent(140)).toBe(100);
  });

  it("applies discount to plain amounts", () => {
    expect(applyDiscount(2500, 10)).toBe(2250);
    expect(applyDiscount(999, 15)).toBe(849.15);
  });

  it("applies discount to package and add-on rules", () => {
    const discountedRules = applyDiscountToRules(rules, 10);

    expect(discountedRules.packages.find((item) => item.id === "qr-menu-mini-site")?.basePrice).toBe(2250);
    expect(discountedRules.addons.find((item) => item.id === "extra_production_day")?.price).toBe(810);
  });
});
