import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/app/api/_auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const createSolutionSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).default(""),
  price: z.coerce.number().min(0),
  imageUrl: z.string().trim().max(1024).default(""),
});

const updateSolutionSchema = createSolutionSchema.partial().extend({
  id: z.string().trim().min(1),
});

export async function GET() {
  try {
    const items = await prisma.solution.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      items: items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    });
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

  const item = await prisma.solution.create({
    data: {
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

  const { id, ...rest } = parsed.data;
  const data = Object.fromEntries(Object.entries(rest).filter((entry) => entry[1] !== undefined));

  const item = await prisma.solution.update({
    where: { id },
    data,
  });

  return NextResponse.json({
    item: {
      ...item,
      price: Number(item.price),
    },
  });
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing solution id." }, { status: 400 });
  }

  await prisma.solution.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
