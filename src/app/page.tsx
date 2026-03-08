import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/LandingPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { getSiteContent } from "@/core/site.content";
import { seoProblems, seoProducts } from "@/lib/seo-data";
import { applyDbOverrides } from "@/lib/site-content-overrides";
import { absoluteUrl, homePageDescription, homePageTitle, siteName } from "@/lib/site";

export const revalidate = 300;

async function getResolvedHomeContent() {
  return applyDbOverrides(getSiteContent("he"), "he");
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getResolvedHomeContent();
  const title = content.hero.title || homePageTitle;
  const description = content.hero.description || homePageDescription;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl("/"),
    },
    openGraph: {
      type: "website",
      locale: "he_IL",
      alternateLocale: ["en_US"],
      url: absoluteUrl("/"),
      siteName,
      title,
      description,
      images: [absoluteUrl("/og-image.jpg")],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/og-image.jpg")],
    },
  };
}

export default async function HomePage() {
  const content = await getResolvedHomeContent();

  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteName,
          url: absoluteUrl("/"),
          description: content.hero.description || homePageDescription,
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
