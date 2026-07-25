"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
};

export type Customer = {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: Customer;
  paymentMethod: "cod" | "card";
  createdAt: string;
};

type OrdersState = {
  orders: Order[];
  lastCustomer: Customer | null;
  addOrder: (order: Order) => void;
};

/** Persisted order history + last-used customer details (so the checkout form can prefill next time). */
export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      lastCustomer: null,
      addOrder: (order) => set({ orders: [order, ...get().orders], lastCustomer: order.customer }),
    }),
    { name: "House of Aura-orders" }
  )
);

export function generateOrderId(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `HM-${Date.now().toString().slice(-6)}${rand}`;
}