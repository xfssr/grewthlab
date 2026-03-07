"use client";

import { useLocaleContent } from "@/components/LocaleProvider";

export function LanguageToggle() {
  const { locale, setLocale } = useLocaleContent();

  return (
    <div className="inline-flex items-center rounded-full border border-stroke-subtle bg-bg-elevated p-1" role="group" aria-label="Language switch">
      <button
        type="button"
        onClick={() => setLocale("he")}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          locale === "he" ? "bg-accent-soft text-[#f1c992]" : "text-text-soft hover:text-text-primary"
        }`}
        aria-pressed={locale === "he"}
      >
        HE
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          locale === "en" ? "bg-accent-soft text-[#f1c992]" : "text-text-soft hover:text-text-primary"
        }`}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
