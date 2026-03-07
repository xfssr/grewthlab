import { buildWhatsAppMessage, toWhatsAppUrl } from "@/core/pricing/whatsapp-template";
import type { QuoteResult } from "@/core/site.types";

const quote: QuoteResult = {
  currency: "ILS",
  subtotal: 4400,
  total: 4400,
  breakdown: [
    { label: "Base package", amount: 2500 },
    { label: "Niche multiplier", amount: 0 },
    { label: "Delivery mode", amount: 0 },
    { label: "Add-ons", amount: 1900 },
  ],
  vatIncluded: false,
};

describe("whatsapp-template", () => {
  it("builds english message", () => {
    const text = buildWhatsAppMessage({
      locale: "en",
      packageTitle: "QR Menu + Mini Site",
      nicheLabel: "Restaurants",
      deliveryLabel: "Standard",
      addonLabels: ["Extra production day"],
      quote,
      notes: "Need launch in 2 weeks",
    });

    expect(text).toContain("Package: QR Menu + Mini Site");
    expect(text).toContain("Estimated total: ₪4,400");
    expect(text).toContain("Notes: Need launch in 2 weeks");
  });

  it("builds hebrew message", () => {
    const text = buildWhatsAppMessage({
      locale: "he",
      packageTitle: "תפריט QR + מיני-אתר",
      nicheLabel: "מסעדות",
      deliveryLabel: "רגיל",
      addonLabels: [],
      quote,
    });

    expect(text).toContain("חבילה: תפריט QR + מיני-אתר");
    expect(text).toContain("סה״כ משוער: ₪4,400");
  });

  it("builds wa.me url", () => {
    const url = toWhatsAppUrl("+972 50 111 2222", "Hello");
    expect(url).toBe("https://wa.me/972501112222?text=Hello");
  });
});
