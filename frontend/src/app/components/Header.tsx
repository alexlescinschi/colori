"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CartItem } from "@/lib/strapi";
import { getWishlistCountSync, getWishlistItems, wishlistEventName } from "@/lib/wishlist";

function getCartCountFromStorage() {
  if (typeof window === "undefined") {
    return 0;
  }

  const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(() => getCartCountFromStorage());
  const [wishlistCount, setWishlistCount] = useState(() => getWishlistCountSync());

  useEffect(() => {
    const syncCounters = () => {
      setCartCount(getCartCountFromStorage());
      setWishlistCount(getWishlistCountSync());
    };

    const syncWishlistFromServer = async () => {
      const items = await getWishlistItems();
      setWishlistCount(items.length);
    };

    window.addEventListener("cartUpdated", syncCounters);
    window.addEventListener(wishlistEventName, syncCounters);
    window.addEventListener("authChanged", syncWishlistFromServer);

    void syncWishlistFromServer();

    return () => {
      window.removeEventListener("cartUpdated", syncCounters);
      window.removeEventListener(wishlistEventName, syncCounters);
      window.removeEventListener("authChanged", syncWishlistFromServer);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[#5e000e] px-4 py-2 text-center text-xs tracking-[0.12em] text-white uppercase md:text-sm">
        Livrare gratuita pentru comenzi peste 299 MDL
      </div>

      <div className="border-b border-zinc-800 bg-black text-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center border border-zinc-700"
            aria-label="Meniu"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeWidth="1.7" d="M6 6l12 12M18 6l-12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>

          <Link href="/" className="brand-serif text-3xl tracking-[0.35em] md:text-4xl">
            COLORI
          </Link>

          <nav className="hidden items-center gap-8 text-sm tracking-[0.12em] uppercase md:flex">
            <Link href="/" className="transition hover:text-zinc-300">Acasă</Link>
            <Link href="/search" className="transition hover:text-zinc-300">Produse</Link>
            <Link href="/despre-noi" className="transition hover:text-zinc-300">Despre noi</Link>
            <Link href="/academie" className="transition hover:text-zinc-300">Academie</Link>
            <Link href="/contacte" className="transition hover:text-zinc-300">Contacte</Link>
          </nav>

          <div suppressHydrationWarning className="flex items-center gap-3 md:gap-4">
            <Link href="/account" className="icon-link" aria-label="Contul meu">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <circle cx="12" cy="8" r="4" strokeWidth="1.6" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="1.6" />
              </svg>
            </Link>

            <Link href="/wishlist" className="icon-link relative" aria-label="Favorite">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <path d="M12 21s-6.716-4.21-9.193-8.233C.839 9.722 2.19 5.75 5.842 4.62c2.084-.645 4.17.033 5.452 1.738 1.284-1.705 3.369-2.383 5.453-1.738 3.651 1.13 5.002 5.102 3.035 8.147C18.707 16.79 12 21 12 21z" strokeWidth="1.6" />
              </svg>
              {wishlistCount > 0 && <span className="badge-counter">{wishlistCount}</span>}
            </Link>

            <Link href="/cart" className="icon-link relative" aria-label="Cos">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 4h2l.6 2.7m0 0L7 14h10l3-7.3H5.6Zm3.4 11a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm8 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
              </svg>
              {cartCount > 0 && <span className="badge-counter">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </div>
    </header>

    {menuOpen && (
      <div className="fixed inset-0 z-[60] md:hidden">
        <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
        <div className="absolute left-0 top-0 h-full w-72 border-r border-zinc-800 bg-[#09090c] p-6 pt-24">
          <nav className="flex flex-col gap-2">
            {[
              { href: "/", label: "Acasă" },
              { href: "/search", label: "Produse" },
              { href: "/despre-noi", label: "Despre noi" },
              { href: "/academie", label: "Academie" },
              { href: "/contacte", label: "Contacte" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-zinc-800 py-3 text-sm uppercase tracking-[0.12em] text-zinc-200 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    )}
  );
}
