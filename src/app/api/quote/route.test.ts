import { NextRequest } from "next/server";

import { POST } from "@/app/api/quote/route";

describe("POST /api/quote", () => {
  it("returns tier quote for valid tier payload", async () => {
    const req = new NextRequest("http://localhost/api/quote", {
      method: "POST",
      body: JSON.stringify({
        locale: "he",
        tierId: "starter",
        intakeSource: "instagram_menu",
        languageBundle: "he_ru_en",
        voiceMode: "empathetic",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      tier: { id: string; publicName: string };
      priceRange: { min: number; max: number; currency: string; period: string };
      whatsappText: string;
    };

    expect(body.tier.id).toBe("starter");
    expect(body.priceRange.min).toBe(199);
    expect(body.priceRange.max).toBe(299);
    expect(body.priceRange.currency).toBe("ILS");
    expect(typeof body.whatsappText).toBe("string");
    expect(body.whatsappText).toContain("48 שעות");
  });

  it("maps legacy package payload to business tier", async () => {
    const req = new NextRequest("http://localhost/api/quote", {
      method: "POST",
      body: JSON.stringify({
        locale: "en",
        packageId: "qr-menu-mini-site",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { tier: { id: string }; whatsappText: string };
    expect(body.tier.id).toBe("business");
    expect(body.whatsappText).toContain("legacy package format");
  });

  it("returns 400 for invalid payload", async () => {
    const req = new NextRequest("http://localhost/api/quote", {
      method: "POST",
      body: JSON.stringify({
        locale: "he",
        intakeSource: "instagram",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
