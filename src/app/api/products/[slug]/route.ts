import { NextResponse } from "next/server";
import { PRODUCTS } from "@/data/catalog";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = PRODUCTS.find((p) => p.slug === slug);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found", slug },
        { status: 404 }
      );
    }

    // Related products (same category, excluding current)
    const related = PRODUCTS.filter(
      (p) => p.category === product.category && p.id !== product.id
    ).slice(0, 4);

    return NextResponse.json({ product, related });
  } catch (err) {
    console.error("[API_PRODUCT_SLUG_GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
