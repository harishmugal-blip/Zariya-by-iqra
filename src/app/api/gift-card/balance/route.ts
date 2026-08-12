import { NextResponse } from "next/server";

// In-memory gift card store (demo). In production this would be Prisma.
interface GiftCard {
  code: string;
  balance: number;
  initial: number;
  expiresAt: string;
  status: "ACTIVE" | "REDEEMED" | "EXPIRED";
}

const GIFTCARDS: GiftCard[] = [
  { code: "ZRY-GC-10001", balance: 10000, initial: 10000, expiresAt: "2027-12-31", status: "ACTIVE" },
  { code: "ZRY-GC-25001", balance: 17500, initial: 25000, expiresAt: "2027-08-15", status: "ACTIVE" },
  { code: "ZRY-GC-50001", balance: 0, initial: 50000, expiresAt: "2027-06-30", status: "REDEEMED" },
  { code: "ZRY-GC-10002", balance: 5000, initial: 10000, expiresAt: "2026-01-15", status: "EXPIRED" },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        { error: "Please enter a gift card code." },
        { status: 400 }
      );
    }

    const card = GIFTCARDS.find((c) => c.code === code);

    if (!card) {
      return NextResponse.json(
        { error: "Gift card not found. Please check your code." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: card.code,
      balance: card.balance,
      initial: card.initial,
      expiresAt: card.expiresAt,
      status: card.status,
      redeemed: card.initial - card.balance,
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to check balance." }, { status: 500 });
  }
}
