import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import type { SessionUser } from "@/types";
import crypto from "node:crypto";

const SESSION_COOKIE = "notemesh_session";
const SESSION_AGE_SECONDS = 60 * 60 * 24 * 30;

function base64url(input: string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(data: string): string {
  return crypto.createHmac("sha256", process.env.AUTH_SECRET ?? "dev-secret").update(data).digest("base64url");
}

function createToken(payload: SessionUser): string {
  const encoded = base64url(JSON.stringify(payload));
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

function verifyToken(token: string): SessionUser | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  if (signature !== expected) return null;
  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionUser;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export async function createSession(user: SessionUser): Promise<void> {
  const token = createToken(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_AGE_SECONDS,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const parsed = verifyToken(token);
  if (!parsed) return null;

  const exists = await prisma.user.findUnique({ where: { id: parsed.id }, select: { id: true, name: true, email: true } });
  if (!exists) return null;
  return exists;
}

export const sessionCookieName = SESSION_COOKIE;
