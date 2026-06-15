import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import WishlistButton from "@/app/components/WishlistButton";
import { fetchAPI, Category, Product, StrapiResponse } from "@/lib/strapi";
import { getCategoryPath, getProductPathFromProduct } from "@/lib/routes";
import { getStrapiUrl } from "@/lib/auth";

interface HomeFilters {
  q?: string;
  category?: string;
  sort?: string;
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

async function getFeaturedProducts() {
  try {
    const res = await fetchAPI("/products", {
      params: {
        "filters[featured][$eq]": "true",
        "pagination[limit]": "24",
        populate: "category",
      },
    });

    const data = res as StrapiResponse<Product>;
    const productsWithCategory = data.data.filter((product) => Boolean(product.category?.slug));

    return {
      ...data,
      data: productsWithCategory.slice(0, 8),
    } as StrapiResponse<Product>;
  } catch {
    return { data: [] } as StrapiResponse<Product>;
  }
}

async function getCatalogProducts(filters: HomeFilters) {
  try {
    const params: Record<string, string> = {
      "pagination[limit]": "24",
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
    return {
      ...data,
      data: data.data.filter((product) => Boolean(product.category?.slug)),
    } as StrapiResponse<Product>;
  } catch {
    return { data: [] } as StrapiResponse<Product>;
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<HomeFilters>;
}) {
  const filters = await searchParams;
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts();
  const catalogProducts = await getCatalogProducts(filters);
  const t = await getTranslations();

  return (
    <div className="bg-[#F8F4F3] text-[#1A1A1A]">
      <section className="border-y border-zinc-200 bg-[#F8F4F3]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8 lg:py-10">
          <aside className="panel-surface hidden p-7 lg:block">
            <p className="brand-serif text-4xl tracking-[0.32em] text-[#1A1A1A]">COLORI</p>
            <p className="mt-5 text-sm leading-7 text-zinc-600">
              {t("home.sidebar.description")}
            </p>

            <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">{t("home.sidebar.palette")}</h3>
            <div className="mt-4 space-y-3 text-sm text-zinc-600">
              <div className="flex items-center gap-3"><span className="h-8 w-8 border border-zinc-400 bg-zinc-300" /> {t("home.sidebar.colors.grey")}</div>
              <div className="flex items-center gap-3"><span className="h-8 w-8 border border-zinc-300 bg-[#5e000e]" /> {t("home.sidebar.colors.red")}</div>
              <div className="flex items-center gap-3"><span className="h-8 w-8 border border-zinc-300 bg-zinc-100" /> {t("home.sidebar.colors.white")}</div>
              <div className="flex items-center gap-3"><span className="h-8 w-8 border border-zinc-300 bg-black" /> {t("home.sidebar.colors.black")}</div>
            </div>
          </aside>

          <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
            <article className="panel-surface overflow-hidden p-8 md:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d7b4bb]">{t("home.hero.label")}</p>
              <h1 className="brand-serif mt-3 text-4xl leading-tight tracking-[0.06em] text-[#1A1A1A] md:text-6xl">
                {t("home.hero.title")}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600 md:text-lg">
                {t("home.hero.description")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center bg-[#5e000e] px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#7e1023]"
                >
                  {t("home.hero.cta")}
                </Link>
                <Link
                  href="/search?q=gel"
                  className="inline-flex items-center justify-center border border-zinc-400 px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-zinc-800 transition hover:border-zinc-300"
                >
                  {t("home.hero.secondary")}
                </Link>
              </div>
            </article>

            <div className="grid gap-4">
              <article className="panel-surface p-6">
                <h3 className="brand-serif text-2xl tracking-[0.12em] text-[#1A1A1A]">{t("home.why.title")}</h3>
                <ul className="mt-5 space-y-3 text-sm text-zinc-600">
                  <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-[#5e000e]" /> {t("home.why.items.0")}</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-[#5e000e]" /> {t("home.why.items.1")}</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-[#5e000e]" /> {t("home.why.items.2")}</li>
                </ul>
              </article>
              <article className="panel-surface p-6">
                <h3 className="brand-serif text-2xl tracking-[0.12em] text-[#1A1A1A]">{t("home.learn.title")}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {t("home.learn.description")}
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-[#F8F4F3] py-6">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#5e000e]" fill="none" stroke="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs uppercase tracking-[0.16em] text-zinc-600">{t("home.features.quality")}</span>
          </div>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#5e000e]" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
              <path d="m8 12 3 3 5-5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs uppercase tracking-[0.16em] text-zinc-600">{t("home.features.tested")}</span>
          </div>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#5e000e]" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs uppercase tracking-[0.16em] text-zinc-600">{t("home.features.created")}</span>
          </div>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#5e000e]" fill="none" stroke="currentColor">
              <rect x="3" y="11" width="18" height="10" rx="2" strokeWidth="1.5" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-xs uppercase tracking-[0.16em] text-zinc-600">{t("home.features.payments")}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="brand-serif text-3xl tracking-[0.12em] text-[#1A1A1A] md:text-4xl">{t("home.featured.title")}</h2>
          <Link href="/search" className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600 hover:text-[#1A1A1A]">
            {t("home.featured.viewAll")}
          </Link>
        </div>

        {featuredProducts.data.length === 0 ? (
          <p className="rounded border border-zinc-200 bg-zinc-100/50 p-6 text-zinc-400">{t("home.featured.empty")}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {featuredProducts.data.map((product) => (
              <article key={product.id} className="group panel-surface overflow-hidden p-4">
                <div className="flex justify-end">
                  <WishlistButton
                    product={{
                      productId: product.id,
                      title: product.title,
                      slug: product.slug,
                      categorySlug: product.category?.slug,
                      price: product.price,
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
                  <h3 className="mt-4 min-h-12 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-800">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-lg font-semibold text-[#d7b4bb]">{product.price.toFixed(2)} {t("common.mdl")}</p>
                </Link>

                <Link
                  href={getProductPathFromProduct(product)}
                  className="mt-4 inline-flex w-full items-center justify-center bg-[#5e000e] px-3 py-2 text-xs font-semibold uppercase tracking-[0.13em] text-white transition hover:bg-[#7e1023]"
                >
                  {t("home.featured.viewProduct")}
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-zinc-200 bg-[#F8F4F3] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="brand-serif text-3xl tracking-[0.12em] text-[#1A1A1A]">{t("home.catalog.title")}</h2>
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">{t("home.catalog.filter")}</p>
          </div>

          <form action="/" className="grid gap-3 rounded border border-zinc-200 bg-black/5 p-4 md:grid-cols-[1.2fr_1fr_1fr_auto]">
            <input
              type="text"
              name="q"
              defaultValue={filters.q || ""}
              placeholder={t("home.catalog.searchPlaceholder")}
              className="border border-zinc-300 bg-[#F8F4F3] px-4 py-3 text-sm text-[#1A1A1A]"
            />

            <select
              name="category"
              defaultValue={filters.category || ""}
              className="border border-zinc-300 bg-[#F8F4F3] px-4 py-3 text-sm text-[#1A1A1A]"
            >
              <option value="">{t("home.catalog.allCategories")}</option>
              {categories.data.map((category) => (
                <option key={category.id} value={category.slug}>{category.title}</option>
              ))}
            </select>

            <select
              name="sort"
              defaultValue={filters.sort || "name-asc"}
              className="border border-zinc-300 bg-[#F8F4F3] px-4 py-3 text-sm text-[#1A1A1A]"
            >
              <option value="name-asc">{t("home.catalog.sortNameAsc")}</option>
              <option value="name-desc">{t("home.catalog.sortNameDesc")}</option>
              <option value="price-asc">{t("home.catalog.sortPriceAsc")}</option>
              <option value="price-desc">{t("home.catalog.sortPriceDesc")}</option>
            </select>

            <button
              type="submit"
              className="bg-[#5e000e] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#7e1023]"
            >
              {t("home.catalog.apply")}
            </button>
          </form>

          {catalogProducts.data.length === 0 ? (
            <p className="mt-6 rounded border border-zinc-200 bg-zinc-100/50 p-6 text-zinc-400">{t("home.catalog.empty")}</p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {catalogProducts.data.map((product) => (
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
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-[#F8F4F3] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="brand-serif text-2xl tracking-[0.14em] text-[#1A1A1A]">{t("home.categories.title")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {categories.data.map((category) => (
              <Link
                key={category.id}
                href={`/search?category=${category.slug}`}
                className="border border-zinc-300 bg-zinc-100/70 px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-zinc-700 transition hover:border-[#5e000e] hover:text-[#1A1A1A]"
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
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
