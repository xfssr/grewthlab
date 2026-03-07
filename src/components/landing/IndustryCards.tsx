/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { toneOverlay } from "@/components/landing/theme";
import { SectionShell } from "@/components/landing/ui/SectionShell";
import { SurfaceCard } from "@/components/landing/ui/SurfaceCard";
import type { Tone } from "@/core/site.types";

type IndustryCardsProps = {
  cards: Array<{ title: string; caption: string; tone: Tone; imageSrc: string; imageAlt: string }>;
  eyebrow: string;
};

export function IndustryCards({ cards, eyebrow }: IndustryCardsProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.2);

  return (
    <SectionShell className="border-b border-stroke-subtle py-12 sm:py-14" ariaLabel="Industry focus cards">
      <motion.ul variants={staggerParent} {...reveal} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((item, index) => (
          <motion.li key={item.title} variants={fadeUp} className={index % 2 === 0 ? "lg:translate-y-3" : ""}>
            <SurfaceCard className="group overflow-hidden rounded-[1.5rem] border-stroke-subtle bg-surface-base transition hover:-translate-y-1">
              <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${toneOverlay(item.tone)}`}>
                <img
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/80">{eyebrow}</p>
                  <p className="mt-1 text-sm font-medium text-white/95">{item.caption}</p>
                </div>
              </div>
              <h3 className="px-4 py-4 text-center text-xl font-semibold text-text-primary">{item.title}</h3>
            </SurfaceCard>
          </motion.li>
        ))}
      </motion.ul>
    </SectionShell>
  );
}
