import { useState } from "react";

import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { BrandButton } from "@/components/landing/ui/BrandButton";
import { SectionHeading } from "@/components/landing/ui/SectionHeading";
import { SectionShell } from "@/components/landing/ui/SectionShell";
import { SurfaceCard } from "@/components/landing/ui/SurfaceCard";
import type { PackageId, SolutionCardViewModel } from "@/core/site.types";

type ShowcaseSectionProps = {
  title: string;
  description: string;
  cards: SolutionCardViewModel[];
  isRtl: boolean;
  selectedPackageId: PackageId;
  onSelectPackage: (packageId: PackageId) => void;
  onOpenQuote: () => void;
};

type SolutionTileProps = {
  card: SolutionCardViewModel;
  isActive: boolean;
  isExpanded: boolean;
  isRtl: boolean;
  onToggleDetails: (cardId: string) => void;
  onSelect: (card: SolutionCardViewModel) => void;
};

function SolutionTile({
  card,
  isActive,
  isExpanded,
  isRtl,
  onToggleDetails,
  onSelect,
}: SolutionTileProps) {
  const problemLabel = isRtl ? "הבעיה" : "Problem";
  const includesLabel = isRtl ? "מה כולל" : "Includes";
  const resultLabel = isRtl ? "תוצאה" : "Result";
  const detailsLabel = isRtl ? "עוד פרטים" : "More details";
  const actionLabel = card.packageId ? card.actionLabel : (isRtl ? "צור קשר" : "Contact");

  return (
    <SurfaceCard
      className={`h-full overflow-hidden rounded-[1.35rem] border p-5 transition sm:p-6 ${
        isActive
          ? "border-accent-primary bg-gradient-to-b from-[#1d1a16] to-[#151c28]"
          : "border-stroke-subtle bg-surface-base hover:border-stroke-strong"
      }`}
    >
      {card.imageSrc ? (
        <div className="mb-4 overflow-hidden rounded-2xl border border-stroke-subtle/80 bg-surface-muted/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={card.imageSrc} alt={card.title} className="h-40 w-full object-cover" loading="lazy" decoding="async" />
        </div>
      ) : null}
      <p className="ui-kicker">{card.timeline}</p>
      <h3 className="mt-2 text-xl font-semibold leading-tight text-text-primary sm:text-2xl">{card.title}</h3>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-muted">{card.problem}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <span className="ui-price-tag text-xs">{card.priceLabel}</span>
        <BrandButton onClick={() => onToggleDetails(card.id)} variant={isExpanded ? "solid" : "outline"} size="sm">
          {detailsLabel}
        </BrandButton>
        <BrandButton onClick={() => onSelect(card)} variant={isActive ? "solid" : "outline"} size="sm">
          {actionLabel}
        </BrandButton>
      </div>

      {isExpanded ? (
        <div className="mt-4 border-t border-stroke-subtle pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-soft">{problemLabel}</p>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">{card.problem}</p>

          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-soft">{includesLabel}</p>
          <p className="mt-2 whitespace-pre-line rounded-xl border border-stroke-subtle bg-surface-muted/40 p-3 text-sm leading-relaxed text-text-soft">
            {card.whatWeDo}
          </p>

          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-soft">{resultLabel}</p>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">{card.outcome}</p>
        </div>
      ) : null}
    </SurfaceCard>
  );
}

export function ShowcaseSection({ title, description, cards, isRtl, selectedPackageId, onSelectPackage, onOpenQuote }: ShowcaseSectionProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.2);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const handleToggleDetails = (cardId: string) => {
    setExpandedCardId((current) => (current === cardId ? null : cardId));
  };

  const handleCardAction = (card: SolutionCardViewModel) => {
    if (card.packageId) {
      onSelectPackage(card.packageId);
      return;
    }

    onOpenQuote();
  };

  return (
    <SectionShell
      id="solutions"
      className="py-12 sm:py-14 md:border-b md:border-stroke-subtle"
      ariaLabelledBy="solutions-title"
    >
      <SectionHeading
        id="solutions-title"
        eyebrow={isRtl ? "פתרונות עסקיים" : "Business solutions"}
        title={title}
        description={description}
      />

      <motion.div variants={staggerParent} {...reveal} className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <motion.div key={card.id} variants={fadeUp}>
            <SolutionTile
              card={card}
              isActive={card.packageId === selectedPackageId}
              isExpanded={expandedCardId === card.id}
              isRtl={isRtl}
              onToggleDetails={handleToggleDetails}
              onSelect={handleCardAction}
            />
          </motion.div>
        ))}
      </motion.div>
    </SectionShell>
  );
}
