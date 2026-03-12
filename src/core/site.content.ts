import calculatorRulesRaw from "@/data/calculator.rules.json";
import mediaDemoRaw from "@/data/media.demo.json";
import enMessagesRaw from "@/messages/en.json";
import heMessagesRaw from "@/messages/he.json";
import { formatTierPriceRangeLabel, getTierDefinition } from "@/core/pricing/tier-model";

import type {
  AddonId,
  CalculatorRules,
  ContentArchiveModule,
  ContentArchiveItem,
  DeliveryMode,
  Direction,
  Locale,
  LocalizedMediaAsset,
  MediaAsset,
  NicheId,
  PackageId,
  SiteContentViewModel,
  SolutionDiagnosisViewModel,
  SolutionCardViewModel,
  TierId,
  Tone,
} from "@/core/site.types";
import { ADDON_IDS, DELIVERY_MODES, NICHE_IDS, PACKAGE_IDS, TIER_IDS } from "@/core/site.types";

type MessageSchema = {
  brand?: { name?: string };
  nav?: {
    links?: Array<{ label?: string; path?: string }>;
    stickyCta?: string;
  };
  hero?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    primaryCta?: string;
    secondaryCta?: string;
  };
  audience?: { categories?: string[] };
  process?: { title?: string; steps?: Array<{ title?: string; description?: string }> };
  solutionsPage?: {
    title?: string;
    description?: string;
    cardCta?: string;
    orderCta?: string;
    cards?: Array<{
      title?: string;
      slug?: string;
      problem?: string;
      whatWeDo?: string;
      outcome?: string;
      timeline?: string;
      price?: string;
    }>;
  };
  pricingPage?: {
    title?: string;
    description?: string;
    tiers?: Array<{ title?: string; price?: string }>;
    addons?: Array<{ title?: string; price?: string }>;
  };
  faq?: { title?: string; items?: Array<{ question?: string; answer?: string }> };
  contact?: {
    channels?: Array<{ label?: string; value?: string }>;
    form?: {
      title?: string;
      nameLabel?: string;
      phoneLabel?: string;
      businessLabel?: string;
      messageLabel?: string;
      submit?: string;
    };
  };
  footer?: { note?: string; copyright?: string };
  cta?: { primaryCta?: string };
  examplesGallery?: { title?: string; description?: string };
};

const enMessages = enMessagesRaw as MessageSchema;
const heMessages = heMessagesRaw as MessageSchema;

const calculatorRules = calculatorRulesRaw as CalculatorRules;
const mediaDemo = mediaDemoRaw as MediaAsset[];

const messageCatalog: Record<Locale, MessageSchema> = {
  en: enMessages,
  he: heMessages,
};

const toneCycle: Tone[] = ["bronze", "gold", "stone", "charcoal"];
const heroBackgroundImageSrc = "/images/generated/hero-blur.webp";
const heroBackgroundVideoSrc = "/webherobackground.mp4";

const industryImages = [
  {
    src: "/images/generated/category-restaurants.webp",
    altEn: "Restaurant marketing category image.",
    altHe: "תמונת קטגוריה למסעדות.",
  },
  {
    src: "/images/generated/category-bars.webp",
    altEn: "Bars and nightlife marketing category image.",
    altHe: "תמונת קטגוריה לברים.",
  },
  {
    src: "/images/generated/category-cafes.webp",
    altEn: "Cafe growth marketing category image.",
    altHe: "תמונת קטגוריה לבתי קפה.",
  },
  {
    src: "/images/generated/category-catering.webp",
    altEn: "Catering marketing category image.",
    altHe: "תמונת קטגוריה לקייטרינג.",
  },
] as const;

const caseStageImages = [
  {
    src: "/images/generated/case-problem.webp",
    altEn: "Problem stage image.",
    altHe: "תמונה לשלב הבעיה.",
  },
  {
    src: "/images/generated/case-solution.webp",
    altEn: "Solution stage image.",
    altHe: "תמונה לשלב הפתרון.",
  },
  {
    src: "/images/generated/case-result.webp",
    altEn: "Result stage image.",
    altHe: "תמונה לשלב התוצאה.",
  },
] as const;

const archiveItemsRaw = [
  {
    id: "archive-reel-1",
    format: "reel",
    productionType: "ugc",
    mediaType: "video",
    src: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    poster: "/images/generated/category-restaurants.webp",
    duration: "00:15",
    platform: "Instagram",
    titleHe: "UGC רילס למסעדה",
    titleEn: "UGC restaurant reel",
    captionHe: "וידאו אנכי בסגנון לקוח אמיתי עם קריאה להזמנה.",
    captionEn: "Vertical UGC-style reel with direct booking CTA.",
    altHe: "רילס אנכי למסעדה בפורמט 9:16.",
    altEn: "Vertical 9:16 restaurant reel preview.",
  },
  {
    id: "archive-short-1",
    format: "short",
    productionType: "ugc",
    mediaType: "video",
    src: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    poster: "/images/generated/category-bars.webp",
    duration: "00:20",
    platform: "YouTube",
    titleHe: "שורטס UGC למוצר חדש",
    titleEn: "UGC product launch short",
    captionHe: "סרטון קצר בסגנון UGC להדגמת מוצר חדש.",
    captionEn: "UGC-style short focused on a new product launch.",
    altHe: "וידאו שורטס אנכי בפורמט 9:16.",
    altEn: "Vertical 9:16 shorts video preview.",
  },
  {
    id: "archive-reel-2",
    format: "reel",
    productionType: "lighting",
    mediaType: "video",
    src: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    poster: "/images/generated/category-cafes.webp",
    duration: "00:18",
    platform: "Instagram",
    titleHe: "רילס תאורה וקולור",
    titleEn: "Lighting production reel",
    captionHe: "רילס פרודקשן עם תאורה חמה וצילום נקי למותג.",
    captionEn: "Production reel with controlled lighting and clean look.",
    altHe: "רילס אנכי עם דגש תאורה.",
    altEn: "Vertical reel with lighting-focused production.",
  },
  {
    id: "archive-short-2",
    format: "short",
    productionType: "lighting",
    mediaType: "video",
    src: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    poster: "/images/generated/category-catering.webp",
    duration: "00:14",
    platform: "TikTok",
    titleHe: "שורטס פרודקשן לתפריט",
    titleEn: "Lighting menu short",
    captionHe: "שורטס קצר עם דגש תאורה לאוכל וצילום פרימיום.",
    captionEn: "Short-form clip with food lighting and premium framing.",
    altHe: "שורטס אנכי עם דגש תאורה וצילום.",
    altEn: "Vertical short with lighting and production styling.",
  },
  {
    id: "archive-reel-3",
    format: "reel",
    productionType: "ai",
    mediaType: "video",
    src: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    poster: "/images/generated/case-solution.webp",
    duration: "00:16",
    platform: "Instagram",
    titleHe: "AI רילס לקמפיין",
    titleEn: "AI-assisted campaign reel",
    captionHe: "רילס עם שילוב AI לרעיונות, חיתוך וטקסטים מהירים.",
    captionEn: "AI-assisted reel for ideation, cutting, and text hooks.",
    altHe: "רילס אנכי עם שילוב AI לתוכן.",
    altEn: "Vertical reel with AI-assisted production workflow.",
  },
  {
    id: "archive-short-3",
    format: "short",
    productionType: "ai",
    mediaType: "video",
    src: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    poster: "/images/generated/case-result.webp",
    duration: "00:12",
    platform: "YouTube",
    titleHe: "שורטס AI לתוצאה",
    titleEn: "AI-assisted result short",
    captionHe: "שורטס קצר שמציג תוצאה עם גרפיקה וטקסט בעזרת AI.",
    captionEn: "Result-focused short using AI for overlays and pacing.",
    altHe: "שורטס אנכי עם שילוב AI לגרפיקה.",
    altEn: "Vertical short with AI-enhanced graphic overlays.",
  },
  {
    id: "archive-photo-1",
    format: "photo",
    productionType: "ugc",
    mediaType: "image",
    src: "/images/generated/category-cafes.webp",
    poster: "/images/generated/category-cafes.webp",
    duration: "Photo",
    platform: "Instagram",
    titleHe: "UGC פריים לסטורי",
    titleEn: "UGC story frame",
    captionHe: "תמונת סטורי אנכית בסגנון אותנטי להנעה לפעולה.",
    captionEn: "Authentic vertical story frame for quick action CTA.",
    altHe: "צילום אנכי לבית קפה בפורמט 9:16.",
    altEn: "Vertical 9:16 cafe photo frame.",
  },
  {
    id: "archive-photo-2",
    format: "photo",
    productionType: "ai",
    mediaType: "image",
    src: "/images/generated/case-result.webp",
    poster: "/images/generated/case-result.webp",
    duration: "Photo",
    platform: "Instagram",
    titleHe: "AI פריים תוצאה",
    titleEn: "AI-enhanced result frame",
    captionHe: "פריים אנכי לתוצאה עם שדרוג ויזואלי בעזרת AI.",
    captionEn: "Result frame with AI-enhanced visual styling.",
    altHe: "תמונת תוצאה אנכית בפורמט 9:16.",
    altEn: "Vertical 9:16 result photo preview.",
  },
] as const;

