import { fetchAPI, StrapiResponse, Product } from "@/lib/strapi";
import { getProductPath } from "@/lib/routes";
import { notFound, redirect } from "next/navigation";

async function getProduct(slug: string) {
  try {
    const res = await fetchAPI("/products", {
      params: {
        "filters[slug][$eq]": slug,
        populate: "category",
      },
    });
    const data = res as StrapiResponse<Product>;
    return data.data[0] || null;
  } catch {
    return null;
  }
}

export default async function LegacyProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product?.category?.slug) {
    notFound();
  }

  redirect(getProductPath(product.category.slug, slug));
}
