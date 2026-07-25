import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getProduct, getRelated, formatPKR } from "@/lib/products";
import { ProductDetailClient } from "./product-detail-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  return {
    title: product ? `${product.name} — Heemia` : "Product — Heemia",
    description: product ? `${product.description} ${formatPKR(product.price)}` : "Shop Heemia.",
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const related = getRelated(product, 4);

  return (
    <>
      <SiteHeader transparent={false} />
      <ProductDetailClient product={product} related={related} />
      <SiteFooter />
    </>
  );
}