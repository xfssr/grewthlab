import { NextRequest } from "next/server";

import { GET, POST } from "@/app/api/leads/route";

describe("/api/leads route", () => {
  it("returns 400 when phone is missing", async () => {
    const req = new NextRequest("http://localhost/api/leads", {
      method: "POST",
      body: JSON.stringify({
        locale: "he",
        acquisitionChannel: "other",
        contact: {
          name: "Dana",
        },
        quote: {
          tierId: "business",
          priceRange: { min: 449, max: 799, currency: "ILS", period: "month" },
        },
        source: "landing_quote_form",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 200 for valid tier payload", async () => {
    const req = new NextRequest("http://localhost/api/leads", {
      method: "POST",
      body: JSON.stringify({
        locale: "en",
        acquisitionChannel: "paid_ads",
        contact: {
          name: "Alex",
          phone: "+972500000000",
        },
        quote: {
          tierId: "starter",
          priceRange: { min: 199, max: 299, currency: "ILS", period: "month" },
        },
        source: "landing_tier_pricing",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("returns 401 for unauthenticated lead list access", async () => {
    const req = new NextRequest("http://localhost/api/leads?limit=2", {
      method: "GET",
    });

    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});
