"use client";

import { motion } from "framer-motion";

import { formatCurrency } from "@/components/landing/currency";
import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { BrandButton } from "@/components/landing/ui/BrandButton";
import { SectionHeading } from "@/components/landing/ui/SectionHeading";
import { SectionShell } from "@/components/landing/ui/SectionShell";
import { SpotlightFrame } from "@/components/landing/ui/SpotlightFrame";
import { SurfaceCard } from "@/components/landing/ui/SurfaceCard";
import type {
  AddonId,
  DeliveryMode,
  Locale,
  NicheId,
  PackageId,
  PriceBreakdownItem,
  QuoteResult,
} from "@/core/site.types";

type PricingSectionProps = {
  locale: Locale;
  title: string;
  description: string;
  vatNote: string;
  labels: {
    niche: string;
    packageType: string;
    deliveryMode: string;
    estimate: string;
    addons: string;
    notes: string;
    breakdown: string;
  };
  openWhatsAppCta: string;
  packageOptions: Array<{ id: PackageId; label: string }>;
  niches: Array<{ id: NicheId; label: string }>;
  deliveryModes: Array<{ id: DeliveryMode; label: string }>;
  addonOptions: Array<{ id: AddonId; label: string; priceLabel: string }>;
  notesPlaceholder: string;
  selectedPackageId: PackageId;
  selectedNiche: NicheId;
  selectedDeliveryMode: DeliveryMode;
  selectedAddons: AddonId[];
  notes: string;
  quote: QuoteResult;
  quoteLoading: boolean;
  onPackageChange: (value: PackageId) => void;
  onNicheChange: (value: NicheId) => void;
  onDeliveryModeChange: (value: DeliveryMode) => void;
  onToggleAddon: (addonId: AddonId) => void;
  onNotesChange: (value: string) => void;
  onOpenWhatsApp: () => void;
};

type BreakdownListProps = {
  locale: Locale;
  title: string;
  items: PriceBreakdownItem[];
};

