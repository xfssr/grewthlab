import { jwtVerify, SignJWT } from "jose";

export const AUTH_COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type AdminSession = {
  sub: string;
  email: string;
  role: string;
};

function getAuthSecret(): string {
  return process.env.AUTH_SECRET || "dev-only-auth-secret-change-in-production";
}

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(getAuthSecret());
}

export async function createSessionToken(session: AdminSession): Promise<string> {
  return new SignJWT({ email: session.email, role: session.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token?: string | null): Promise<AdminSession | null> {
  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });

    const email = typeof verified.payload.email === "string" ? verified.payload.email : "";
    const role = typeof verified.payload.role === "string" ? verified.payload.role : "";
    const sub = typeof verified.payload.sub === "string" ? verified.payload.sub : "";

    if (!sub || !email || !role) {
      return null;
    }

    return { sub, email, role };
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

