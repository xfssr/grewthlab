import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/app/api/_auth";
import { getSiteContent } from "@/core/site.content";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const createGalleryItemSchema = z.object({
  title: z.string().trim().min(1).max(160),
  tier: z.string().trim().max(160).default(""),
  description: z.string().trim().max(500).default(""),
  imageUrl: z.string().trim().max(1024).default(""),
  videoUrl: z.string().trim().max(1024).default(""),
});

const updateGalleryItemSchema = createGalleryItemSchema.partial().extend({
  id: z.string().trim().min(1),
});

function normalizeTier(tier: string | undefined, title: string | undefined): string {
  const candidate = (tier?.trim() || title?.trim() || "").slice(0, 160);
  return candidate;
}

function mapDefaultGalleryItem(
  item: ReturnType<typeof getSiteContent>["gallery"]["items"][number],
  index: number,
) {
  const alt = item.alt.trim();
  const title = alt.slice(0, 160) || `Gallery item ${index + 1}`;

  return {
    id: item.id,
    title,
    tier: title,
    description: alt.slice(0, 500),
    imageUrl: item.type === "image" ? item.src : (item.poster || ""),
    videoUrl: item.type === "video" ? item.src : "",
  };
}

async function ensureGalleryRowsExist() {
  const existing = await prisma.galleryItem.count();
  if (existing > 0) {
    return;
  }

  const defaults = getSiteContent("he").gallery.items.map(mapDefaultGalleryItem);
  if (!defaults.length) {
    return;
  }

  await prisma.galleryItem.createMany({
    data: defaults,
    skipDuplicates: true,
  });
}

export async function GET() {
  try {
    await ensureGalleryRowsExist();

    const items = await prisma.galleryItem.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [], error: "Database unavailable." });
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

  const parsed = createGalleryItemSchema.safeParse(payload);
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

  const item = await prisma.galleryItem.create({
    data: {
      ...parsed.data,
      tier: normalizeTier(parsed.data.tier, parsed.data.title),
    },
  });

  return NextResponse.json({ item });
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

  const parsed = updateGalleryItemSchema.safeParse(payload);
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

  const { id, ...rest } = parsed.data;
  const data = Object.fromEntries(Object.entries(rest).filter((entry) => entry[1] !== undefined));
  const normalizedData: Record<string, unknown> = { ...data };
  if ("tier" in data || "title" in data) {
    normalizedData.tier = normalizeTier(data.tier as string | undefined, data.title as string | undefined);
  }

  const item = await prisma.galleryItem.update({
    where: { id },
    data: normalizedData,
  });

  return NextResponse.json({ item });
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing item id." }, { status: 400 });
  }

  await prisma.galleryItem.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
