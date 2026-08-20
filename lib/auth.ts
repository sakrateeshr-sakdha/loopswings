import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "lw_admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set. Copy .env.example to .env.local.");
  return s;
}

function adminPassword() {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) throw new Error("ADMIN_PASSWORD is not set. Copy .env.example to .env.local.");
  return p;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function checkPassword(candidate: string) {
  const expected = adminPassword();
  // Hash both sides first so timingSafeEqual never sees mismatched lengths.
  return safeEqual(
    crypto.createHash("sha256").update(candidate).digest("hex"),
    crypto.createHash("sha256").update(expected).digest("hex"),
  );
}

function makeToken() {
  const expires = Date.now() + MAX_AGE * 1000;
  const payload = `admin.${expires}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [subject, expires, mac] = parts;
  const payload = `${subject}.${expires}`;
  if (!safeEqual(mac, sign(payload))) return false;
  return Number(expires) > Date.now();
}

export async function createSession() {
  const jar = await cookies();
  jar.set(COOKIE, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAuthed() {
  const jar = await cookies();
  return verifyToken(jar.get(COOKIE)?.value);
}

/** Guard for API routes. Returns a 401 Response when not signed in. */
export async function requireAuth() {
  if (await isAuthed()) return null;
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
