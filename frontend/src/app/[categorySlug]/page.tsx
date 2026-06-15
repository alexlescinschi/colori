import { fetchAPI, StrapiResponse, Category, Product } from "@/lib/strapi";
import { getProductPath } from "@/lib/routes";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

async function getCategory(slug: string) {
  try {
    const res = await fetchAPI("/categories", {
      params: { "filters[slug][$eq]": slug },
    });
    const data = res as StrapiResponse<Category>;
    return data.data[0] || null;
  } catch {
    return null;
  }
}

async function getProductsByCategory(categorySlug: string) {
  try {
    const res = await fetchAPI("/products", {
      params: {
        "filters[category][slug][$eq]": categorySlug,
        "pagination[pageSize]": "50",
        sort: "title:asc",
      },
    });
    return res as StrapiResponse<Product>;
  } catch {
    return { data: [] } as StrapiResponse<Product>;
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const category = await getCategory(categorySlug);
  const t = await getTranslations();

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-[#5e000e]">{t("product.breadcrumb.home")}</Link>
        {" / "}
        <span className="text-gray-900">{category.title}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.title}</h1>
      <p className="text-gray-500 mb-8">
        {products.data.length} {products.data.length === 1 ? t("category.productCount", { count: 1 }) : t("category.productCountPlural", { count: products.data.length })}
      </p>

      {products.data.length === 0 ? (
        <p className="text-gray-500">
          {t("category.empty")}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.data.map((prod) => (
            <Link
              key={prod.id}
              href={getProductPath(categorySlug, prod.slug)}
              className="group bg-white rounded-lg shadow hover:shadow-lg transition p-4"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{prod.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#5e000e]">
                  {prod.price.toFixed(2)} {t("common.mdl")}
                </span>
                {prod.stockQuantity === 0 ? (
                  <span className="text-xs text-red-500">{t("product.outOfStock")}</span>
                ) : prod.stockQuantity <= 5 ? (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    {t("product.stockLimited")}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
