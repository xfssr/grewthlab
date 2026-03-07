import type { ReactNode } from "react";

import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, useReducedMotionPreference } from "@/components/landing/motion";

type SurfaceCardProps = {
  as?: "article" | "div" | "aside";
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  className?: string;
  children: ReactNode;
};

export function SurfaceCard({ as = "article", id, ariaLabel, ariaLabelledBy, className, children }: SurfaceCardProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion);
  const MotionTag = as === "article" ? motion.article : as === "aside" ? motion.aside : motion.div;

  return (
    <MotionTag
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      variants={fadeUp}
      {...reveal}
      className={`rounded-3xl border border-stroke-subtle bg-surface-base shadow-panel ${className ?? ""}`}
    >
      {children}
    </MotionTag>
  );
}
