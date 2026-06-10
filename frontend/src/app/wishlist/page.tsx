"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProductPath } from "@/lib/routes";
import { getWishlistItems, WishlistItem, wishlistEventName } from "@/lib/wishlist";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const syncItems = async () => {
      const nextItems = await getWishlistItems();
      setItems(nextItems);
    };

    void syncItems();

    window.addEventListener(wishlistEventName, syncItems);
    window.addEventListener("authChanged", syncItems);

    return () => {
      window.removeEventListener(wishlistEventName, syncItems);
      window.removeEventListener("authChanged", syncItems);
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="brand-serif text-4xl tracking-[0.12em] text-[#1A1A1A]">Favorite</h1>

      {items.length === 0 ? (
        <div className="mt-6 rounded border border-zinc-200 bg-zinc-100/60 p-6 text-zinc-600">
          Nu ai produse in favorite.
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.productId}
              href={item.categorySlug ? getProductPath(item.categorySlug, item.slug) : `/product/${item.slug}`}
              className="panel-surface block p-5 transition hover:border-[#5e000e]"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Produs favorit</p>
              <h2 className="mt-2 text-lg font-semibold text-[#1A1A1A]">{item.title}</h2>
              {typeof item.price === "number" && (
                <p className="mt-2 text-[#d7b4bb]">{item.price.toFixed(2)} MDL</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
