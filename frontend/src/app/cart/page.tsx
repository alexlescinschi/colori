"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartItem } from "@/lib/strapi";
import { getProductPath } from "@/lib/routes";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Coșul este gol</h1>
        <p className="text-gray-600 mb-8">Adaugă produse în coș pentru a continua.</p>
        <Link
          href="/search"
          className="inline-block bg-[#5e000e] text-white px-6 py-3 rounded-lg hover:bg-[#4a000b] transition"
        >
          Vezi produsele
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Coșul tău</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 bg-white p-4 rounded-lg shadow"
            >
              <div className="w-24 h-24 relative bg-gray-200 rounded flex-shrink-0">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.titleSnapshot}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    Fără imagine
                  </div>
                )}
              </div>

              <div className="flex-1">
                <Link
                  href={item.categorySlug ? getProductPath(item.categorySlug, item.slug) : `/product/${item.slug}`}
                  className="font-semibold text-gray-900 hover:text-[#5e000e]"
                >
                  {item.titleSnapshot}
                </Link>
                <p className="text-[#5e000e] font-bold mt-1">
                  {item.priceSnapshot.toFixed(2)} MDL
                </p>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 min-w-[3rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Șterge
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg">
                  {(item.priceSnapshot * item.quantity).toFixed(2)} MDL
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sumar</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{total.toFixed(2)} MDL</span>
            </div>
            <div className="flex justify-between">
              <span>Livrare</span>
              <span>Se calculează</span>
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{total.toFixed(2)} MDL</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block w-full bg-[#5e000e] text-white text-center py-3 rounded-lg font-semibold hover:bg-[#4a000b] transition"
          >
            Continuă la checkout
          </Link>

          <Link
            href="/search"
            className="block w-full text-center mt-3 text-gray-600 hover:text-[#5e000e]"
          >
            Continuă cumpărăturile
          </Link>
        </div>
      </div>
    </div>
  );
}
