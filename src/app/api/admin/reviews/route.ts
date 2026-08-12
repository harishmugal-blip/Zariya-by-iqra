import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PRODUCTS } from "@/data/catalog";

// GET product reviews (catalog reviews + any persisted)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const productSlug = url.searchParams.get("productSlug");
    let catalogReviews = PRODUCTS.flatMap((p) =>
      p.reviews.map((r) => ({ ...r, productSlug: p.slug, productName: p.name, source: "catalog" }))
    );
    if (productSlug) {
      catalogReviews = catalogReviews.filter((r) => r.productSlug === productSlug);
    }
    return NextResponse.json({ reviews: catalogReviews, count: catalogReviews.length });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
