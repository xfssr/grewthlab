import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/app/api/_auth";

export const runtime = "nodejs";

const MAX_AVATAR_UPLOAD_BYTES = 5 * 1024 * 1024;

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename")?.trim();
  if (!filename) {
    return NextResponse.json({ error: "filename is required" }, { status: 400 });
  }

  const safeFilename = sanitizeFilename(filename);
  if (!safeFilename) {
    return NextResponse.json({ error: "invalid filename" }, { status: 400 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    return NextResponse.json({ error: "only image uploads are allowed" }, { status: 400 });
  }

  const contentLengthRaw = request.headers.get("content-length");
  const contentLength = contentLengthRaw ? Number(contentLengthRaw) : NaN;
  if (Number.isFinite(contentLength) && contentLength > MAX_AVATAR_UPLOAD_BYTES) {
    return NextResponse.json({ error: "file is too large" }, { status: 413 });
  }

  if (!request.body) {
    return NextResponse.json({ error: "empty body" }, { status: 400 });
  }

  const blob = await put(`avatars/${Date.now()}-${safeFilename}`, request.body, {
    access: "private",
  });

  return NextResponse.json(blob);
}
