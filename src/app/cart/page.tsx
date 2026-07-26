"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useCart } from "@/lib/cart-store";
import { formatPKR, getSizes } from "@/lib/products";
import { Minus, Plus, X, ShoppingBag, Sparkles, Truck, AlertCircle } from "lucide-react";

export default function CartPage() {
  const { items, setQty, setSize, remove, subtotal, count } = useCart();
  const shipping = subtotal > 10000 || subtotal === 0 ? 0 : 500;
  const total = subtotal + shipping;

  const itemsMissingSize = items.filter((i) => getSizes(i.product).length > 0 && !i.size);
  const canCheckout = itemsMissingSize.length === 0;

  return (
    <>
      <SiteHeader transparent={false} />
      <section className="mx-auto max-w-6xl px-4 md:px-8 py-16 min-h-[70vh]">
        <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Your bag</div>
        <h1 className="text-display text-5xl md:text-7xl mt-3 mb-12">Cart ({count})</h1>

        {items.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border">
            <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Your bag is empty.</p>
            <Link href="/" className="mt-6 inline-block bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-gold-foreground transition-colors">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-12">
            <div className="divide-y divide-border">
              {items.map(({ product, qty, size }) => {
                const sizeOptions = getSizes(product);
                const needsSize = sizeOptions.length > 0;
                const missingSize = needsSize && !size;

                return (
                  <div key={`${product.id}-${size ?? ""}`} className="flex gap-4 md:gap-6 py-6 anim-fade-up">
                    <img src={product.image} alt={product.name} className="w-24 md:w-32 aspect-[3/4] object-cover" />
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
                        </div>
                        <button onClick={() => remove(product.id, size)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {needsSize && (
                        <div className="mt-3">
                          <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                            Size
                          </label>
                          <select
                            value={size ?? ""}
                            onChange={(e) => setSize(product.id, size, e.target.value)}
                            className={`mt-1.5 block w-28 border bg-background px-2.5 py-2 text-sm transition-colors focus:outline-none focus:ring-1 ${
                              missingSize
                                ? "border-destructive focus:ring-destructive"
                                : "border-border focus:border-gold focus:ring-gold/40"
                            }`}
                          >
                            <option value="" disabled>
                              Select
                            </option>
                            {sizeOptions.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          {missingSize && (
                            <p className="mt-1 text-[11px] text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Please select a size
                            </p>
                          )}
                        </div>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="inline-flex items-center border border-border">
                          <button onClick={() => setQty(product.id, qty - 1, size)} className="p-2 hover:bg-muted" aria-label="Decrease">
                            <Minus className="h-3 w-3" />
                          </button>
                          <div className="w-10 text-center text-sm">{qty}</div>
                          <button onClick={() => setQty(product.id, qty + 1, size)} className="p-2 hover:bg-muted" aria-label="Increase">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-sm font-medium">{formatPKR(product.price * qty)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="relative overflow-hidden border border-border p-6 md:p-8 h-fit lg:sticky lg:top-24 bg-gradient-to-b from-gold/5 via-transparent to-transparent">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gold-grad" />

              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                Order summary
              </div>

              <div className="mt-6 space-y-3 text-sm">
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

              {shipping === 0 && subtotal > 0 && (
                <div className="mt-4 rounded-md bg-gold/10 border border-gold/20 px-3 py-2 text-[11px] text-gold flex items-center gap-2">
                  <Sparkles className="h-3 w-3 shrink-0" />
                  You've unlocked free shipping!
                </div>
              )}

              {canCheckout ? (
                <Link
                  href="/checkout"
                  className="mt-6 w-full inline-block text-center bg-primary text-primary-foreground py-4 text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-gold-foreground transition-colors"
                >
                  Checkout
                </Link>
              ) : (
                <button
                  disabled
                  className="mt-6 w-full bg-muted text-muted-foreground py-4 text-xs uppercase tracking-[0.25em] cursor-not-allowed"
                >
                  Select size to continue
                </button>
              )}

              {!canCheckout && (
                <p className="mt-3 text-[11px] text-destructive text-center flex items-center justify-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {itemsMissingSize.length} item{itemsMissingSize.length > 1 ? "s need" : " needs"} a size selected
                </p>
              )}

              <p className="mt-4 text-[11px] text-muted-foreground text-center">
                Cash on Delivery available. Enter delivery details on the next step.
              </p>
            </aside>
          </div>
        )}
      </section>
      <SiteFooter />
    </>
  );
}