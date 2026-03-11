import { useState } from "react";

import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { BrandButton } from "@/components/landing/ui/BrandButton";
import { SectionHeading } from "@/components/landing/ui/SectionHeading";
import { SectionShell } from "@/components/landing/ui/SectionShell";
import { SpotlightFrame } from "@/components/landing/ui/SpotlightFrame";
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
  const problemLabel = isRtl ? "\u05d4\u05d1\u05e2\u05d9\u05d4" : "Problem";
  const includesLabel = isRtl ? "\u05de\u05d4 \u05db\u05d5\u05dc\u05dc" : "Includes";
  const resultLabel = isRtl ? "\u05ea\u05d5\u05e6\u05d0\u05d4" : "Result";
  const detailsLabel = isRtl ? "\u05e2\u05d5\u05d3 \u05e4\u05e8\u05d8\u05d9\u05dd" : "More details";
  const actionLabel = card.packageId ? card.actionLabel : (isRtl ? "\u05e6\u05d5\u05e8 \u05e7\u05e9\u05e8" : "Contact");

  return (
    <SurfaceCard
      className={`h-full overflow-hidden rounded-[1.35rem] border p-5 transition sm:p-6 ${
        isActive
          ? "border-accent-primary/75 bg-[linear-gradient(150deg,rgba(34,27,20,0.75),rgba(20,27,39,0.84))]"
          : "border-white/12 bg-black/16 hover:border-stroke-strong"
      }`}
    >
      {card.imageSrc ? (
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/12 bg-black/22">
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
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-soft">{problemLabel}</p>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">{card.problem}</p>

          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-soft">{includesLabel}</p>
          <p className="mt-2 whitespace-pre-line rounded-xl border border-white/10 bg-black/20 p-3 text-sm leading-relaxed text-text-soft">
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
  const spotlightLabel = isRtl ? "\u05de\u05d4 \u05e7\u05d5\u05e8\u05d4 \u05e4\u05d4" : "Inside the system";
  const packagesCountLabel = isRtl ? "\u05d7\u05d1\u05d9\u05dc\u05d5\u05ea \u05e4\u05e2\u05d9\u05dc\u05d5\u05ea" : "Active solution tracks";
  const detailsCountLabel = isRtl ? "\u05db\u05e8\u05d8\u05d9\u05e1\u05d9\u05dd \u05e2\u05dd \u05e4\u05d9\u05e8\u05d5\u05d8" : "Cards with deep details";
  const currentLabel = isRtl ? "\u05de\u05e1\u05dc\u05d5\u05dc \u05e0\u05d1\u05d7\u05e8" : "Selected package";
  const activePackageLabel =
    cards.find((card) => card.packageId === selectedPackageId)?.title ||
    cards.find((card) => card.packageId)?.title ||
    "-";

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
      className="border-b border-stroke-subtle py-12 sm:py-14"
      ariaLabelledBy="solutions-title"
    >
      <SpotlightFrame
        imageSrc="/images/generated/case-problem.webp"
        imageAlt={isRtl ? "\u05e4\u05ea\u05e8\u05d5\u05e0\u05d5\u05ea \u05e6\u05de\u05d9\u05d7\u05d4 \u05dc\u05e2\u05e1\u05e7" : "Business solution tracks"}
        aside={
          <>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-text-soft">{spotlightLabel}</p>
            <div className="mt-3 space-y-2 text-sm text-text-primary/90">
              <p>{packagesCountLabel}: {cards.filter((card) => Boolean(card.packageId)).length}</p>
              <p>{detailsCountLabel}: {cards.length}</p>
              <p>{currentLabel}: {activePackageLabel}</p>
            </div>
          </>
        }
      >
        <SectionHeading
          id="solutions-title"
          eyebrow={isRtl ? "\u05e4\u05ea\u05e8\u05d5\u05e0\u05d5\u05ea \u05e2\u05e1\u05e7\u05d9\u05d9\u05dd" : "Business solutions"}
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
      </SpotlightFrame>
    </SectionShell>
  );
}