const heroLeadLineByLocale: Record<Locale, string> = {
  he: "שולחים אינסטגרם או תפריט, ומקבלים פלט ראשון תוך 48 שעות: עמוד, תוכן ומסלול פניות אנושי.",
  en: "Send your Instagram or menu, and receive first output within 48 hours: page, content, and a human-tone inquiry path.",
};

const industryCaptionOverrides: Record<Locale, string[]> = {
  he: [
    "לעסקים שרוצים יותר הזמנות מהאזור שלהם.",
    "לברים ומותגים שמריצים מוצר חדש.",
    "לבתי קפה שרוצים יותר הזמנות ותיאום תורים.",
    "לקייטרינג שרוצה פניות מהירות לפני אירועים.",
  ],
  en: [
    "For restaurants that want more local bookings.",
    "For bars and brands launching a new product.",
    "For cafes increasing orders and booking slots.",
    "For catering teams that need fast pre-event inquiries.",
  ],
};

const localizedSectionCopy: Record<
  Locale,
  {
    navQuoteCta: string;
    nav: { solutions: string; gallery: string; pricing: string; faq: string };
    hero: { eyebrow: string; title: string; accent: string; primaryCta: string; secondaryCta: string };
    industryEyebrow: string;
    process: { title: string; steps: Array<{ title: string; subtitle: string }> };
    solutions: {
      title: string;
      description: string;
      chainTitle: string;
      chainStages: string[];
      diagnosticsTitle: string;
      diagnosticsDescription: string;
      strategicTitle: string;
      strategicBody: string;
      strategicHighlight: string;
      panelTitle: string;
      panelCta: string;
      cardCta: string;
      diagnosisCta: string;
    };
    gallery: { title: string; description: string; detailsCta: string; cardNote: string };
    contentArchive: {
      eyebrow: string;
      title: string;
      description: string;
      filters: { all: string; reel: string; short: string; photo: string };
      productionFilters: { all: string; ugc: string; lighting: string; ai: string };
      emptyLabel: string;
    };
    bridge: {
      eyebrow: string;
      title: string;
      beforeLabel: string;
      beforeText: string;
      buildLabel: string;
      buildItems: string[];
      resultLabel: string;
      resultText: string;
      cta: string;
    };
    pricing: { title: string; description: string };
    casesTitle: string;
    faq: { title: string; items: Array<{ question: string; answer: string }> };
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
      navTitle: string;
      contactTitle: string;
      ctaTitle: string;
      ctaButton: string;
      location: string;
    };
  }
