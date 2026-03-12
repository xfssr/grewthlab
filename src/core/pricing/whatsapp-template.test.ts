import { buildWhatsAppMessage, toWhatsAppUrl } from "@/core/pricing/whatsapp-template";
import { getTierDefinition } from "@/core/pricing/tier-model";

describe("whatsapp-template", () => {
  it("builds english message from tier metadata", () => {
    const text = buildWhatsAppMessage({
      locale: "en",
      tier: getTierDefinition("business"),
      intakeSource: "instagram_menu",
      languageBundle: "he_ru_en_ar",
      voiceMode: "empathetic",
      notes: "Need fast kickoff",
    });

    expect(text).toContain("Tier: Business");
    expect(text).toContain("Price range: \u20AA449-\u20AA799 / month");
    expect(text).toContain("Expectation: first output is delivered within 48 hours.");
    expect(text).toContain("Language bundle: Hebrew + Russian + English + Arabic");
    expect(text).toContain("Notes: Need fast kickoff");
  });

  it("builds hebrew message with legacy mapping note", () => {
    const text = buildWhatsAppMessage({
      locale: "he",
      tier: getTierDefinition("business"),
      intakeSource: "menu",
      languageBundle: "he_en",
      voiceMode: "neutral",
      legacyPayloadMapped: true,
    });

    expect(text).toContain("Tier: Business");
    expect(text).toContain("הפלט הראשון מגיע תוך 48 שעות");
    expect(text).toContain("הבקשה התקבלה בפורמט ישן");
  });

  it("builds wa.me url", () => {
    const url = toWhatsAppUrl("+972 50 111 2222", "Hello");
    expect(url).toBe("https://wa.me/972501112222?text=Hello");
  });
});
