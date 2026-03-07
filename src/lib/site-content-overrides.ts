import type { Locale, LocalizedMediaAsset, SiteContentViewModel } from "@/core/site.types";
import { PACKAGE_IDS } from "@/core/site.types";
import { prisma } from "@/lib/db";

type SiteContentOverrideData = Partial<SiteContentViewModel>;

function formatPriceLabel(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(value);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) {
    return base;
  }

  if (Array.isArray(base) && Array.isArray(override)) {
    const fallbackItems = base as unknown[];
    return override.map((item, index) => deepMerge(fallbackItems[index], item)) as T;
  }

  if (isPlainObject(base) && isPlainObject(override)) {
    const result: Record<string, unknown> = { ...base };

    for (const [key, value] of Object.entries(override)) {
      const current = result[key];
      if (current !== undefined) {
        result[key] = deepMerge(current, value);
        continue;
      }
      result[key] = value;
    }

    return result as T;
  }

  return override as T;
}

function normalizeOverrideData(value: unknown): SiteContentOverrideData | null {
  return isPlainObject(value) ? (value as SiteContentOverrideData) : null;
}

export function sanitizeSiteContentOverrideData(value: unknown): SiteContentOverrideData | null {
  const normalized = normalizeOverrideData(value);
  if (!normalized) {
    return null;
  }

  const next = structuredClone(normalized) as Record<string, unknown>;
  delete next.locale;
  delete next.dir;
  delete next.isRtl;

  if (isPlainObject(next.hero)) {
    delete next.hero.backgroundImageSrc;
    delete next.hero.backgroundVideoSrc;
  }
  if (isPlainObject(next.gallery)) {
    delete next.gallery.items;
  }
  if (isPlainObject(next.contentArchive)) {
    delete next.contentArchive.modules;
  }
  if (isPlainObject(next.solutions)) {
    delete next.solutions.cards;
  }
  if (isPlainObject(next.pricing)) {
    delete next.pricing.packageOptions;
  }
  if (isPlainObject(next.cases)) {
    delete next.cases.cards;
  }

  return next as SiteContentOverrideData;
}

function mapGalleryItems(
  rows: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    videoUrl: string;
  }>,
  locale: Locale,
): LocalizedMediaAsset[] {
  const mapped: LocalizedMediaAsset[] = [];

  for (const row of rows) {
    const hasVideo = Boolean(row.videoUrl?.trim());
    const mediaSrc = hasVideo ? row.videoUrl.trim() : row.imageUrl.trim();
    if (!mediaSrc) {
      continue;
    }

    const alt = row.description?.trim() || row.title?.trim() || (locale === "he" ? "פריט גלריה" : "Gallery item");

    mapped.push({
      id: row.id,
      type: hasVideo ? "video" : "image",
      src: mediaSrc,
      poster: hasVideo ? row.imageUrl?.trim() || undefined : undefined,
      alt,
      tags: ["admin", "gallery"],
    });
  }

  return mapped;
}

export async function getSiteContentOverride(locale: Locale): Promise<SiteContentOverrideData | null> {
  try {
    const row = await prisma.siteContentOverride.findUnique({
      where: { locale },
      select: { data: true },
    });

    return normalizeOverrideData(row?.data);
  } catch {
    return null;
  }
}

export async function saveSiteContentOverride(locale: Locale, data: unknown): Promise<SiteContentOverrideData | null> {
  const normalized = sanitizeSiteContentOverrideData(data);
  if (!normalized) {
    return null;
  }

  const row = await prisma.siteContentOverride.upsert({
    where: { locale },
    create: {
      locale,
      data: normalized,
    },
    update: {
      data: normalized,
    },
    select: {
      data: true,
    },
  });

  return normalizeOverrideData(row.data);
}

export async function applyDbOverrides(content: SiteContentViewModel, locale: Locale): Promise<SiteContentViewModel> {
  try {
    const [contentOverride, page, galleryRows, solutionRows] = await Promise.all([
      getSiteContentOverride(locale),
      prisma.page.findUnique({ where: { slug: "home" } }),
      prisma.galleryItem.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          videoUrl: true,
        },
      }),
      prisma.solution.findMany({
        orderBy: { createdAt: "asc" },
        select: {
          title: true,
          description: true,
          price: true,
          imageUrl: true,
        },
      }),
    ]);

    const next = structuredClone(content) as SiteContentViewModel;

    if (page) {
      if (page.title?.trim()) {
        next.hero.title = page.title.trim();
      }
      if (page.subtitle?.trim()) {
        next.hero.description = page.subtitle.trim();
      }
      if (page.heroImage?.trim()) {
        next.hero.backgroundImageSrc = page.heroImage.trim();
      }
      if (page.heroVideo?.trim()) {
        next.hero.backgroundVideoSrc = page.heroVideo.trim();
      }
    }

    const withLocalizedCopy = deepMerge(next, contentOverride) as SiteContentViewModel;

    if (galleryRows.length > 0) {
      const mappedGallery = mapGalleryItems(galleryRows, locale);
      if (mappedGallery.length > 0) {
        withLocalizedCopy.gallery.items = mappedGallery;
      }
    }

    if (solutionRows.length > 0) {
      const cardById = new Map(withLocalizedCopy.solutions.cards.map((card) => [card.id, card]));
      const updatedCards = PACKAGE_IDS.map((packageId, index) => {
        const baseCard = cardById.get(packageId);
        const row = solutionRows[index];
        if (!baseCard || !row) {
          return baseCard;
        }

        const description = row.description?.trim();
        return {
          ...baseCard,
          title: row.title?.trim() || baseCard.title,
          problem: description || baseCard.problem,
          whatWeDo: description || baseCard.whatWeDo,
          outcome: description || baseCard.outcome,
          priceLabel: formatPriceLabel(Number(row.price), locale),
          imageSrc: row.imageUrl?.trim() || baseCard.imageSrc,
        };
      }).filter((item): item is SiteContentViewModel["solutions"]["cards"][number] => Boolean(item));

      if (updatedCards.length > 0) {
        withLocalizedCopy.solutions.cards = updatedCards;
        withLocalizedCopy.pricing.packageOptions = updatedCards.map((item) => ({
          id: item.id,
          label: item.title,
        }));
      }
    }

    return withLocalizedCopy;
  } catch {
    return content;
  }
}
