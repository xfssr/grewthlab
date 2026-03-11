import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { BrandButton } from "@/components/landing/ui/BrandButton";
import { MetricChip } from "@/components/landing/ui/MetricChip";
import { SpotlightFrame } from "@/components/landing/ui/SpotlightFrame";

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
  const statsLabel = /[\u0590-\u05FF]/.test(`${title} ${description}`) ? "\u05de\u05d3\u05d3\u05d9 \u05de\u05e4\u05ea\u05d7" : "Key metrics";

  return (
    <motion.section
      id="top"
      className={`relative overflow-hidden pb-6 pt-8 text-text-primary sm:pb-8 sm:pt-10 lg:pb-10 lg:pt-11 ${
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
              poster={backgroundImageSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover opacity-[0.36]"
              style={{ transform: isRtl ? "scaleX(-1) scale(1.04)" : "scale(1.04)" }}
            />
          </div>
        ) : (
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-45"
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

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp}>
          <SpotlightFrame
            imageSrc={backgroundImageSrc}
            imageAlt={/[\u0590-\u05FF]/.test(`${title} ${description}`) ? "\u05e8\u05d0\u05e9 \u05d4\u05e2\u05de\u05d5\u05d3" : "Hero background"}
            imageOpacityClassName="opacity-[0.28]"
            contentClassName="p-4 sm:p-5 lg:p-6"
            asideClassName="hidden md:block"
            aside={
              <>
                <p className="mb-3 text-[0.67rem] font-semibold uppercase tracking-[0.18em] text-text-soft">{statsLabel}</p>
                <div className="space-y-3">
                  {stats.slice(0, 3).map((item) => (
                    <MetricChip
                      key={`${item.label}-${item.value}`}
                      label={item.label}
                      value={item.value}
                      className="border border-white/12 bg-black/26"
                    />
                  ))}
                </div>
              </>
            }
          >
            <p className="ui-kicker">{eyebrow}</p>
            <h1
              id="hero-title"
              className="mt-3 max-w-4xl font-display text-[1.95rem] leading-[0.95] text-text-primary sm:mt-4 sm:text-[2.55rem] lg:text-[3.25rem]"
            >
              {title}
              <span className="mt-2 block text-[1.08rem] leading-[1.1] text-accent-primary sm:text-[1.35rem] lg:text-[1.72rem]">
                {accent}
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">{description}</p>
            <div className="mt-4 flex flex-col items-start gap-2.5 sm:flex-row">
              <BrandButton as="a" href="#gallery" variant="solid" className="w-full px-6 sm:w-auto">
                {primaryCta}
              </BrandButton>
              <BrandButton as="a" href="#pricing" variant="outline" className="w-full px-6 sm:w-auto">
                {secondaryCta}
              </BrandButton>
            </div>
          </SpotlightFrame>
        </motion.div>
      </div>
    </motion.section>
  );
}
