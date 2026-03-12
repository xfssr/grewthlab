"use client";

import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { BrandButton } from "@/components/landing/ui/BrandButton";
import { SectionHeading } from "@/components/landing/ui/SectionHeading";
import { SectionShell } from "@/components/landing/ui/SectionShell";
import { SpotlightFrame } from "@/components/landing/ui/SpotlightFrame";
import { SurfaceCard } from "@/components/landing/ui/SurfaceCard";
import type { IntakeSourceId, LanguageBundleId, Locale, TierId, VoiceModeId } from "@/core/site.types";

type PricingSectionProps = {
  locale: Locale;
  title: string;
  description: string;
  vatNote: string;
  tiers: Array<{
    id: TierId;
    publicName: string;
    description: string;
    priceRangeLabel: string;
    features: string[];
    ctaLabel: string;
    recommended?: boolean;
  }>;
  notesPlaceholder: string;
  selectedTierId: TierId;
  selectedIntakeSource: IntakeSourceId;
  selectedLanguageBundle: LanguageBundleId;
  selectedVoiceMode: VoiceModeId;
  notes: string;
  quoteLoading: boolean;
  onTierChange: (value: TierId) => void;
  onIntakeSourceChange: (value: IntakeSourceId) => void;
  onLanguageBundleChange: (value: LanguageBundleId) => void;
  onVoiceModeChange: (value: VoiceModeId) => void;
  onNotesChange: (value: string) => void;
  onOpenWhatsApp: () => void;
};

