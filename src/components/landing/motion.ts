import type { Variants } from "framer-motion";
import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

export type LandingMotionVariant = "staggerParent" | "fadeUp" | "scaleIn" | "slideMask" | "parallaxSoft";

export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.2, 0.9, 0.2, 1],
    },
  },
};

export const slideMask: Variants = {
  hidden: {
    opacity: 0,
    x: 18,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const parallaxSoft: Variants = {
  hidden: {
    opacity: 0,
    y: 34,
    scale: 1.02,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.82,
      ease: [0.2, 0.86, 0.25, 1],
    },
  },
};

export function useReducedMotionPreference(): boolean {
  return Boolean(useFramerReducedMotion());
}

export function revealWhileInView(reduceMotion: boolean, amount = 0.2) {
  if (reduceMotion) {
    return {};
  }

  return {
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: {
      once: true,
      amount,
    },
  };
}
