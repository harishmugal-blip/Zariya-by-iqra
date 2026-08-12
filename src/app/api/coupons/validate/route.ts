import { NextResponse } from "next/server";
import { COUPONS } from "@/data/catalog";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.code !== "string") {
      return NextResponse.json(
        { valid: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    const code = body.code.trim().toUpperCase();
    const subtotal =
      typeof body.subtotal === "number" && Number.isFinite(body.subtotal)
        ? body.subtotal
        : 0;

    const coupon = COUPONS.find((c) => c.code.toUpperCase() === code);

    if (!coupon) {
      return NextResponse.json(
        {
          valid: false,
          message: `Coupon "${code}" does not exist. Please check and try again.`,
        },
        { status: 400 }
      );
    }

    if (subtotal < coupon.minOrder) {
      return NextResponse.json(
        {
          valid: false,
          message: `This coupon requires a minimum order of ₹${coupon.minOrder.toLocaleString(
            "en-IN"
          )}. Your current subtotal is ₹${subtotal.toLocaleString("en-IN")}.`,
        },
        { status: 400 }
      );
    }

    const discount =
      coupon.type === "percent"
        ? Math.round((subtotal * coupon.value) / 100)
        : Math.min(coupon.value, subtotal);

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrder: coupon.minOrder,
        description: coupon.description,
      },
      discount,
      message: `Coupon applied — ${coupon.description}`,
    });
  } catch (err) {
    console.error("[API_COUPONS_VALIDATE_POST]", err);
    return NextResponse.json(
      { valid: false, message: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
