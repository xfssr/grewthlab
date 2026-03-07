import calculatorRulesRaw from "@/data/calculator.rules.json";
import mediaDemoRaw from "@/data/media.demo.json";
import enMessagesRaw from "@/messages/en.json";
import heMessagesRaw from "@/messages/he.json";

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
  Tone,
} from "@/core/site.types";
import { ADDON_IDS, DELIVERY_MODES, NICHE_IDS, PACKAGE_IDS } from "@/core/site.types";

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
    titleHe: "UGC Shorts למוצר חדש",
    titleEn: "UGC product launch short",
    captionHe: "סרטון קצר בסגנון UGC להדגמת מוצר חדש.",
    captionEn: "UGC-style short focused on a new product launch.",
    altHe: "וידאו Shorts אנכי בפורמט 9:16.",
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
    titleHe: "Shorts פרודקשן לתפריט",
    titleEn: "Lighting menu short",
    captionHe: "Shorts קצר עם דגש תאורה לאוכל וצילום פרימיום.",
    captionEn: "Short-form clip with food lighting and premium framing.",
    altHe: "Shorts אנכי עם דגש תאורה וצילום.",
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
    titleHe: "AI Shorts לתוצאה",
    titleEn: "AI-assisted result short",
    captionHe: "Shorts קצר שמציג תוצאה עם גרפיקה וטקסט בעזרת AI.",
    captionEn: "Result-focused short using AI for overlays and pacing.",
    altHe: "Shorts אנכי עם שילוב AI לגרפיקה.",
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
  he: "מצלמים, בונים דף נחיתה ומביאים פניות איכותיות ל-WhatsApp.",
  en: "We shoot, build a landing page, and drive qualified inquiries to WhatsApp.",
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
      eyebrow: "אנחנו לא רק מצלמים",
      title: "מצלמים, עורכים, אורזים ומפרסמים",
      accent: "ומביאים לכם לקוחות בפועל",
      primaryCta: "לפתרונות",
      secondaryCta: "למחיר מהיר",
    },
    industryEyebrow: "קטגוריות מובילות",
    process: {
      title: "איך זה עובד",
      steps: [
        {
          title: "מצלמים תוכן",
          subtitle: "מצלמים את העסק, המוצרים והשירותים בפורמט שמתאים לרשתות.",
        },
        {
          title: "בונים עמוד נחיתה",
          subtitle: "מקימים עמוד ברור עם הצעה, הוכחה וכפתור WhatsApp.",
        },
        {
          title: "מחברים פרסום",
          subtitle: "מעלים קמפיינים ממוקדים ומחברים אותם לעמוד ולתוכן.",
        },
        {
          title: "לקוחות כותבים",
          subtitle: "הלקוחות פונים ישירות ל-WhatsApp עם כוונת רכישה ברורה.",
        },
      ],
    },
    solutions: {
      title: "ארכיטקטורת פתרונות לעסקים מקומיים",
      description: "אנחנו מאתרים את החוליה השבורה במסע הלקוח ובונים מערכת שמחזירה צמיחה.",
      chainTitle: "שרשרת הלקוחות בעסק",
      chainStages: [
        "מכירים אתכם",
        "מתעניינים",
        "צופים בתוכן",
        "בונים אמון",
        "כותבים ב-WhatsApp",
        "קונים",
      ],
      diagnosticsTitle: "הבעיות האמיתיות שבעל עסק פוגש",
      diagnosticsDescription: "בחרו את הבעיה שאתם מזהים, ונתאים את הפתרון הנכון.",
      strategicTitle: "לא מוכרים שירות בודד. פותרים חסם צמיחה.",
      strategicBody:
        "במקום להגיד 'אנחנו מצלמים' או 'אנחנו בונים אתר', אנחנו מחברים תוכן, דף ופרסום למערכת אחת שמביאה פניות.",
      strategicHighlight: "אנחנו פותרים בעיות צמיחה עסקית, לא רק מפיקים נכסים דיגיטליים.",
      panelTitle: "בחירת פתרון",
      panelCta: "התאמת פתרון לפער",
      cardCta: "בחרו פתרון",
      diagnosisCta: "התאמת פתרון",
    },
    gallery: {
      title: "עבודות נבחרות",
      description: "כך נראים פרויקטים שמייצרים עניין, אמון ופנייה.",
      detailsCta: "למודול תוכן",
      cardNote: "זה תוכן שאנחנו יוצרים לעסקים.",
    },
    contentArchive: {
      eyebrow: "מודול תוכן",
      title: "ארכיון רילס / שורטס (UGC • תאורה • AI)",
      description: "מודול הדגמה ללקוח: פורמטים אנכיים 9:16 לפי סוג פרודקשן.",
      filters: {
        all: "הכל",
        reel: "Reels",
        short: "Shorts",
        photo: "Photo",
      },
      productionFilters: {
        all: "כל הסוגים",
        ugc: "UGC",
        lighting: "Lighting",
        ai: "AI",
      },
      emptyLabel: "אין פריטים לסינון הזה כרגע.",
    },
    pricing: {
      title: "מחשבון מחיר מהיר",
      description: "בחרו תחום, חבילה ותוספות וקבלו מחיר משוער בשניות.",
    },
    casesTitle: "בעיה, פתרון, תוצאה",
    faq: {
      title: "שאלות נפוצות לפני התחלה",
      items: [
        {
          question: "תוך כמה זמן אפשר לעלות לאוויר?",
          answer: "בדרך כלל בתוך 7 עד 14 ימים, לפי היקף העבודה.",
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
          answer: "הפניות מגיעות ישירות ל-WhatsApp עם הודעה מוכנה מראש.",
        },
      ],
    },
    quote: {
      title: "קבלו הצעת מחיר מהירה",
      nameLabel: "שם מלא",
      phoneLabel: "טלפון / WhatsApp",
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
      ctaButton: "לדבר איתנו ב-WhatsApp",
      location: "ישראל",
    },
  },
  en: {
    navQuoteCta: "Get Quote",
    nav: {
      solutions: "Solutions",
      gallery: "Gallery",
      pricing: "Pricing",
      faq: "FAQ",
    },
    hero: {
      eyebrow: "We do more than just shooting",
      title: "We shoot, edit, package, and run ads",
      accent: "to bring you real clients",
      primaryCta: "View solutions",
      secondaryCta: "Quick pricing",
    },
    industryEyebrow: "Top categories",
    process: {
      title: "How it works",
      steps: [
        {
          title: "We shoot content",
          subtitle: "We capture your business, products, and services in social-first formats.",
        },
        {
          title: "We build a landing page",
          subtitle: "We set up a clear page with offer, proof, and a WhatsApp button.",
        },
        {
          title: "We connect ads",
          subtitle: "We launch focused campaigns connected to your page and content.",
        },
        {
          title: "Clients message you",
          subtitle: "Qualified leads come directly to WhatsApp ready to talk.",
        },
      ],
    },
    solutions: {
      title: "Service architecture for local businesses",
      description: "We diagnose the broken client-chain link and build the fix around it.",
      chainTitle: "Your client chain",
      chainStages: ["Discover", "Get interested", "Watch", "Trust", "Message", "Buy"],
      diagnosticsTitle: "Real issues local owners describe",
      diagnosticsDescription: "Choose the problem you recognize and match the right solution.",
      strategicTitle: "We do not sell isolated services. We solve growth bottlenecks.",
      strategicBody:
        "Instead of saying 'we make videos' or 'we build sites', we combine content, conversion page, and promotion into one business system.",
      strategicHighlight: "This is growth consulting execution, not freelance production.",
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
    pricing: {
      title: "Quick pricing calculator",
      description: "Choose niche, package, and add-ons to get an instant estimate.",
    },
    casesTitle: "Problem, Solution, Result",
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          question: "How fast can we go live?",
          answer: "Usually within 7 to 14 days, depending on scope.",
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
      symptoms: ["Instagram ריק", "אין תמונות חזקות", "Google Business נראה לא פעיל"],
      mappedPackageId: "quick-start-system",
    },
    {
      id: "views-no-messages",
      title: "צופים אבל לא כותבים",
      problem: "יש צפיות, אבל אין מעבר לפנייה אמיתית.",
      symptoms: ["אין CTA ברור", "אין עמוד ממיר", "הלקוח לא מבין מה הצעד הבא"],
      mappedPackageId: "content-whatsapp-funnel",
    },
    {
      id: "restaurant-empty",
      title: "המסעדה יפה אבל ריקה",
      problem: "המקום טוב, אבל ברשת הוא לא נראה מספיק מזמין.",
      symptoms: ["אוכל לא מצולם נכון", "אין Reels קבועים", "אין חוויית מותג באונליין"],
      mappedPackageId: "qr-menu-mini-site",
    },
    {
      id: "listing-stuck",
      title: "הנכס מוצג אבל לא נמכר",
      problem: "הנכס לא מוצג בצורה שמייצרת עניין ובקשות סיור.",
      symptoms: ["תמונות חלשות", "אין וידאו walkthrough", "אין עמוד נכס ממוקד"],
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
      title: "Restaurant Growth System",
      problem: "המסעדה נראית טוב במציאות, אבל באונליין לא נוצרת תנועה מספקת של אורחים.",
      whatWeDo:
        "• צילום אוכל מקצועי\n• צילום אווירה ושירות\n• 10-15 Reels\n• QR menu נוח\n• עמוד מסעדה + אינטגרציית WhatsApp",
      outcome: "התוצאה: תוכן חזק שמביא יותר תנועה, יותר פניות ויותר הזמנות.",
      timeline: "10-18 ימים",
    },
    "content-whatsapp-funnel": {
      title: "WhatsApp Conversion System",
      problem: "אנשים צופים בעמודים וברשתות, אבל לא עוברים לשיחה או השארת פרטים.",
      whatWeDo:
        "• עמוד נחיתה ברור\n• כפתור WhatsApp בולט\n• CTA לקבלת מחיר\n• הודעות פתיחה מהירות\n• תבניות תגובה לצוות",
      outcome: "התוצאה: מעבר ישיר מצפייה לפנייה עם יותר לידים רלוונטיים.",
      timeline: "10-18 ימים",
    },
    "business-launch-setup": {
      title: "Business Launch System",
      problem: "עסק חדש עולה לאוויר בלי מערכת שיווק אחידה, ולכן מאבד מומנטום כבר בהתחלה.",
      whatWeDo:
        "• צילום פתיחה לעסק\n• סט תוכן לרשתות\n• אתר/עמוד שירות\n• הקמת Google Business\n• פרסום בסיס ממוקד",
      outcome: "התוצאה: השקה דיגיטלית מסודרת עם טראפיק ופניות מהיום הראשון.",
      timeline: "10-21 ימים",
    },
    "beauty-booking-flow": {
      title: "Real Estate Listing System",
      problem: "נכס לא נסגר כי ההצגה שלו חלשה ולא יוצרת ערך נתפס גבוה.",
      whatWeDo:
        "• צילום נדל\"ן מקצועי\n• וידאו walkthrough\n• Reels לנכס\n• עמוד נחיתה ייעודי\n• כפתור פנייה מהירה",
      outcome: "התוצאה: הנכס נראה יקר ומקצועי יותר ומייצר יותר צפיות ובקשות סיור.",
      timeline: "7-16 ימים",
    },
    "quick-start-system": {
      title: "Digital Presence Starter",
      problem: "העסק כמעט לא נראה באינטרנט ולכן לקוחות לא בונים אמון ולא פונים.",
      whatWeDo:
        "• יום צילום עסק\n• 10 סרטוני Reels קצרים\n• עיצוב Instagram\n• עיצוב Google Business\n• דף נחיתה בסיסי + WhatsApp",
      outcome: "התוצאה: העסק נראה חי ומקצועי, ולקוחות מתחילים לכתוב.",
      timeline: "5-12 ימים",
    },
  },
  en: {
    "qr-menu-mini-site": {
      title: "Restaurant Growth System",
      problem: "The restaurant looks great offline, but online visibility is not driving enough guests.",
      whatWeDo:
        "• Professional food shooting\n• Atmosphere coverage\n• 10-15 social reels\n• QR menu setup\n• Restaurant page + WhatsApp integration",
      outcome: "Result: stronger social pull, more guest traffic, and more direct inquiries.",
      timeline: "10-18 days",
    },
    "content-whatsapp-funnel": {
      title: "WhatsApp Conversion System",
      problem: "People watch your content, but they do not take the next step and message.",
      whatWeDo:
        "• Clear landing page\n• Prominent WhatsApp button\n• \"Get pricing\" CTA flow\n• Fast auto-reply setup\n• Message templates for the team",
      outcome: "Result: view-to-message conversion improves and lead flow becomes stable.",
      timeline: "10-18 days",
    },
    "business-launch-setup": {
      title: "Business Launch System",
      problem: "A new business opens with disconnected assets and no unified acquisition system.",
      whatWeDo:
        "• Launch photoshoot\n• Social content set\n• Website or service page\n• Google Business profile\n• Starter ad setup",
      outcome: "Result: the business launches with structured visibility, traffic, and first inquiries.",
      timeline: "10-21 days",
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
      title: "Digital Presence Starter",
      problem: "The business is barely visible online, so trust is low and outreach is weak.",
      whatWeDo:
        "• Business photoshoot\n• 10 short reels\n• Instagram setup\n• Google Business setup\n• Basic landing page + WhatsApp",
      outcome: "Result: the business starts to look alive and people begin to message.",
      timeline: "5-12 days",
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
    type: item.type,
    src: item.src,
    poster: item.poster,
    alt: locale === "he" ? item.altHe : item.altEn,
    tags: item.tags,
  }));
}

