"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartItem } from "@/lib/strapi";
import { getProductPath } from "@/lib/routes";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[];
  });

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    const updated = cart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (productId: number) => {
    const updated = cart.filter((item) => item.productId !== productId);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = cart.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="brand-serif text-3xl tracking-[0.12em] text-white">Coșul este gol</h1>
        <p className="mt-4 text-sm tracking-wide text-zinc-400">Adaugă produse în coș pentru a continua.</p>
        <Link
          href="/search"
          className="mt-8 inline-block bg-[#5e000e] px-8 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#7e1023]"
        >
          Vezi produsele
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#09090c] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="brand-serif mb-10 text-3xl tracking-[0.12em] text-white">Coșul tău</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 border border-zinc-800 bg-[#121216] p-4"
              >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-zinc-900">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.titleSnapshot}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                      Fără imagine
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={item.categorySlug ? getProductPath(item.categorySlug, item.slug) : `/product/${item.slug}`}
                      className="text-sm font-semibold uppercase tracking-wide text-zinc-100 transition hover:text-[#5e000e]"
                    >
                      {item.titleSnapshot}
                    </Link>
                    <p className="mt-1 text-sm font-bold text-[#5e000e]">
                      {item.priceSnapshot.toFixed(2)} MDL
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-zinc-700">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-3 py-1 text-sm text-zinc-300 transition hover:bg-zinc-800"
                      >
                        −
                      </button>
                      <span className="min-w-[3rem] px-3 py-1 text-center text-sm text-zinc-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-1 text-sm text-zinc-300 transition hover:bg-zinc-800"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-xs uppercase tracking-wider text-zinc-500 transition hover:text-red-400"
                    >
                      Șterge
                    </button>
                  </div>
                </div>

                <div className="flex items-center text-right">
                  <p className="text-base font-bold text-zinc-100">
                    {(item.priceSnapshot * item.quantity).toFixed(2)} MDL
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit border border-zinc-800 bg-[#121216] p-6">
            <h2 className="brand-serif mb-6 text-xl tracking-[0.1em] text-white">Sumar</h2>

            <div className="space-y-3 text-sm text-zinc-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{total.toFixed(2)} MDL</span>
              </div>
              <div className="flex justify-between">
                <span>Livrare</span>
                <span className="text-zinc-500">Se calculează</span>
              </div>
            </div>

            <div className="my-6 border-t border-zinc-800 pt-6">
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>{total.toFixed(2)} MDL</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-[#5e000e] px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#7e1023]"
            >
              Finalizează comanda
            </Link>

            <Link
              href="/search"
              className="mt-3 block w-full text-center text-xs uppercase tracking-wider text-zinc-500 transition hover:text-white"
            >
              Continuă cumpărăturile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
