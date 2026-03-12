import type { IntakeSourceId, LanguageBundleId, Locale, TierDefinition, VoiceModeId } from "@/core/site.types";

type WhatsAppTemplateInput = {
  locale: Locale;
  tier: TierDefinition;
  intakeSource: IntakeSourceId;
  languageBundle: LanguageBundleId;
  voiceMode: VoiceModeId;
  notes?: string;
  legacyPayloadMapped?: boolean;
};

function formatPrice(amount: number): string {
  return `\u20AA${amount.toLocaleString("en-US")}`;
}

function intakeSourceLabel(locale: Locale, value: IntakeSourceId): string {
  const heLabels: Record<IntakeSourceId, string> = {
    instagram: "Instagram",
    menu: "תפריט / PDF",
    instagram_menu: "Instagram + תפריט",
    other: "אחר",
  };
  const enLabels: Record<IntakeSourceId, string> = {
    instagram: "Instagram profile",
    menu: "Menu / PDF",
    instagram_menu: "Instagram + menu",
    other: "Other",
  };
  return locale === "he" ? heLabels[value] : enLabels[value];
}

function languageBundleLabel(locale: Locale, value: LanguageBundleId): string {
  const heLabels: Record<LanguageBundleId, string> = {
    he_ru_en: "עברית + רוסית + אנגלית",
    he_en: "עברית + אנגלית",
    he_ru_en_ar: "עברית + רוסית + אנגלית + ערבית",
  };
  const enLabels: Record<LanguageBundleId, string> = {
    he_ru_en: "Hebrew + Russian + English",
    he_en: "Hebrew + English",
    he_ru_en_ar: "Hebrew + Russian + English + Arabic",
  };
  return locale === "he" ? heLabels[value] : enLabels[value];
}

function voiceModeLabel(locale: Locale, value: VoiceModeId): string {
  if (locale === "he") {
    return value === "neutral" ? "טון ניטרלי" : "טון אנושי / מכיל";
  }
  return value === "neutral" ? "Neutral business tone" : "Empathetic human tone";
}

export function buildWhatsAppMessage(input: WhatsAppTemplateInput): string {
  const range = `${formatPrice(input.tier.priceRange.min)}-${formatPrice(input.tier.priceRange.max)}`;
  const intake = intakeSourceLabel(input.locale, input.intakeSource);
  const languageBundle = languageBundleLabel(input.locale, input.languageBundle);
  const voiceMode = voiceModeLabel(input.locale, input.voiceMode);

  if (input.locale === "he") {
    return [
      "שלום, אני רוצה להתחיל מסלול שירות.",
      `Tier: ${input.tier.publicName}`,
      `טווח מחיר: ${range} לחודש`,
      "תיאום ציפיות: הפלט הראשון מגיע תוך 48 שעות.",
      `מקור חומרים: ${intake}`,
      `חבילת שפות: ${languageBundle}`,
      `טון כתיבה: ${voiceMode}`,
      input.legacyPayloadMapped ? "הערה: הבקשה התקבלה בפורמט ישן ומופתה זמנית ל-Business." : "",
      input.notes ? `הערות: ${input.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    "Hi, I want to start with your service tier.",
    `Tier: ${input.tier.publicName}`,
    `Price range: ${range} / month`,
    "Expectation: first output is delivered within 48 hours.",
    `Kickoff input: ${intake}`,
    `Language bundle: ${languageBundle}`,
    `Voice mode: ${voiceMode}`,
    input.legacyPayloadMapped ? "Note: request arrived in legacy package format and was temporarily mapped to Business." : "",
    input.notes ? `Notes: ${input.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function toWhatsAppUrl(phoneDigits: string, message: string): string {
  const cleanPhone = phoneDigits.replace(/[^\d]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
