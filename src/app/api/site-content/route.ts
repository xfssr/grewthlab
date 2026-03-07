import { NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/app/api/_auth";
import { getSiteContent } from "@/core/site.content";
import type { Locale } from "@/core/site.types";
import {
  applyDbOverrides,
  getSiteContentOverride,
  sanitizeSiteContentOverrideData,
  saveSiteContentOverride,
} from "@/lib/site-content-overrides";

export const runtime = "nodejs";

function resolveLocale(value: string | null): Locale {
  return value === "en" ? "en" : "he";
}

export async function GET(request: NextRequest) {
  const locale = resolveLocale(request.nextUrl.searchParams.get("locale"));
  const override = await getSiteContentOverride(locale);
  const content = await applyDbOverrides(getSiteContent(locale), locale);
  const editableContent = sanitizeSiteContentOverrideData(content);

  return NextResponse.json({ content, override, editableContent });
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

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const locale = resolveLocale((payload as { locale?: string }).locale ?? null);
  const data = (payload as { content?: unknown }).content;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return NextResponse.json({ error: "Content must be a JSON object." }, { status: 400 });
  }

  const override = await saveSiteContentOverride(locale, data);
  if (!override) {
    return NextResponse.json({ error: "Content override is invalid." }, { status: 400 });
  }

  const content = await applyDbOverrides(getSiteContent(locale), locale);

  return NextResponse.json({ content, override });
}
