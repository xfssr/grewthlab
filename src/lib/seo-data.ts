import { getSiteContent } from "@/core/site.content";
import { getTierDefinition, legacyPackageToTier, mapLegacyPackageToTier } from "@/core/pricing/tier-model";
import type { PackageId } from "@/core/site.types";
import { applyDbOverrides } from "@/lib/site-content-overrides";
import { absoluteUrl } from "@/lib/site";

export type SeoProductPage = {
  slug: string;
  packageId: PackageId;
  title: string;
  headline: string;
  description: string;
  searchIntent: string;
  keywords: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export type SeoProblemPage = {
  slug: string;
  title: string;
  description: string;
  symptoms: string[];
  whyItHappens: string;
  mappedPackageId: PackageId;
  keywords: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export type SeoBannerVariant = {
  id: "diagnostic" | "system-offer" | "results" | "speed" | "calculator";
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  linkCta: { label: string; href: string };
  imageSrc: string;
  imageAlt: string;
};

export const seoBannerVariants: SeoBannerVariant[] = [
  {
    id: "diagnostic",
    title: "יש צפיות אבל אין פניות?",
    subtitle: "נראה לך ב-60 שניות איפה הלקוח נתקע בדרך לוואטסאפ.",
    primaryCta: { label: "קבלו אבחון מהיר", href: "/#quote" },
    secondaryCta: { label: "צפו בעבודות", href: "/#gallery" },
    linkCta: { label: "איך זה עובד", href: "/#solutions" },
    imageSrc: "/images/generated/case-problem.webp",
    imageAlt: "Business diagnosis concept image",
  },
  {
    id: "system-offer",
    title: "תוכן + דף נחיתה + וואטסאפ במערכת אחת",
    subtitle: "במקום שירותים מפוזרים — מסלול ברור שמייצר פניות לעסק המקומי.",
    primaryCta: { label: "קבלו הצעת מחיר", href: "/#pricing" },
    secondaryCta: { label: "ראו חבילות", href: "/#solutions" },
    linkCta: { label: "פירוט התהליך", href: "/#solutions" },
    imageSrc: "/images/generated/category-restaurants.webp",
    imageAlt: "Integrated growth system concept image",
  },
  {
    id: "results",
    title: "יותר אמון. יותר פניות. יותר הזמנות.",
    subtitle: "כך בונים נוכחות דיגיטלית שמביאה לקוחות אמיתיים, לא רק לייקים.",
    primaryCta: { label: "התחילו בוואטסאפ", href: "/#pricing" },
    secondaryCta: { label: "דוגמאות לתוצאות", href: "/#gallery" },
    linkCta: { label: "מה כולל השירות", href: "/#solutions" },
    imageSrc: "/images/generated/case-result.webp",
    imageAlt: "Growth results concept image",
  },
  {
    id: "speed",
    title: "אפשר לעלות לאוויר תוך 14 יום",
    subtitle: "צילום, עמוד ממיר וקריאייטיב פרסומי — הכל מוכן להשקה.",
    primaryCta: { label: "בנו לי מסלול מהיר", href: "/#quote" },
    secondaryCta: { label: "צפו בקייסים", href: "/#gallery" },
    linkCta: { label: "שאלות נפוצות", href: "/#faq" },
    imageSrc: "/images/generated/case-solution.webp",
    imageAlt: "Fast launch concept image",
  },
  {
    id: "calculator",
    title: "רוצים לדעת כמה זה יעלה לעסק שלכם?",
    subtitle: "מחשבון מהיר + המלצה למסלול שמתאים לתחום וליעד שלכם.",
    primaryCta: { label: "לחישוב מחיר מהיר", href: "/#pricing" },
    secondaryCta: { label: "דברו איתנו בוואטסאפ", href: "/#quote" },
    linkCta: { label: "השוואת חבילות", href: "/#solutions" },
    imageSrc: "/images/generated/hero-blur.webp",
    imageAlt: "Pricing and calculator concept image",
  },
];

export const seoProducts: SeoProductPage[] = [
  {
    slug: "digital-presence-starter",
    packageId: "quick-start-system",
    title: "Digital Presence Starter",
    headline: "נראות דיגיטלית לעסק קטן או מקומי",
    description:
      "פתרון לעסק שלא נראה מספיק טוב באינטרנט: צילומי עסק, רילס, Instagram, Google Business, דף נחיתה ו-WhatsApp.",
    searchIntent: "עסק שלא נראה באינטרנט ורוצה להתחיל לקבל פניות.",
    keywords: [
      "נראות דיגיטלית לעסק",
      "עסק לא נראה באינטרנט",
      "צילום לעסק קטן",
      "רילס לעסק מקומי",
      "Google Business לעסק",
      "עמוד נחיתה לעסק קטן",
    ],
    faqs: [
      {
        question: "למי מתאים Digital Presence Starter?",
        answer: "לעסקים קטנים או חדשים שצריכים נראות דיגיטלית בסיסית שמביאה אמון ופניות ראשונות.",
      },
      {
        question: "מה מקבלים בפועל?",
        answer: "יום צילום, Reels, הקמת נראות ב-Instagram וב-Google, דף נחיתה וכפתור WhatsApp.",
      },
    ],
  },
  {
    slug: "whatsapp-conversion-system",
    packageId: "content-whatsapp-funnel",
    title: "WhatsApp Conversion System",
    headline: "הופכים צפיות לפניות דרך WhatsApp",
    description:
      "פתרון לעסקים שיש להם טראפיק או Instagram אבל אין מספיק פניות: דף ממיר, CTA ברור, WhatsApp ותגובה מהירה.",
    searchIntent: "עסקים שאנשים רואים אבל לא פונים אליהם.",
    keywords: [
      "WhatsApp לעסק",
      "עמוד נחיתה ממיר",
      "אנשים רואים אבל לא פונים",
      "יותר לידים מוואטסאפ",
      "כפתור WhatsApp באתר",
      "מערכת פניות לעסק",
    ],
    faqs: [
      {
        question: "מה הבעיה שהפתרון הזה פותר?",
        answer: "הוא מטפל בשלב שבו המשתמש צופה בתוכן או בדף, אבל לא מבצע פעולה ולא שולח הודעה.",
      },
      {
        question: "האם זה מתאים רק ל-Instagram?",
        answer: "לא. זה מתאים לכל מקור תנועה שמגיע לדף או לפרופיל וצריך מסלול ברור לפנייה.",
      },
    ],
  },
  {
    slug: "restaurant-growth-system",
    packageId: "qr-menu-mini-site",
    title: "Restaurant Growth System",
    headline: "יותר אורחים דרך תוכן, רילס ועמוד מסעדה",
    description:
      "פתרון למסעדות ובתי קפה שרוצים יותר תנועה: צילום אוכל, צילום אווירה, Reels, QR menu, עמוד מסעדה ו-WhatsApp.",
    searchIntent: "מסעדה יפה עם מעט תנועה שרוצה יותר אורחים דרך דיגיטל.",
    keywords: [
      "שיווק למסעדות",
      "צילום אוכל למסעדה",
      "רילס למסעדה",
      "QR menu למסעדה",
      "עמוד נחיתה למסעדה",
      "שיווק לבית קפה",
    ],
    faqs: [
      {
        question: "האם Restaurant Growth System מתאים רק למסעדות?",
        answer: "הוא מתאים גם לבתי קפה, ברים ועסקי אוכל שצריכים נראות חזקה יותר והזמנות דרך דיגיטל.",
      },
      {
        question: "מה נותן ה-QR menu?",
        answer: "הוא מקצר את המעבר מצפייה בתפריט להזמנה, שיחה או השארת פרטים.",
      },
    ],
  },
  {
    slug: "real-estate-listing-system",
    packageId: "beauty-booking-flow",
    title: "Real Estate Listing System",
    headline: "מציגים נכס בצורה שמביאה יותר פניות",
    description:
      "פתרון לנדל\"ן ונכסים עם הצגה חלשה: צילום מקצועי, וידאו walkthrough, Reels, עמוד נכס וכפתור פנייה.",
    searchIntent: "נכס שלא נראה מספיק טוב באינטרנט ולא מייצר בקשות סיור.",
    keywords: [
      "שיווק נדלן",
      "צילום נדלן מקצועי",
      "וידאו walkthrough לנכס",
      "עמוד נחיתה לנכס",
      "רילס לנדלן",
      "יותר פניות לנכס",
    ],
    faqs: [
      {
        question: "למי מתאים Real Estate Listing System?",
        answer: "למתווכים, יזמים ובעלי נכסים שרוצים לשפר הצגה, אמון וכמות פניות לנכס.",
      },
      {
        question: "האם זה מתאים גם לפרויקט חדש?",
        answer: "כן. אפשר להשתמש בפורמט הזה גם לעמוד פרויקט, דירות לדוגמה או השקת מתחם חדש.",
      },
    ],
  },
  {
    slug: "business-launch-system",
    packageId: "business-launch-setup",
    title: "Business Launch System",
    headline: "השקה דיגיטלית מסודרת לעסק חדש",
    description:
      "פתרון לעסק שנפתח ורוצה לעלות נכון: צילום, תוכן לרשתות, אתר, Google Business ופרסום בסיסי.",
    searchIntent: "עסק חדש שרוצה לעלות לאוויר עם טראפיק ופניות כבר בתחילת הדרך.",
    keywords: [
      "השקת עסק חדש",
      "פתיחת עסק באינטרנט",
      "תוכן לעסק חדש",
      "אתר לעסק חדש",
      "Google Business לעסק חדש",
      "פרסום לעסק חדש",
    ],
    faqs: [
      {
        question: "מה כולל Business Launch System?",
        answer: "צילום, סט תוכן, עמוד אתר או שירות, הקמת Google Business ופרסום התחלה ממוקד.",
      },
      {
        question: "כמה מהר אפשר לעלות עם זה?",
        answer: "בדרך כלל בתוך חלון עבודה קצר יחסית, בהתאם להיקף ההפקה והתוכן הנדרש.",
      },
    ],
  },
];

export const seoProblems: SeoProblemPage[] = [
  {
    slug: "business-not-visible-online",
    title: "העסק לא נראה באינטרנט",
    description: "למה עסק טוב עדיין לא מקבל מספיק פניות, ואיך בונים נראות שמייצרת אמון כבר במבט ראשון.",
    symptoms: ["Instagram כמעט ריק", "אין תמונות חזקות", "Google Business לא נראה חי"],
    whyItHappens: "הלקוח שופט מהר מאוד. אם הנראות חלשה, הוא מניח שהעסק חלש ולא ממשיך.",
    mappedPackageId: "quick-start-system",
    keywords: ["עסק לא נראה באינטרנט", "נראות דיגיטלית לעסק", "איך להביא פניות לעסק מקומי"],
    faqs: [
      {
        question: "למה נראות חלשה פוגעת בפניות?",
        answer: "כי הלקוח בונה אמון דרך תמונות, תוכן ועדכון שוטף לפני שהוא כותב או מתקשר.",
      },
      {
        question: "מה הפתרון המהיר ביותר?",
        answer: "לבנות שכבת נראות בסיסית חזקה: צילומים, רילס, Google Business, דף נחיתה ו-WhatsApp.",
      },
    ],
  },
  {
    slug: "people-watch-but-dont-message",
    title: "אנשים רואים אבל לא כותבים",
    description: "איך מתקנים פער המרה בין צפייה לבין הודעה ב-WhatsApp או השארת פרטים.",
    symptoms: ["יש צפיות או כניסות", "אין CTA ברור", "אין דף מסודר לפנייה"],
    whyItHappens: "יש עניין ראשוני, אבל אין מסלול פעולה פשוט ולכן המשתמש יוצא בלי לפנות.",
    mappedPackageId: "content-whatsapp-funnel",
    keywords: ["אנשים רואים אבל לא פונים", "שיפור המרה לוואטסאפ", "לידים מ-Instagram"],
    faqs: [
      {
        question: "האם חייבים אתר מלא כדי לפתור את זה?",
        answer: "לא. ברוב המקרים מספיק דף נחיתה ברור עם CTA נכון ומסלול WhatsApp מסודר.",
      },
      {
        question: "איזה שינוי הכי משפיע כאן?",
        answer: "קיצור הדרך מהצפייה לפנייה: כפתור ברור, הצעה ברורה ותגובה ראשונית מהירה.",
      },
    ],
  },
  {
    slug: "restaurant-empty-despite-good-food",
    title: "המסעדה יפה אבל ריקה",
    description: "אוכל טוב לא מספיק אם הוא לא נראה נכון ברשת. כך בונים נראות שמביאה יותר אורחים.",
    symptoms: ["המנות לא נראות מספיק טוב", "אין Reels קבועים", "אין חוויית מותג דיגיטלית"],
    whyItHappens: "היום מסעדה נבחרת קודם כל דרך המסך. אם היא לא מרגישה חיה בדיגיטל, מדלגים הלאה.",
    mappedPackageId: "qr-menu-mini-site",
    keywords: ["מסעדה ריקה", "שיווק למסעדה", "צילום אוכל ורילס למסעדות"],
    faqs: [
      {
        question: "למה Reels חשובים למסעדה?",
        answer: "כי הם מראים תנועה, אווירה, אוכל ואנשים בצורה הרבה יותר משכנעת מתמונה בודדת.",
      },
      {
        question: "האם QR menu באמת משפיע?",
        answer: "כן. הוא מקל על המשתמש לעבור מצפייה להזמנה, תפריט או הודעה.",
      },
    ],
  },
  {
    slug: "property-listed-but-not-selling",
    title: "יש נכס אבל לא קונים",
    description: "כשנכס מוצג בצורה חלשה, הקונה פשוט ממשיך הלאה. כך משפרים תפיסה, עניין ובקשות סיור.",
    symptoms: ["תמונות כהות", "אין וידאו", "אין עמוד נכס ברור"],
    whyItHappens: "השוק משווה מהר מאוד. נכס שנראה פשוט או לא ברור מאבד ערך נתפס כבר בגלילה הראשונה.",
    mappedPackageId: "beauty-booking-flow",
    keywords: ["נכס לא נמכר", "צילום נדלן מקצועי", "איך לקבל יותר פניות לנכס"],
    faqs: [
      {
        question: "מה הדבר הראשון שכדאי לשפר?",
        answer: "את ההצגה הוויזואלית: צילום מקצועי ועמוד נכס שנותן תחושת ערך ברורה.",
      },
      {
        question: "למה וידאו walkthrough חשוב?",
        answer: "כי הוא יוצר תחושת ביקור אמיתית ועוזר למועמד רציני להשאיר פנייה מהר יותר.",
      },
    ],
  },
  {
    slug: "old-business-feels-stuck",
    title: "עסק ותיק מרגיש תקוע",
    description: "איך מעבירים עסק ותיק ממראה מיושן למותג עדכני שמוכן לצמוח גם מעבר להמלצות מפה לאוזן.",
    symptoms: ["אתר ישן", "מיתוג חלש", "אין תוכן וידאו או רשתות פעילות"],
    whyItHappens: "העסק נשען על מוניטין קיים, אבל בלי שדרוג דיגיטלי הוא לא מצליח להתרחב לקהלים חדשים.",
    mappedPackageId: "business-launch-setup",
    keywords: ["עסק ותיק תקוע", "שדרוג עסק ישן", "מיתוג מחדש לעסק מקומי"],
    faqs: [
      {
        question: "האם צריך לבנות הכול מחדש?",
        answer: "לא תמיד. לעיתים מספיק לבנות שכבת תוכן, דף עדכני ומסלול פרסום חדש סביב העסק הקיים.",
      },
      {
        question: "למי זה מתאים?",
        answer: "לעסקים ותיקים עם לקוחות קיימים שרוצים נראות עדכנית ויכולת לגדול מעבר למעגל ההמלצות.",
      },
    ],
  },
  {
    slug: "content-without-system",
    title: "יש תוכן אבל אין מערכת",
    description: "הרבה עסקים מצלמים ומעלים, אבל בלי מסלול ברור התוכן לא מייצר פניות עקביות.",
    symptoms: ["פוסטים אקראיים", "אין אסטרטגיה", "אין חיבור בין תוכן לפרסום"],
    whyItHappens: "כשאין מבנה קבוע של מסר, דף וקריאה לפעולה, התוכן נשאר רק 'נוכחות' ולא הופך למנוע צמיחה.",
    mappedPackageId: "content-whatsapp-funnel",
    keywords: ["יש תוכן אבל אין פניות", "אסטרטגיית תוכן לעסק", "מערכת תוכן לוואטסאפ"],
    faqs: [
      {
        question: "למה תוכן לבד לא מספיק?",
        answer: "כי בלי הצעה, דף ו-CTA, התוכן יוצר עניין רגעי אבל לא מחבר אותו לפנייה עסקית.",
      },
      {
        question: "מה צריך להוסיף?",
        answer: "מסלול ברור: מסר, עמוד ממיר, נקודת פנייה ותגובה מהירה.",
      },
    ],
  },
  {
    slug: "new-business-launch-chaos",
    title: "עסק חדש נפתח בבלגן",
    description: "לפני פתיחה יש לוגו, אתר, רשתות ופרסום, אבל בלי סדר אחד הכול מתפזר. כך מתקנים את זה.",
    symptoms: ["הרבה ספקים שונים", "אין סדר השקה", "אין מסלול לקוח אחיד"],
    whyItHappens: "כל חלק נבנה בנפרד, ולכן אין מהלך אחד שעוזר לעסק להתחיל עם תנועה ופניות מסודרות.",
    mappedPackageId: "business-launch-setup",
    keywords: ["פתיחת עסק חדש באינטרנט", "השקה דיגיטלית לעסק", "סדר השקה לעסק חדש"],
    faqs: [
      {
        question: "מה הטעות הכי נפוצה לפני פתיחה?",
        answer: "לבנות אתר, תוכן ופרסום כמשימות נפרדות בלי מהלך אחד שמחבר ביניהן.",
      },
      {
        question: "איך נראה פתרון נכון?",
        answer: "צילום, תוכן, עמוד, Google Business ופרסום בסיסי שנבנים כחלק ממערכת אחת.",
      },
    ],
  },
];

export const seoProductBySlug = new Map(seoProducts.map((item) => [item.slug, item]));
export const seoProblemBySlug = new Map(seoProblems.map((item) => [item.slug, item]));
export const productSlugByPackageId = new Map(seoProducts.map((item) => [item.packageId, item.slug]));
export const legacySeoTierMapping = legacyPackageToTier;

function stableHashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getSeoBannerVariant(seed: string): SeoBannerVariant {
  if (seoBannerVariants.length === 0) {
    throw new Error("seoBannerVariants is empty.");
  }
  return seoBannerVariants[stableHashSeed(seed) % seoBannerVariants.length];
}

export async function getSeoProductCard(packageId: PackageId) {
  const content = await applyDbOverrides(getSiteContent("he"), "he");
  return content.solutions.cards.find((item) => item.packageId === packageId) ?? null;
}

export function getSeoTierForPackage(packageId: PackageId) {
  const tierId = mapLegacyPackageToTier(packageId);
  return getTierDefinition(tierId);
}

export function getSeoProductPriceRange(packageId: PackageId) {
  return getSeoTierForPackage(packageId).priceRange;
}

export function getSeoProductUrl(slug: string): string {
  return absoluteUrl(`/products/${slug}`);
}

export function getSeoProblemUrl(slug: string): string {
  return absoluteUrl(`/problems/${slug}`);
}
