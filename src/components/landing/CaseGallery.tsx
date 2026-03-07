/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { toneOverlay } from "@/components/landing/theme";
import { BrandButton } from "@/components/landing/ui/BrandButton";
import { SectionHeading } from "@/components/landing/ui/SectionHeading";
import { SectionShell } from "@/components/landing/ui/SectionShell";
import { SurfaceCard } from "@/components/landing/ui/SurfaceCard";
import type { PackageId, Tone } from "@/core/site.types";

type CaseGalleryProps = {
  title: string;
  cards: Array<{
    title: string;
    bullets: string[];
    action: string;
    packageId: PackageId;
    tone: Tone;
    imageSrc: string;
    imageAlt: string;
  }>;
  onSelectPackage: (packageId: PackageId) => void;
};

export function CaseGallery({ title, cards, onSelectPackage }: CaseGalleryProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.22);

  return (
    <SectionShell id="cases" className="border-b border-stroke-subtle py-14 sm:py-16" ariaLabelledBy="cases-title">
      <SectionHeading id="cases-title" eyebrow="Proof" title={title} />
      <motion.ul variants={staggerParent} {...reveal} className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((story, index) => (
          <motion.li key={`${story.title}-${index}`} variants={fadeUp}>
            <SurfaceCard className="h-full overflow-hidden rounded-[1.5rem] border-stroke-subtle bg-surface-base">
              <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${toneOverlay(story.tone)}`}>
                <img src={story.imageSrc} alt={story.imageAlt} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden="true" />
              </div>
              <div className="p-5">
                <h3 className="text-3xl font-semibold text-text-primary">{story.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-text-muted">
                  {story.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="pt-1 text-accent-primary">{">"}</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <BrandButton onClick={() => onSelectPackage(story.packageId)} variant="outline" className="mt-5">
                  {story.action}
                </BrandButton>
              </div>
            </SurfaceCard>
          </motion.li>
        ))}
      </motion.ul>
    </SectionShell>
  );
}
