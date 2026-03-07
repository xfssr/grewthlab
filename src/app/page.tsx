import type { Metadata } from "next";

import { Gallery, type PublicGalleryItem } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Solutions, type PublicSolution } from "@/components/Solutions";
import { prisma } from "@/lib/db";
import { absoluteUrl, siteName } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${siteName} | Content, Website and Ads System`,
  description:
    "Business website with gallery and solution packages. Managed from a compact admin panel with PostgreSQL and Vercel Blob.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

type PublicData = {
  page: {
    title: string;
    subtitle: string;
    heroImage: string;
  };
  gallery: PublicGalleryItem[];
  solutions: PublicSolution[];
};

async function loadPublicData(): Promise<PublicData> {
  const fallback: PublicData = {
    page: {
      title: "Grow your local business with content and ads",
      subtitle: "Content, landing pages, and WhatsApp conversion flow in one system.",
      heroImage: "",
    },
    gallery: [],
    solutions: [],
  };

  try {
    const [page, gallery, solutions] = await Promise.all([
      prisma.page.findUnique({ where: { slug: "home" } }),
      prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.solution.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    return {
      page: {
        title: page?.title || fallback.page.title,
        subtitle: page?.subtitle || fallback.page.subtitle,
        heroImage: page?.heroImage || fallback.page.heroImage,
      },
      gallery,
      solutions: solutions.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    };
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const data = await loadPublicData();

  return (
    <div className="min-h-screen bg-[#090b10]">
      <Hero title={data.page.title} subtitle={data.page.subtitle} heroImage={data.page.heroImage} />
      <Gallery items={data.gallery} />
      <Solutions items={data.solutions} />
    </div>
  );
}

