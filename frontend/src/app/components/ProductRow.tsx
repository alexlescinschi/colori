"use client";

import Image from "next/image";
import Link from "next/link";
import { getProductPath } from "@/lib/routes";
import { getStrapiUrl } from "@/lib/auth";
import WishlistButton from "./WishlistButton";

export interface RowProduct {
  id: number;
  slug: string;
  title: string;
  price: number;
  categorySlug?: string;
  imageUrl?: string;
}

interface ProductRowProps {
  title: string;
  products: RowProduct[];
}

function toAbsoluteMediaUrl(url?: string) {
  if (!url) {
    return "";
  }

  if (url.startsWith("http")) {
    return url;
  }

  return `${getStrapiUrl()}${url}`;
}

export default function ProductRow({ title, products }: ProductRowProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="brand-serif text-2xl tracking-[0.1em] text-[#1A1A1A]">{title}</h2>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:overflow-visible lg:px-0">
        <div className="flex gap-4 lg:grid lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <article
              key={product.id}
              className="panel-surface flex w-52 flex-shrink-0 flex-col overflow-hidden p-4 lg:w-auto lg:flex-shrink"
            >
              <div className="flex justify-end">
                <WishlistButton
                  product={{
                    productId: product.id,
                    title: product.title,
                    slug: product.slug,
                    categorySlug: product.categorySlug,
                    price: product.price,
                    imageUrl: product.imageUrl,
                  }}
                />
              </div>

              <Link
                href={
                  product.categorySlug
                    ? getProductPath(product.categorySlug, product.slug)
                    : `/product/${product.slug}`
                }
                className="mt-3 block"
              >
                <div className="relative aspect-square overflow-hidden border border-zinc-200 bg-zinc-50">
                  {product.imageUrl ? (
                    <Image
                      src={toAbsoluteMediaUrl(product.imageUrl)}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-zinc-400">
                      {product.title.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <h3 className="mt-3 min-h-12 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-800">
                  {product.title}
                </h3>
                <p className="mt-1 text-lg font-semibold text-[#d7b4bb]">
                  {product.price.toFixed(2)} MDL
                </p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}