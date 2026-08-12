import { NextResponse } from "next/server";
import { CATEGORIES } from "@/data/catalog";

export async function GET() {
  try {
    return NextResponse.json({ categories: CATEGORIES, count: CATEGORIES.length });
  } catch (err) {
    console.error("[API_CATEGORIES_GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
