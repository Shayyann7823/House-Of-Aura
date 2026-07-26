import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="text-display text-3xl">House of Aura</div>
          <p className="mt-3 text-sm opacity-70 leading-relaxed">
            Timeless Pakistani craft, modern silhouettes. Made with intention in Lahore, Karachi and Islamabad.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] opacity-60 mb-4">Shop</div>
          <ul className="space-y-3 text-sm opacity-90">
            <li className="group">
              <div className="cursor-default">Women</div>
              <ul className="ml-3 space-y-1 text-xs opacity-80 max-h-0 overflow-hidden group-hover:max-h-20 group-hover:mt-1.5 transition-all duration-300 ease-in-out">
                <li>
                  <Link href="/shop/women-eastern" className="hover:opacity-70 transition-opacity">
                    Eastern
                  </Link>
                </li>
                <li>
                  <Link href="/shop/women-western" className="hover:opacity-70 transition-opacity">
                    Western
                  </Link>
                </li>
              </ul>
            </li>
            <li className="group">
              <div className="cursor-default">Men</div>
              <ul className="ml-3 space-y-1 text-xs opacity-80 max-h-0 overflow-hidden group-hover:max-h-20 group-hover:mt-1.5 transition-all duration-300 ease-in-out">
                <li>
                  <Link href="/shop/men-eastern" className="hover:opacity-70 transition-opacity">
                    Eastern
                  </Link>
                </li>
                <li>
                  <Link href="/shop/men-western" className="hover:opacity-70 transition-opacity">
                    Western
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/shop/kids" className="hover:opacity-70 transition-opacity">
                Kids
              </Link>
            </li>
            <li>
              <Link href="/shop/jewellery" className="hover:opacity-70 transition-opacity">
                Jewellery
              </Link>
            </li>
            <li>
              <Link href="/shop/accessories" className="hover:opacity-70 transition-opacity">
                Accessories
              </Link>
            </li>
            <li>
              <Link href="/shop/perfumes" className="hover:opacity-70 transition-opacity">
                Perfumes
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] opacity-60 mb-4">Help</div>
          <ul className="space-y-2 text-sm opacity-60">
            <li className="cursor-not-allowed" title="Not available at the moment">
              Shipping & Returns <span className="text-[10px] opacity-60">(Coming soon)</span>
            </li>
            <li className="cursor-not-allowed" title="Not available at the moment">
              Size Guide <span className="text-[10px] opacity-60">(Coming soon)</span>
            </li>
            <li className="cursor-not-allowed" title="Not available at the moment">
              Contact <span className="text-[10px] opacity-60">(Coming soon)</span>
            </li>
            <li className="cursor-not-allowed" title="Not available at the moment">
              FAQ <span className="text-[10px] opacity-60">(Coming soon)</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-6 text-center text-xs opacity-60">
        © {new Date().getFullYear()} House of Aura. All rights reserved.
      </div>
    </footer>
  );
}