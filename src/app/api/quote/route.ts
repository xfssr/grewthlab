import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { buildWhatsAppMessage } from "@/core/pricing/whatsapp-template";
import { getTierDefinition } from "@/core/pricing/tier-model";
import { INTAKE_SOURCES, LANGUAGE_BUNDLES, LOCALES, PACKAGE_IDS, TIER_IDS, VOICE_MODES } from "@/core/site.types";

export const runtime = "nodejs";

const tierQuoteRequestSchema = z.object({
  locale: z.enum(LOCALES).default("he"),
  tierId: z.enum(TIER_IDS),
  intakeSource: z.enum(INTAKE_SOURCES),
  languageBundle: z.enum(LANGUAGE_BUNDLES),
  voiceMode: z.enum(VOICE_MODES),
  notes: z.string().trim().max(500).optional(),
});

const legacyPackageRequestSchema = z.object({
  locale: z.enum(LOCALES).default("he"),
  packageId: z.enum(PACKAGE_IDS),
  intakeSource: z.enum(INTAKE_SOURCES).default("instagram_menu"),
  languageBundle: z.enum(LANGUAGE_BUNDLES).default("he_ru_en"),
  voiceMode: z.enum(VOICE_MODES).default("empathetic"),
  notes: z.string().trim().max(500).optional(),
});

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const tierParsed = tierQuoteRequestSchema.safeParse(payload);
  if (tierParsed.success) {
    const input = tierParsed.data;
    const tier = getTierDefinition(input.tierId);
    const whatsappText = buildWhatsAppMessage({
      locale: input.locale,
      tier,
      intakeSource: input.intakeSource,
      languageBundle: input.languageBundle,
      voiceMode: input.voiceMode,
      notes: input.notes,
    });

    return NextResponse.json({
      tier,
      priceRange: tier.priceRange,
      whatsappText,
    });
  }

  const legacyParsed = legacyPackageRequestSchema.safeParse(payload);
  if (legacyParsed.success) {
    const input = legacyParsed.data;
    const tier = getTierDefinition("business");
    const whatsappText = buildWhatsAppMessage({
      locale: input.locale,
      tier,
      intakeSource: input.intakeSource,
      languageBundle: input.languageBundle,
      voiceMode: input.voiceMode,
      notes: input.notes,
      legacyPayloadMapped: true,
    });

    return NextResponse.json({
      tier,
      priceRange: tier.priceRange,
      whatsappText,
    });
  }

  return NextResponse.json(
    {
      error: "Validation failed.",
      issues: tierParsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    },
    { status: 400 },
  );
}
