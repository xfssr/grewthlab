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
    "border border-accent-primary bg-gradient-to-r from-accent-primary to-accent-secondary text-text-inverse shadow-glow hover:brightness-105",
  outline: "border border-stroke-strong bg-transparent text-text-primary hover:bg-surface-muted",
  soft: "border border-stroke-subtle bg-accent-soft text-accent-primary hover:border-accent-primary",
  ghost: "border border-transparent bg-transparent text-text-primary hover:bg-surface-muted",
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
  const classes = `inline-flex items-center justify-center rounded-full transition duration-300 ${variantClassMap[variant]} ${
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
