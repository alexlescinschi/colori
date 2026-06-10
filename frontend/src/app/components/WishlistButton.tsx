"use client";

import { useEffect, useState } from "react";
import {
  isWishlisted,
  toggleWishlist,
  wishlistEventName,
  WishlistItem,
} from "@/lib/wishlist";

interface WishlistButtonProps {
  product: WishlistItem;
  className?: string;
  label?: string;
  variant?: "icon" | "outline";
}

export default function WishlistButton({
  product,
  className,
  label = "Adauga la favorite",
  variant = "icon",
}: WishlistButtonProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const syncWishlistState = async () => {
      const status = await isWishlisted(product.productId);
      setActive(status);
    };

    void syncWishlistState();

    window.addEventListener(wishlistEventName, syncWishlistState);

    return () => {
      window.removeEventListener(wishlistEventName, syncWishlistState);
    };
  }, [product.productId]);

  const onToggle = async () => {
    const status = await toggleWishlist(product);
    setActive(Boolean(status));
  };

  if (variant === "outline") {
    return (
      <button
        type="button"
        onClick={onToggle}
        className={
          className ||
          "w-full border border-black/10 px-5 py-3 text-sm font-semibold tracking-wide uppercase text-[#1A1A1A] transition hover:border-black/30"
        }
      >
        {active ? "In favorite" : label}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onToggle}
      className={
        className ||
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-zinc-50/60 text-[#1A1A1A] transition hover:border-[#5e000e]"
      }
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill={active ? "currentColor" : "none"}>
        <path
          d="M12 21s-6.716-4.21-9.193-8.233C.839 9.722 2.19 5.75 5.842 4.62c2.084-.645 4.17.033 5.452 1.738 1.284-1.705 3.369-2.383 5.453-1.738 3.651 1.13 5.002 5.102 3.035 8.147C18.707 16.79 12 21 12 21z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    </button>
  );
}
