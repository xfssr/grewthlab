import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { SectionHeading } from "@/components/landing/ui/SectionHeading";
import { SectionShell } from "@/components/landing/ui/SectionShell";
import { SurfaceCard } from "@/components/landing/ui/SurfaceCard";

type ProcessFlowProps = {
  title: string;
  steps: Array<{ title: string; subtitle: string }>;
  isRtl: boolean;
  backgroundVideoSrc?: string;
  useSharedBackground?: boolean;
};

export function ProcessFlow({ title, steps, isRtl, backgroundVideoSrc, useSharedBackground }: ProcessFlowProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.22);
  const desktopGridClass = steps.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <SectionShell
      id="process"
      className="relative overflow-hidden border-b border-stroke-subtle py-14 sm:py-16"
      ariaLabelledBy="process-title"
    >
      {!useSharedBackground && backgroundVideoSrc ? (
        <>
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <video
              src={backgroundVideoSrc}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full scale-105 object-cover opacity-[0.3] blur-[1.5px]"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,19,0.68),rgba(10,13,19,0.78))]"
            aria-hidden="true"
          />
        </>
      ) : null}
      <SectionHeading id="process-title" title={title} />
      <motion.ol
        variants={staggerParent}
        {...reveal}
        className={`relative mt-6 grid gap-3 sm:mt-8 sm:gap-4 ${desktopGridClass}`}
      >
        {steps.map((step, index) => (
          <motion.li key={`${step.title}-${index}`} variants={fadeUp} className="relative mx-auto w-full max-w-[380px] lg:max-w-none">
            <SurfaceCard className="h-full rounded-[1rem] border-stroke-subtle bg-gradient-to-b from-surface-base to-[#111722] p-3 sm:rounded-[1.25rem] sm:p-4 lg:p-5">
              <div className="flex items-start gap-2.5 sm:gap-3.5">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stroke-strong bg-[#0d121c] text-[11px] font-semibold text-accent-primary sm:h-8 sm:w-8 sm:text-xs lg:h-9 lg:w-9">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary sm:text-xl lg:text-[1.35rem]">{step.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-text-muted sm:mt-1.5 sm:text-sm lg:text-[15px]">{step.subtitle}</p>
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
    </SectionShell>
  );
}
