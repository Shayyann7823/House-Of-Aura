"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { CartProvider } from "@/lib/cart-store";
import { StylistChatWidget } from "@/components/stylist-chat-widget"; // ⬅️ add this

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {children}
        <StylistChatWidget /> {/* ⬅️ add this */}
        <Toaster position="bottom-right" theme="light" />
      </CartProvider>
    </QueryClientProvider>
  );
}