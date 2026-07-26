"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useCart } from "@/lib/cart-store";
import { formatPKR } from "@/lib/products";
import { useOrders, type Customer } from "@/lib/orders-store";
import { CheckCircle2, ShoppingBag, Lock, Loader2, Banknote, CreditCard, Sparkles, Truck } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { lastCustomer } = useOrders();

  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .finally(() => setAuthChecked(true));
  }, []);

  const [fullName, setFullName] = useState(lastCustomer?.fullName ?? "");
  const [phone, setPhone] = useState(lastCustomer?.phone ?? "");
  const [email, setEmail] = useState(lastCustomer?.email ?? "");
  const [address, setAddress] = useState(lastCustomer?.address ?? "");
  const [city, setCity] = useState(lastCustomer?.city ?? "");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placedOrder, setPlacedOrder] = useState<{ id: string; orderNumber: string; total: number; paymentMethod: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const shipping = subtotal > 10000 || subtotal === 0 ? 0 : 500;
  const total = subtotal + shipping;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = "Naam likhein";
    if (!phone.trim() || phone.trim().length < 10) next.phone = "Valid phone number likhein";
    if (!address.trim()) next.address = "Address likhein";
    if (!city.trim()) next.city = "City likhein";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrder = async () => {
    if (!user) return;
    if (!validate()) return;
    setSubmitError("");
    setSubmitting(true);
    const customer: Customer = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim(),
      city: city.trim(),
      notes: notes.trim() || undefined,
    };
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ product, qty, size }) => ({
            productId: product.id,
            name: product.name,
            price: product.price,
            qty,
            size,
          })),
          subtotal,
          shipping,
          total,
          customer,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Order place nahi ho saka, dobara try karein");
        setSubmitting(false);
        return;
      }
      clear();
      setPlacedOrder({
        id: data.order.id,
        orderNumber: data.order.orderNumber,
        total: data.order.total,
        paymentMethod: data.order.paymentMethod,
      });
    } catch (err) {
      setSubmitError("Network error, dobara try karein");
    } finally {
      setSubmitting(false);
    }
  };

  if (!authChecked) {
    return (
      <>
        <SiteHeader transparent={false} />
        <section className="mx-auto max-w-xl px-4 md:px-8 py-24 text-center min-h-[60vh]" />
        <SiteFooter />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <SiteHeader transparent={false} />
        <section className="mx-auto max-w-xl px-4 md:px-8 py-24 text-center min-h-[60vh]">
          <Lock className="h-10 w-10 mx-auto text-muted-foreground" />
          <h1 className="text-display text-4xl mt-6">Login required</h1>
          <p className="mt-3 text-muted-foreground">
            Order place karne ke liye pehle apna account banayein ya login karein.
          </p>
          <Link
            href="/auth?redirect=/checkout"
            className="mt-8 inline-block bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-gold-foreground transition-colors"
          >
            Sign in / Create account
          </Link>
        </section>
        <SiteFooter />
      </>
    );
  }

  if (placedOrder) {
    return (
      <>
        <SiteHeader transparent={false} />
        <section className="mx-auto max-w-xl px-4 md:px-8 py-24 text-center min-h-[60vh]">
          <div className="relative inline-flex">
            <CheckCircle2 className="h-12 w-12 mx-auto text-gold" />
            <span className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
          </div>
          <h1 className="text-display text-4xl mt-6">Order placed!</h1>
          <p className="mt-3 text-muted-foreground">
            Order ID: <span className="text-foreground font-medium">{placedOrder.orderNumber}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {placedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"} — Total{" "}
            <span className="text-gold font-semibold">{formatPKR(placedOrder.total)}</span>
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-gold-foreground transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        </section>
        <SiteFooter />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <SiteHeader transparent={false} />
        <section className="mx-auto max-w-xl px-4 md:px-8 py-24 text-center min-h-[60vh]">
          <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Your bag is empty.</p>
          <Link
            href="/"
            className="mt-6 inline-block bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-gold-foreground transition-colors"
          >
            Start shopping
          </Link>
        </section>
        <SiteFooter />
      </>
    );
  }

  const inputClass = (field: string) =>
    `mt-2 w-full border bg-background px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-1 ${
      errors[field]
        ? "border-destructive focus:ring-destructive"
        : "border-border focus:border-gold focus:ring-gold/40"
    }`;

  return (
    <>
      <SiteHeader transparent={false} />
      <section className="mx-auto max-w-6xl px-4 md:px-8 py-16 min-h-[70vh]">
        <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Checkout</div>
        <h1 className="text-display text-5xl md:text-6xl mt-3 mb-12">Delivery details</h1>

        <div className="grid lg:grid-cols-[1fr_360px] gap-12">
          <div className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ayesha Khan"
                className={inputClass("fullName")}
              />
              {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  placeholder="03xx-xxxxxxx"
                  inputMode="numeric"
                  maxLength={11}
                  className={inputClass("phone")}
                />
                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Email (optional)</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass("email")}
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House #, Street, Area"
                className={inputClass("address")}
              />
              {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Lahore"
                className={inputClass("city")}
              />
              {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Order notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-1 focus:border-gold focus:ring-gold/40"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Payment method</label>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`relative flex items-center gap-3 border px-4 py-3.5 text-sm transition-all ${
                    paymentMethod === "cod"
                      ? "border-gold bg-gold/10 shadow-[0_0_0_1px_theme(colors.gold)]"
                      : "border-border hover:border-gold/40"
                  }`}
                >
                  <Banknote className={`h-4 w-4 ${paymentMethod === "cod" ? "text-gold" : "text-muted-foreground"}`} />
                  <span>Cash on Delivery</span>
                  {paymentMethod === "cod" && (
                    <CheckCircle2 className="h-4 w-4 text-gold absolute right-3" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`relative flex items-center gap-3 border px-4 py-3.5 text-sm transition-all ${
                    paymentMethod === "card"
                      ? "border-gold bg-gold/10 shadow-[0_0_0_1px_theme(colors.gold)]"
                      : "border-border hover:border-gold/40"
                  }`}
                >
                  <CreditCard className={`h-4 w-4 ${paymentMethod === "card" ? "text-gold" : "text-muted-foreground"}`} />
                  <span>Online Payment</span>
                  {paymentMethod === "card" && (
                    <CheckCircle2 className="h-4 w-4 text-gold absolute right-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <aside className="relative overflow-hidden border border-border p-6 md:p-8 h-fit lg:sticky lg:top-24 bg-gradient-to-b from-gold/5 via-transparent to-transparent">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gold-grad" />

            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Order summary
            </div>

            <div className="mt-6 space-y-3 divide-y divide-border">
              {items.map(({ product, qty, size }) => (
                <div key={`${product.id}-${size ?? ""}`} className="flex justify-between text-sm pt-3 first:pt-0">
                  <span>
                    {product.name}
                    {size ? ` (${size})` : ""} × {qty}
                  </span>
                  <span className="whitespace-nowrap">{formatPKR(product.price * qty)}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-sm border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" />
                  Shipping
                </span>
                <span className={shipping === 0 ? "text-gold font-medium" : ""}>
                  {shipping === 0 ? "Free" : formatPKR(shipping)}
                </span>
              </div>
              <div className="border-t border-gold/30 pt-3 flex justify-between items-baseline text-base">
                <span className="font-medium">Total</span>
                <span className="text-lg font-semibold text-gold">{formatPKR(total)}</span>
              </div>
            </div>

            {shipping === 0 && (
              <div className="mt-4 rounded-md bg-gold/10 border border-gold/20 px-3 py-2 text-[11px] text-gold flex items-center gap-2">
                <Sparkles className="h-3 w-3 shrink-0" />
                You've unlocked free shipping!
              </div>
            )}

            {submitError && <p className="mt-4 text-xs text-destructive">{submitError}</p>}

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={placeOrder}
                  disabled={submitting}
                  className="mt-6 w-full bg-primary text-primary-foreground py-4 text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-gold-foreground transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? "Placing order..." : "Place order"}
                </button>
              </TooltipTrigger>
              <TooltipContent>Confirm and place your order</TooltipContent>
            </Tooltip>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}