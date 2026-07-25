"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./products";

type FavoritesState = {
  ids: string[];
  count: number;
  toggle: (product: Product) => void;
  isFavorite: (id: string) => boolean;
  clear: () => void;
};

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      count: 0,
      toggle: (product) => {
        const exists = get().ids.includes(product.id);
        const next = exists
          ? get().ids.filter((id) => id !== product.id)
          : [...get().ids, product.id];
        set({ ids: next, count: next.length });
      },
      isFavorite: (id) => get().ids.includes(id),
      clear: () => set({ ids: [], count: 0 }),
    }),
    { name: "House of Aura-favorites" }
  )
);