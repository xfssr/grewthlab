"use client";

import { useEffect, useMemo, useState } from "react";

import { useLocaleContent } from "@/components/LocaleProvider";
import { FaqAndQuote } from "@/components/landing/FaqAndQuote";
import { GallerySection } from "@/components/landing/GallerySection";
import { Hero } from "@/components/landing/Hero";
import { IndustryCards } from "@/components/landing/IndustryCards";
import { PricingSection } from "@/components/landing/PricingSection";
import { PricingStats } from "@/components/landing/PricingStats";
import { ProcessFlow } from "@/components/landing/ProcessFlow";
import { ShowcaseSection } from "@/components/landing/ShowcaseSection";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { getCalculatorRules } from "@/core/site.content";
import { calculateQuote } from "@/core/pricing/quote-engine";
import { buildWhatsAppMessage, toWhatsAppUrl } from "@/core/pricing/whatsapp-template";
import type { AddonId, DeliveryMode, NicheId, PackageId, SectionId } from "@/core/site.types";

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function LandingPage() {
  const { content, dir, locale } = useLocaleContent();
  const rules = useMemo(() => getCalculatorRules(), []);

  const [activeSection, setActiveSection] = useState<SectionId>("top");
  const [selectedNiche, setSelectedNiche] = useState<NicheId>(content.pricing.niches[0]?.id ?? "restaurants");
  const [selectedPackageId, setSelectedPackageId] = useState<PackageId>(
    content.pricing.packageOptions[0]?.id ?? "qr-menu-mini-site",
  );
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState<DeliveryMode>("standard");
  const [selectedAddons, setSelectedAddons] = useState<AddonId[]>([]);
  const [notes, setNotes] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);

  useEffect(() => {
    if (!content.pricing.packageOptions.find((item) => item.id === selectedPackageId)) {
      setSelectedPackageId(content.pricing.packageOptions[0]?.id ?? "qr-menu-mini-site");
    }
    if (!content.pricing.niches.find((item) => item.id === selectedNiche)) {
      setSelectedNiche(content.pricing.niches[0]?.id ?? "restaurants");
    }
  }, [content.pricing.niches, content.pricing.packageOptions, selectedNiche, selectedPackageId]);

  useEffect(() => {
    const observedIds = ["top", "gallery", "solutions", "pricing", "faq", "quote"];
    const elements = observedIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id as SectionId);
        }
      },
      {
        root: null,
        rootMargin: "-40% 0px -45% 0px",
        threshold: [0.1, 0.3, 0.6],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const quote = useMemo(
    () =>
      calculateQuote(
        {
          locale,
          niche: selectedNiche,
          packageId: selectedPackageId,
          deliveryMode: selectedDeliveryMode,
          addons: selectedAddons,
        },
        rules,
      ),
    [locale, selectedNiche, selectedPackageId, selectedDeliveryMode, selectedAddons, rules],
  );
  const sharedVideoSrc = content.hero.backgroundVideoSrc || "";

  const handleSelectPackage = (packageId: PackageId) => {
    setSelectedPackageId(packageId);
    scrollToSection("pricing");
  };

  const handleToggleAddon = (addonId: AddonId) => {
    setSelectedAddons((prev) => (prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]));
  };

  const handleOpenWhatsApp = async () => {
    setQuoteLoading(true);
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale,
          niche: selectedNiche,
          packageId: selectedPackageId,
          deliveryMode: selectedDeliveryMode,
          addons: selectedAddons,
          notes,
        }),
      });

      let whatsappText = "";
      if (response.ok) {
        const payload = (await response.json()) as { whatsappText?: string };
        whatsappText = payload.whatsappText || "";
      }

      if (!whatsappText) {
        const packageTitle =
          content.pricing.packageOptions.find((item) => item.id === selectedPackageId)?.label || selectedPackageId;
        const nicheLabel = content.pricing.niches.find((item) => item.id === selectedNiche)?.label || selectedNiche;
        const deliveryLabel =
          content.pricing.deliveryModes.find((item) => item.id === selectedDeliveryMode)?.label ||
          selectedDeliveryMode;
        const addonLabels = selectedAddons
          .map((addonId) => content.pricing.addonOptions.find((item) => item.id === addonId)?.label)
          .filter((value): value is string => Boolean(value));

        whatsappText = buildWhatsAppMessage({
          locale,
          packageTitle,
          nicheLabel,
          deliveryLabel,
          addonLabels,
          quote,
          notes,
        });
      }

      const url = toWhatsAppUrl(content.whatsappPhoneDigits, whatsappText);
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleSubmitLead = async (payload: { name: string; phone: string; business: string; message: string }) => {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locale,
        contact: {
          name: payload.name,
          phone: payload.phone,
          business: payload.business || undefined,
          message: payload.message || undefined,
        },
        quote: {
          packageId: selectedPackageId,
          total: quote.total,
          breakdown: quote.breakdown,
        },
        source: "landing_quote_form",
      }),
    });

    if (!response.ok) {
      throw new Error("Lead store request failed.");
    }
  };

  return (
    <div dir={dir} className={content.isRtl ? "text-right" : "text-left"}>
      <SiteNav
        brandName={content.brandName}
        navLinks={content.navLinks}
        navQuoteCta={content.navQuoteCta}
        activeSection={activeSection}
        isRtl={content.isRtl}
      />
      <main className="flex flex-col">
        <div className="relative order-1 isolate overflow-hidden">
          {sharedVideoSrc ? (
            <>
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <video
                  src={sharedVideoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover opacity-[0.36] blur-[1px]"
                  style={{ transform: content.isRtl ? "scaleX(-1) scale(1.03)" : "scale(1.03)" }}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,15,0.7),rgba(10,13,19,0.78),rgba(8,11,17,0.86))]" />
            </>
          ) : null}
          <div className="relative z-10">
            <Hero
              eyebrow={content.hero.eyebrow}
              title={content.hero.title}
              accent={content.hero.accent}
              description={content.hero.description}
              primaryCta={content.hero.primaryCta}
              secondaryCta={content.hero.secondaryCta}
              backgroundImageSrc={content.hero.backgroundImageSrc}
              backgroundVideoSrc={sharedVideoSrc || undefined}
              useSharedBackground={Boolean(sharedVideoSrc)}
              isRtl={content.isRtl}
              stats={content.pricing.stats}
            />
          </div>
          <div className="relative z-10">
            <ProcessFlow
              title={content.process.title}
              steps={content.process.steps}
              isRtl={content.isRtl}
              backgroundVideoSrc={sharedVideoSrc || undefined}
              useSharedBackground={Boolean(sharedVideoSrc)}
            />
          </div>
        </div>
        <div className="order-2">
          <GallerySection
            title={content.gallery.title}
            description={content.gallery.description}
            detailsCta={content.gallery.detailsCta}
            cardNote={content.gallery.cardNote}
            items={content.gallery.items}
            archive={content.contentArchive}
          />
        </div>
        <div className="order-3">
          <ShowcaseSection
            title={content.solutions.title}
            description={content.solutions.description}
            cards={content.solutions.cards}
            isRtl={content.isRtl}
            selectedPackageId={selectedPackageId}
            onSelectPackage={handleSelectPackage}
            onOpenQuote={() => scrollToSection("quote")}
          />
        </div>
        <div className="order-4">
          <IndustryCards cards={content.industries} eyebrow={content.industryEyebrow} />
        </div>
        <div className="order-5">
          <PricingStats stats={content.pricing.stats} />
        </div>
        <div className="order-6">
          <PricingSection
            locale={locale}
            title={content.pricing.title}
            description={content.pricing.description}
            vatNote={content.pricing.vatNote}
            labels={content.pricing.labels}
            openWhatsAppCta={content.pricing.openWhatsAppCta}
            packageOptions={content.pricing.packageOptions}
            niches={content.pricing.niches}
            deliveryModes={content.pricing.deliveryModes}
            addonOptions={content.pricing.addonOptions}
            notesPlaceholder={content.pricing.notesPlaceholder}
            selectedPackageId={selectedPackageId}
            selectedNiche={selectedNiche}
            selectedDeliveryMode={selectedDeliveryMode}
            selectedAddons={selectedAddons}
            notes={notes}
            quote={quote}
            quoteLoading={quoteLoading}
            onPackageChange={setSelectedPackageId}
            onNicheChange={setSelectedNiche}
            onDeliveryModeChange={setSelectedDeliveryMode}
            onToggleAddon={handleToggleAddon}
            onNotesChange={setNotes}
            onOpenWhatsApp={handleOpenWhatsApp}
          />
        </div>
        <div className="order-7">
          <FaqAndQuote
            faqTitle={content.faq.title}
            faqItems={content.faq.items}
            quoteTitle={content.quote.title}
            nameLabel={content.quote.nameLabel}
            phoneLabel={content.quote.phoneLabel}
            businessLabel={content.quote.businessLabel}
            messageLabel={content.quote.messageLabel}
            submitLabel={content.quote.submitLabel}
            successMessage={content.quote.successMessage}
            errorMessage={content.quote.errorMessage}
            onSubmitLead={handleSubmitLead}
          />
        </div>
      </main>
      <SiteFooter
        brandName={content.brandName}
        note={content.footer.note}
        copyright={content.footer.copyright}
        navTitle={content.footer.navTitle}
        navLinks={content.navLinks}
        contactTitle={content.footer.contactTitle}
        ctaTitle={content.footer.ctaTitle}
        ctaButton={content.footer.ctaButton}
        phone={content.footer.phone}
        email={content.footer.email}
        location={content.footer.location}
      />
    </div>
  );
}
