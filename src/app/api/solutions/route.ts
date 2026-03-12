import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/app/api/_auth";
import { getSiteContent } from "@/core/site.content";
import { getTierDefinition, mapLegacyPackageToTier } from "@/core/pricing/tier-model";
import { PACKAGE_IDS } from "@/core/site.types";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const packageSlugSchema = z.enum(PACKAGE_IDS);

const updateSolutionSchema = z.object({
  slug: z.string().trim().min(1).max(160),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).default(""),
  price: z.coerce.number().min(0),
  imageUrl: z.string().trim().max(1024).default(""),
});

const createSolutionSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).default(""),
  price: z.coerce.number().min(0),
  imageUrl: z.string().trim().max(1024).default(""),
});

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function createUniqueCustomSlug(title: string): Promise<string> {
  const base = slugify(title) || "custom-solution";
  let slug = `custom-${base}`;
  let counter = 2;

  while (await prisma.solution.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `custom-${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

export async function GET() {
  const content = getSiteContent("he");

  try {
    const items = await prisma.solution.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    const itemBySlug = new Map(items.map((item) => [item.slug, item]));
    const customItems = items
      .filter((item) => !PACKAGE_IDS.includes(item.slug as (typeof PACKAGE_IDS)[number]))
      .map((item) => ({
        ...item,
        price: Number(item.price),
      }));

    return NextResponse.json({
      items: PACKAGE_IDS.map((slug) => {
        const existing = itemBySlug.get(slug);
        const defaultCard = content.solutions.cards.find((item) => item.id === slug);
        const tierId = mapLegacyPackageToTier(slug);
        const tier = getTierDefinition(tierId);

        if (existing) {
          return {
            ...existing,
            price: Number(existing.price),
          };
        }

        return {
          id: "",
          slug,
          title: defaultCard?.title || slug,
          description: defaultCard?.problem || "",
          price: tier.priceRange.min,
          imageUrl: "",
          createdAt: "",
        };
      }),
      customItems,
    });
  } catch {
    return NextResponse.json({
      items: PACKAGE_IDS.map((slug) => {
        const defaultCard = content.solutions.cards.find((item) => item.id === slug);
        const tierId = mapLegacyPackageToTier(slug);
        const tier = getTierDefinition(tierId);

        return {
          id: "",
          slug,
          title: defaultCard?.title || slug,
          description: defaultCard?.problem || "",
          price: tier.priceRange.min,
          imageUrl: "",
          createdAt: "",
        };
      }),
      customItems: [],
      error: "Database unavailable.",
    });
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = createSolutionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const slug = await createUniqueCustomSlug(parsed.data.title);
  const item = await prisma.solution.create({
    data: {
      slug,
      ...parsed.data,
    },
  });

  return NextResponse.json({
    item: {
      ...item,
      price: Number(item.price),
    },
  });
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = updateSolutionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const isFixedPackage = packageSlugSchema.safeParse(parsed.data.slug).success;
  const item = await prisma.solution.upsert({
    where: { slug: parsed.data.slug },
    create: parsed.data,
    update: {
      title: parsed.data.title,
      description: parsed.data.description,
      price: parsed.data.price,
      imageUrl: parsed.data.imageUrl,
    },
  });

  return NextResponse.json({
    item: {
      ...item,
      price: Number(item.price),
    },
    mode: isFixedPackage ? "replace" : "add",
  });
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing solution slug." }, { status: 400 });
  }
  if (packageSlugSchema.safeParse(slug).success) {
    return NextResponse.json({ error: "Fixed package solutions cannot be deleted." }, { status: 400 });
  }

  await prisma.solution.delete({
    where: { slug },
  });

  return NextResponse.json({ ok: true });
}