function BreakdownList({ locale, title, items }: BreakdownListProps) {
  return (
    <SurfaceCard className="rounded-[1.7rem] border-white/12 bg-black/18 p-4 sm:p-5">
      <h3 className="ui-kicker">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={`${item.label}-${item.amount}`} className="flex items-center justify-between gap-3">
            <span className="text-text-primary">{item.label}</span>
            <span className="ui-price-tag text-xs">{formatCurrency(item.amount, locale)}</span>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}

export function PricingSection({
  locale,
  title,
  description,
  vatNote,
  labels,
  openWhatsAppCta,
  packageOptions,
  niches,
  deliveryModes,
  addonOptions,
  notesPlaceholder,
  selectedPackageId,
  selectedNiche,
  selectedDeliveryMode,
  selectedAddons,
  notes,
  quote,
  quoteLoading,
  onPackageChange,
  onNicheChange,
  onDeliveryModeChange,
  onToggleAddon,
  onNotesChange,
  onOpenWhatsApp,
}: PricingSectionProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.22);
  const subtotalLabel = locale === "he" ? "\u05e1\u05db\u05d5\u05dd \u05d1\u05d9\u05e0\u05d9\u05d9\u05dd" : "Subtotal";
  const eyebrow = locale === "he" ? "\u05de\u05d7\u05e9\u05d1\u05d5\u05df" : "Calculator";
  const summaryTitle = locale === "he" ? "\u05ea\u05de\u05d5\u05e0\u05ea \u05de\u05e1\u05dc\u05d5\u05dc" : "Path summary";
  const summaryPackageLabel = locale === "he" ? "\u05d7\u05d1\u05d9\u05dc\u05d4" : "Package";
  const summaryNicheLabel = locale === "he" ? "\u05ea\u05d7\u05d5\u05dd" : "Niche";
  const summaryModeLabel = locale === "he" ? "\u05e7\u05e6\u05d1" : "Delivery";
  const selectedPackageLabel = packageOptions.find((pkg) => pkg.id === selectedPackageId)?.label || "-";
  const selectedNicheLabel = niches.find((niche) => niche.id === selectedNiche)?.label || "-";
  const selectedModeLabel = deliveryModes.find((mode) => mode.id === selectedDeliveryMode)?.label || "-";

  return (
    <SectionShell id="pricing" className="border-b border-stroke-subtle py-12 sm:py-14" ariaLabelledBy="pricing-title">
      <SpotlightFrame
        imageSrc="/images/generated/case-solution.webp"
        imageAlt={locale === "he" ? "\u05de\u05d7\u05e9\u05d1\u05d5\u05df \u05ea\u05de\u05d7\u05d5\u05e8" : "Pricing calculator overview"}
        aside={
          <>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-text-soft">{summaryTitle}</p>
            <div className="mt-3 space-y-2 text-sm text-text-primary/90">
              <p>{summaryPackageLabel}: {selectedPackageLabel}</p>
              <p>{summaryNicheLabel}: {selectedNicheLabel}</p>
              <p>{summaryModeLabel}: {selectedModeLabel}</p>
            </div>
          </>
        }
      >
        <SectionHeading id="pricing-title" eyebrow={eyebrow} title={title} description={description} />

        <div className="mt-7 grid gap-4 lg:grid-cols-12">
          <SurfaceCard as="div" className="rounded-[1.5rem] border-white/12 bg-black/16 p-5 sm:p-6 lg:col-span-8">
            <motion.div variants={staggerParent} {...reveal} className="grid gap-3 sm:grid-cols-3">
              <motion.label variants={fadeUp} className="sm:col-span-1">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{labels.niche}</span>
                <select
                  value={selectedNiche}
                  onChange={(event) => onNicheChange(event.target.value as NicheId)}
                  className="w-full rounded-2xl border border-white/12 bg-black/24 px-4 py-3 text-base font-medium text-text-primary outline-none ring-offset-2 focus:ring-2 focus:ring-accent-primary"
                >
                  {niches.map((niche) => (
                    <option key={niche.id} value={niche.id}>
                      {niche.label}
                    </option>
                  ))}
                </select>
              </motion.label>

              <motion.label variants={fadeUp} className="sm:col-span-1">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{labels.packageType}</span>
                <select
                  value={selectedPackageId}
                  onChange={(event) => onPackageChange(event.target.value as PackageId)}
                  className="w-full rounded-2xl border border-white/12 bg-black/24 px-4 py-3 text-base font-medium text-text-primary outline-none ring-offset-2 focus:ring-2 focus:ring-accent-primary"
                >
                  {packageOptions.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.label}
                    </option>
                  ))}
                </select>
              </motion.label>

              <motion.label variants={fadeUp} className="sm:col-span-1">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{labels.deliveryMode}</span>
                <select
                  value={selectedDeliveryMode}
                  onChange={(event) => onDeliveryModeChange(event.target.value as DeliveryMode)}
                  className="w-full rounded-2xl border border-white/12 bg-black/24 px-4 py-3 text-base font-medium text-text-primary outline-none ring-offset-2 focus:ring-2 focus:ring-accent-primary"
                >
                  {deliveryModes.map((mode) => (
                    <option key={mode.id} value={mode.id}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </motion.label>
            </motion.div>

            <fieldset className="mt-5">
              <legend className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{labels.addons}</legend>
              <motion.div variants={staggerParent} {...reveal} className="grid gap-2 sm:grid-cols-2">
                {addonOptions.map((addon) => {
                  const checked = selectedAddons.includes(addon.id);
                  return (
                    <motion.label
                      variants={fadeUp}
                      key={addon.id}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border px-3 py-2 text-sm transition ${
                        checked
                          ? "border-accent-primary/70 bg-[#201a13]/82"
                          : "border-white/10 bg-black/20 hover:border-stroke-strong"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleAddon(addon.id)}
                          className="h-4 w-4 accent-accent-primary"
                        />
                        <span>{addon.label}</span>
                      </span>
                      <span className="ui-price-tag text-[11px]">{addon.priceLabel}</span>
                    </motion.label>
                  );
                })}
              </motion.div>
            </fieldset>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{labels.notes}</span>
              <textarea
                rows={3}
                value={notes}
                onChange={(event) => onNotesChange(event.target.value)}
                placeholder={notesPlaceholder}
                className="w-full rounded-2xl border border-white/12 bg-black/24 px-4 py-3 text-base leading-relaxed text-text-primary outline-none ring-offset-2 placeholder:text-text-soft focus:ring-2 focus:ring-accent-primary"
              />
            </label>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <article className="rounded-2xl border border-white/14 bg-gradient-to-br from-[#1a1f2a] to-[#101622] px-4 py-3 shadow-soft">
                <p className="ui-kicker">{labels.estimate}</p>
                <p className="mt-2 text-4xl font-black tracking-tight text-text-primary">{formatCurrency(quote.total, locale)}</p>
                <p className="mt-1 text-xs font-medium text-text-soft">{vatNote}</p>
              </article>
              <BrandButton onClick={onOpenWhatsApp} disabled={quoteLoading} className="w-full disabled:opacity-60 sm:w-auto" size="lg">
                {quoteLoading ? "..." : openWhatsAppCta}
              </BrandButton>
            </div>
          </SurfaceCard>

          <motion.div variants={staggerParent} {...reveal} className="space-y-4 lg:col-span-4">
            <motion.div variants={fadeUp}>
              <BreakdownList locale={locale} title={labels.breakdown} items={quote.breakdown} />
            </motion.div>
            <motion.article
              variants={fadeUp}
              className="premium-card rounded-[1.5rem] border-white/14 p-5"
            >
              <h3 className="ui-kicker">{subtotalLabel}</h3>
              <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary">{formatCurrency(quote.subtotal, locale)}</p>
            </motion.article>
          </motion.div>
        </div>
      </SpotlightFrame>
    </SectionShell>
  );
}
