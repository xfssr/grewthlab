import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, useReducedMotionPreference } from "@/components/landing/motion";

type MetricChipProps = {
  label: string;
  value: string;
  className?: string;
};

export function MetricChip({ label, value, className }: MetricChipProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion);

  return (
    <motion.article
      variants={fadeUp}
      {...reveal}
      className={`rounded-2xl border border-stroke-subtle bg-surface-base px-4 py-3 shadow-soft ${className ?? ""}`}
    >
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-text-soft">{label}</p>
      <p className="mt-1 text-lg font-semibold text-text-primary sm:text-xl">{value}</p>
    </motion.article>
  );
}
