import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "annasite_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: string; // userId
  role: "STUDENT" | "PARENT" | "ADMIN";
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.sub !== "string" || typeof payload.role !== "string") {
      return null;
    }
    return { sub: payload.sub, role: payload.role as SessionPayload["role"] };
  } catch {
    return null;
  }
}

/** Sets the session cookie. Must be called from a Server Action or Route Handler. */
export async function createSessionCookie(payload: SessionPayload) {
  const token = await signSessionToken(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSessionPayload(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Full current user (without passwordHash) for use in Server Components / actions. */
export async function getCurrentUser() {
  const session = await getSessionPayload();
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) return null;
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}

export { SESSION_COOKIE };
