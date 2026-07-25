"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useCart } from "@/lib/cart-store";
import { formatPKR } from "@/lib/products";
import { useOrders, type Customer } from "@/lib/orders-store";
import { CheckCircle2, ShoppingBag, Lock, Loader2 } from "lucide-react";
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
          <CheckCircle2 className="h-12 w-12 mx-auto text-gold" />
          <h1 className="text-display text-4xl mt-6">Order placed!</h1>
          <p className="mt-3 text-muted-foreground">
            Order ID: <span className="text-foreground font-medium">{placedOrder.orderNumber}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {placedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"} — Total{" "}
            {formatPKR(placedOrder.total)}
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
    `mt-2 w-full border bg-background px-3 py-2.5 text-sm ${
      errors[field] ? "border-destructive" : "border-border"
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
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Full name</label>
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
  <label className="text-xs uppercase tracking-widest text-muted-foreground">Phone</label>
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
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Email (optional)</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass("email")}
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House #, Street, Area"
                className={inputClass("address")}
              />
              {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Lahore"
                className={inputClass("city")}
              />
              {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Order notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Payment method</label>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex-1 border px-4 py-3 text-sm transition-colors ${
                    paymentMethod === "cod" ? "border-primary bg-muted" : "border-border"
                  }`}
                >
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 border px-4 py-3 text-sm transition-colors ${
                    paymentMethod === "card" ? "border-primary bg-muted" : "border-border"
                  }`}
                >
                  Online Payement
                </button>
              </div>
            </div>
          </div>

          <aside className="border border-border p-6 md:p-8 h-fit lg:sticky lg:top-24">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Order summary</div>
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPKR(shipping)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-base font-medium">
                <span>Total</span>
                <span>{formatPKR(total)}</span>
              </div>
            </div>
            {submitError && <p className="mt-4 text-xs text-destructive">{submitError}</p>}
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