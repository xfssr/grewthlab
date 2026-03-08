import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/app/api/_auth";
import { getPricingSettings, savePricingSettings } from "@/lib/pricing-settings";

export const runtime = "nodejs";

const pricingSettingsSchema = z.object({
  discountPercent: z.coerce.number().min(0).max(100),
});

export async function GET() {
  const settings = await getPricingSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = pricingSettingsSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const settings = await savePricingSettings(parsed.data.discountPercent);
  return NextResponse.json({ settings });
}
