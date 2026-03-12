export const siteName = "SS Space";
export const siteTitle = "SS Space | 48-hour site + content systems for Israel SMBs";
export const siteDescription =
  "Instagram/menu -> first output in 48 hours: page, content, and inquiry flow. Built-in Hebrew/Russian/English operations with WhatsApp-first handling.";

export const homePageTitle = "איך למצוא לקוחות לעסק | How to Get More Clients";
export const homePageDescription =
  "מאינסטגרם או תפריט לפלט ראשון תוך 48 שעות: עמוד, תוכן, Google Business ו-WhatsApp בטון אנושי. From Instagram/menu to first output in 48 hours with multilingual and channel-ready assets.";

export const homePageKeywords = [
  "איך למצוא לקוחות לעסק",
  "למה העסק לא מוכר",
  "למה לא מוכרים",
  "למה צריך תוכן לעסק",
  "למה צריך פרסום לעסק",
  "איך להביא לקוחות לעסק מקומי",
  "שיווק למסעדות",
  "שיווק לבית קפה",
  "שיווק נדל\"ן",
  "שיווק לביוטי",
  "דף נחיתה לעסק",
  "פרסום בוואטסאפ לעסק",
  "how to get more clients",
  "why my business is not selling",
  "why content marketing matters",
  "why ads are important for business",
  "local business marketing",
  "restaurant marketing",
  "cafe marketing",
  "real estate marketing",
  "beauty business marketing",
  "landing page for local business",
  "whatsapp lead generation",
];

function normalizeUrl(value: string): string {
  if (!value) {
    return value;
  }

  if (/^https?:\/\//i.test(value)) {
    return value.replace(/\/+$/, "");
  }

  return `https://${value.replace(/\/+$/, "")}`;
}

export function getSiteUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    "http://localhost:3000";

  return normalizeUrl(envUrl);
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${base}/`).toString();
}