> = {
  he: {
    navQuoteCta: "לקבלת הצעה",
    nav: {
      solutions: "פתרונות",
      gallery: "גלריה",
      pricing: "מחירים",
      faq: "שאלות",
    },
    hero: {
      eyebrow: "פלט ראשון ב-48 שעות",
      title: "אינסטגרם / תפריט -> אתר + חבילת תוכן",
      accent: "מערך רב-לשוני לישראל + טון אנושי, בלי טקסט שבלוני",
      primaryCta: "לפתרונות",
      secondaryCta: "למחיר מהיר",
    },
    industryEyebrow: "קטגוריות מובילות",
    process: {
      title: "איך זה עובד",
      steps: [
        {
          title: "שולחים מינימום חומרים",
          subtitle: "קישור אינסטגרם, תפריט, או שניהם. בלי בריף ארוך.",
        },
        {
          title: "בונים מערכת פנייה ברורה",
          subtitle: "עמוד ממיר, שפת מותג אנושית, וזרימת WhatsApp לשיחה ראשונה.",
        },
        {
          title: "עולים עם פלט ראשון תוך 48 שעות",
          subtitle: "מתחילים לעבוד עם תוצרים ראשונים ולא מחכים לסיום כל הפרויקט.",
        },
      ],
    },
    solutions: {
      title: "ארכיטקטורת הצעה לעסקים בישראל",
      description: "מהירות ביצוע, רב-לשוניות וערוצים תפעוליים - כחבילה אחת שאפשר להשיק מיידית.",
      chainTitle: "שרשרת הלקוחות בעסק",
      chainStages: [
        "מכירים אתכם",
        "מתעניינים",
        "צופים בתוכן",
        "בונים אמון",
        "כותבים בוואטסאפ",
        "קונים",
      ],
      diagnosticsTitle: "הבעיות האמיתיות שבעל עסק פוגש",
      diagnosticsDescription: "בחרו את הבעיה שאתם מזהים, ונתאים את הפתרון הנכון.",
      strategicTitle: "זה לא טמפלט SaaS. זאת מערכת עבודה מלאה.",
      strategicBody:
        "במקום ספקים נפרדים, מקבלים השקה אחת: אתר, נכסי Google Business, וטקסטים לשיחות WhatsApp.",
      strategicHighlight: "העיקרון: טון אנושי עם כללי קול ברורים, לא קופי שיווקי גנרי.",
      panelTitle: "בחירת פתרון",
      panelCta: "התאמת פתרון לפער",
      cardCta: "בחרו פתרון",
      diagnosisCta: "התאמת פתרון",
    },
    gallery: {
      title: "עבודות נבחרות",
      description: "לא רק עיצוב יפה - כל נכס כאן תומך במהלך שמוביל לפניות ולמכירה.",
      detailsCta: "למודול תוכן",
      cardNote: "זה תוכן שאנחנו יוצרים לעסקים.",
    },
    contentArchive: {
      eyebrow: "מודול תוכן",
      title: "ארכיון רילס / שורטס (UGC • תאורה • AI)",
      description: "מודול הדגמה ללקוח: פורמטים אנכיים 9:16 לפי סוג פרודקשן.",
      filters: {
        all: "הכל",
        reel: "רילסים",
        short: "שורטס",
        photo: "תמונות",
      },
      productionFilters: {
        all: "כל הסוגים",
        ugc: "UGC",
        lighting: "תאורה",
        ai: "AI",
      },
      emptyLabel: "אין פריטים לסינון הזה כרגע.",
    },
    bridge: {
      eyebrow: "מחומרים להשקה",
      title: "מאינסטגרם/תפריט לפלט ראשון תוך 48 שעות",
      beforeLabel: "לפני",
      beforeText: "יש חומרים, אבל הערוצים לא מחוברים, אין כיסוי שפות מלא, והטון מרגיש רובוטי.",
      buildLabel: "מה אנחנו בונים",
      buildItems: [
        "השקת אתר + חבילת תוכן ב-48 שעות ממינימום קלט",
        "שכבת שפות מובנית: עברית/רוסית/אנגלית (+ערבית לפי צורך)",
        "תכני Google Business לפוסטים/הטבות (תואם תהליך API)",
        "סקריפטים ל-WhatsApp עם טון מכיל ואנושי",
      ],
      resultLabel: "התוצאה",
      resultText: "השקה אחידה בכל נקודות המגע: יותר אמון, תגובות מהירות יותר, ופניות מדויקות יותר.",
      cta: "לבחירת tier",
    },
    pricing: {
      title: "שלוש רמות שירות ברורות",
      description: "Starter, Business, Growth. הפלט הראשון תוך 48 שעות, בלי מחשבון חבילות.",
    },
    casesTitle: "בעיה, פתרון, תוצאה",
    faq: {
      title: "שאלות נפוצות לפני התחלה",
      items: [
        {
          question: "תוך כמה זמן אפשר לעלות לאוויר?",
          answer: "הפלט הראשון מגיע תוך 48 שעות. היקף מלא נקבע לאחר אפיון קצר.",
        },
        {
          question: "אתם עושים גם תוכן וגם דף נחיתה?",
          answer: "כן. זאת חבילה מלאה שמחברת תוכן, דף ופרסום.",
        },
        {
          question: "יש אפשרות להתחיל קטן?",
          answer: "כן. אפשר להתחיל מחבילת בסיס ולהתרחב בהמשך.",
        },
        {
          question: "איך מקבלים פניות בפועל?",
          answer: "הפניות מגיעות ישירות לוואטסאפ עם הודעה מוכנה מראש.",
        },
      ],
    },
    quote: {
      title: "קבלו הצעת מחיר מהירה",
      nameLabel: "שם מלא",
      phoneLabel: "טלפון / וואטסאפ",
      businessLabel: "שם העסק",
      messageLabel: "מה המטרה שלכם?",
      submitLabel: "שליחה",
      successMessage: "הפנייה נשלחה בהצלחה.",
      errorMessage: "משהו השתבש. נסו שוב.",
    },
    footer: {
      note: "פתרון פשוט לעסקים שרוצים יותר פניות והזמנות.",
      navTitle: "ניווט",
      contactTitle: "יצירת קשר",
      ctaTitle: "התחלה מהירה",
      ctaButton: "לדבר איתנו בוואטסאפ",
      location: "ישראל",
    },
  },
  en: {
    navQuoteCta: "Get quote",
    nav: {
      solutions: "Solutions",
      gallery: "Gallery",
      pricing: "Pricing",
      faq: "FAQ",
    },
    hero: {
      eyebrow: "First output in 48 hours",
      title: "Instagram / menu -> live site + content pack",
      accent: "Multilingual Israel stack + human tone, not template copy",
      primaryCta: "View solutions",
      secondaryCta: "Quick pricing",
    },
    industryEyebrow: "Top categories",
    process: {
      title: "How it works",
      steps: [
        {
          title: "Drop your minimum input",
          subtitle: "Send an Instagram profile, a menu, or both. No long brief needed.",
        },
        {
          title: "We build a clear inquiry system",
          subtitle: "Conversion page, human voice rules, and a WhatsApp-first contact path.",
        },
        {
          title: "First output ships in 48 hours",
          subtitle: "You start operating from initial deliverables instead of waiting for full project completion.",
        },
      ],
    },
    solutions: {
      title: "Offer architecture for Israel local businesses",
      description: "We package speed, multilingual execution, and channel-ready assets into one operating offer.",
      chainTitle: "Your client chain",
      chainStages: ["Discover", "Get interested", "Watch", "Trust", "Message", "Buy"],
      diagnosticsTitle: "Real issues local owners describe",
      diagnosticsDescription: "Choose the problem you recognize and match the right solution.",
      strategicTitle: "This is not a template SaaS handoff. It is an operating growth stack.",
      strategicBody:
        "Instead of separate vendors, you get one accountable release: site, Google Business assets, and WhatsApp scripts.",
      strategicHighlight: "Core principle: human tone with context constraints, not generic marketing copy.",
      panelTitle: "Solution selector",
      panelCta: "Match solution to bottleneck",
      cardCta: "Choose solution",
      diagnosisCta: "Match this issue",
    },
    gallery: {
      title: "Selected work",
      description: "Project samples built to attract attention, trust, and inquiries.",
      detailsCta: "Open content module",
      cardNote: "This is content we create for clients.",
    },
    contentArchive: {
      eyebrow: "Content module",
      title: "Reels / Shorts archive (UGC • Lighting • AI)",
      description: "Client-facing 9:16 module split by production type.",
      filters: {
        all: "All",
        reel: "Reels",
        short: "Shorts",
        photo: "Photo",
      },
      productionFilters: {
        all: "All types",
        ugc: "UGC",
        lighting: "Lighting",
        ai: "AI",
      },
      emptyLabel: "No items in this filter yet.",
    },
    bridge: {
      eyebrow: "From Input to Launch",
      title: "From Instagram/menu to first output in 48 hours",
      beforeLabel: "Before",
      beforeText: "Assets exist, but channels are disconnected, language coverage is partial, and tone sounds robotic.",
      buildLabel: "What we build",
      buildItems: [
        "48-hour site + content sprint from minimal input",
        "Built-in Hebrew/Russian/English layer (Arabic optional)",
        "Google Business Profile post + offer copy (API-ready workflow)",
        "WhatsApp response scripts with empathetic, human tone",
      ],
      resultLabel: "Result",
      resultText: "One coherent launch across channels: clearer trust, faster responses, and higher-quality inquiries.",
      cta: "Open quick pricing",
    },
    pricing: {
      title: "Three clear service tiers",
      description: "Starter, Business, Growth. First output in 48 hours, no package calculator.",
    },
    casesTitle: "Problem, Solution, Result",
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          question: "How fast can we go live?",
          answer: "First output is delivered within 48 hours. Full scope timeline is set after a short brief.",
        },
        {
          question: "Do you handle both content and landing page?",
          answer: "Yes. The package combines production, page, and promotion.",
        },
        {
          question: "Can we start with a small package?",
          answer: "Yes. Start with a base package and scale when ready.",
        },
        {
          question: "Where do inquiries arrive?",
          answer: "Directly to WhatsApp with a prefilled message.",
        },
      ],
    },
    quote: {
      title: "Get a quick quote",
      nameLabel: "Full name",
      phoneLabel: "Phone / WhatsApp",
      businessLabel: "Business name",
      messageLabel: "What is your goal?",
      submitLabel: "Send",
      successMessage: "Inquiry sent successfully.",
      errorMessage: "Something went wrong. Please try again.",
    },
    footer: {
      note: "A simple system for businesses that need more leads and bookings.",
      navTitle: "Navigation",
      contactTitle: "Contact",
      ctaTitle: "Quick start",
      ctaButton: "Chat with us on WhatsApp",
      location: "Israel",
    },
  },
};

const selectableSolutionOrder: PackageId[] = [
  "quick-start-system",
  "content-whatsapp-funnel",
  "qr-menu-mini-site",
  "beauty-booking-flow",
  "business-launch-setup",
];

