import type { Metadata } from "next";

import { StructuredData } from "@/components/seo/StructuredData";
import { LandingPage } from "@/components/landing/LandingPage";
import { getSiteContent } from "@/core/site.content";
import { seoProblems, seoProducts } from "@/lib/seo-data";
import { absoluteUrl, homePageDescription, homePageKeywords, homePageTitle, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: homePageTitle,
  description: homePageDescription,
  keywords: homePageKeywords,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    alternateLocale: ["en_US"],
    url: absoluteUrl("/"),
    siteName,
    title: homePageTitle,
    description: homePageDescription,
    images: [absoluteUrl("/og-image.jpg")],
  },
  twitter: {
    card: "summary_large_image",
    title: homePageTitle,
    description: homePageDescription,
    images: [absoluteUrl("/og-image.jpg")],
  },
};

export default function HomePage() {
  const content = getSiteContent("he");

  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteName,
          url: absoluteUrl("/"),
          description: homePageDescription,
          inLanguage: ["he", "en"],
        }}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteName,
          url: absoluteUrl("/"),
          logo: absoluteUrl("/apple-touch-icon.png"),
          image: absoluteUrl("/og-image.jpg"),
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "sales",
              telephone: content.footer.phone,
              email: content.footer.email,
              areaServed: "IL",
              availableLanguage: ["he", "en"],
            },
          ],
        }}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: content.faq.items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          name: "Local business growth solutions",
          url: absoluteUrl("/"),
          itemListElement: seoProducts.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`/products/${item.slug}`),
            name: item.title,
          })),
        }}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Business problems and solutions",
          itemListElement: [
            ...seoProblems.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absoluteUrl(`/problems/${item.slug}`),
              name: item.title,
            })),
            ...seoProducts.map((item, index) => ({
              "@type": "ListItem",
              position: seoProblems.length + index + 1,
              url: absoluteUrl(`/products/${item.slug}`),
              name: item.title,
            })),
          ],
        }}
      />
      <LandingPage />
    </>
  );
}
