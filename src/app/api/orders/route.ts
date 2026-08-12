import { NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { db } from "@/lib/db";

interface OrderItemPayload {
  productId?: string;
  slug?: string;
  name?: string;
  price?: number;
  image?: string;
  color?: string;
  size?: string;
  quantity?: number;
  stock?: number;
}

interface CreateOrderBody {
  customerName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  notes?: string;
  items?: OrderItemPayload[];
  subtotal?: number;
  discount?: number;
  shipping?: number;
  total?: number;
  couponCode?: string | null;
  paymentMethod?: string;
}

function generateOrderNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ZRY-${ymd}-${rand}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as CreateOrderBody | null;

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Basic required field validation
    const required = {
      customerName: body.customerName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
    };

    for (const [key, value] of Object.entries(required)) {
      if (!value || typeof value !== "string" || !value.trim()) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${key}` },
          { status: 400 }
        );
      }
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    const subtotal = Math.max(0, Math.round(Number(body.subtotal) || 0));
    const discount = Math.max(0, Math.round(Number(body.discount) || 0));
    const shipping = Math.max(0, Math.round(Number(body.shipping) || 0));
    const total = Math.max(
      0,
      Math.round(Number(body.total) || subtotal - discount + shipping)
    );

    const orderNumber = generateOrderNumber();

    const order = await db.order.create({
      data: {
        orderNumber,
        customerName: body.customerName!.trim(),
        email: body.email!.trim().toLowerCase(),
        phone: body.phone!.trim(),
        address: body.address!.trim(),
        city: body.city!.trim(),
        state: body.state!.trim(),
        pincode: body.pincode!.trim(),
        country: (body.country || "India").trim(),
        notes: body.notes?.trim() || null,
        itemsJson: JSON.stringify(body.items),
        subtotal,
        discount,
        shipping,
        total,
        couponCode: body.couponCode?.trim() || null,
        paymentMethod: body.paymentMethod || "COD",
        status: "PENDING",
      },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[API_ORDERS_POST]", err);

    if (err instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          success: false,
          error: "Database constraint error",
          code: err.code,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        email: true,
        total: true,
        status: true,
        paymentMethod: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ orders, count: orders.length });
  } catch (err) {
    console.error("[API_ORDERS_GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
