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
        className={`mt-3 font-display text-4xl leading-[1.05] text-text-primary sm:text-5xl lg:text-6xl ${
          center ? "mx-auto text-center" : ""
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`ui-subtle mt-4 max-w-3xl text-base leading-relaxed sm:text-lg ${
            center ? "mx-auto text-center" : ""
          }`}
        >
          {description}
        </p>
      ) : null}
    </motion.header>
  );
}
