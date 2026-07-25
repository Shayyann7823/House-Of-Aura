"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatPKR } from "@/lib/products";
import { Package, Lock } from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  size?: string | null;
};

type Order = {
  id: string;
  orderNumber: string;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrderHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then(async (r) => {
        if (r.status === 401) {
          setUnauthorized(true);
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d?.orders) setOrders(d.orders);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <SiteHeader transparent={false} />
        <section className="mx-auto max-w-4xl px-4 md:px-8 py-24 min-h-[60vh]" />
        <SiteFooter />
      </>
    );
  }

  if (unauthorized) {
    return (
      <>
        <SiteHeader transparent={false} />
        <section className="mx-auto max-w-xl px-4 md:px-8 py-24 text-center min-h-[60vh]">
          <Lock className="h-10 w-10 mx-auto text-muted-foreground" />
          <h1 className="text-display text-4xl mt-6">Login required</h1>
          <p className="mt-3 text-muted-foreground">Apne orders dekhne ke liye login karein.</p>
          <Link
            href="/auth?redirect=/account/orders"
            className="mt-8 inline-block bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-gold-foreground transition-colors"
          >
            Sign in
          </Link>
        </section>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader transparent={false} />
      <section className="mx-auto max-w-4xl px-4 md:px-8 py-16 min-h-[70vh]">
        <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Account</div>
        <h1 className="text-display text-5xl md:text-6xl mt-3 mb-12">My orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <Package className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Abhi tak koi order nahi hai.</p>
            <Link
              href="/"
              className="mt-6 inline-block bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-gold-foreground transition-colors"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-border p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{order.orderNumber}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest border border-border px-3 py-1 rounded-full">
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 divide-y divide-border">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm pt-2 first:pt-0">
                      <span>
                        {item.name}
                        {item.size ? ` (${item.size})` : ""} × {item.qty}
                      </span>
                      <span className="whitespace-nowrap">{formatPKR(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm font-medium">
                  <span>Total ({order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"})</span>
                  <span>{formatPKR(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </>
  );
}