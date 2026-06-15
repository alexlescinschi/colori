import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import WishlistButton from "@/app/components/WishlistButton";
import { getStrapiUrl } from "@/lib/auth";
import { getProductPathFromProduct } from "@/lib/routes";
import { Category, fetchAPI, Product, StrapiResponse } from "@/lib/strapi";

interface CatalogFilters {
  q?: string;
  category?: string;
  sort?: string;
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

async function getCategories() {
  try {
    const res = await fetchAPI("/categories", {
      params: { sort: "order:asc" },
    });
    return res as StrapiResponse<Category>;
  } catch {
    return { data: [] } as StrapiResponse<Category>;
  }
}

async function getCatalogProducts(filters: CatalogFilters) {
  try {
    const params: Record<string, string> = {
      "pagination[limit]": "60",
      "populate[0]": "category",
      "populate[1]": "images",
    };

    if (filters.q) {
      params["filters[title][$containsi]"] = filters.q;
    }

    if (filters.category) {
      params["filters[category][slug][$eq]"] = filters.category;
    }

    switch (filters.sort) {
      case "price-asc":
        params.sort = "price:asc";
        break;
      case "price-desc":
        params.sort = "price:desc";
        break;
      case "name-desc":
        params.sort = "title:desc";
        break;
      default:
        params.sort = "title:asc";
        break;
    }

    const res = await fetchAPI("/products", { params });
    const data = res as StrapiResponse<Product>;
    return data as StrapiResponse<Product>;
  } catch {
    return { data: [] } as StrapiResponse<Product>;
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<CatalogFilters>;
}) {
  const filters = await searchParams;
  const categories = await getCategories();
  const products = await getCatalogProducts(filters);
  const t = await getTranslations();

  return (
    <div className="bg-[#F8F4F3] text-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="brand-serif text-4xl tracking-[0.12em] text-[#1A1A1A]">{t("search.title")}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t("search.subtitle")}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="panel-surface h-fit p-5 lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">{t("search.filters")}</p>

            <form action="/search" className="mt-4 space-y-3">
              <input
                type="text"
                name="q"
                defaultValue={filters.q || ""}
                placeholder={t("search.searchPlaceholder")}
                className="w-full border border-zinc-300 bg-[#F8F4F3] px-4 py-3 text-sm text-[#1A1A1A]"
              />

              <select
                name="category"
                defaultValue={filters.category || ""}
                className="w-full border border-zinc-300 bg-[#F8F4F3] px-4 py-3 text-sm text-[#1A1A1A]"
              >
                <option value="">{t("search.allCategories")}</option>
                {categories.data.map((category) => (
                  <option key={category.id} value={category.slug}>{category.title}</option>
                ))}
              </select>

              <select
                name="sort"
                defaultValue={filters.sort || "name-asc"}
                className="w-full border border-zinc-300 bg-[#F8F4F3] px-4 py-3 text-sm text-[#1A1A1A]"
              >
                <option value="name-asc">{t("search.sortNameAsc")}</option>
                <option value="name-desc">{t("search.sortNameDesc")}</option>
                <option value="price-asc">{t("search.sortPriceAsc")}</option>
                <option value="price-desc">{t("search.sortPriceDesc")}</option>
              </select>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#5e000e] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#7e1023]"
                >
                  {t("search.apply")}
                </button>
                <Link
                  href="/search"
                  className="inline-flex items-center border border-zinc-300 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700"
                >
                  {t("search.reset")}
                </Link>
              </div>
            </form>
          </aside>

          <section>
            <div className="mb-4 text-xs uppercase tracking-[0.14em] text-zinc-400">
              {t("search.results", { count: products.data.length })}
            </div>

            {products.data.length === 0 ? (
              <p className="rounded border border-zinc-200 bg-zinc-100/50 p-6 text-zinc-400">{t("search.empty")}</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {products.data.map((product) => (
                  <article key={product.id} className="panel-surface overflow-hidden p-4">
                    <div className="flex justify-end">
                      <WishlistButton
                        product={{
                          productId: product.id,
                          title: product.title,
                          slug: product.slug,
                          categorySlug: product.category?.slug,
                          price: product.price,
                          imageUrl: product.images?.[0]?.url,
                        }}
                      />
                    </div>

                    <Link href={getProductPathFromProduct(product)} className="mt-3 block">
                      <div className="relative aspect-square overflow-hidden border border-zinc-200 bg-zinc-50">
                        {product.images?.[0]?.url ? (
                          <Image
                            src={toAbsoluteMediaUrl(product.images[0].url)}
                            alt={product.images[0].alternativeText || product.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-zinc-400">
                            {product.title.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <h3 className="mt-4 min-h-12 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-800">{product.title}</h3>
                      <p className="mt-2 text-lg font-semibold text-[#d7b4bb]">{product.price.toFixed(2)} {t("common.mdl")}</p>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
