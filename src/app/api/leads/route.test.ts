import { NextRequest } from "next/server";

import { GET, POST } from "@/app/api/leads/route";

describe("/api/leads route", () => {
  it("returns 400 when phone is missing", async () => {
    const req = new NextRequest("http://localhost/api/leads", {
      method: "POST",
      body: JSON.stringify({
        locale: "he",
        contact: {
          name: "Dana",
        },
        quote: {
          packageId: "qr-menu-mini-site",
          total: 4400,
          breakdown: [],
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

  it("returns list response shape", async () => {
    const req = new NextRequest("http://localhost/api/leads?limit=2", {
      method: "GET",
    });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { items: unknown[] };
    expect(Array.isArray(body.items)).toBe(true);
  });
});
