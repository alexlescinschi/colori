"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CartItem } from "@/lib/strapi";
import { getProductPath } from "@/lib/routes";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[];
  });
  const t = useTranslations();

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
        <h1 className="brand-serif text-3xl tracking-[0.12em] text-[#1A1A1A]">{t("cart.emptyTitle")}</h1>
        <p className="mt-4 text-sm tracking-wide text-zinc-400">{t("cart.emptyText")}</p>
        <Link
          href="/search"
          className="mt-8 inline-block bg-[#5e000e] px-8 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#7e1023]"
        >
          {t("cart.viewProducts")}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F4F3] text-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="brand-serif mb-10 text-3xl tracking-[0.12em] text-[#1A1A1A]">{t("cart.title")}</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 border border-zinc-200 bg-[#EFEBEA] p-4"
              >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-zinc-100">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.titleSnapshot}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                      {t("cart.noImage")}
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={item.categorySlug ? getProductPath(item.categorySlug, item.slug) : `/product/${item.slug}`}
                      className="text-sm font-semibold uppercase tracking-wide text-zinc-800 transition hover:text-[#5e000e]"
                    >
                      {item.titleSnapshot}
                    </Link>
                    <p className="mt-1 text-sm font-bold text-[#5e000e]">
                      {item.priceSnapshot.toFixed(2)} {t("common.mdl")}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-zinc-300">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-3 py-1 text-sm text-zinc-600 transition hover:bg-zinc-200"
                      >
                        −
                      </button>
                      <span className="min-w-[3rem] px-3 py-1 text-center text-sm text-zinc-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-1 text-sm text-zinc-600 transition hover:bg-zinc-200"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-xs uppercase tracking-wider text-zinc-400 transition hover:text-red-600"
                    >
                      {t("cart.delete")}
                    </button>
                  </div>
                </div>

                <div className="flex items-center text-right">
                  <p className="text-base font-bold text-zinc-800">
                    {(item.priceSnapshot * item.quantity).toFixed(2)} {t("common.mdl")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit border border-zinc-200 bg-[#EFEBEA] p-6">
            <h2 className="brand-serif mb-6 text-xl tracking-[0.1em] text-[#1A1A1A]">{t("cart.summary")}</h2>

            <div className="space-y-3 text-sm text-zinc-600">
              <div className="flex justify-between">
                <span>{t("cart.subtotal")}</span>
                <span>{total.toFixed(2)} {t("common.mdl")}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("cart.shipping")}</span>
                <span className="text-zinc-400">{t("cart.shippingCalc")}</span>
              </div>
            </div>

            <div className="my-6 border-t border-zinc-200 pt-6">
              <div className="flex justify-between text-lg font-bold text-[#1A1A1A]">
                <span>{t("cart.total")}</span>
                <span>{total.toFixed(2)} {t("common.mdl")}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-[#5e000e] px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#7e1023]"
            >
              {t("cart.checkout")}
            </Link>

            <Link
              href="/search"
              className="mt-3 block w-full text-center text-xs uppercase tracking-wider text-zinc-400 transition hover:text-[#1A1A1A]"
            >
              {t("cart.continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
