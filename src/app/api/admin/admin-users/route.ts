import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin-auth";
import { createHash } from "crypto";

function hashPassword(p: string) { return createHash("sha256").update(p).digest("hex"); }

export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const users = await db.adminUser.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, email: true, name: true, role: true, createdAt: true } });
    return NextResponse.json({ users, count: users.length });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { email, name, password, role } = await req.json();
    if (!email || !name || !password) return NextResponse.json({ error: "email, name, password required" }, { status: 400 });
    const user = await db.adminUser.create({
      data: { email: email.toLowerCase().trim(), name, password: hashPassword(password), role: role || "ADMIN" },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.adminUser.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