const diagnosisOverrides: Record<Locale, Array<Omit<SolutionDiagnosisViewModel, "ctaLabel">>> = {
  he: [
    {
      id: "visibility-gap",
      title: "לא רואים את העסק",
      problem: "יש עסק טוב, אבל לקוחות חדשים כמעט לא מכירים אותו.",
      symptoms: ["עמוד אינסטגרם ריק", "אין תמונות חזקות", "פרופיל העסק בגוגל נראה לא פעיל"],
      mappedPackageId: "quick-start-system",
    },
    {
      id: "views-no-messages",
      title: "צופים אבל לא כותבים",
      problem: "יש צפיות, אבל אין מעבר לפנייה אמיתית.",
      symptoms: ["אין קריאה ברורה לפעולה", "אין עמוד ממיר", "הלקוח לא מבין מה הצעד הבא"],
      mappedPackageId: "content-whatsapp-funnel",
    },
    {
      id: "restaurant-empty",
      title: "המסעדה יפה אבל ריקה",
      problem: "המקום טוב, אבל ברשת הוא לא נראה מספיק מזמין.",
      symptoms: ["אוכל לא מצולם נכון", "אין רילסים קבועים", "אין חוויית מותג באונליין"],
      mappedPackageId: "qr-menu-mini-site",
    },
    {
      id: "listing-stuck",
      title: "הנכס מוצג אבל לא נמכר",
      problem: "הנכס לא מוצג בצורה שמייצרת עניין ובקשות סיור.",
      symptoms: ["תמונות חלשות", "אין וידאו סיור", "אין עמוד נכס ממוקד"],
      mappedPackageId: "beauty-booking-flow",
    },
    {
      id: "legacy-stuck",
      title: "עסק ותיק שנתקע",
      problem: "העסק עובד שנים, אבל נראה ישן ולא מתקדם דיגיטלית.",
      symptoms: ["אתר מיושן", "עיצוב חלש", "אין וידאו/סושיאל פעיל"],
      mappedPackageId: "business-launch-setup",
    },
    {
      id: "content-no-system",
      title: "יש תוכן אבל אין מערכת",
      problem: "מייצרים תוכן, אבל בלי מבנה שמוביל לפניות.",
      symptoms: ["פוסטים אקראיים", "אין אסטרטגיה", "אין חיבור לפרסום"],
      mappedPackageId: "content-whatsapp-funnel",
    },
    {
      id: "new-business-chaos",
      title: "עסק חדש נפתח בבלגן",
      problem: "יש הרבה משימות התחלה, אבל אין מערכת אחת שמחברת הכל.",
      symptoms: ["תוכן, אתר ופרסום מנותקים", "אין סדר השקה", "אין זרימת לקוח יציבה"],
      mappedPackageId: "business-launch-setup",
    },
  ],
  en: [
    {
      id: "visibility-gap",
      title: "Business Is Not Visible",
      problem: "The business is good, but new people barely notice it.",
      symptoms: ["Instagram looks empty", "No strong photos", "Google profile looks inactive"],
      mappedPackageId: "quick-start-system",
    },
    {
      id: "views-no-messages",
      title: "People Watch but Do Not Message",
      problem: "You get views, but they do not turn into inquiries.",
      symptoms: ["No clear CTA", "No conversion page", "The next step is unclear"],
      mappedPackageId: "content-whatsapp-funnel",
    },
    {
      id: "restaurant-empty",
      title: "Restaurant Looks Good but Feels Empty",
      problem: "The place is solid, but online presentation is too weak to attract guests.",
      symptoms: ["Food visuals are weak", "No steady reels", "No atmosphere content"],
      mappedPackageId: "qr-menu-mini-site",
    },
    {
      id: "listing-stuck",
      title: "Property Is Listed but Not Selling",
      problem: "Listings are visible but not compelling enough to trigger action.",
      symptoms: ["Dark photos", "No walkthrough video", "No focused property page"],
      mappedPackageId: "beauty-booking-flow",
    },
    {
      id: "legacy-stuck",
      title: "Legacy Business Is Stuck",
      problem: "A long-running business looks outdated and cannot scale digitally.",
      symptoms: ["Old site", "Weak design", "No active social/video presence"],
      mappedPackageId: "business-launch-setup",
    },
    {
      id: "content-no-system",
      title: "Content Exists but No System",
      problem: "Content is produced, but there is no engine behind it.",
      symptoms: ["Chaotic posting", "No strategy", "No ad integration"],
      mappedPackageId: "content-whatsapp-funnel",
    },
    {
      id: "new-business-chaos",
      title: "New Business Launch Is Chaotic",
      problem: "Before opening, many moving parts exist but no unified setup.",
      symptoms: ["Content, site, and ads are disconnected", "No launch sequence", "No stable inquiry flow"],
      mappedPackageId: "business-launch-setup",
    },
  ],
};

const solutionOverrides: Record<
  Locale,
  Record<PackageId, Omit<SolutionCardViewModel, "id" | "tone" | "priceLabel" | "actionLabel"> & { priceLabel?: string }>
> = {
  he: {
    "qr-menu-mini-site": {
      title: "מערכת תפריט-לאתר ב-48 שעות",
      problem: "יש תפריט ותוכן, אבל הם לא מתורגמים למסלול ברור שמייצר פניות מהירות.",
      whatWeDo:
        "• קליטה מתפריט/אינסטגרם\n• מיני-אתר ממיר תוך 48 שעות\n• בלוקים מסודרים להצעה ושירות\n• כפתור WhatsApp עם מסלול תגובה\n• סט טקסטים מוכן לפרסום",
      outcome: "התוצאה: מעבר מתפריט למסלול הזמנה/פנייה חי בתוך יומיים.",
      timeline: "48 שעות",
    },
    "content-whatsapp-funnel": {
      title: "מערכת WhatsApp בטון אנושי",
      problem: "יש פניות, אבל השיחה נשמעת גנרית ונופלת לפני שהלקוח מתקדם.",
      whatWeDo:
        "• מפת שיחה לפי כוונת לקוח\n• הודעות פתיחה והמשך\n• כללי קול אמפתיים (בלי טון פרסומי ריק)\n• טקסטים להצעה והתנגדויות\n• פלייבוק לצוות ב-WhatsApp",
      outcome: "התוצאה: איכות תגובה גבוהה יותר, טיפול מהיר יותר, ויותר שיחות שנסגרות.",
      timeline: "3-5 ימים",
    },
    "business-launch-setup": {
      title: "סטאק השקה לערוצי ישראל",
      problem: "עסקים עולים עם אתר בלבד, בלי חיבור תפעולי ל-Google Business ול-WhatsApp.",
      whatWeDo:
        "• אתר או עמוד שירות\n• טקסטים לפוסטים/הטבות ב-Google Business\n• הנחיית עבודה תואמת API ל-GBP\n• סקריפטים לתגובות WhatsApp\n• שכבת CTA וטון אחידה",
      outcome: "התוצאה: כל הערוצים הפעילים עולים יחד עם מסר אחיד ומענה מהיר יותר.",
      timeline: "4-7 ימים",
    },
    "beauty-booking-flow": {
      title: "מערכת שיווק לנכס נדל\"ן",
      problem: "נכס לא נסגר כי ההצגה שלו חלשה ולא יוצרת ערך נתפס גבוה.",
      whatWeDo:
        "• צילום נדל\"ן מקצועי\n• וידאו סיור\n• רילסים לנכס\n• עמוד נחיתה ייעודי\n• כפתור פנייה מהירה",
      outcome: "התוצאה: הנכס נראה יקר ומקצועי יותר ומייצר יותר צפיות ובקשות סיור.",
      timeline: "7-16 ימים",
    },
    "quick-start-system": {
      title: "קוויקסטארט מאינסטגרם/תפריט",
      problem: "יש חומרים בסיסיים, אבל אין דרך מהירה להפוך אותם להשקה שמביאה פניות.",
      whatWeDo:
        "• קליטת חומרים קיימים מאינסטגרם/תפריט\n• מסלול השקה מהיר ב-48 שעות\n• שכבת קופי רב-לשונית (עברית/רוסית/אנגלית + ערבית אופציונלית)\n• סט התחלתי ל-Google Business ו-WhatsApp\n• כללי טון אנושי עקביים",
      outcome: "התוצאה: השקה במינימום קלט, עם שפה טבעית שמביאה פניות איכותיות מהר.",
      timeline: "48 שעות",
    },
  },
  en: {
    "qr-menu-mini-site": {
      title: "48-Hour Menu-to-Site System",
      problem: "Menu assets exist, but they are not translated into a fast, conversion-ready customer path.",
      whatWeDo:
        "• Menu/Instagram intake\n• Conversion mini-site in 48 hours\n• Structured service/offer blocks\n• WhatsApp CTA and response entry\n• Publish-ready content snippets",
      outcome: "Result: a live ordering/inquiry path from menu content in two days, not two weeks.",
      timeline: "48 hours",
    },
    "content-whatsapp-funnel": {
      title: "Human-Tone WhatsApp Funnel",
      problem: "Leads arrive, but replies sound generic and conversations drop before intent is qualified.",
      whatWeDo:
        "• Message map by customer intent\n• First-reply and follow-up scripts\n• Empathetic tone guardrails (no ad-bullshit)\n• Offer and objection snippets\n• Team-ready WhatsApp playbook",
      outcome: "Result: higher reply quality, faster handoff, and more conversations that actually close.",
      timeline: "3-5 days",
    },
    "business-launch-setup": {
      title: "Israel Channel Launch Stack",
      problem: "Businesses launch with a website only, while Google Business and WhatsApp channels stay unstructured.",
      whatWeDo:
        "• Site or service page\n• Google Business Profile post/offer copy\n• API-ready GBP posting workflow notes\n• WhatsApp response scripts\n• Unified CTA and tone system",
      outcome: "Result: all active local channels launch together, with one message and faster lead handling.",
      timeline: "4-7 days",
    },
    "beauty-booking-flow": {
      title: "Real Estate Listing System",
      problem: "The property is listed, but presentation quality is too weak to trigger demand.",
      whatWeDo:
        "• Professional property photos\n• Walkthrough video\n• Listing reels\n• Property landing page\n• Fast inquiry button",
      outcome: "Result: the listing looks premium, gets more attention, and receives more inquiries.",
      timeline: "7-16 days",
    },
    "quick-start-system": {
      title: "Instagram/Menu Quickstart",
      problem: "The owner has social/menu materials, but no practical way to package them into a sales-ready launch.",
      whatWeDo:
        "• Intake from existing Instagram/menu assets\n• 48-hour sprint setup\n• Multilingual copy layer (HE/RU/EN, optional AR)\n• Google Business + WhatsApp starter scripts\n• Human-tone message rules",
      outcome: "Result: minimal-input launch that sounds natural and starts collecting qualified inquiries quickly.",
      timeline: "48 hours",
    },
  },
};

