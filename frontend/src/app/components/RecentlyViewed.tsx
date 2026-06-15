"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { getRecentlyViewed } from "@/lib/recentlyViewed";
import ProductRow from "./ProductRow";

export default function RecentlyViewed() {
  const [products] = useState(() => getRecentlyViewed());
  const t = useTranslations();

  return <ProductRow title={t("product.recentlyViewed")} products={products} />;
}