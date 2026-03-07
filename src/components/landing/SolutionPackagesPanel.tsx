import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, useReducedMotionPreference } from "@/components/landing/motion";
import { BrandButton } from "@/components/landing/ui/BrandButton";
import type { PackageId } from "@/core/site.types";

type SolutionPackagesPanelProps = {
  title: string;
  ctaLabel: string;
  items: Array<{ id: PackageId; label: string; priceLabel?: string }>;
  isRtl: boolean;
  selectedPackageId: PackageId;
  onSelectPackage: (packageId: PackageId) => void;
};

export function SolutionPackagesPanel({
  title,
  ctaLabel,
  items,
  isRtl,
  selectedPackageId,
  onSelectPackage,
}: SolutionPackagesPanelProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.25);

  return (
    <motion.aside
      variants={fadeUp}
      {...reveal}
      className="rounded-[1.5rem] border border-stroke-subtle bg-[#101521] p-4 shadow-panel sm:p-5 lg:sticky lg:top-24"
      aria-label={title}
    >
      <p className="ui-kicker">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {items.map((item, index) => {
          const isActive = item.id === selectedPackageId;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelectPackage(item.id)}
                className={`w-full rounded-2xl border p-3 text-start transition sm:p-4 ${
                  isActive
                    ? "border-accent-primary bg-[#211d16] shadow-soft"
                    : "border-stroke-subtle bg-surface-base hover:border-stroke-strong hover:bg-surface-muted"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-base font-semibold text-text-primary">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        isActive ? "bg-accent-primary text-text-inverse" : "bg-surface-muted text-text-muted"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="line-clamp-1">{item.label}</span>
                  </span>
                  <span className="text-base text-text-soft" aria-hidden="true">
                    {isRtl ? "\u2039" : "\u203A"}
                  </span>
                </div>
                {item.priceLabel ? <span className="ui-price-tag mt-3 text-xs">{item.priceLabel}</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
      <BrandButton
        onClick={() => onSelectPackage(selectedPackageId)}
        variant="solid"
        className="mt-4 w-full"
        size="sm"
      >
        {ctaLabel}
      </BrandButton>
    </motion.aside>
  );
}