function toneAt(index: number): Tone {
  return toneCycle[index % toneCycle.length];
}

function toDirection(locale: Locale): Direction {
  return locale === "he" ? "rtl" : "ltr";
}

function toShekelLabel(value: string | undefined): string {
  if (!value) {
    return "";
  }

  return value.replace(/\bILS\b/gi, "₪");
}

function hasHebrewCharacters(value: string | undefined): boolean {
  if (!value) {
    return false;
  }
  return /[\u0590-\u05FF]/u.test(value);
}

function localizedText(locale: Locale, candidate: string | undefined, fallback: string): string {
  const value = candidate?.trim();
  if (!value) {
    return fallback;
  }

  if (locale === "he" && !hasHebrewCharacters(value)) {
    return fallback;
  }

  return value;
}

function formatShekel(amount: number): string {
  return `₪${amount.toLocaleString("en-US")}`;
}

function isPackageId(value: string): value is PackageId {
  return (PACKAGE_IDS as readonly string[]).includes(value);
}

function extractPhoneDigits(messages: MessageSchema): string {
  const channels = messages.contact?.channels ?? [];
  const preferred =
    channels.find((channel) => /whatsapp/i.test(channel.label ?? "")) ||
    channels.find((channel) => /phone|טלפון/i.test(channel.label ?? "")) ||
    channels[0];

  const value = preferred?.value ?? "+972509656366";
  const digits = value.replace(/[^\d]/g, "");
  return digits || "972509656366";
}

function mapMedia(locale: Locale): LocalizedMediaAsset[] {
  return mediaDemo.map((item) => ({
    id: item.id,
    title: locale === "he" ? item.altHe : item.altEn,
    tier: item.tags[0] || item.id,
    type: item.type,
    src: item.src,
    poster: item.poster,
    alt: locale === "he" ? item.altHe : item.altEn,
    tags: item.tags,
  }));
}

function mapContentArchive(locale: Locale): ContentArchiveItem[] {
  return archiveItemsRaw.map<ContentArchiveItem>((item) => ({
    id: item.id,
    format: item.format,
    productionType: item.productionType,
    mediaType: item.mediaType,
    src: item.src,
    poster: item.poster,
    title: locale === "he" ? item.titleHe : item.titleEn,
    caption: locale === "he" ? item.captionHe : item.captionEn,
    duration: item.duration,
    platform: item.platform,
    alt: locale === "he" ? item.altHe : item.altEn,
  }));
}

type ContentTheme = "restaurant" | "beauty" | "real-estate" | "hotel" | "business" | "general";

const themeCopy: Record<
  Locale,
  Record<ContentTheme, { label: string; focus: string; cta: string; modulePrefix: string }>
> = {
  he: {
    restaurant: {
      label: "מסעדות ובתי קפה",
      focus: "חוויית אירוח, מנות ותנועה להזמנות",
      cta: "קריאה ברורה להזמנה בוואטסאפ",
      modulePrefix: "מודול תוכן למסעדה",
    },
    beauty: {
      label: "ביוטי וטיפוח",
      focus: "תיאום תורים ואמון דרך תוצאות אמיתיות",
      cta: "הנעה לתיאום תור מידי",
      modulePrefix: "מודול תוכן לביוטי",
    },
    "real-estate": {
      label: "נדל\"ן",
      focus: "איכות לידים וסינון פניות לפי אזור",
      cta: "קריאה לקבלת פרטים וסיור",
      modulePrefix: "מודול תוכן לנדל\"ן",
    },
    hotel: {
      label: "מלונאות ואירוח",
      focus: "נראות חדרים וחוויית שהייה",
      cta: "הנעה להזמנה מהירה",
      modulePrefix: "מודול תוכן למלון",
    },
    business: {
      label: "עסקים מקומיים",
      focus: "הצעת ערך ברורה ופניות איכותיות",
      cta: "הנעה לשיחה מהירה",
      modulePrefix: "מודול תוכן לעסק",
    },
    general: {
      label: "תוכן פרסומי",
      focus: "מסר חד, הצעה ברורה והוכחה",
      cta: "קריאה לפעולה פשוטה",
      modulePrefix: "מודול תוכן",
    },
  },
  en: {
    restaurant: {
      label: "Restaurants and Cafes",
      focus: "Hospitality vibe, menu visuals, and booking flow",
      cta: "Clear WhatsApp booking CTA",
      modulePrefix: "Restaurant content module",
    },
    beauty: {
      label: "Beauty and Wellness",
      focus: "Appointment intent and trust through real results",
      cta: "Direct appointment CTA",
      modulePrefix: "Beauty content module",
    },
    "real-estate": {
      label: "Real Estate",
      focus: "Lead quality and area-based intent",
      cta: "Property inquiry CTA",
      modulePrefix: "Real-estate content module",
    },
    hotel: {
      label: "Hotels and Hospitality",
      focus: "Room presentation and stay experience",
      cta: "Fast booking CTA",
      modulePrefix: "Hotel content module",
    },
    business: {
      label: "Local Business",
      focus: "Clear offer and qualified inquiries",
      cta: "Quick consultation CTA",
      modulePrefix: "Business content module",
    },
    general: {
      label: "Marketing Content",
      focus: "Strong hook, clear offer, and proof",
      cta: "Simple next-step CTA",
      modulePrefix: "Content module",
    },
  },
};

