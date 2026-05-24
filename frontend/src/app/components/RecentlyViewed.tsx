"use client";

import { useState } from "react";
import { getRecentlyViewed } from "@/lib/recentlyViewed";
import ProductRow from "./ProductRow";

export default function RecentlyViewed() {
  const [products] = useState(() => getRecentlyViewed());

  return <ProductRow title="Vazute recent" products={products} />;
}