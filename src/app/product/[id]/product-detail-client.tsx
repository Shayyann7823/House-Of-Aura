"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useFavorites } from "@/lib/favorites-store";
import { formatPKR, getImages, getSizes, type Product } from "@/lib/products";
import { SizeSelector } from "@/components/size-selector";
import { ProductReviews } from "@/components/product-reviews";
import { ProductCard } from "@/components/product-card";

export function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const images = getImages(product);
  const sizes = getSizes(product);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const { add } = useCart();
  const { toggle, isFavorite } = useFavorites();
  const favorite = isFavorite(product.id);

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      toast.error("Pehle size select karein");
      return;
    }
    add(product, selectedSize ?? undefined);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-10 md:py-16">
      {/* Breadcrumb */}
      <div className="text-xs text-muted-foreground mb-8 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href={`/shop/${product.category}`} className="hover:text-foreground capitalize">
          {product.category.replace("-", " ")}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative overflow-hidden rounded-md bg-muted" style={{ aspectRatio: "3 / 4" }}>
            <img
              src={images[activeImage]}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {product.tag && (
              <span className="absolute top-4 left-4 bg-background/90 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-widest">
                {product.tag}
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`relative overflow-hidden rounded-md bg-muted border-2 transition-colors ${
                    activeImage === i ? "border-gold" : "border-transparent"
                  }`}
                  style={{ aspectRatio: "3 / 4" }}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {product.category.replace("-", " ")}
          </div>
          <h1 className="text-display text-4xl md:text-5xl mt-3">{product.name}</h1>
          <div className="text-xl mt-4 font-medium">{formatPKR(product.price)}</div>

          <p className="mt-6 text-sm text-muted-foreground leading-relaxed">{product.description}</p>

         {sizes.length > 0 && (
            <div className="mt-8">
              <SizeSelector sizes={sizes} value={selectedSize} onChange={setSelectedSize} />
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-gold-foreground transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to cart
            </button>
            <button
              onClick={() => {
                toggle(product);
                toast.success(favorite ? "Removed from favourites" : "Added to favourites");
              }}
              aria-label="Toggle favourite"
              className="h-[52px] w-[52px] flex items-center justify-center border border-border hover:border-primary transition-colors"
            >
              <Heart className={`h-5 w-5 ${favorite ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-xs text-muted-foreground space-y-2">
            <p>Cash on Delivery available across Pakistan.</p>
            <p>Free shipping on orders above {formatPKR(10000)}.</p>
            <p>Easy exchange within 7 days of delivery.</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-20 md:mt-28 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">Reviews</div>
        <h2 className="text-display text-3xl mb-8">What customers say</h2>
        <ProductReviews productId={product.id} />
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-20 md:mt-28">
          <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">You may also like</div>
          <h2 className="text-display text-3xl mb-8">Complete the look</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}