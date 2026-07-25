import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { getByCategory, getCategory, type Category } from "@/lib/products";

type PageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category as Category);
  return {
    title: `${c?.label ?? "Shop"} — Heemia`,
    description: c?.blurb ?? "Shop Heemia.",
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug as Category);
  if (!category) notFound();

  const products = getByCategory(category.slug);

  return (
    <>
      <SiteHeader />
      <section className="relative h-[50vh] min-h-[380px] overflow-hidden">
        <img src={category.image} alt={category.label} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 h-full flex flex-col justify-end pb-12">
          <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground anim-fade-up">
            The collection
          </div>
          <h1 className="text-display text-6xl md:text-8xl mt-4 anim-fade-up" style={{ animationDelay: "100ms" }}>
            {category.label}
          </h1>
          <p className="mt-3 text-muted-foreground anim-fade-up" style={{ animationDelay: "200ms" }}>{category.blurb}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-16">
        {products.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">No products yet — check back soon.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </>
  );
}
