export const siteName = "SS Space";
export const siteTitle = "SS Space | Growth systems for local businesses";
export const siteDescription =
  "Growth systems for local businesses: content, landing pages, WhatsApp, and ads that bring qualified inquiries.";

export const homePageTitle = "איך למצוא לקוחות לעסק | How to Get More Clients";
export const homePageDescription =
  "איך למצוא לקוחות, למה העסק לא מוכר, ולמה תוכן, דף נחיתה, WhatsApp ופרסום עובדים יחד. Learn how content, landing pages, WhatsApp, and ads turn attention into real sales for local businesses.";

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

