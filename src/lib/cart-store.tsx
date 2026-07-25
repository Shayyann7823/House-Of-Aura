"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./products";

export type CartItem = { product: Product; qty: number; size?: string };

type Ctx = {
  items: CartItem[];
  add: (p: Product, size?: string, qty?: number) => void;
  remove: (id: string, size?: string) => void;
  setQty: (id: string, qty: number, size?: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "heemia-cart-v2";

// A cart line is unique per product id + size (same product, different size = separate line).
const lineKey = (id: string, size?: string) => (size ? `${id}::${size}` : id);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const value = useMemo<Ctx>(
    () => ({
      items,
      add: (p, size, qty = 1) =>
        setItems((prev) => {
          const key = lineKey(p.id, size);
          const found = prev.find((i) => lineKey(i.product.id, i.size) === key);
          if (found) {
            return prev.map((i) => (lineKey(i.product.id, i.size) === key ? { ...i, qty: i.qty + qty } : i));
          }
          return [...prev, { product: p, qty, size }];
        }),
      remove: (id, size) => setItems((prev) => prev.filter((i) => lineKey(i.product.id, i.size) !== lineKey(id, size))),
      setQty: (id, qty, size) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => lineKey(i.product.id, i.size) !== lineKey(id, size))
            : prev.map((i) => (lineKey(i.product.id, i.size) === lineKey(id, size) ? { ...i, qty } : i))
        ),
      clear: () => setItems([]),
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.qty * i.product.price, 0),
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}