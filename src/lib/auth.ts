import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./db";
import { SESSION_COOKIE, SESSION_DAYS, signSessionToken, verifySessionToken } from "./session-token";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  plan: "FREE" | "PRO";
};

export function hashPassword(password: string) {
  return hash(password, 12);
}

export function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export async function startSession(userId: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, await signSessionToken(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const userId = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, plan: true },
  });
}
