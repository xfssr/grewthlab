import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { BrandButton } from "@/components/landing/ui/BrandButton";
import { MetricChip } from "@/components/landing/ui/MetricChip";

type HeroProps = {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  backgroundImageSrc: string;
  backgroundVideoSrc?: string;
  useSharedBackground?: boolean;
  isRtl?: boolean;
  stats: Array<{ label: string; value: string }>;
};

export function Hero({
  eyebrow,
  title,
  accent,
  description,
  primaryCta,
  secondaryCta,
  backgroundImageSrc,
  backgroundVideoSrc,
  useSharedBackground,
  isRtl,
  stats,
}: HeroProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.12);
  const statsLabel = /[\u0590-\u05FF]/.test(`${title} ${description}`) ? "מדדי מפתח" : "Key metrics";

  return (
    <motion.section
      id="top"
      className={`relative overflow-hidden pb-14 pt-16 text-text-primary sm:pb-16 sm:pt-20 ${
        useSharedBackground ? "" : "border-b border-stroke-subtle"
      }`}
      aria-labelledby="hero-title"
      variants={staggerParent}
      {...reveal}
    >
      {!useSharedBackground ? (
        backgroundVideoSrc ? (
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <video
              src={backgroundVideoSrc}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover opacity-[0.42] blur-[1px]"
              style={{ transform: isRtl ? "scaleX(-1) scale(1.05)" : "scale(1.05)" }}
            />
          </div>
        ) : (
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: `url(${backgroundImageSrc})` }}
            aria-hidden="true"
          />
        )
      ) : null}
      {!useSharedBackground ? (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(8,10,15,0.72),rgba(10,13,19,0.82),rgba(8,11,17,0.88))]" />
      ) : null}
      <div className="pointer-events-none absolute -left-14 top-10 h-44 w-44 rounded-full bg-[#d9a260]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-20 h-56 w-56 rounded-full bg-[#5572a7]/18 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:px-8">
        <motion.div variants={fadeUp}>
          <p className="ui-kicker">{eyebrow}</p>
          <h1
            id="hero-title"
            className="mt-6 max-w-4xl font-display text-5xl leading-[0.92] text-text-primary sm:text-6xl lg:text-7xl"
          >
            {title}
            <span className="mt-3 block text-accent-primary">{accent}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">{description}</p>
          <div className="mt-8 hidden flex-col items-start gap-3 sm:flex-row md:flex">
            <BrandButton as="a" href="#gallery" variant="solid" className="w-full sm:w-auto">
              {primaryCta}
            </BrandButton>
            <BrandButton as="a" href="#pricing" variant="outline" className="w-full sm:w-auto">
              {secondaryCta}
            </BrandButton>
          </div>
        </motion.div>

        <motion.aside
          variants={fadeUp}
          className="hidden rounded-3xl border border-stroke-subtle bg-surface-base p-4 shadow-panel sm:p-5 md:block"
        >
          <p className="mb-3 text-[0.67rem] font-semibold uppercase tracking-[0.18em] text-text-soft">{statsLabel}</p>
          <div className="space-y-3">
            {stats.slice(0, 3).map((item) => (
              <MetricChip key={`${item.label}-${item.value}`} label={item.label} value={item.value} className="bg-surface-muted" />
            ))}
          </div>
        </motion.aside>
      </div>
    </motion.section>
  );
}