const itemAngleCopy: Record<Locale, string[]> = {
  he: [
    "פתיח חזק",
    "אווירה וסטייל",
    "הצעת ערך",
    "הוכחה חברתית",
    "לפני/אחרי",
    "תסריט AI",
    "מסר קצר לסטורי",
    "סגירה עם קריאה לפעולה",
  ],
  en: [
    "Opening hook",
    "Atmosphere and style",
    "Offer highlight",
    "Social proof",
    "Before / after",
    "AI-assisted script",
    "Story frame",
    "Closing CTA",
  ],
};

const moduleWorkflowSteps: Record<Locale, string[]> = {
  he: [
    "יוצרים קונספט ברור לתוכן ולמטרה.",
    "מגדירים תגיות תוכן לפי קהל יעד ונושא.",
    "מצלמים וידאו איכותי עם תאורה נכונה.",
    "כותבים תסריט קצר עם פתיח חזק וקריאה לפעולה.",
    "אורזים את החומרים לפורמטים של רילס/שורטס.",
    "מפרסמים לרשתות החברתיות ועוקבים אחרי תגובה.",
  ],
  en: [
    "Define a clear content concept and goal.",
    "Set content tags by audience and topic.",
    "Shoot high-quality video with proper lighting.",
    "Write a short script with hook and CTA.",
    "Package assets into reels/shorts formats.",
    "Publish to social channels and monitor response.",
  ],
};

function detectTheme(tags: string[]): ContentTheme {
  const lowered = tags.map((tag) => tag.toLowerCase());

  if (lowered.some((tag) => ["restaurant", "cafe", "menu", "bar", "catering", "food"].includes(tag))) {
    return "restaurant";
  }
  if (lowered.some((tag) => ["beauty", "wellness", "salon", "portrait"].includes(tag))) {
    return "beauty";
  }
  if (lowered.some((tag) => ["real-estate", "property", "architecture"].includes(tag))) {
    return "real-estate";
  }
  if (lowered.some((tag) => ["hotel", "hospitality", "room"].includes(tag))) {
    return "hotel";
  }
  if (lowered.some((tag) => ["business", "service", "storefront", "campaign", "strategy", "planning"].includes(tag))) {
    return "business";
  }

  return "general";
}

function trimTopic(value: string, maxLength = 82): string {
  const compact = value.trim().replace(/[.!?]\s*$/, "");
  if (compact.length <= maxLength) {
    return compact;
  }
  return `${compact.slice(0, maxLength).trimEnd()}...`;
}

export function buildContentArchiveModules(locale: Locale, galleryItems: LocalizedMediaAsset[]): ContentArchiveModule[] {
  const baseItems = mapContentArchive(locale);
  const groupedItems = new Map<string, LocalizedMediaAsset[]>();

  for (const item of galleryItems) {
    const key = item.tier.trim() || item.title.trim() || item.id;
    const current = groupedItems.get(key) ?? [];
    current.push(item);
    groupedItems.set(key, current);
  }

  return Array.from(groupedItems.entries()).map(([, group], moduleIndex) => {
    const primaryItem = group[0];
    const topic = trimTopic(primaryItem.tier || primaryItem.title || primaryItem.alt);
    const theme = detectTheme(primaryItem.tags);
    const themeContext = themeCopy[locale][theme];
    const categoryTag =
      primaryItem.tags.find((tag) => {
        const lowered = tag.toLowerCase();
        return lowered !== "admin" && lowered !== "gallery";
      }) || "";

    const relatedPool = group.filter((item) =>
      categoryTag ? item.tags.some((tag) => tag.toLowerCase() === categoryTag.toLowerCase()) : true,
    );
    const normalizedPool = relatedPool.length > 0 ? relatedPool : [primaryItem];
    const videoPool = normalizedPool.filter((item) => item.type === "video");
    const imagePool = normalizedPool.filter((item) => item.type === "image");
    const moduleImageFallback = imagePool[0] || normalizedPool[0] || primaryItem;
    const moduleVideoFallback = videoPool[0] || null;
    const description =
      locale === "he"
        ? `${themeContext.modulePrefix}: ${topic}. ${themeContext.focus}.`
        : `${themeContext.modulePrefix}: ${topic}. ${themeContext.focus}.`;

    const items: ContentArchiveItem[] = baseItems.map((baseItem, itemIndex): ContentArchiveItem => {
      const angle = itemAngleCopy[locale][itemIndex % itemAngleCopy[locale].length];
      const title = locale === "he" ? `${themeContext.label} • ${angle}` : `${angle} • ${themeContext.label}`;
      const caption =
        locale === "he"
          ? `${themeContext.focus}. ${baseItem.caption} ${themeContext.cta}.`
          : `${themeContext.focus}. ${baseItem.caption} ${themeContext.cta}.`;

      const targetPool =
        baseItem.mediaType === "video"
          ? (videoPool.length > 0 ? videoPool : imagePool.length > 0 ? imagePool : normalizedPool)
          : (imagePool.length > 0 ? imagePool : videoPool.length > 0 ? videoPool : normalizedPool);
      const selectedMedia = targetPool[itemIndex % targetPool.length] || primaryItem;
      const mediaIsVideo = selectedMedia.type === "video";
      const format: ContentArchiveItem["format"] = mediaIsVideo ? "reel" : "photo";
      const mediaType: ContentArchiveItem["mediaType"] = mediaIsVideo ? "video" : "image";

      return {
        ...baseItem,
        id: `${primaryItem.id}-${baseItem.id}-${itemIndex + 1}`,
        format,
        mediaType,
        src: selectedMedia.src,
        poster: mediaIsVideo
          ? (selectedMedia.poster || moduleImageFallback.src || moduleVideoFallback?.poster || moduleVideoFallback?.src)
          : (selectedMedia.src || moduleImageFallback.src),
        duration: mediaIsVideo ? baseItem.duration : (locale === "he" ? "תמונה" : "Photo"),
        title,
        caption,
        alt: locale === "he" ? `${topic} | ${mediaIsVideo ? "וידאו" : "תמונה"}` : `${topic} | ${mediaIsVideo ? "video" : "image"}`,
      };
    });

    return {
      id: `module-${moduleIndex + 1}-${primaryItem.id}`,
      sourceCardId: primaryItem.id,
      title: topic,
      description,
      workflowSteps: moduleWorkflowSteps[locale],
      items,
    };
  });
}

function addonLabelFromMessages(locale: Locale, addonId: AddonId): string {
  const fallbackMap: Record<Locale, Record<AddonId, string>> = {
    en: {
      extra_production_day: "48-hour sprint execution",
      extra_service_page: "Google Business posts + offers pack",
      monthly_ad_creatives: "WhatsApp reply scripts pack",
      whatsapp_crm_setup: "Multilingual copy layer (HE/RU/EN)",
    },
    he: {
      extra_production_day: "ספרינט ביצוע ל-48 שעות",
      extra_service_page: "סט פוסטים/הטבות ל-Google Business",
      monthly_ad_creatives: "סט סקריפטים לתגובות WhatsApp",
      whatsapp_crm_setup: "שכבת קופי רב-לשונית (עברית/רוסית/אנגלית)",
    },
  };

  return fallbackMap[locale][addonId];
}

