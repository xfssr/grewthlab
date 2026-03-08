export const LOCALES = ["he", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const SECTION_IDS = ["top", "solutions", "gallery", "pricing", "cases", "faq", "quote"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const NICHE_IDS = ["restaurants", "beauty", "real-estate", "hotels"] as const;
export type NicheId = (typeof NICHE_IDS)[number];

export const PACKAGE_IDS = [
  "qr-menu-mini-site",
  "content-whatsapp-funnel",
  "business-launch-setup",
  "beauty-booking-flow",
  "quick-start-system",
] as const;
export type PackageId = (typeof PACKAGE_IDS)[number];

export const DELIVERY_MODES = ["standard", "express"] as const;
export type DeliveryMode = (typeof DELIVERY_MODES)[number];

export const ADDON_IDS = [
  "extra_production_day",
  "extra_service_page",
  "monthly_ad_creatives",
  "whatsapp_crm_setup",
] as const;
export type AddonId = (typeof ADDON_IDS)[number];

export type Direction = "ltr" | "rtl";
export type CurrencyCode = "ILS";
export type Tone = "gold" | "charcoal" | "bronze" | "stone";

export type CalculatorRules = {
  currency: CurrencyCode;
  roundTo: number;
  packages: Array<{ id: PackageId; basePrice: number }>;
  nicheMultipliers: Record<NicheId, number>;
  deliveryMultipliers: Record<DeliveryMode, number>;
  addons: Array<{ id: AddonId; price: number }>;
};

export type CalculatorInput = {
  locale: Locale;
  niche: NicheId;
  packageId: PackageId;
  deliveryMode: DeliveryMode;
  addons: AddonId[];
};

export type PriceBreakdownItem = {
  label: string;
  amount: number;
};

export type QuoteResult = {
  currency: CurrencyCode;
  subtotal: number;
  total: number;
  breakdown: PriceBreakdownItem[];
  vatIncluded: false;
};

export type MediaAsset = {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  altEn: string;
  altHe: string;
  tags: string[];
};

export type LocalizedMediaAsset = {
  id: string;
  title: string;
  tier: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  tags: string[];
};

export type ArchiveFormat = "reel" | "short" | "photo";
export type ArchiveProductionType = "ugc" | "lighting" | "ai";

export type ContentArchiveItem = {
  id: string;
  format: ArchiveFormat;
  productionType: ArchiveProductionType;
  mediaType: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  caption: string;
  duration: string;
  platform: string;
  alt: string;
};

export type ContentArchiveModule = {
  id: string;
  sourceCardId: string;
  title: string;
  description: string;
  workflowSteps: string[];
  items: ContentArchiveItem[];
};

export type SolutionCardViewModel = {
  id: PackageId;
  title: string;
  problem: string;
  whatWeDo: string;
  outcome: string;
  timeline: string;
  priceLabel: string;
  actionLabel: string;
  tone: Tone;
  imageSrc?: string;
};

export type SolutionDiagnosisViewModel = {
  id: string;
  title: string;
  problem: string;
  symptoms: string[];
  mappedPackageId: PackageId;
  ctaLabel: string;
};

export type SiteContentViewModel = {
  locale: Locale;
  dir: Direction;
  isRtl: boolean;
  brandName: string;
  whatsappPhoneDigits: string;
  navQuoteCta: string;
  navLinks: Array<{ label: string; href: string; sectionId: SectionId }>;
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    backgroundImageSrc: string;
    backgroundVideoSrc?: string;
  };
  industries: Array<{ title: string; caption: string; tone: Tone; imageSrc: string; imageAlt: string }>;
  industryEyebrow: string;
  process: {
    title: string;
    steps: Array<{ title: string; subtitle: string }>;
  };
  solutions: {
    title: string;
    description: string;
    chainTitle: string;
    chainStages: string[];
    diagnosticsTitle: string;
    diagnosticsDescription: string;
    diagnostics: SolutionDiagnosisViewModel[];
    strategicStatement: {
      title: string;
      body: string;
      highlight: string;
    };
    cards: SolutionCardViewModel[];
    packagePanelTitle: string;
    packagePanelCta: string;
  };
  gallery: {
    title: string;
    description: string;
    detailsCta: string;
    cardNote: string;
    items: LocalizedMediaAsset[];
  };
  contentArchive: {
    eyebrow: string;
    title: string;
    description: string;
    filters: {
      all: string;
      reel: string;
      short: string;
      photo: string;
    };
    productionFilters: {
      all: string;
      ugc: string;
      lighting: string;
      ai: string;
    };
    emptyLabel: string;
    modules: ContentArchiveModule[];
  };
  pricing: {
    title: string;
    description: string;
    vatNote: string;
    labels: {
      niche: string;
      packageType: string;
      deliveryMode: string;
      estimate: string;
      addons: string;
      notes: string;
      breakdown: string;
    };
    openWhatsAppCta: string;
    saveLeadCta: string;
    niches: Array<{ id: NicheId; label: string }>;
    packageOptions: Array<{ id: PackageId; label: string }>;
    deliveryModes: Array<{ id: DeliveryMode; label: string }>;
    addonOptions: Array<{ id: AddonId; label: string; priceLabel: string }>;
    notesPlaceholder: string;
    stats: Array<{ label: string; value: string }>;
  };
  cases: {
    title: string;
    cards: Array<{
      title: string;
      bullets: string[];
      action: string;
      packageId: PackageId;
      tone: Tone;
      imageSrc: string;
      imageAlt: string;
    }>;
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  quote: {
    title: string;
    nameLabel: string;
    phoneLabel: string;
    businessLabel: string;
    messageLabel: string;
    submitLabel: string;
    successMessage: string;
    errorMessage: string;
  };
  footer: {
    note: string;
    copyright: string;
    navTitle: string;
    contactTitle: string;
    ctaTitle: string;
    ctaButton: string;
    email: string;
    phone: string;
    location: string;
  };
};

export type LeadRecord = {
  id: string;
  createdAt: string;
  locale: Locale;
  contact: {
    name: string;
    phone: string;
    business?: string;
    message?: string;
  };
  quote: {
    packageId: PackageId;
    total: number;
    breakdown: PriceBreakdownItem[];
  };
  source: "landing_calculator" | "landing_quote_form";
};
