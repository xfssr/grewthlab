import { buildContentArchiveModules, getCalculatorRules } from "@/core/site.content";
import type { Locale, LocalizedMediaAsset, PackageId, SiteContentViewModel } from "@/core/site.types";
import { PACKAGE_IDS } from "@/core/site.types";
import { prisma } from "@/lib/db";
import { applyDiscount, applyDiscountToRules, getPricingSettings } from "@/lib/pricing-settings";

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
    tier: string;
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

    const normalizedTier = row.tier?.trim() || row.title?.trim();

    mapped.push({
      id: row.id,
      title: row.title?.trim() || alt,
      tier: normalizedTier || row.title?.trim() || row.id,
      type: hasVideo ? "video" : "image",
      src: mediaSrc,
      poster: hasVideo ? row.imageUrl?.trim() || undefined : undefined,
      alt,
      tags: ["admin", "gallery", ...(normalizedTier ? [normalizedTier] : []), row.title?.trim()].filter(Boolean),
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
    const [contentOverride, page, galleryRows, solutionRows, pricingSettings] = await Promise.all([
      getSiteContentOverride(locale),
      prisma.page.findUnique({ where: { slug: "home" } }),
      prisma.galleryItem.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          tier: true,
          description: true,
          imageUrl: true,
          videoUrl: true,
        },
      }),
      prisma.solution.findMany({
        orderBy: { createdAt: "asc" },
        select: {
          slug: true,
          title: true,
          description: true,
          price: true,
          imageUrl: true,
        },
      }),
      getPricingSettings(),
    ]);

    const next = structuredClone(content) as SiteContentViewModel;
    const discountedRules = applyDiscountToRules(getCalculatorRules(), pricingSettings.discountPercent);
    const discountedPackagePrices = new Map(discountedRules.packages.map((item) => [item.id, item.basePrice]));
    const discountedAddonPrices = new Map(discountedRules.addons.map((item) => [item.id, item.price]));

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

    withLocalizedCopy.contentArchive.modules = buildContentArchiveModules(locale, withLocalizedCopy.gallery.items);

    const rowBySlug = new Map(solutionRows.map((row) => [row.slug, row]));
    const cardById = new Map(withLocalizedCopy.solutions.cards.map((card) => [card.id, card]));
    const updatedCards = PACKAGE_IDS.map((packageId) => {
      const baseCard = cardById.get(packageId);
      if (!baseCard) {
        return null;
      }

      const row = rowBySlug.get(packageId);
      const description = row?.description?.trim();
      const displayPrice = row
        ? applyDiscount(Number(row.price), pricingSettings.discountPercent)
        : (discountedPackagePrices.get(packageId) ?? 0);

      return {
        ...baseCard,
        title: row?.title?.trim() || baseCard.title,
        problem: description || baseCard.problem,
        whatWeDo: description || baseCard.whatWeDo,
        outcome: description || baseCard.outcome,
        priceLabel: formatPriceLabel(displayPrice, locale),
        imageSrc: row?.imageUrl?.trim() || baseCard.imageSrc,
      };
    }).filter((item): item is SiteContentViewModel["solutions"]["cards"][number] => Boolean(item));

    if (updatedCards.length > 0) {
      withLocalizedCopy.solutions.cards = updatedCards;
      withLocalizedCopy.pricing.packageOptions = updatedCards.map((item) => ({
        id: item.id,
        label: item.title,
      }));
    }

    withLocalizedCopy.pricing.addonOptions = withLocalizedCopy.pricing.addonOptions.map((item) => ({
      ...item,
      priceLabel: formatPriceLabel(discountedAddonPrices.get(item.id) ?? 0, locale),
    }));

    const statsPackageOrder: PackageId[] = [
      "qr-menu-mini-site",
      "content-whatsapp-funnel",
      "business-launch-setup",
    ];
    withLocalizedCopy.pricing.stats = withLocalizedCopy.pricing.stats.map((item, index) => {
      if (index < statsPackageOrder.length) {
        return {
          ...item,
          value: formatPriceLabel(discountedPackagePrices.get(statsPackageOrder[index]) ?? 0, locale),
        };
      }

      return {
        ...item,
        value: formatPriceLabel(discountedAddonPrices.get("extra_production_day") ?? 0, locale),
      };
    });

    return withLocalizedCopy;
  } catch {
    return content;
  }
}