export function PricingSection({
  locale,
  title,
  description,
  vatNote,
  tiers,
  notesPlaceholder,
  selectedTierId,
  selectedIntakeSource,
  selectedLanguageBundle,
  selectedVoiceMode,
  notes,
  quoteLoading,
  onTierChange,
  onIntakeSourceChange,
  onLanguageBundleChange,
  onVoiceModeChange,
  onNotesChange,
  onOpenWhatsApp,
}: PricingSectionProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.2);
  const selectedTier = tiers.find((tier) => tier.id === selectedTierId) ?? tiers[0];
  const settingsTitle = locale === "he" ? "הגדרות התחלה" : "Kickoff settings";
  const intakeSourceLabel = locale === "he" ? "מקור חומרים" : "Kickoff input";
  const languageBundleLabel = locale === "he" ? "חבילת שפות" : "Language bundle";
  const voiceModeLabel = locale === "he" ? "טון כתיבה" : "Voice mode";
  const notesLabel = locale === "he" ? "הערות" : "Notes";

  const intakeOptions: Array<{ id: IntakeSourceId; label: string }> =
    locale === "he"
      ? [
          { id: "instagram", label: "Instagram" },
          { id: "menu", label: "תפריט / PDF" },
          { id: "instagram_menu", label: "Instagram + תפריט" },
          { id: "other", label: "אחר" },
        ]
      : [
          { id: "instagram", label: "Instagram profile" },
          { id: "menu", label: "Menu / PDF" },
          { id: "instagram_menu", label: "Instagram + menu" },
          { id: "other", label: "Other" },
        ];

  const languageOptions: Array<{ id: LanguageBundleId; label: string }> =
    locale === "he"
      ? [
          { id: "he_ru_en", label: "עברית + רוסית + אנגלית" },
          { id: "he_en", label: "עברית + אנגלית" },
          { id: "he_ru_en_ar", label: "עברית + רוסית + אנגלית + ערבית" },
        ]
      : [
          { id: "he_ru_en", label: "Hebrew + Russian + English" },
          { id: "he_en", label: "Hebrew + English" },
          { id: "he_ru_en_ar", label: "Hebrew + Russian + English + Arabic" },
        ];

  const voiceOptions: Array<{ id: VoiceModeId; label: string }> =
    locale === "he"
      ? [
          { id: "empathetic", label: "טון אנושי / מכיל" },
          { id: "neutral", label: "טון ניטרלי" },
        ]
      : [
          { id: "empathetic", label: "Empathetic human tone" },
          { id: "neutral", label: "Neutral business tone" },
        ];

  return (
    <SectionShell id="pricing" className="border-b border-stroke-subtle py-12 sm:py-14" ariaLabelledBy="pricing-title">
      <SpotlightFrame
        imageSrc="/images/generated/case-solution.webp"
        imageAlt={locale === "he" ? "תמחור לפי tiers" : "Tier-first pricing"}
        aside={
          <>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-text-soft">
              {locale === "he" ? "tier נבחר" : "Selected tier"}
            </p>
            <div className="mt-3 space-y-2 text-sm text-text-primary/90">
              <p>{selectedTier?.publicName}</p>
              <p>{selectedTier?.priceRangeLabel}</p>
              <p>{locale === "he" ? "הפלט הראשון תוך 48 שעות" : "First output within 48 hours"}</p>
            </div>
          </>
        }
      >
        <SectionHeading id="pricing-title" eyebrow={locale === "he" ? "מחירים" : "Pricing"} title={title} description={description} />

        <motion.div variants={staggerParent} {...reveal} className="mt-7 grid gap-4 lg:grid-cols-3">
          {tiers.map((tier) => {
            const selected = tier.id === selectedTierId;
            return (
              <motion.button
                key={tier.id}
                variants={fadeUp}
                type="button"
                onClick={() => onTierChange(tier.id)}
                className={`text-start ${selected ? "scale-[1.01]" : ""}`}
              >
                <SurfaceCard
                  className={`h-full rounded-[1.4rem] border p-5 transition sm:p-6 ${
                    selected
                      ? "border-accent-primary/75 bg-[linear-gradient(150deg,rgba(34,27,20,0.75),rgba(20,27,39,0.84))]"
                      : "border-white/12 bg-black/16 hover:border-stroke-strong"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-2xl font-semibold text-text-primary">{tier.publicName}</h3>
                    {tier.recommended ? (
                      <span className="rounded-full border border-accent-primary/55 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-primary">
                        {locale === "he" ? "מומלץ" : "Recommended"}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-lg font-semibold text-accent-primary">{tier.priceRangeLabel}</p>
                  <p className="mt-3 text-sm text-text-muted">{tier.description}</p>
                  <ul className="mt-4 space-y-2 text-sm text-text-primary/90">
                    {tier.features.map((feature) => (
                      <li key={`${tier.id}-${feature}`} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </SurfaceCard>
              </motion.button>
            );
          })}
        </motion.div>

        <SurfaceCard className="mt-5 rounded-[1.5rem] border-white/12 bg-black/16 p-5 sm:p-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.13em] text-text-soft">{settingsTitle}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{intakeSourceLabel}</span>
              <select
                value={selectedIntakeSource}
                onChange={(event) => onIntakeSourceChange(event.target.value as IntakeSourceId)}
                className="w-full rounded-2xl border border-white/12 bg-black/24 px-4 py-3 text-base font-medium text-text-primary outline-none ring-offset-2 focus:ring-2 focus:ring-accent-primary"
              >
                {intakeOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{languageBundleLabel}</span>
              <select
                value={selectedLanguageBundle}
                onChange={(event) => onLanguageBundleChange(event.target.value as LanguageBundleId)}
                className="w-full rounded-2xl border border-white/12 bg-black/24 px-4 py-3 text-base font-medium text-text-primary outline-none ring-offset-2 focus:ring-2 focus:ring-accent-primary"
              >
                {languageOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{voiceModeLabel}</span>
              <select
                value={selectedVoiceMode}
                onChange={(event) => onVoiceModeChange(event.target.value as VoiceModeId)}
                className="w-full rounded-2xl border border-white/12 bg-black/24 px-4 py-3 text-base font-medium text-text-primary outline-none ring-offset-2 focus:ring-2 focus:ring-accent-primary"
              >
                {voiceOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{notesLabel}</span>
            <textarea
              rows={3}
              value={notes}
              onChange={(event) => onNotesChange(event.target.value)}
              placeholder={notesPlaceholder}
              className="w-full rounded-2xl border border-white/12 bg-black/24 px-4 py-3 text-base leading-relaxed text-text-primary outline-none ring-offset-2 placeholder:text-text-soft focus:ring-2 focus:ring-accent-primary"
            />
          </label>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-text-soft">{vatNote}</p>
            <BrandButton onClick={onOpenWhatsApp} disabled={quoteLoading} className="w-full disabled:opacity-60 sm:w-auto" size="lg">
              {quoteLoading ? "..." : selectedTier?.ctaLabel}
            </BrandButton>
          </div>
        </SurfaceCard>
      </SpotlightFrame>
    </SectionShell>
  );
}
