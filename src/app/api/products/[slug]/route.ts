import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PRODUCTS } from "@/data/catalog";
import type { Product } from "@/lib/types";

function dbToProduct(p: any): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle || "",
    description: p.description || "",
    story: p.story || "",
    price: p.price,
    compareAtPrice: p.compareAtPrice || undefined,
    currency: (p.currency as "INR") || "INR",
    category: p.category,
    collection: p.collection,
    fabric: p.fabric || "",
    fabricDetails: JSON.parse(p.fabricDetails || "[]"),
    colors: JSON.parse(p.colors || "[]"),
    sizes: JSON.parse(p.sizes || "[]"),
    images: JSON.parse(p.images || "[]"),
    rating: p.rating || 5,
    reviewCount: p.reviewCount || 0,
    reviews: [],
    badges: JSON.parse(p.badges || "[]"),
    featured: p.featured || false,
    bestSeller: p.bestSeller || false,
    newArrival: p.newArrival || false,
    limitedEdition: p.limitedEdition || false,
    stock: p.stock || 0,
    sku: p.sku,
    careInstructions: p.care || "",
    shippingInfo: p.shipping || "",
    tags: JSON.parse(p.tags || "[]"),
    videoUrl: p.videoUrl || undefined,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Try DB first
    let product: Product | null = null;
    try {
      const row = await db.product.findUnique({ where: { slug } });
      if (row && row.active) {
        product = dbToProduct(row);
      }
    } catch (e) {
      console.error("[DB_PRODUCT_FALLBACK]", e);
    }

    // Fallback to static catalog
    if (!product) {
      product = PRODUCTS.find((p) => p.slug === slug) || null;
    }

    if (!product) {
      return NextResponse.json(
        { error: "Product not found", slug },
        { status: 404 }
      );
    }

    // Related products (same category, excluding current) — from DB or static
    let related: Product[] = [];
    try {
      const rows = await db.product.findMany({
        where: { category: product.category, active: true },
        take: 5,
      });
      related = rows
        .filter((r) => r.slug !== product!.slug)
        .slice(0, 4)
        .map(dbToProduct);
    } catch {
      related = [];
    }
    if (related.length === 0) {
      related = PRODUCTS.filter(
        (p) => p.category === product.category && p.id !== product.id
      ).slice(0, 4);
    }

    return NextResponse.json({ product, related });
  } catch (err) {
    console.error("[API_PRODUCT_SLUG_GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