function mapContentArchive(locale: Locale): ContentArchiveItem[] {
  return archiveItemsRaw.map((item) => ({
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
      cta: "קריאה ברורה להזמנה ב-WhatsApp",
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
    "Hook לפתיחה",
    "אווירה וסטייל",
    "הצעת ערך",
    "הוכחה חברתית",
    "לפני/אחרי",
    "תסריט AI",
    "מסר קצר לסטורי",
    "סגירה עם CTA",
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
    "כותבים תסריט קצר עם Hook ו-CTA.",
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

function stableHash(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function dedupeMediaById(items: LocalizedMediaAsset[]): LocalizedMediaAsset[] {
  const seen = new Set<string>();
  const unique: LocalizedMediaAsset[] = [];
  for (const item of items) {
    if (seen.has(item.id)) {
      continue;
    }
    seen.add(item.id);
    unique.push(item);
  }
  return unique;
}

function sharedTagScore(baseTags: string[], candidateTags: string[]): number {
  const tagSet = new Set(baseTags.map((tag) => tag.toLowerCase()));
  return candidateTags.reduce((score, tag) => (tagSet.has(tag.toLowerCase()) ? score + 1 : score), 0);
}

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

function pickMedia(
  galleryItem: LocalizedMediaAsset,
  allMedia: LocalizedMediaAsset[],
  mediaType: LocalizedMediaAsset["type"],
  seed: number,
): LocalizedMediaAsset | null {
  const related = allMedia
    .filter((candidate) => candidate.id !== galleryItem.id && candidate.type === mediaType)
    .map((candidate) => ({
      item: candidate,
      score: sharedTagScore(galleryItem.tags, candidate.tags),
    }))
    .sort((left, right) => right.score - left.score);

  const boosted = related.filter((entry) => entry.score > 0).map((entry) => entry.item);
  const globalPool = related.map((entry) => entry.item);
  const sourcePool = dedupeMediaById(
    [galleryItem, ...boosted, ...globalPool].filter((item) => item.type === mediaType),
  );

  if (!sourcePool.length) {
    return null;
  }

  return sourcePool[seed % sourcePool.length];
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

  return galleryItems.map((galleryItem, moduleIndex) => {
    const topic = trimTopic(galleryItem.alt);
    const theme = detectTheme(galleryItem.tags);
    const themeContext = themeCopy[locale][theme];
    const moduleSeed = stableHash(galleryItem.id);
    const moduleImageFallback = pickMedia(galleryItem, galleryItems, "image", moduleSeed) ?? galleryItem;
    const moduleVideoFallback = pickMedia(galleryItem, galleryItems, "video", moduleSeed + 1);
    const description =
      locale === "he"
        ? `${themeContext.modulePrefix}: ${topic}. ${themeContext.focus}.`
        : `${themeContext.modulePrefix}: ${topic}. ${themeContext.focus}.`;

    const items = baseItems.map((baseItem, itemIndex) => {
      const itemSeed = stableHash(`${galleryItem.id}-${baseItem.id}-${itemIndex + 1}`);
      const chosenImage = pickMedia(galleryItem, galleryItems, "image", itemSeed + moduleSeed);
      const chosenVideo = pickMedia(galleryItem, galleryItems, "video", itemSeed + moduleSeed + 17);
      const angle = itemAngleCopy[locale][itemIndex % itemAngleCopy[locale].length];
      const title = locale === "he" ? `${themeContext.label} • ${angle}` : `${angle} • ${themeContext.label}`;
      const caption =
        locale === "he"
          ? `${themeContext.focus}. ${baseItem.caption} ${themeContext.cta}.`
          : `${themeContext.focus}. ${baseItem.caption} ${themeContext.cta}.`;

      if (baseItem.mediaType === "video") {
        return {
          ...baseItem,
          id: `${galleryItem.id}-${baseItem.id}-${itemIndex + 1}`,
          src: chosenVideo?.src ?? moduleVideoFallback?.src ?? baseItem.src,
          poster: chosenVideo?.poster || chosenImage?.src || moduleImageFallback.src || baseItem.poster,
          title,
          caption,
          alt: locale === "he" ? `${topic} | וידאו` : `${topic} | video`,
        };
      }

      return {
        ...baseItem,
        id: `${galleryItem.id}-${baseItem.id}-${itemIndex + 1}`,
        src: chosenImage?.src ?? moduleImageFallback.src ?? baseItem.src,
        poster: chosenImage?.src ?? moduleImageFallback.src ?? baseItem.poster,
        title,
        caption,
        alt: locale === "he" ? `${topic} | תמונה` : `${topic} | image`,
      };
    });

    return {
      id: `module-${moduleIndex + 1}-${galleryItem.id}`,
      sourceCardId: galleryItem.id,
      title: topic,
      description,
      workflowSteps: moduleWorkflowSteps[locale],
      items,
    };
  });
}

function addonLabelFromMessages(locale: Locale, messages: MessageSchema, addonId: AddonId): string {
  const pricingAddons = messages.pricingPage?.addons ?? [];
  const fallbackMap: Record<Locale, Record<AddonId, string>> = {
    en: {
      extra_production_day: "Extra production day",
      extra_service_page: "Additional service page",
      monthly_ad_creatives: "Monthly ad creative set",
      whatsapp_crm_setup: "WhatsApp CRM setup",
    },
    he: {
      extra_production_day: "יום הפקה נוסף",
      extra_service_page: "עמוד שירות נוסף",
      monthly_ad_creatives: "סט קריאייטיב חודשי",
      whatsapp_crm_setup: "הקמת WhatsApp CRM",
    },
  };

  if (addonId === "extra_production_day" && pricingAddons[0]?.title) {
    return pricingAddons[0].title;
  }
  if (addonId === "extra_service_page" && pricingAddons[1]?.title) {
    return pricingAddons[1].title;
  }
  if (addonId === "monthly_ad_creatives" && pricingAddons[2]?.title) {
    return pricingAddons[2].title;
  }

  return fallbackMap[locale][addonId];
}

function deliveryLabel(locale: Locale, mode: DeliveryMode): string {
  const labels: Record<Locale, Record<DeliveryMode, string>> = {
    en: {
      standard: "Standard",
      express: "Express",
    },
    he: {
      standard: "רגיל",
      express: "מהיר",
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
      notesPlaceholder: "כתבו מטרה עסקית, תקציב חודשי ואזור פעילות.",
      openWhatsAppCta: "פתיחה ב-WhatsApp",
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
    notesPlaceholder: "Write your business goal, monthly budget, and target area.",
    openWhatsAppCta: "Open WhatsApp",
    saveLeadCta: "Send inquiry",
    vatNote: "VAT not included.",
  };
}

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

  const packageOptions = solutions.map((item) => ({ id: item.id, label: item.title }));

  const audience = messages.audience?.categories ?? [];
  const industries = NICHE_IDS.map((nicheId, index) => ({
    title: audience[index] || nicheId,
    caption:
      industryCaptionOverrides[locale][index] ||
      solutions[index]?.problem ||
      (isRtl ? "פתרון ממוקד לעסק" : "Focused business solution"),
    tone: toneAt(index),
    imageSrc: industryImages[index % industryImages.length].src,
    imageAlt: isRtl ? industryImages[index % industryImages.length].altHe : industryImages[index % industryImages.length].altEn,
  }));

  const processSteps = localizedCopy.process.steps;

  const pricingTiers = messages.pricingPage?.tiers ?? [];
  const pricingAddons = messages.pricingPage?.addons ?? [];
  const stats = [
    {
      label: pricingTiers[0]?.title || (isRtl ? "בסיס" : "Basic"),
      value: toShekelLabel(pricingTiers[0]?.price) || formatShekel(1200),
    },
    {
      label: pricingTiers[1]?.title || (isRtl ? "צמיחה" : "Growth"),
      value: toShekelLabel(pricingTiers[1]?.price) || formatShekel(3000),
    },
    {
      label: pricingTiers[2]?.title || (isRtl ? "מערכת" : "System"),
      value: toShekelLabel(pricingTiers[2]?.price) || formatShekel(5000),
    },
    {
      label: pricingAddons[0]?.title || (isRtl ? "תוספת" : "Add-on"),
      value: toShekelLabel(pricingAddons[0]?.price) || formatShekel(900),
    },
  ];

  const niches = NICHE_IDS.map((id, index) => ({
    id,
    label: audience[index] || id,
  }));

  const addonOptions = ADDON_IDS.map((id) => {
    const addon = calculatorRules.addons.find((item) => item.id === id);
    return {
      id,
      label: addonLabelFromMessages(locale, messages, id),
      priceLabel: formatShekel(addon?.price ?? 0),
    };
  });

  const rawCases = solutions.slice(0, 4);
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
      action: messages.solutionsPage?.orderCta || (isRtl ? "בחירה ב-WhatsApp" : "Choose on WhatsApp"),
      packageId: item.id,
      tone: item.tone,
      imageSrc: caseStageImages[Math.min(index, caseStageImages.length - 1)].src,
      imageAlt: isRtl
        ? caseStageImages[Math.min(index, caseStageImages.length - 1)].altHe
        : caseStageImages[Math.min(index, caseStageImages.length - 1)].altEn,
    };
  });

  const footerCopyright = messages.footer?.copyright || "© 2026 Business Start Studio";
  const phoneDigits = extractPhoneDigits(messages);

  return {
    locale,
    dir: toDirection(locale),
    isRtl,
    brandName: messages.brand?.name || "Business Start Studio",
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
    pricing: {
      title: localizedCopy.pricing.title,
      description: localizedCopy.pricing.description,
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

