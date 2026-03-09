import type { Metadata } from "next";
import { Heebo, Manrope, Playfair_Display } from "next/font/google";

import { Analytics } from "@/components/Analytics";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getSiteContent } from "@/core/site.content";
import { applyDbOverrides } from "@/lib/site-content-overrides";
import { absoluteUrl, getSiteUrl, siteDescription, siteName, siteTitle } from "@/lib/site";

import "./globals.css";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700"],
});

const hebrew = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-hebrew",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: absoluteUrl("/"),
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: absoluteUrl("/og-image.jpg"),
        width: 1200,
        height: 630,
        alt: `${siteName} open graph image`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [absoluteUrl("/og-image.jpg")],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
};

async function getInitialLocaleContent() {
  return applyDbOverrides(getSiteContent("he"), "he");
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialContent = await getInitialLocaleContent();

  return (
    <html lang="he">
      <body className={`${sans.variable} ${display.variable} ${hebrew.variable} bg-bg-base font-sans text-text-primary antialiased`}>
        <Analytics />
        <LocaleProvider initialLocale="he" initialContent={initialContent}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
