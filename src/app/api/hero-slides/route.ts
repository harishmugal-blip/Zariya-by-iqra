import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public GET — storefront reads hero slides
export async function GET() {
  try {
    const slides = await db.heroSlide.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ slides });
  } catch {
    return NextResponse.json({ slides: [] }, { status: 200 });
  }
}
