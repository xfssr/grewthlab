import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/app/api/_auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const upsertPageSchema = z.object({
  slug: z.string().trim().min(1).max(120).default("home"),
  title: z.string().trim().min(1).max(180),
  subtitle: z.string().trim().max(400).default(""),
  heroImage: z.string().trim().max(1024).default(""),
  heroVideo: z.string().trim().max(1024).default(""),
});

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") || "home";
  const page = await prisma.page.findUnique({
    where: { slug },
  });

  if (!page) {
    return NextResponse.json({ page: null });
  }

  return NextResponse.json({ page });
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

  const parsed = upsertPageSchema.safeParse(payload);
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

  const page = await prisma.page.upsert({
    where: { slug: parsed.data.slug },
    create: parsed.data,
    update: {
      title: parsed.data.title,
      subtitle: parsed.data.subtitle,
      heroImage: parsed.data.heroImage,
      heroVideo: parsed.data.heroVideo,
    },
  });

  return NextResponse.json({ page });
}
