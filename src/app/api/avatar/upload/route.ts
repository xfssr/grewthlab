import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ error: "filename is required" }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ error: "empty body" }, { status: 400 });
  }

  const blob = await put(filename, request.body, {
    access: "private",
  });

  return NextResponse.json(blob);
}

