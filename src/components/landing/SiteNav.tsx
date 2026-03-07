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
    <header className="sticky top-0 z-50 border-b border-stroke-subtle bg-[#0b0e14]/92 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between gap-3" aria-label="Primary">
          <a href="#top" className="font-display text-lg tracking-tight text-text-primary sm:text-xl">
            {brandName}
          </a>
          <ul className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.sectionId;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive ? "text-text-primary" : "text-text-muted hover:text-text-primary"
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
            <BrandButton as="a" href="#quote" size="sm" className="hidden sm:inline-flex">
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
                    ? "border-accent-primary bg-accent-soft text-[#efc58f]"
                    : "border-stroke-subtle bg-surface-base text-text-muted"
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
