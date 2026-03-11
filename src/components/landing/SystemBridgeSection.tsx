import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { BrandButton } from "@/components/landing/ui/BrandButton";
import { SectionHeading } from "@/components/landing/ui/SectionHeading";
import { SectionShell } from "@/components/landing/ui/SectionShell";
import { SpotlightFrame } from "@/components/landing/ui/SpotlightFrame";

type SystemBridgeSectionProps = {
  eyebrow: string;
  title: string;
  beforeLabel: string;
  beforeText: string;
  buildLabel: string;
  buildItems: string[];
  resultLabel: string;
  resultText: string;
  cta: string;
  isRtl: boolean;
};

export function SystemBridgeSection({
  eyebrow,
  title,
  beforeLabel,
  beforeText,
  buildLabel,
  buildItems,
  resultLabel,
  resultText,
  cta,
  isRtl,
}: SystemBridgeSectionProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.2);
  const buildFlowLabel = isRtl ? "\u05de\u05e2\u05e8\u05db\u05ea \u05e6\u05de\u05d9\u05d7\u05d4" : "Growth flow";
  const stepOneLabel = isRtl ? "\u05ea\u05d5\u05db\u05df \u05de\u05d3\u05d5\u05d9\u05e7" : "Precise content";
  const stepTwoLabel = isRtl ? "\u05e2\u05de\u05d5\u05d3 \u05de\u05de\u05d9\u05e8" : "Converting page";
  const stepThreeLabel = isRtl ? "\u05de\u05e1\u05dc\u05d5\u05dc WhatsApp" : "WhatsApp path";

  return (
    <SectionShell className="border-b border-stroke-subtle py-12 sm:py-14" ariaLabelledBy="system-bridge-title">
      <SectionHeading id="system-bridge-title" eyebrow={eyebrow} title={title} />
      <motion.div variants={staggerParent} {...reveal} className="mt-7">
        <motion.div variants={fadeUp} className="relative">
          <SpotlightFrame
            imageSrc="/images/generated/case-solution.webp"
            imageAlt={isRtl ? "\u05de\u05e2\u05e8\u05db\u05ea \u05e6\u05de\u05d9\u05d7\u05d4 \u05dc\u05e2\u05e1\u05e7 \u05de\u05e7\u05d5\u05de\u05d9" : "Business growth system concept"}
            imageOpacityClassName="opacity-[0.44]"
            aside={
              <>
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-text-soft">{buildFlowLabel}</p>
                <div className="mt-3 space-y-2 text-sm text-text-primary/90">
                  <p>1. {stepOneLabel}</p>
                  <p>2. {stepTwoLabel}</p>
                  <p>3. {stepThreeLabel}</p>
                </div>
              </>
            }
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <section className="rounded-2xl border border-white/12 bg-black/25 p-4">
                <p className="ui-kicker">{beforeLabel}</p>
                <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">{beforeText}</p>
              </section>

              <section className="rounded-2xl border border-white/18 bg-[linear-gradient(145deg,rgba(26,23,19,0.72),rgba(21,27,38,0.7))] p-4">
                <p className="ui-kicker">{buildLabel}</p>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-primary sm:text-base">
                  {buildItems.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-white/12 bg-black/25 p-4">
                <p className="ui-kicker">{resultLabel}</p>
                <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">{resultText}</p>
                <BrandButton as="a" href="#pricing" variant="solid" className="mt-5 w-full sm:w-auto">
                  {cta}
                </BrandButton>
              </section>
            </div>
          </SpotlightFrame>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