function deliveryLabel(locale: Locale, mode: DeliveryMode): string {
  const labels: Record<Locale, Record<DeliveryMode, string>> = {
    en: {
      standard: "Standard (5-10 days)",
      express: "48-hour sprint",
    },
    he: {
      standard: "רגיל (5-10 ימים)",
      express: "מהיר 48 שעות",
    },
  };

  return labels[locale][mode];
}

function defaultPackagePriceLabel(locale: Locale, packageId: PackageId): string {
  const packageRule = calculatorRules.packages.find((item) => item.id === packageId);
  const base = formatShekel(packageRule?.basePrice ?? 0);
  return locale === "he" ? `החל מ-${base}` : `From ${base}`;
}

function localizedPricingLabels(locale: Locale) {
  if (locale === "he") {
    return {
      niche: "תחום",
      packageType: "חבילה",
      deliveryMode: "מסלול אספקה",
      estimate: "מחיר משוער",
      addons: "תוספות",
      notes: "הערות",
      breakdown: "פירוט חישוב",
      notesPlaceholder: "הדביקו קישור אינסטגרם/תפריט + מטרה עסקית + אזור פעילות.",
      openWhatsAppCta: "פתיחה בוואטסאפ",
      saveLeadCta: "שליחת פנייה",
      vatNote: "מע״מ לא כלול.",
    };
  }

  return {
    niche: "Niche",
    packageType: "Package",
    deliveryMode: "Delivery mode",
    estimate: "Estimated total",
    addons: "Add-ons",
    notes: "Notes",
    breakdown: "Price breakdown",
    notesPlaceholder: "Paste Instagram/menu link + business goal + target area.",
    openWhatsAppCta: "Open WhatsApp",
    saveLeadCta: "Send inquiry",
    vatNote: "VAT not included.",
  };
}

const tierCardCopyByLocale: Record<
  Locale,
  Record<
    TierId,
    {
      description: string;
      features: string[];
      ctaLabel: string;
      recommended?: boolean;
    }
  >
> = {
  he: {
    starter: {
      description: "כניסה מהירה לעסק שצריך להתחיל מסלול פניות ברור.",
      features: [
        "הקמה מהירה ממינימום חומרים",
        "שפה מותאמת לשוק המקומי",
        "הפלט הראשון תוך 48 שעות",
      ],
      ctaLabel: "פתיחה בוואטסאפ",
    },
    business: {
      description: "ליבה תפעולית לעסק שרוצה זרימה עקבית של פניות איכותיות.",
      features: [
        "מערכת אתר + WhatsApp בטון אנושי",
        "עבודה רב-לשונית HE/EN (+RU לפי צורך)",
        "התאמת תכנים לערוצי ישראל",
      ],
      ctaLabel: "פתיחה בוואטסאפ",
      recommended: true,
    },
    growth: {
      description: "מערך רחב יותר לעסקים שצריכים קצב ייצור והפצה גבוה.",
      features: [
        "מסלול תפעול מלא עם שכבות תוכן",
        "הרחבת נפח יצירה והטמעת תהליכים",
        "ניהול יציב של פאנל פניות פעיל",
      ],
      ctaLabel: "פתיחה בוואטסאפ",
    },
  },
  en: {
    starter: {
      description: "Fast entry point for businesses that need a clear inquiry path.",
      features: [
        "Quick setup from minimal assets",
        "Local-market ready messaging",
        "First output delivered in 48 hours",
      ],
      ctaLabel: "Open WhatsApp",
    },
    business: {
      description: "Core operating layer for teams that need consistent qualified inquiries.",
      features: [
        "Site + WhatsApp system with human tone",
        "Multilingual execution in HE/EN (+RU when needed)",
        "Channel-ready assets for Israel market flows",
      ],
      ctaLabel: "Open WhatsApp",
      recommended: true,
    },
    growth: {
      description: "Expanded service layer for teams that need higher production volume.",
      features: [
        "Full-stack operating setup",
        "Higher content throughput with process discipline",
        "Reliable handling of ongoing lead volume",
      ],
      ctaLabel: "Open WhatsApp",
    },
  },
};

export function getCalculatorRules(): CalculatorRules {
  return calculatorRules;
}

export function getDirection(locale: Locale): Direction {
  return toDirection(locale);
}

