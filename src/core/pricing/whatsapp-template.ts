import type { Locale, QuoteResult } from "@/core/site.types";

type WhatsAppTemplateInput = {
  locale: Locale;
  packageTitle: string;
  nicheLabel: string;
  deliveryLabel: string;
  addonLabels: string[];
  quote: QuoteResult;
  notes?: string;
};

function formatShekel(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const absolute = Math.abs(amount);
  return `${sign}₪${absolute.toLocaleString("en-US")}`;
}

export function buildWhatsAppMessage(input: WhatsAppTemplateInput): string {
  const addonText = input.addonLabels.length ? input.addonLabels.join(", ") : input.locale === "he" ? "ללא" : "None";

  const breakdownText = input.quote.breakdown
    .map((item) => `- ${item.label}: ${formatShekel(item.amount)}`)
    .join("\n");

  if (input.locale === "he") {
    const notesLine = input.notes ? `\nהערות: ${input.notes}` : "";

    return [
      "שלום, אני רוצה הצעת מחיר.",
      `חבילה: ${input.packageTitle}`,
      `תחום: ${input.nicheLabel}`,
      `מסלול אספקה: ${input.deliveryLabel}`,
      `תוספות: ${addonText}`,
      `סה״כ משוער: ${formatShekel(input.quote.total)}`,
      "",
      "פירוט:",
      breakdownText,
      notesLine,
    ]
      .filter(Boolean)
      .join("\n");
  }

  const notesLine = input.notes ? `\nNotes: ${input.notes}` : "";

  return [
    "Hi, I want a quote for this package.",
    `Package: ${input.packageTitle}`,
    `Niche: ${input.nicheLabel}`,
    `Delivery mode: ${input.deliveryLabel}`,
    `Add-ons: ${addonText}`,
    `Estimated total: ${formatShekel(input.quote.total)}`,
    "",
    "Breakdown:",
    breakdownText,
    notesLine,
  ]
    .filter(Boolean)
    .join("\n");
}

export function toWhatsAppUrl(phoneDigits: string, message: string): string {
  const cleanPhone = phoneDigits.replace(/[^\d]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
