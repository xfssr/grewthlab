import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getCalculatorRules, getSiteContent } from "@/core/site.content";
import { buildWhatsAppMessage } from "@/core/pricing/whatsapp-template";
import { calculateQuote, QuoteEngineError } from "@/core/pricing/quote-engine";
import { ADDON_IDS, DELIVERY_MODES, LOCALES, NICHE_IDS, PACKAGE_IDS } from "@/core/site.types";

export const runtime = "nodejs";

const quoteRequestSchema = z.object({
  locale: z.enum(LOCALES).default("he"),
  niche: z.enum(NICHE_IDS),
  packageId: z.enum(PACKAGE_IDS),
  deliveryMode: z.enum(DELIVERY_MODES).default("standard"),
  addons: z.array(z.enum(ADDON_IDS)).default([]),
  notes: z.string().trim().max(500).optional(),
});

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = quoteRequestSchema.safeParse(payload);
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
  const content = getSiteContent(input.locale);
  const rules = getCalculatorRules();

  try {
    const quote = calculateQuote(input, rules);

    const packageTitle =
      content.pricing.packageOptions.find((item) => item.id === input.packageId)?.label || input.packageId;
    const nicheLabel = content.pricing.niches.find((item) => item.id === input.niche)?.label || input.niche;
    const deliveryLabel =
      content.pricing.deliveryModes.find((item) => item.id === input.deliveryMode)?.label || input.deliveryMode;
    const addonLabels = input.addons
      .map((addonId) => content.pricing.addonOptions.find((item) => item.id === addonId)?.label)
      .filter((value): value is string => Boolean(value));

    const whatsappText = buildWhatsAppMessage({
      locale: input.locale,
      packageTitle,
      nicheLabel,
      deliveryLabel,
      addonLabels,
      quote,
      notes: input.notes,
    });

    return NextResponse.json({
      ...quote,
      whatsappText,
    });
  } catch (error) {
    if (error instanceof QuoteEngineError) {
      return NextResponse.json(
        {
          error: "Quote engine validation failed.",
          code: error.code,
          message: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Internal quote error." }, { status: 500 });
  }
}
