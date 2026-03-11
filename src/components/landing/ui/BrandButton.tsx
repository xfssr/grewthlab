import type { MouseEventHandler, ReactNode } from "react";

import { motion } from "framer-motion";

import { revealWhileInView, useReducedMotionPreference } from "@/components/landing/motion";

export type BrandButtonVariant = "solid" | "outline" | "soft" | "ghost";

type BrandButtonProps = {
  as?: "button" | "a";
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  children: ReactNode;
  className?: string;
  variant?: BrandButtonVariant;
  size?: "sm" | "md" | "lg";
};

const variantClassMap: Record<BrandButtonVariant, string> = {
  solid:
    "border border-accent-primary/85 bg-gradient-to-r from-accent-primary to-accent-secondary text-text-inverse shadow-glow hover:brightness-[1.06]",
  outline: "border border-white/16 bg-black/18 text-text-primary hover:border-accent-primary/55 hover:bg-surface-muted/75",
  soft: "border border-stroke-subtle bg-accent-soft/90 text-accent-primary hover:border-accent-primary",
  ghost: "border border-transparent bg-transparent text-text-primary hover:bg-surface-muted/55",
};

const sizeClassMap = {
  sm: "px-3 py-2 text-xs font-semibold",
  md: "px-5 py-3 text-sm font-semibold",
  lg: "px-7 py-3.5 text-base font-semibold",
} as const;

export function BrandButton({
  as = "button",
  href,
  type = "button",
  disabled = false,
  onClick,
  children,
  className,
  variant = "solid",
  size = "md",
}: BrandButtonProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.3);
  const classes = `inline-flex items-center justify-center rounded-full tracking-[0.01em] transition duration-300 hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/65 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0d12] ${variantClassMap[variant]} ${
    sizeClassMap[size]
  } ${className ?? ""}`;

  if (as === "a") {
    return (
      <motion.a href={href} {...reveal} className={classes} onClick={onClick}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} disabled={disabled} onClick={onClick} {...reveal} className={classes}>
      {children}
    </motion.button>
  );
}
