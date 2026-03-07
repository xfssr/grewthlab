import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { MetricChip } from "@/components/landing/ui/MetricChip";
import { SectionShell } from "@/components/landing/ui/SectionShell";

type PricingStatsProps = {
  stats: Array<{ label: string; value: string }>;
};

export function PricingStats({ stats }: PricingStatsProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.25);

  return (
    <SectionShell className="border-b border-stroke-subtle py-8" ariaLabel="Pricing highlights">
      <motion.ul variants={staggerParent} {...reveal} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.li key={`${stat.label}-${stat.value}`} variants={fadeUp}>
            <MetricChip label={stat.label} value={stat.value} className="h-full rounded-3xl bg-[#121824]" />
          </motion.li>
        ))}
      </motion.ul>
    </SectionShell>
  );
}