export function getSiteContent(locale: Locale): SiteContentViewModel {
  const messages = messageCatalog[locale];
  const isRtl = locale === "he";
  const pricingLabels = localizedPricingLabels(locale);
  const localizedCopy = localizedSectionCopy[locale];
  const galleryItems = mapMedia(locale);
  const contentArchiveModules = buildContentArchiveModules(locale, galleryItems);

  const rawSolutions = messages.solutionsPage?.cards ?? [];
  const rawSolutionById = new Map<PackageId, (typeof rawSolutions)[number]>();
  for (const item of rawSolutions) {
    if (item.slug && isPackageId(item.slug)) {
      rawSolutionById.set(item.slug, item);
    }
  }

  const solutions: SolutionCardViewModel[] = selectableSolutionOrder.map((packageId, index) => {
    const raw = rawSolutionById.get(packageId);
    const copy = solutionOverrides[locale][packageId];
    return {
      id: packageId,
      packageId,
      title: copy?.title ?? raw?.title ?? "",
      problem: copy?.problem ?? raw?.problem ?? "",
      whatWeDo: copy?.whatWeDo ?? raw?.whatWeDo ?? "",
      outcome: copy?.outcome ?? raw?.outcome ?? "",
      timeline: copy?.timeline ?? raw?.timeline ?? "",
      priceLabel: copy?.priceLabel ?? (toShekelLabel(raw?.price) || defaultPackagePriceLabel(locale, packageId)),
      actionLabel: localizedCopy.solutions.cardCta,
      tone: toneAt(index),
    };
  });

  const diagnostics: SolutionDiagnosisViewModel[] = diagnosisOverrides[locale].map((item) => ({
    ...item,
    ctaLabel: localizedCopy.solutions.diagnosisCta,
  }));

  const packageOptions = solutions
    .filter((item): item is SolutionCardViewModel & { packageId: PackageId } => Boolean(item.packageId))
    .map((item) => ({ id: item.packageId, label: item.title }));

  const audience = messages.audience?.categories ?? [];
  const industryFallbackLabels = isRtl
    ? ["מסעדות", "ביוטי וטיפוח", "נדל\"ן", "מלונאות ואירוח"]
    : ["Restaurants", "Beauty and wellness", "Real estate", "Hotels and hospitality"];
  const industries = NICHE_IDS.map((nicheId, index) => ({
    title: localizedText(locale, audience[index], industryFallbackLabels[index] || nicheId),
    caption:
      industryCaptionOverrides[locale][index] ||
      solutions[index]?.problem ||
      (isRtl ? "פתרון ממוקד לעסק" : "Focused business solution"),
    tone: toneAt(index),
    imageSrc: industryImages[index % industryImages.length].src,
    imageAlt: isRtl ? industryImages[index % industryImages.length].altHe : industryImages[index % industryImages.length].altEn,
  }));

  const processSteps = localizedCopy.process.steps;

  const stats = isRtl
    ? [
        { label: "חלון לפלט ראשון", value: "48 שעות" },
        { label: "שפות מובנות", value: "עברית / רוסית / אנגלית" },
        { label: "ערוצים בחבילה", value: "אתר + GBP + WhatsApp" },
        { label: "סגנון כתיבה", value: "טון אנושי" },
      ]
    : [
        { label: "First output window", value: "48 hours" },
        { label: "Built-in languages", value: "Hebrew / Russian / English" },
        { label: "Channel package", value: "Site + GBP + WhatsApp" },
        { label: "Voice style", value: "Human tone" },
      ];

  const tierCards = TIER_IDS.map((id) => {
    const tier = getTierDefinition(id);
    const copy = tierCardCopyByLocale[locale][id];
    return {
      id,
      publicName: tier.publicName,
      description: copy.description,
      priceRangeLabel: formatTierPriceRangeLabel(id, locale),
      features: copy.features,
      ctaLabel: copy.ctaLabel,
      recommended: copy.recommended,
    };
  });

  const niches = NICHE_IDS.map((id, index) => ({
    id,
    label: localizedText(locale, audience[index], industryFallbackLabels[index] || id),
  }));

  const addonOptions = ADDON_IDS.map((id) => {
    const addon = calculatorRules.addons.find((item) => item.id === id);
    return {
      id,
      label: addonLabelFromMessages(locale, id),
      priceLabel: formatShekel(addon?.price ?? 0),
    };
  });

  const rawCases = solutions
    .filter((item): item is SolutionCardViewModel & { packageId: PackageId } => Boolean(item.packageId))
    .slice(0, 4);
  const cases = rawCases.map((item, index) => {
    const caseTitles = isRtl ? ["בעיה", "פתרון", "תוצאה", "תוצאה"] : ["Problem", "Solution", "Result", "Result"];
    const bullets =
      index === 0
        ? [item.problem, item.timeline]
        : index === 1
          ? [item.whatWeDo, item.outcome]
          : [item.outcome, item.priceLabel];

    return {
      title: caseTitles[index],
      bullets: bullets.filter(Boolean),
      action: localizedText(locale, messages.solutionsPage?.orderCta, isRtl ? "בחירה בוואטסאפ" : "Choose on WhatsApp"),
      packageId: item.packageId,
      tone: item.tone,
      imageSrc: caseStageImages[Math.min(index, caseStageImages.length - 1)].src,
      imageAlt: isRtl
        ? caseStageImages[Math.min(index, caseStageImages.length - 1)].altHe
        : caseStageImages[Math.min(index, caseStageImages.length - 1)].altEn,
    };
  });

  const footerCopyright = messages.footer?.copyright || "© 2026 SS Space";
  const phoneDigits = extractPhoneDigits(messages);

  return {
    locale,
    dir: toDirection(locale),
    isRtl,
    brandName: messages.brand?.name || "SS Space",
    whatsappPhoneDigits: phoneDigits,
    navQuoteCta: localizedCopy.navQuoteCta,
    navLinks: [
      {
        label: localizedCopy.nav.gallery,
        href: "#gallery",
        sectionId: "gallery",
      },
      {
        label: localizedCopy.nav.solutions,
        href: "#solutions",
        sectionId: "solutions",
      },
      {
        label: localizedCopy.nav.pricing,
        href: "#pricing",
        sectionId: "pricing",
      },
      {
        label: localizedCopy.nav.faq,
        href: "#faq",
        sectionId: "faq",
      },
    ],
    hero: {
      eyebrow: localizedCopy.hero.eyebrow,
      title: localizedCopy.hero.title,
      accent: localizedCopy.hero.accent,
      description: heroLeadLineByLocale[locale],
      primaryCta: localizedCopy.hero.primaryCta,
      secondaryCta: localizedCopy.hero.secondaryCta,
      backgroundImageSrc: heroBackgroundImageSrc,
      backgroundVideoSrc: heroBackgroundVideoSrc,
    },
    industries,
    industryEyebrow: localizedCopy.industryEyebrow,
    process: {
      title: localizedCopy.process.title,
      steps: processSteps,
    },
    solutions: {
      title: localizedCopy.solutions.title,
      description: localizedCopy.solutions.description,
      chainTitle: localizedCopy.solutions.chainTitle,
      chainStages: localizedCopy.solutions.chainStages,
      diagnosticsTitle: localizedCopy.solutions.diagnosticsTitle,
      diagnosticsDescription: localizedCopy.solutions.diagnosticsDescription,
      diagnostics,
      strategicStatement: {
        title: localizedCopy.solutions.strategicTitle,
        body: localizedCopy.solutions.strategicBody,
        highlight: localizedCopy.solutions.strategicHighlight,
      },
      cards: solutions,
      packagePanelTitle: localizedCopy.solutions.panelTitle,
      packagePanelCta: localizedCopy.solutions.panelCta,
    },
    gallery: {
      title: localizedCopy.gallery.title,
      description: localizedCopy.gallery.description,
      detailsCta: localizedCopy.gallery.detailsCta,
      cardNote: localizedCopy.gallery.cardNote,
      items: galleryItems,
    },
    contentArchive: {
      eyebrow: localizedCopy.contentArchive.eyebrow,
      title: localizedCopy.contentArchive.title,
      description: localizedCopy.contentArchive.description,
      filters: localizedCopy.contentArchive.filters,
      productionFilters: localizedCopy.contentArchive.productionFilters,
      emptyLabel: localizedCopy.contentArchive.emptyLabel,
      modules: contentArchiveModules,
    },
    bridge: {
      eyebrow: localizedCopy.bridge.eyebrow,
      title: localizedCopy.bridge.title,
      beforeLabel: localizedCopy.bridge.beforeLabel,
      beforeText: localizedCopy.bridge.beforeText,
      buildLabel: localizedCopy.bridge.buildLabel,
      buildItems: localizedCopy.bridge.buildItems,
      resultLabel: localizedCopy.bridge.resultLabel,
      resultText: localizedCopy.bridge.resultText,
      cta: localizedCopy.bridge.cta,
    },
    pricing: {
      title: localizedCopy.pricing.title,
      description: localizedCopy.pricing.description,
      tiers: tierCards,
      vatNote: pricingLabels.vatNote,
      labels: {
        niche: pricingLabels.niche,
        packageType: pricingLabels.packageType,
        deliveryMode: pricingLabels.deliveryMode,
        estimate: pricingLabels.estimate,
        addons: pricingLabels.addons,
        notes: pricingLabels.notes,
        breakdown: pricingLabels.breakdown,
      },
      openWhatsAppCta: pricingLabels.openWhatsAppCta,
      saveLeadCta: pricingLabels.saveLeadCta,
      niches,
      packageOptions,
      deliveryModes: DELIVERY_MODES.map((id) => ({ id, label: deliveryLabel(locale, id) })),
      addonOptions,
      notesPlaceholder: pricingLabels.notesPlaceholder,
      stats,
    },
    cases: {
      title: localizedCopy.casesTitle,
      cards: cases,
    },
    faq: {
      title: localizedCopy.faq.title,
      items: localizedCopy.faq.items,
    },
    quote: {
      title: localizedCopy.quote.title,
      nameLabel: localizedCopy.quote.nameLabel,
      phoneLabel: localizedCopy.quote.phoneLabel,
      businessLabel: localizedCopy.quote.businessLabel,
      messageLabel: localizedCopy.quote.messageLabel,
      submitLabel: localizedCopy.quote.submitLabel,
      successMessage: localizedCopy.quote.successMessage,
      errorMessage: localizedCopy.quote.errorMessage,
    },
    footer: {
      note: localizedCopy.footer.note,
      copyright: footerCopyright,
      navTitle: localizedCopy.footer.navTitle,
      contactTitle: localizedCopy.footer.contactTitle,
      ctaTitle: localizedCopy.footer.ctaTitle,
      ctaButton: localizedCopy.footer.ctaButton,
      email: "hello@businessstart.studio",
      phone: `+${phoneDigits}`,
      location: localizedCopy.footer.location,
    },
  };
}

export function isNicheId(value: string): value is NicheId {
  return (NICHE_IDS as readonly string[]).includes(value);
}

export function isPackageOption(value: string): value is PackageId {
  return (PACKAGE_IDS as readonly string[]).includes(value);
}

export function isDeliveryMode(value: string): value is DeliveryMode {
  return (DELIVERY_MODES as readonly string[]).includes(value);
}

export function isAddonId(value: string): value is AddonId {
  return (ADDON_IDS as readonly string[]).includes(value);
}


