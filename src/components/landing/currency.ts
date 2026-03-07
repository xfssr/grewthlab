import type { Locale } from "@/core/site.types";

const localeMap: Record<Locale, string> = {
  he: "he-IL",
  en: "en-US",
};

export function formatCurrency(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(localeMap[locale], {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(amount);
}
