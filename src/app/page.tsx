"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SocialLinks } from "@/components/social-links";
import { FounderCarousel } from "@/components/founder-carousel";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { LazyVideo } from "@/components/lazy-video";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.tag === "New").slice(0, 8);
  const editorial = PRODUCTS.slice(0, 3);

  // glow ko ref se control karo, setState se nahi -> re-render nahi hoga
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let pending: { x: number; y: number } | null = null;

    const apply = () => {
      if (pending && glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle 320px at ${pending.x}% ${pending.y}%, rgba(212,175,55,0.35), transparent 70%)`;
      }
      raf = 0;
    };

    const onMove = (e: MouseEvent) => {
      pending = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* global cursor glow, sits above everything, blends with page content */}
      <div
        ref={glowRef}
        className="fixed inset-0 z-30 pointer-events-none mix-blend-soft-light"
        style={{
          background: "radial-gradient(circle 320px at 50% 50%, rgba(212,175,55,0.35), transparent 70%)",
          willChange: "background",
        }}
      />

      <SiteHeader />

      {/* HERO */}
      <section className="relative min-h-[92vh] overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover"
            style={{ objectPosition: "center 65%" }}
            src="/videos/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 pt-40 md:pt-48 pb-24">
          <h1 className="mt-6 text-display text-[15vw] md:text-[9vw] leading-[0.9] font-semibold anim-fade-up" style={{ animationDelay: "150ms" }}>
            Woven <em className="text-gold not-italic">in</em>
            <br />
            heritage.
          </h1>
          <p className="mt-8 max-w-md text-base md:text-lg text-muted-foreground anim-fade-up" style={{ animationDelay: "400ms" }}>
            <strong>The Modern Pakistani Wardrobe</strong> <em>Designed for today, made to last</em>
          </p>
          <div className="mt-10 flex flex-wrap gap-3 anim-fade-up" style={{ animationDelay: "600ms" }}>
            <Link
              href="#categories"
              scroll={true}
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-gold-foreground transition-colors"
            >
              Discover collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/shop/accessories"
              className="inline-flex items-center gap-2 border border-foreground/30 px-8 py-4 text-xs uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors"
            >
              Discover accessories
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-border overflow-hidden py-2 bg-primary text-primary-foreground">
        <div className="flex whitespace-nowrap anim-marquee">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex items-center gap-16 pr-16">
              {["New Arrivals Every Week", "Free Shipping Over PKR 10,000", "Autumn / Winter '26"].map((t, i) => (
                <span key={`${k}-${i}`} className="text-display text-lg md:text-2xl italic opacity-90">
                  {t} <span className="text-gold mx-4">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <Reveal>
        <section id="categories" className="mx-auto max-w-7xl px-4 md:px-8 py-24 md:py-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Explore</div>
              <h2 className="text-display text-5xl md:text-7xl mt-3">The edit.</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {CATEGORIES.map((c, i) => (
              <Link
                key={c.slug}
                href={`/shop/${c.slug}`}
                className="group relative aspect-[3/4] overflow-hidden bg-muted anim-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <img
                  src={c.image}
                  alt={c.label}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 text-primary-foreground">
                  <div className="text-display text-xl md:text-2xl">{c.label}</div>
                  <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-80 mt-1">{c.blurb}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      {/* FEATURED */}
      <Reveal>
        <section className="mx-auto max-w-7xl px-4 md:px-8 py-16">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Just landed</div>
              <h2 className="text-display text-5xl md:text-7xl mt-3">New arrivals.</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      </Reveal>

      {/* EDITORIAL — video in a framed box beside text */}
      <Reveal>
        <section className="bg-primary text-primary-foreground py-24 md:py-32 mt-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.4em] text-gold">Our craft</div>
              <h2 className="text-display text-5xl md:text-8xl mt-6 leading-[0.95]">
                Made slowly, <em className="text-gold not-italic">so it lasts</em>.
              </h2>
              <p className="mt-8 max-w-lg text-primary-foreground/70 leading-relaxed">
                Every House of Aura piece begins in the workshops of Lahore, Karachi and Islamabad — cut, embroidered and finished by hand. We work in small batches, choose natural fibres, and pay our artisans fairly.
              </p>
            </div>
            <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-md overflow-hidden border border-gold/20">
              <LazyVideo src="/videos/homepagedown.mp4" className="h-full w-full" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
            </div>
          </div>
        </section>
      </Reveal>

      {/* FOUNDER'S NOTE */}
      <Reveal>
        <section className="mx-auto max-w-7xl px-4 md:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <FounderCarousel />
            <div>
              <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                A note from our founder
              </div>
              <h2 className="text-display text-4xl md:text-6xl mt-6 leading-[1.1]">
                "Every thread carries <em className="text-gold not-italic">a story</em>.
                I wanted House of Aura to carry ours."
              </h2>
              
              <div className="mt-8">
                <div className="text-sm font-medium">MIRZA SHAYYAN BAIG</div>
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1">
                  Founder
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* SOCIAL */}
      <Reveal>
        <section className="py-16 md:py-20 border-t border-border">
          <SocialLinks />
        </section>
      </Reveal>

      <SiteFooter />
    </>
  );
}