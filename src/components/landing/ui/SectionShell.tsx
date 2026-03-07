import type { ReactNode } from "react";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";

import { parallaxSoft, revealWhileInView, useReducedMotionPreference } from "@/components/landing/motion";

type SectionShellProps = {
  id?: string;
  className?: string;
  containerClassName?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  children: ReactNode;
  motionVariant?: Variants;
};

export function SectionShell({
  id,
  className,
  containerClassName,
  ariaLabel,
  ariaLabelledBy,
  children,
  motionVariant = parallaxSoft,
}: SectionShellProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion);

  return (
    <motion.section
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      variants={motionVariant}
      {...reveal}
      className={className}
    >
      <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${containerClassName ?? ""}`}>{children}</div>
    </motion.section>
  );
}
