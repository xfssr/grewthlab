import type { MetadataRoute } from "next";

import { seoProblems, seoProducts } from "@/lib/seo-data";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/products"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.65,
    },
    {
      url: absoluteUrl("/problems"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.65,
    },
    ...seoProducts.map((item) => ({
      url: absoluteUrl(`/products/${item.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...seoProblems.map((item) => ({
      url: absoluteUrl(`/problems/${item.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.72,
    })),
  ];
}
