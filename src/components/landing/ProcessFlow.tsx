import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { SectionHeading } from "@/components/landing/ui/SectionHeading";
import { SectionShell } from "@/components/landing/ui/SectionShell";
import { SpotlightFrame } from "@/components/landing/ui/SpotlightFrame";
import { SurfaceCard } from "@/components/landing/ui/SurfaceCard";

type ProcessFlowProps = {
  title: string;
  steps: Array<{ title: string; subtitle: string }>;
  isRtl: boolean;
  backgroundVideoSrc?: string;
  useSharedBackground?: boolean;
};

function normalizeStepTitle(value: string): string {
  return value.replace(/^(?:\s*\d+\s*[.)\-:]\s*)+/u, "").trim();
}

export function ProcessFlow({ title, steps, isRtl, backgroundVideoSrc, useSharedBackground }: ProcessFlowProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.22);
  const desktopGridClass = steps.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  const frameImageSrc = !useSharedBackground && backgroundVideoSrc ? "/images/generated/case-solution.webp" : "/images/generated/case-result.webp";
  const flowLabel = isRtl ? "מהלך עבודה" : "Work flow";
  const flowSteps = steps.slice(0, 3).map((step) => normalizeStepTitle(step.title));

  return (
    <SectionShell id="process" className="border-b border-stroke-subtle py-10 sm:py-12" ariaLabelledBy="process-title">
      <SpotlightFrame
        imageSrc={frameImageSrc}
        imageAlt={isRtl ? "זרימת עבודה של המערכת" : "System workflow overview"}
        aside={
          <>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-text-soft">{flowLabel}</p>
            <div className="mt-3 space-y-2 text-sm text-text-primary/90">
              {flowSteps.map((label, index) => (
                <p key={`${label}-${index}`}>{index + 1}. {label}</p>
              ))}
            </div>
          </>
        }
      >
        <SectionHeading id="process-title" title={title} />
        <motion.ol
          variants={staggerParent}
          {...reveal}
          className={`relative mt-6 grid gap-3 sm:mt-8 sm:gap-4 ${desktopGridClass}`}
        >
          {steps.map((step, index) => (
            <motion.li key={`${step.title}-${index}`} variants={fadeUp} className="relative mx-auto w-full max-w-[380px] lg:max-w-none">
              <SurfaceCard className="h-full rounded-[1rem] border-white/12 bg-black/22 p-3 sm:rounded-[1.25rem] sm:p-4 lg:p-5">
                <div className="flex items-start gap-2.5 sm:gap-3.5">
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/18 bg-black/30 text-[11px] font-semibold text-accent-primary sm:h-8 sm:w-8 sm:text-xs lg:h-9 lg:w-9">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary sm:text-xl lg:text-[1.35rem]">{normalizeStepTitle(step.title)}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-text-muted sm:mt-1.5 sm:text-sm lg:text-[15px]">{step.subtitle.trim()}</p>
                  </div>
                </div>
              </SurfaceCard>
              {index < steps.length - 1 ? (
                <span
                  className="absolute top-1/2 hidden translate-y-[-50%] text-3xl text-stroke-strong lg:inline-block"
                  style={isRtl ? { left: -18 } : { right: -18 }}
                  aria-hidden="true"
                >
                  {isRtl ? "\u2190" : "\u2192"}
                </span>
              ) : null}
            </motion.li>
          ))}
        </motion.ol>
      </SpotlightFrame>
    </SectionShell>
  );
}
