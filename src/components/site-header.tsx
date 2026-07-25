"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, ChevronDown, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { useFavorites } from "@/lib/favorites-store";
import { CATEGORIES } from "@/lib/products";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { AccountMenu } from "@/components/account-menu";

export function SiteHeader({ transparent = true }: { transparent?: boolean }) {
  const { count } = useCart();
  const { count: favCount } = useFavorites();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isSolid = scrolled || !transparent;


  const NavDropdown = ({
    label,
    eastern,
    western,
  }: {
    label: string;
    eastern: string;
    western: string;
  }) => (
    <div className="relative group/nav">
      <button className="flex items-center gap-1 hover:text-gold transition-colors">
        {label}
        <ChevronDown className="h-3 w-3" />
      </button>

      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible translate-y-1 group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 transition-all duration-200">
        <div className="flex flex-col min-w-[140px] rounded-md border border-border/60 bg-background text-foreground shadow-lg overflow-hidden">

          <Link
            href={`/shop/${eastern}`}
            className="px-4 py-2.5 text-sm hover:bg-muted hover:text-gold transition-colors"
          >
            Eastern
          </Link>

          <Link
            href={`/shop/${western}`}
            className="px-4 py-2.5 text-sm hover:bg-muted hover:text-gold transition-colors border-t border-border/40"
          >
            Western
          </Link>

        </div>
      </div>
    </div>
  );


  return (
    <header
      className={`${transparent ? "fixed" : "sticky"} top-0 inset-x-0 z-40 transition-all duration-300 ${
        !transparent
          ? "border-b border-border/60 bg-background text-foreground"
          : isSolid
          ? "top-2 mx-3 md:mx-6 rounded-full border border-border/60 bg-background/70 backdrop-blur-xl shadow-md text-foreground"
          : "bg-transparent text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]"
      }`}
    >

      {!isSolid && (
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none -z-10" />
      )}


      <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 md:px-8">


        {!isHome && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setOpen((v) => !v)}
                className="md:hidden p-2 -ml-2"
                aria-label="Menu"
              >
                {open ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </TooltipTrigger>

            <TooltipContent>
              Menu
            </TooltipContent>
          </Tooltip>
        )}



        <Link
          href="/"
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
          }}
          className="text-display text-2xl md:text-3xl font-semibold tracking-tight"
        >
          House of Aura
        </Link>




        {!isHome && (
          <nav className="hidden md:flex items-center gap-7 text-sm">

            <NavDropdown
              label="Women"
              eastern="women-eastern"
              western="women-western"
            />


            <NavDropdown
              label="Men"
              eastern="men-eastern"
              western="men-western"
            />


            <Link
              href="/shop/kids"
              className="hover:text-gold transition-colors"
            >
              Kids
            </Link>


            <Link
              href="/shop/accessories"
              className="hover:text-gold transition-colors"
            >
              Accessories
            </Link>


            <Link
              href="/shop/perfumes"
              className="hover:text-gold transition-colors"
            >
              Perfumes
            </Link>


            <Link
              href="/shop/jewellery"
              className="hover:text-gold transition-colors"
            >
              Jewellery
            </Link>


          </nav>
        )}






        <div className="flex items-center gap-1">


          <AccountMenu />



          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/favorites"
                className="relative p-2 hover:text-gold transition-colors"
                aria-label="Favourites"
              >

                <Heart className="h-5 w-5" />


                {favCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-gold-foreground anim-scale-in">
                    {favCount}
                  </span>
                )}

              </Link>
            </TooltipTrigger>

            <TooltipContent>
              Favourites
            </TooltipContent>

          </Tooltip>





          <Tooltip>
            <TooltipTrigger asChild>

              <Link
                href="/cart"
                className="relative p-2 hover:text-gold transition-colors"
                aria-label="Cart"
              >

                <ShoppingBag className="h-5 w-5" />


                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-gold-foreground anim-scale-in">
                    {count}
                  </span>
                )}

              </Link>

            </TooltipTrigger>

            <TooltipContent>
              Cart
            </TooltipContent>

          </Tooltip>


        </div>


      </div>







      {!isHome && open && (

        <div
          className={`md:hidden border-t anim-fade-in ${
            isSolid
              ? "border-border/60 bg-background text-foreground"
              : "border-white/15 bg-black/70 backdrop-blur-md text-white"
          }`}
        >

          <nav className="flex flex-col p-4 gap-1">


            {CATEGORIES.map((c) => (

              <Link
                key={c.slug}
                href={`/shop/${c.slug}`}
                onClick={() => setOpen(false)}
                className="py-2 text-sm border-b border-white/20 last:border-0"
              >
                {c.label}
              </Link>

            ))}



            {/* MOBILE VIRTUAL TRY ON */}

            <Link
              href="/try-on"
              onClick={() => setOpen(false)}
              className="py-2 text-sm border-b border-white/20"
            >
              Virtual Try-On
            </Link>



          </nav>


        </div>

      )}



    </header>
  );
}