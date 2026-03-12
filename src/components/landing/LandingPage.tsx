"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { useLocaleContent } from "@/components/LocaleProvider";
import { GallerySection } from "@/components/landing/GallerySection";
import { Hero } from "@/components/landing/Hero";
import { ProcessFlow } from "@/components/landing/ProcessFlow";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { SystemBridgeSection } from "@/components/landing/SystemBridgeSection";
import { getTierDefinition, mapLegacyPackageToTier } from "@/core/pricing/tier-model";
import { buildWhatsAppMessage, toWhatsAppUrl } from "@/core/pricing/whatsapp-template";
import type {
  AcquisitionChannel,
  IntakeSourceId,
  LanguageBundleId,
  PackageId,
  SectionId,
  TierId,
  VoiceModeId,
} from "@/core/site.types";

function SectionLoading({ minHeight }: { minHeight: string }) {
  return (
    <div className="border-b border-stroke-subtle py-10 sm:py-12">
      <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${minHeight}`}>
        <div className="h-full w-full animate-pulse rounded-[1.25rem] border border-stroke-subtle bg-surface-base/70" />
      </div>
    </div>
  );
}

const ShowcaseSection = dynamic(
  () => import("@/components/landing/ShowcaseSection").then((mod) => mod.ShowcaseSection),
  { loading: () => <SectionLoading minHeight="min-h-[420px]" /> },
);

const PricingSection = dynamic(
  () => import("@/components/landing/PricingSection").then((mod) => mod.PricingSection),
  { loading: () => <SectionLoading minHeight="min-h-[480px]" /> },
);

const FaqAndQuote = dynamic(
  () => import("@/components/landing/FaqAndQuote").then((mod) => mod.FaqAndQuote),
  { loading: () => <SectionLoading minHeight="min-h-[380px]" /> },
);

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function LandingPage() {
  const { content, dir, locale } = useLocaleContent();
  const [activeSection, setActiveSection] = useState<SectionId>("top");
  const [selectedTierId, setSelectedTierId] = useState<TierId>(content.pricing.tiers[0]?.id ?? "starter");
  const [selectedPackageId, setSelectedPackageId] = useState<PackageId>("quick-start-system");

  const [selectedIntakeSource, setSelectedIntakeSource] = useState<IntakeSourceId>("instagram_menu");
  const [selectedLanguageBundle, setSelectedLanguageBundle] = useState<LanguageBundleId>("he_ru_en");
  const [selectedVoiceMode, setSelectedVoiceMode] = useState<VoiceModeId>("empathetic");
  const [notes, setNotes] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);

  const tierIds = useMemo(() => content.pricing.tiers.map((tier) => tier.id), [content.pricing.tiers]);
  const firstTierId = tierIds[0] ?? "starter";
  const firstPackageId = useMemo(
    () => content.solutions.cards.find((card) => card.packageId)?.packageId ?? "quick-start-system",
    [content.solutions.cards],
  );

  useEffect(() => {
    if (!tierIds.includes(selectedTierId)) {
      setSelectedTierId(firstTierId);
    }
  }, [firstTierId, selectedTierId, tierIds]);

  useEffect(() => {
    const availablePackageIds = content.solutions.cards.flatMap((card) =>
      card.packageId ? [card.packageId as PackageId] : [],
    );
    if (!availablePackageIds.includes(selectedPackageId)) {
      setSelectedPackageId(firstPackageId);
    }
  }, [content.solutions.cards, firstPackageId, selectedPackageId]);

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

  const sharedVideoSrc = content.hero.backgroundVideoSrc || "";

  const handleSelectPackage = (packageId: PackageId) => {
    setSelectedPackageId(packageId);
    setSelectedTierId(mapLegacyPackageToTier(packageId));
    scrollToSection("pricing");
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
          tierId: selectedTierId,
          intakeSource: selectedIntakeSource,
          languageBundle: selectedLanguageBundle,
          voiceMode: selectedVoiceMode,
          notes,
        }),
      });

      let whatsappText = "";
      if (response.ok) {
        const payload = (await response.json()) as { whatsappText?: string };
        whatsappText = payload.whatsappText || "";
      }

      if (!whatsappText) {
        const tier = getTierDefinition(selectedTierId);
        whatsappText = buildWhatsAppMessage({
          locale,
          tier,
          intakeSource: selectedIntakeSource,
          languageBundle: selectedLanguageBundle,
          voiceMode: selectedVoiceMode,
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
          tierId: selectedTierId,
          priceRange: getTierDefinition(selectedTierId).priceRange,
          legacyPackageId: selectedPackageId,
        },
        acquisitionChannel: "other" satisfies AcquisitionChannel,
        source: "landing_quote_form",
      }),
    });

    if (!response.ok) {
      throw new Error("Lead store request failed.");
    }
  };

  return (
    <div dir={dir} className={`relative ${content.isRtl ? "text-right" : "text-left"}`}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(circle_at_18%_0%,rgba(217,162,96,0.16),transparent_44%),radial-gradient(circle_at_84%_6%,rgba(86,109,158,0.15),transparent_40%)]" />
        <div className="absolute inset-x-0 top-[34%] h-[420px] bg-[radial-gradient(circle_at_52%_20%,rgba(217,162,96,0.08),transparent_58%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[560px] bg-[radial-gradient(circle_at_24%_100%,rgba(86,109,158,0.11),transparent_48%),radial-gradient(circle_at_80%_100%,rgba(217,162,96,0.1),transparent_52%)]" />
      </div>
      <SiteNav
        brandName={content.brandName}
        navLinks={content.navLinks}
        navQuoteCta={content.navQuoteCta}
        activeSection={activeSection}
        isRtl={content.isRtl}
      />
      <main className="relative z-10 flex flex-col">
        <div className="relative order-1 isolate overflow-hidden">
          {sharedVideoSrc ? (
            <>
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <video
                  src={sharedVideoSrc}
                  poster={content.hero.backgroundImageSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover opacity-[0.34]"
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
            items={content.gallery.items}
            isRtl={content.isRtl}
          />
        </div>
        <div className="order-3">
          <SystemBridgeSection
            eyebrow={content.bridge.eyebrow}
            title={content.bridge.title}
            beforeLabel={content.bridge.beforeLabel}
            beforeText={content.bridge.beforeText}
            buildLabel={content.bridge.buildLabel}
            buildItems={content.bridge.buildItems}
            resultLabel={content.bridge.resultLabel}
            resultText={content.bridge.resultText}
            cta={content.bridge.cta}
            isRtl={content.isRtl}
          />
        </div>
        <div className="order-4">
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
        <div className="order-5">
          <PricingSection
            locale={locale}
            title={content.pricing.title}
            description={content.pricing.description}
            vatNote={content.pricing.vatNote}
            tiers={content.pricing.tiers}
            notesPlaceholder={content.pricing.notesPlaceholder}
            selectedTierId={selectedTierId}
            selectedIntakeSource={selectedIntakeSource}
            selectedLanguageBundle={selectedLanguageBundle}
            selectedVoiceMode={selectedVoiceMode}
            notes={notes}
            quoteLoading={quoteLoading}
            onTierChange={setSelectedTierId}
            onIntakeSourceChange={setSelectedIntakeSource}
            onLanguageBundleChange={setSelectedLanguageBundle}
            onVoiceModeChange={setSelectedVoiceMode}
            onNotesChange={setNotes}
            onOpenWhatsApp={handleOpenWhatsApp}
          />
        </div>
        <div className="order-6">
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
