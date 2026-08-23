import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin-auth";
import { PRODUCTS } from "@/data/catalog";

// GET reviews — from catalog (with optional productSlug filter)
export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const productSlug = searchParams.get("productSlug");
    let reviews = PRODUCTS.flatMap((p) =>
      p.reviews.map((r) => ({ ...r, productSlug: p.slug, productName: p.name, source: "catalog", status: "approved" }))
    );
    if (productSlug) {
      reviews = reviews.filter((r) => r.productSlug === productSlug);
    }
    return NextResponse.json({ reviews, count: reviews.length });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// PATCH — approve/reject a review (mock — in production this would update DB)
export async function PATCH(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }
    // Mock response — in production, update DB
    return NextResponse.json({ success: true, id, status });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// DELETE a review (mock)
export async function DELETE(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    // Mock — in production, delete from DB
    return NextResponse.json({ success: true, id });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
