"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatPKR } from "@/lib/products";
import { Package, Lock, Clock, Banknote, CreditCard, ChevronDown } from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  size?: string | null;
  image?: string | null;
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
  const [expanded, setExpanded] = useState<string | null>(null);

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

  const lifetimeSpend = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      <SiteHeader transparent={false} />
      <section className="mx-auto max-w-4xl px-4 md:px-8 py-16 min-h-[70vh]">
        <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Account</div>
        <div className="flex items-end justify-between flex-wrap gap-3">
          <h1 className="text-display text-5xl md:text-6xl mt-3 mb-12">My orders</h1>
          {orders.length > 0 && (
            <div className="mb-12 text-right">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Total spent</div>
              <div className="text-lg font-semibold text-gold">{formatPKR(lifetimeSpend)}</div>
            </div>
          )}
        </div>

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
            {orders.map((order) => {
              const isOpen = expanded === order.id;
              return (
                <div
                  key={order.id}
                  className="relative overflow-hidden border border-border transition-all hover:border-gold/40 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.3)]"
                >
                  <div className="absolute top-0 left-0 h-full w-1 bg-gold" />

                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="w-full text-left p-6 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {order.items.slice(0, 3).map((item) =>
                          item.image ? (
                            <img
                              key={item.id}
                              src={item.image}
                              alt={item.name}
                              className="h-10 w-10 rounded-full object-cover border-2 border-background"
                            />
                          ) : (
                            <div
                              key={item.id}
                              className="h-10 w-10 rounded-full bg-muted border-2 border-background flex items-center justify-center"
                            >
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )
                        )}
                        {order.items.length > 3 && (
                          <div className="h-10 w-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-sm font-medium">{order.orderNumber}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(order.createdAt).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {" · "}
                          {order.items.length} item{order.items.length > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest border border-amber-500/30 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full">
                        <Clock className="h-3 w-3" />
                        {order.status}
                      </span>
                      <span className="text-base font-semibold text-gold whitespace-nowrap">
                        {formatPKR(order.total)}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6">
                        <div className="space-y-3 divide-y divide-border border-t border-border pt-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 text-sm pt-3 first:pt-0">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-12 w-12 rounded-md object-cover shrink-0"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center shrink-0">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                              <span className="flex-1">
                                {item.name}
                                {item.size ? ` (${item.size})` : ""} × {item.qty}
                              </span>
                              <span className="whitespace-nowrap">{formatPKR(item.price * item.qty)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gold/20 flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            {order.paymentMethod === "cod" ? (
                              <Banknote className="h-3.5 w-3.5" />
                            ) : (
                              <CreditCard className="h-3.5 w-3.5" />
                            )}
                            {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                          </span>
                          <span className="text-base font-semibold text-gold">{formatPKR(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <SiteFooter />
    </>
  );
}