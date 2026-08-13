import { createHash } from "crypto";
import { db } from "@/lib/db";

export interface AdminSession {
  email: string;
  name: string;
  role: string;
}

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function verifyAdmin(
  email: string,
  password: string
): Promise<AdminSession | null> {
  const admin = await db.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!admin) return null;
  if (admin.password !== hashPassword(password)) return null;
  return { email: admin.email, name: admin.name, role: admin.role };
}

export async function createSessionToken(session: AdminSession): Promise<string> {
  // Simple signed token (base64 of JSON + secret hash)
  const payload = JSON.stringify(session);
  const b64 = Buffer.from(payload).toString("base64");
  const sig = createHash("sha256")
    .update(payload + (process.env.ADMIN_SECRET || "zariya-admin-secret"))
    .digest("hex")
    .slice(0, 16);
  return `${b64}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const [b64, sig] = token.split(".");
    if (!b64 || !sig) return null;
    const payload = Buffer.from(b64, "base64").toString();
    const expectedSig = createHash("sha256")
      .update(payload + (process.env.ADMIN_SECRET || "zariya-admin-secret"))
      .digest("hex")
      .slice(0, 16);
    if (sig !== expectedSig) return null;
    return JSON.parse(payload) as AdminSession;
  } catch {
    return null;
  }
}

export async function getSession(req: Request): Promise<AdminSession | null> {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/zariya-admin=([^;]+)/);
  if (!match) return null;
  return verifySessionToken(match[1]);
}

export function setSessionCookie(token: string): string {
  return `zariya-admin=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
}

export function clearSessionCookie(): string {
  return `zariya-admin=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
