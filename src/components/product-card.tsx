"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { useFavorites } from "@/lib/favorites-store";
import { formatPKR, getSizes, type Product } from "@/lib/products";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart();
  const { toggle, isFavorite } = useFavorites();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const favorite = mounted && isFavorite(product.id);
  const sizes = getSizes(product);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative anim-fade-up block"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative overflow-hidden rounded-md bg-muted" style={{ aspectRatio: "3 / 4" }}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
        />
        {product.tag && (
          <span className="absolute top-3 left-3 bg-background/90 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-widest">
            {product.tag}
          </span>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle(product);
                toast.success(favorite ? "Removed from favourites" : "Added to favourites");
              }}
              aria-label={favorite ? "Remove from favourites" : "Add to favourites"}
              className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-background/90 backdrop-blur hover:scale-110 transition-transform duration-200"
              suppressHydrationWarning
            >
              <Heart
                className={`h-4 w-4 transition-colors duration-200 ${favorite ? "fill-red-500 text-red-500" : "text-foreground"}`}
                suppressHydrationWarning
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>{favorite ? "Remove from favourites" : "Add to favourites"}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (sizes.length > 0) {
                  router.push(`/product/${product.id}`);
                  return;
                }
                add(product);
                toast.success(`${product.name} added to cart`);
              }}
              className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-primary text-primary-foreground py-3 text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-gold-foreground"
            >
              {sizes.length > 0 ? "Shop Now" : "Add to cart"}
            </button>
          </TooltipTrigger>
          <TooltipContent>{sizes.length > 0 ? "Choose a size first" : "Add this item to your bag"}</TooltipContent>
        </Tooltip>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium">{product.name}</h3>
        <div className="text-sm font-medium whitespace-nowrap">{formatPKR(product.price)}</div>
      </div>
    </Link>
  );
}