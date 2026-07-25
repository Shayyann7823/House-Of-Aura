"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { useFavorites } from "@/lib/favorites-store";
import { PRODUCTS } from "@/lib/products";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const { ids } = useFavorites();
  const items = PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <>
      <SiteHeader transparent={false} />
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-16 min-h-[70vh]">
        <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Saved for later</div>
        <h1 className="text-display text-5xl md:text-7xl mt-3 mb-12">Favourites ({items.length})</h1>

        {items.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border">
            <Heart className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No favourites yet.</p>
            <Link href="/" className="mt-6 inline-block bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-gold-foreground transition-colors">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </>
  );
}