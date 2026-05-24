"use client";

import { useEffect } from "react";

export interface RecentProduct {
  id: number;
  slug: string;
  title: string;
  price: number;
  categorySlug?: string;
  imageUrl?: string;
}

const RECENT_KEY = "recently_viewed";
const MAX_RECENT = 10;

function isClient() {
  return typeof window !== "undefined";
}

export function getRecentlyViewed(): RecentProduct[] {
  if (!isClient()) {
    return [];
  }

  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistRecent(products: RecentProduct[]) {
  if (!isClient()) {
    return;
  }

  localStorage.setItem(RECENT_KEY, JSON.stringify(products));
}

export function trackProductView(product: RecentProduct) {
  if (!isClient()) {
    return;
  }

  const current = getRecentlyViewed();
  const filtered = current.filter((item) => item.id !== product.id);

  filtered.unshift(product);
  persistRecent(filtered.slice(0, MAX_RECENT));
}

export default function RecentlyViewedTracker({ product }: { product: RecentProduct }) {
  useEffect(() => {
    trackProductView(product);
  }, [product]);

  return null;
}