import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST — create Razorpay order (mock for demo — in production use razorpay SDK)
export async function POST(req: Request) {
  try {
    const { amount, orderId, customerName, email, phone } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // In production:
    // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
    // const order = await razorpay.orders.create({ amount: amount * 100, currency: "INR", receipt: orderId })

    // For demo — generate mock Razorpay order
    const razorpayOrderId = `rzp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    return NextResponse.json({
      success: true,
      orderId: razorpayOrderId,
      amount: amount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_DEMO_KEY",
      customerName,
      email,
      phone,
      // In production, return real Razorpay order object
      note: "Demo mode — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env for real payments",
    });
  } catch (e) {
    console.error("razorpay error", e);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}

// GET — payment status (mock)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("paymentId");
  if (!paymentId) return NextResponse.json({ error: "paymentId required" }, { status: 400 });

  // In production: verify payment with Razorpay API
  return NextResponse.json({
    success: true,
    paymentId,
    status: "captured",
    method: "upi",
    note: "Demo mode — real verification needs Razorpay SDK",
  });
}
