import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/app/api/_auth";
import { getCalculatorRules, getSiteContent } from "@/core/site.content";
import { PACKAGE_IDS } from "@/core/site.types";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const updateSolutionSchema = z.object({
  slug: z.enum(PACKAGE_IDS),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).default(""),
  price: z.coerce.number().min(0),
  imageUrl: z.string().trim().max(1024).default(""),
});

export async function GET() {
  const content = getSiteContent("he");
  const rules = getCalculatorRules();

  try {
    const items = await prisma.solution.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    const itemBySlug = new Map(items.map((item) => [item.slug, item]));

    return NextResponse.json({
      items: PACKAGE_IDS.map((slug) => {
        const existing = itemBySlug.get(slug);
        const defaultCard = content.solutions.cards.find((item) => item.id === slug);
        const defaultRule = rules.packages.find((item) => item.id === slug);

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
          price: defaultRule?.basePrice ?? 0,
          imageUrl: "",
          createdAt: "",
        };
      }),
    });
  } catch {
    return NextResponse.json({
      items: PACKAGE_IDS.map((slug) => {
        const defaultCard = content.solutions.cards.find((item) => item.id === slug);
        const defaultRule = rules.packages.find((item) => item.id === slug);

        return {
          id: "",
          slug,
          title: defaultCard?.title || slug,
          description: defaultCard?.problem || "",
          price: defaultRule?.basePrice ?? 0,
          imageUrl: "",
          createdAt: "",
        };
      }),
      error: "Database unavailable.",
    });
  }
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
  });
}
