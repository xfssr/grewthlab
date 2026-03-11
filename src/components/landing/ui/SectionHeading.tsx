import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, useReducedMotionPreference } from "@/components/landing/motion";

type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.24);
  const center = align === "center";

  return (
    <motion.header variants={fadeUp} {...reveal} className={className}>
      {eyebrow ? <p className={`ui-kicker ${center ? "mx-auto" : ""}`}>{eyebrow}</p> : null}
      <h2
        id={id}
        className={`mt-3 max-w-5xl font-display text-[2rem] leading-[1.06] text-text-primary drop-shadow-[0_8px_22px_rgba(0,0,0,0.38)] sm:text-[2.55rem] lg:text-[3.15rem] ${
          center ? "mx-auto text-center" : ""
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`ui-subtle mt-4 max-w-2xl text-[15px] leading-relaxed sm:text-base ${
            center ? "mx-auto text-center" : ""
          }`}
        >
          {description}
        </p>
      ) : null}
    </motion.header>
  );
}
