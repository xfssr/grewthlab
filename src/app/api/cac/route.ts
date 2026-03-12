import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/app/api/_auth";
import { ACQUISITION_CHANNELS } from "@/core/site.types";
import { computeCacMetricsForMonth, deleteCacEntry, listCacEntries, upsertCacEntry } from "@/lib/cac";
import { listAllLeads } from "@/lib/db";

export const runtime = "nodejs";

const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
const monthSchema = z.string().regex(monthRegex, "Month must be YYYY-MM.");

const upsertSchema = z.object({
  id: z.string().min(1).optional(),
  month: monthSchema,
  channel: z.enum(ACQUISITION_CHANNELS),
  spendIls: z.coerce.number().int().min(0),
  dealsWon: z.coerce.number().int().min(0),
  revenueIls: z.coerce.number().int().min(0),
  notes: z.string().trim().max(500).optional(),
});

function defaultMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

async function requireAdmin(request: NextRequest) {
  const session = await getAdminSession(request);
  return session ? true : false;
}

export async function GET(request: NextRequest) {
  const isAdmin = await requireAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsedMonth = monthSchema.safeParse(request.nextUrl.searchParams.get("month") || defaultMonth());
  if (!parsedMonth.success) {
    return NextResponse.json({ error: parsedMonth.error.issues[0]?.message || "Invalid month." }, { status: 400 });
  }

  const [entries, leads] = await Promise.all([listCacEntries(), listAllLeads()]);
  const metrics = computeCacMetricsForMonth(parsedMonth.data, entries, leads);
  return NextResponse.json({ month: parsedMonth.data, entries, metrics });
}

export async function POST(request: NextRequest) {
  const isAdmin = await requireAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = upsertSchema.safeParse(payload);
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

  const entry = await upsertCacEntry(parsed.data);
  return NextResponse.json({ entry });
}

export async function PUT(request: NextRequest) {
  return POST(request);
}

export async function DELETE(request: NextRequest) {
  const isAdmin = await requireAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id parameter." }, { status: 400 });
  }

  const deleted = await deleteCacEntry(id);
  if (!deleted) {
    return NextResponse.json({ error: "Entry not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
