import Image from "next/image";
import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { BrandButton } from "@/components/landing/ui/BrandButton";

type SiteFooterProps = {
  brandName: string;
  note: string;
  copyright: string;
  navTitle: string;
  navLinks: Array<{ label: string; href: string }>;
  contactTitle: string;
  ctaTitle: string;
  ctaButton: string;
  phone: string;
  email: string;
  location: string;
};

export function SiteFooter({
  brandName,
  note,
  copyright,
  navTitle,
  navLinks,
  contactTitle,
  ctaTitle,
  ctaButton,
  phone,
  email,
  location,
}: SiteFooterProps) {
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.15);

  return (
    <footer className="border-t border-stroke-subtle bg-[#090c12] py-12 text-text-primary" aria-label="Footer">
      <motion.div variants={staggerParent} {...reveal} className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-stroke-subtle bg-surface-base p-6 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
          <motion.div variants={fadeUp}>
            <h2 className="inline-flex items-center gap-2 font-display text-3xl leading-none">
              <Image src="/icon.svg" alt={`${brandName} logo`} width={32} height={32} className="h-8 w-8 rounded-md" />
              <span>{brandName}</span>
            </h2>
            <p className="mt-3 text-sm text-text-muted">{note}</p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-soft">{navTitle}</h3>
            <ul className="mt-3 space-y-2 text-sm text-text-muted">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition hover:text-text-primary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={fadeUp}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-soft">{contactTitle}</h3>
            <ul className="mt-3 space-y-2 text-sm text-text-muted">
              <li>{email}</li>
              <li>{phone}</li>
              <li>{location}</li>
            </ul>
          </motion.div>
          <motion.div variants={fadeUp}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-soft">{ctaTitle}</h3>
            <BrandButton as="a" href="#quote" className="mt-3">
              {ctaButton}
            </BrandButton>
          </motion.div>
        </div>
        <p className="mt-8 border-t border-stroke-subtle pt-4 text-xs text-text-soft">{copyright}</p>
      </motion.div>
    </footer>
  );
}
