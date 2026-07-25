import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="text-display text-3xl">HEEMIA</div>
          <p className="mt-3 text-sm opacity-70 leading-relaxed">
            Timeless Pakistani craft, modern silhouettes. Made with intention in Lahore, Karachi and Islamabad.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] opacity-60 mb-4">Shop</div>
         <ul className="space-y-2 text-sm opacity-90">
  <li>Women</li>
  <li>Men</li>
  <li>Kids</li>
  <li>Jewellery</li>
</ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] opacity-60 mb-4">Help</div>
          <ul className="space-y-2 text-sm opacity-90">
            <li>Shipping & Returns</li>
            <li>Size Guide</li>
            <li>Contact</li>
            <li>FAQ</li>
          </ul>
        </div>
       
      </div>
      <div className="border-t border-primary-foreground/10 py-6 text-center text-xs opacity-60">
  © {new Date().getFullYear()} Heemia. All rights reserved. 
</div>
    </footer>
  );
}
