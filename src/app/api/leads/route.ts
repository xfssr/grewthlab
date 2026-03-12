import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/app/api/_auth";
import { getTierDefinition, mapLegacyPackageToTier } from "@/core/pricing/tier-model";
import { ACQUISITION_CHANNELS, LOCALES, PACKAGE_IDS, TIER_IDS } from "@/core/site.types";
import { appendLead, listLeads } from "@/lib/db";

export const runtime = "nodejs";

const legacyBreakdownItemSchema = z.object({
  label: z.string().min(1).max(120),
  amount: z.number().int(),
});

const leadSchema = z.object({
  locale: z.enum(LOCALES),
  acquisitionChannel: z.enum(ACQUISITION_CHANNELS).default("other"),
  contact: z.object({
    name: z.string().trim().min(1).max(120),
    phone: z.string().trim().min(6).max(50),
    business: z.string().trim().max(120).optional(),
    message: z.string().trim().max(800).optional(),
  }),
  quote: z.union([
    z.object({
      tierId: z.enum(TIER_IDS),
      priceRange: z.object({
        min: z.number().int().min(0),
        max: z.number().int().min(0),
        currency: z.literal("ILS"),
        period: z.literal("month"),
      }),
      legacyPackageId: z.enum(PACKAGE_IDS).optional(),
    }),
    z.object({
      packageId: z.enum(PACKAGE_IDS),
      total: z.number().int().min(0),
      breakdown: z.array(legacyBreakdownItemSchema),
    }),
  ]),
  source: z.enum(["landing_tier_pricing", "landing_quote_form", "legacy_package_calculator", "landing_calculator"]),
});

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const limitRaw = request.nextUrl.searchParams.get("limit") ?? "20";
  const limitParsed = z.coerce.number().int().min(1).max(100).safeParse(limitRaw);
  if (!limitParsed.success) {
    return NextResponse.json({ error: "Invalid limit parameter." }, { status: 400 });
  }

  const items = await listLeads(limitParsed.data);
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
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

  const input = parsed.data;
  const normalizedSource = input.source === "landing_calculator" ? "legacy_package_calculator" : input.source;
  const normalizedQuote =
    "tierId" in input.quote
      ? input.quote
      : {
          tierId: mapLegacyPackageToTier(input.quote.packageId),
          priceRange: getTierDefinition(mapLegacyPackageToTier(input.quote.packageId)).priceRange,
          legacyPackageId: input.quote.packageId,
        };

  const now = new Date();
  const record = {
    id: `lead_${now.toISOString().slice(0, 10).replace(/-/g, "")}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now.toISOString(),
    locale: input.locale,
    acquisitionChannel: input.acquisitionChannel,
    contact: input.contact,
    quote: normalizedQuote,
    source: normalizedSource,
  };

  await appendLead(record);
  return NextResponse.json({ id: record.id, status: "stored" });
}
