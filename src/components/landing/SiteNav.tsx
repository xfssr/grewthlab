import Image from "next/image";

import { LanguageToggle } from "@/components/LanguageToggle";
import { BrandButton } from "@/components/landing/ui/BrandButton";
import type { SectionId } from "@/core/site.types";

type SiteNavProps = {
  brandName: string;
  navLinks: Array<{ label: string; href: string; sectionId: SectionId }>;
  navQuoteCta: string;
  activeSection: SectionId;
  isRtl: boolean;
};

export function SiteNav({ brandName, navLinks, navQuoteCta, activeSection, isRtl }: SiteNavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-stroke-subtle/85 bg-[linear-gradient(180deg,rgba(10,13,19,0.94),rgba(9,12,18,0.88))] backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between gap-3" aria-label="Primary">
          <a
            href="#top"
            className="premium-shell inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-display text-lg tracking-tight text-text-primary sm:text-xl"
          >
            <Image src="/icon.svg" alt={`${brandName} logo`} width={28} height={28} className="h-7 w-7 rounded-md" />
            <span>{brandName}</span>
          </a>
          <ul className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.sectionId;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "premium-shell text-text-primary shadow-soft"
                        : "border border-transparent text-text-muted hover:border-stroke-subtle hover:bg-surface-base/45 hover:text-text-primary"
                    }`}
                  >
                    {link.label}
                    {isActive ? (
                      <span
                        className={`absolute bottom-0 h-0.5 w-5 rounded-full bg-accent-primary ${
                          isRtl ? "left-4" : "right-4"
                        }`}
                        aria-hidden="true"
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <BrandButton as="a" href="#quote" size="sm" className="hidden sm:inline-flex sm:shadow-glow">
              {navQuoteCta}
            </BrandButton>
          </div>
        </nav>
        <div className="flex flex-wrap gap-2 pb-3 md:hidden">
          {navLinks.map((link) => {
            const isActive = activeSection === link.sectionId;
            return (
              <a
                key={`${link.href}-mobile`}
                href={link.href}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "premium-shell border-accent-primary/55 text-[#efc58f]"
                    : "border-stroke-subtle bg-surface-base/75 text-text-muted"
                } ${isRtl ? "ml-1" : "mr-1"}`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
}
