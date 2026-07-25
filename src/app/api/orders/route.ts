import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { items, subtotal, shipping, total, customer, paymentMethod } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!customer?.fullName || !customer?.phone || !customer?.address || !customer?.city) {
      return NextResponse.json({ error: "Delivery details incomplete" }, { status: 400 });
    }

    const orderNumber = `HM-${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.userId,
        subtotal,
        shipping,
        total,
        fullName: customer.fullName,
        phone: customer.phone,
        email: customer.email || null,
        address: customer.address,
        city: customer.city,
        notes: customer.notes || null,
        paymentMethod,
       items: {
  create: items.map((it: any) => ({
    productId: it.productId,
    name: it.name,
    price: it.price,
    qty: it.qty,
    size: it.size || null,
    image: it.image || null,
  })),
},
      },
      include: { items: true },
    });

    return NextResponse.json({ order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Order place nahi ho saka, dobara try karein" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}