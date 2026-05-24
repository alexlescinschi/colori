import { Product } from "@/lib/strapi";

export function getCategoryPath(categorySlug: string) {
  return `/${categorySlug}`;
}

export function getProductPath(categorySlug: string, productSlug: string) {
  return `/${categorySlug}/${productSlug}`;
}

export function getProductPathFromProduct(product: Product) {
  if (!product.category?.slug) {
    return `/product/${product.slug}`;
  }

  return getProductPath(product.category.slug, product.slug);
}
