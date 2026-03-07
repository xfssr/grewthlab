import rulesRaw from "@/data/calculator.rules.json";
import { calculateQuote, QuoteEngineError } from "@/core/pricing/quote-engine";
import type { CalculatorRules } from "@/core/site.types";

const rules = rulesRaw as CalculatorRules;

describe("quote-engine", () => {
  it("calculates total for standard package with add-ons", () => {
    const quote = calculateQuote(
      {
        locale: "he",
        niche: "restaurants",
        packageId: "qr-menu-mini-site",
        deliveryMode: "standard",
        addons: ["extra_production_day", "monthly_ad_creatives"],
      },
      rules,
    );

    expect(quote.currency).toBe("ILS");
    expect(quote.subtotal).toBe(4400);
    expect(quote.total).toBe(4400);
    expect(quote.breakdown.find((item) => item.label.includes("תוספות"))?.amount).toBe(1900);
  });

  it("applies niche and delivery multipliers with rounding to 50", () => {
    const quote = calculateQuote(
      {
        locale: "en",
        niche: "real-estate",
        packageId: "quick-start-system",
        deliveryMode: "express",
        addons: [],
      },
      rules,
    );

    expect(quote.total % 50).toBe(0);
    expect(quote.total).toBeGreaterThan(quote.subtotal - 50);
  });

  it("throws controlled error for unknown add-on", () => {
    expect(() =>
      calculateQuote(
        {
          locale: "en",
          niche: "restaurants",
          packageId: "qr-menu-mini-site",
          deliveryMode: "standard",
          addons: ["extra_production_day", "unknown_addon" as never],
        },
        rules,
      ),
    ).toThrowError(QuoteEngineError);
  });
});
