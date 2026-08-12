import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const subscribers = await db.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json({ subscribers, count: subscribers.length });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
