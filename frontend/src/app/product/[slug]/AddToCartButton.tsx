"use client";

import { useState } from "react";
import { CartItem } from "@/lib/strapi";
import { getStrapiUrl } from "@/lib/auth";

interface AddToCartButtonProps {
  product: {
    id: number;
    title: string;
    price: number;
    slug: string;
    categorySlug?: string;
    imageUrl?: string;
    stockQuantity: number;
  };
  variant?: "default" | "dark";
}

export default function AddToCartButton({ product, variant = "default" }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const inStock = product.stockQuantity > 0;
  const normalizedImageUrl =
    product.imageUrl && product.imageUrl.startsWith("/")
      ? `${getStrapiUrl()}${product.imageUrl}`
      : product.imageUrl;

  const addToCart = () => {
    if (!inStock) return;

    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    
    const existingIndex = cart.findIndex((item) => item.productId === product.id);
    
    if (existingIndex >= 0) {
      // Update quantity
      const newQty = cart[existingIndex].quantity + quantity;
      if (newQty <= product.stockQuantity) {
        cart[existingIndex].quantity = newQty;
      } else {
        alert(`Stoc limitat: doar ${product.stockQuantity} buc. disponibile`);
        return;
      }
    } else {
      // Add new item
      if (quantity > product.stockQuantity) {
        alert(`Stoc limitat: doar ${product.stockQuantity} buc. disponibile`);
        return;
      }
      cart.push({
        productId: product.id,
        quantity,
        titleSnapshot: product.title,
        priceSnapshot: product.price,
        slug: product.slug,
        categorySlug: product.categorySlug,
        imageUrl: normalizedImageUrl,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    
    // Trigger custom event for header update
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!inStock) {
    return (
      <button
        disabled
        className="w-full py-3 bg-zinc-800 text-zinc-400 rounded-lg cursor-not-allowed"
      >
        Stoc epuizat
      </button>
    );
  }

  const quantityWrapperClass =
    variant === "dark"
      ? "flex items-center border border-zinc-300 bg-[#F8F4F3]"
      : "flex items-center border border-gray-300 rounded-lg";

  const quantityButtonClass =
    variant === "dark"
      ? "px-4 py-3 text-xl text-zinc-600 transition hover:bg-zinc-100"
      : "px-3 py-2 hover:bg-gray-100";

  const addButtonClass =
    variant === "dark"
      ? "flex-1 py-3 bg-[#5e000e] text-white font-semibold tracking-[0.1em] uppercase transition hover:bg-[#7e1023]"
      : "flex-1 py-3 rounded-lg font-semibold transition bg-[#5e000e] text-white hover:bg-[#4a000b]";

  return (
    <div className="flex gap-4">
      <div className={quantityWrapperClass}>
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className={quantityButtonClass}
        >
          -
        </button>
        <span className="px-3 py-2 min-w-[3rem] text-center text-[#1A1A1A]">{quantity}</span>
        <button
          onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
          className={quantityButtonClass}
        >
          +
        </button>
      </div>
      <button
        onClick={addToCart}
        className={added ? "flex-1 py-3 bg-emerald-700 text-white font-semibold tracking-[0.08em] uppercase" : addButtonClass}
      >
        {added ? "Adaugat" : "Adauga in cos"}
      </button>
    </div>
  );
}
