import { NextRequest } from "next/server";

import { POST } from "@/app/api/quote/route";

describe("POST /api/quote", () => {
  it("returns quote for valid payload", async () => {
    const req = new NextRequest("http://localhost/api/quote", {
      method: "POST",
      body: JSON.stringify({
        locale: "he",
        niche: "restaurants",
        packageId: "qr-menu-mini-site",
        deliveryMode: "standard",
        addons: ["extra_production_day", "monthly_ad_creatives"],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { total: number; whatsappText: string };
    expect(body.total).toBe(4400);
    expect(typeof body.whatsappText).toBe("string");
  });

  it("returns 400 for invalid payload", async () => {
    const req = new NextRequest("http://localhost/api/quote", {
      method: "POST",
      body: JSON.stringify({
        locale: "he",
        niche: "restaurants",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
