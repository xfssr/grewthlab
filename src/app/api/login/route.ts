import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { AUTH_COOKIE_NAME, createSessionToken, getSessionCookieOptions, verifySessionToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const loginSchema = z.object({
  password: z.string().min(5).max(120),
});

const FALLBACK_ADMIN_LOGIN = (process.env.ADMIN_EMAIL || "admin-dev").toLowerCase();
const FALLBACK_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ALLOW_DEV_FALLBACK = process.env.NODE_ENV !== "production" && Boolean(FALLBACK_ADMIN_PASSWORD);

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.sub,
      email: session.email,
      role: session.role,
    },
  });
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(payload);
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

  try {
    const users = await prisma.user.findMany({
      where: {
        role: "admin",
      },
    });

    for (const user of users) {
      const validPassword = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!validPassword) {
        continue;
      }

      const token = await createSessionToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      const response = NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });

      response.cookies.set(AUTH_COOKIE_NAME, token, getSessionCookieOptions());
      return response;
    }
  } catch {
    // Fallback below handles local login when the database is not configured yet.
  }

  if (ALLOW_DEV_FALLBACK && parsed.data.password === FALLBACK_ADMIN_PASSWORD) {
    const token = await createSessionToken({
      sub: `local-${FALLBACK_ADMIN_LOGIN}`,
      email: FALLBACK_ADMIN_LOGIN,
      role: "admin",
    });

    const response = NextResponse.json({
      authenticated: true,
      user: {
        id: `local-${FALLBACK_ADMIN_LOGIN}`,
        email: FALLBACK_ADMIN_LOGIN,
        role: "admin",
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, getSessionCookieOptions());
    return response;
  }

  return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...getSessionCookieOptions(),
    maxAge: 0,
  });

  return response;
}
