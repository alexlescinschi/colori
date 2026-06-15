import { Link } from "@/i18n/navigation";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import AddToCartButton from "@/app/product/[slug]/AddToCartButton";
import WishlistButton from "@/app/components/WishlistButton";
import ProductRow from "@/app/components/ProductRow";
import RecentlyViewed from "@/app/components/RecentlyViewed";
import RecentlyViewedTracker from "@/lib/recentlyViewed";
import { getCategoryPath } from "@/lib/routes";
import { fetchAPI, Product, StrapiResponse } from "@/lib/strapi";
import ProductGallery from "./ProductGallery";

async function getProduct(categorySlug: string, productSlug: string, locale: string) {
  try {
    const res = await fetchAPI("/products", {
      params: {
        "filters[slug][$eq]": productSlug,
        "filters[category][slug][$eq]": categorySlug,
        "populate[0]": "category",
        "populate[1]": "images",
      }, locale,
    });

    const data = res as StrapiResponse<Product>;
    return data.data[0] || null;
  } catch {
    return null;
  }
}

async function getRelatedProducts(categorySlug: string, excludeSlug: string, locale: string) {
  try {
    const res = await fetchAPI("/products", {
      params: {
        "filters[category][slug][$eq]": categorySlug,
        "filters[slug][$ne]": excludeSlug,
        "pagination[limit]": "10",
        "populate[0]": "category",
        "populate[1]": "images",
      }, locale,
    });

    return res as StrapiResponse<Product>;
  } catch {
    return { data: [] } as StrapiResponse<Product>;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string; productSlug: string }>;
}) {
  const { locale, categorySlug, productSlug } = await params;
  const t = await getTranslations();
  const product = await getProduct(categorySlug, productSlug, locale);
  const relatedProducts = await getRelatedProducts(categorySlug, productSlug, locale);

  if (!product) {
    // Fallback: try to find in default locale (en) then redirect to localized slug
    const defaultProduct = await getProduct(categorySlug, productSlug, "en");
    if (defaultProduct) {
      const localizedRes = await fetchAPI("/products", {
        locale,
        params: {
          "filters[documentId][$eq]": defaultProduct.documentId,
          "populate[0]": "category",
        },
      }) as StrapiResponse<Product>;
      if (localizedRes.data[0]) {
        const p = localizedRes.data[0];
        redirect(`/${locale}/${p.category?.slug || categorySlug}/${p.slug}`);
      }
    }
    notFound();
  }

  const inStock = product.stockQuantity > 0;

  return (
    <div className="bg-[#F8F4F3] text-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-zinc-400">
          <Link href="/" className="hover:text-[#1A1A1A]">{t("product.breadcrumb.home")}</Link>
          <span className="mx-2">/</span>
          <Link href={`/search?category=${categorySlug}`} className="hover:text-[#1A1A1A]">
            {product.category?.title || categorySlug}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-700">{product.title}</span>
        </nav>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <ProductGallery images={product.images || []} productTitle={product.title} />

          <div className="panel-surface p-6 md:p-8">
            <p className="brand-serif text-xs font-semibold uppercase tracking-[0.22em] text-[#333F48]">{t("product.coloriLab")}</p>
            <h1 className="brand-serif mt-3 text-4xl tracking-[0.08em] text-[#1A1A1A] md:text-5xl">{product.title}</h1>

            <div className="mt-6 flex items-baseline gap-4">
              <p className="text-3xl font-semibold text-[#1A1A1A] md:text-4xl">{product.price.toFixed(2)} {t("common.mdl")}</p>
              {product.oldPrice && <p className="text-lg text-zinc-400 line-through">{product.oldPrice.toFixed(2)} MDL</p>}
            </div>

            <p className={`mt-3 text-sm ${inStock ? "text-emerald-600" : "text-red-600"}`}>
              {inStock ? t("product.stock", { count: product.stockQuantity }) : t("product.outOfStock")}
            </p>

            <div className="mt-6 space-y-3 text-sm text-zinc-600">
              <p>{t("product.features.0")}</p>
              <p>{t("product.features.1")}</p>
              <p>{t("product.features.2")}</p>
            </div>

            <div className="mt-8 space-y-3">
              <AddToCartButton
                variant="dark"
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  slug: product.slug,
                  categorySlug,
                  imageUrl: product.images?.[0]?.url,
                  stockQuantity: product.stockQuantity,
                }}
              />

              <WishlistButton
                variant="outline"
                label={t("product.addToWishlist")}
                product={{
                  productId: product.id,
                  title: product.title,
                  slug: product.slug,
                  categorySlug,
                  price: product.price,
                }}
              />
            </div>

            {product.sku && <p className="mt-6 text-xs uppercase tracking-[0.12em] text-zinc-400">{t("product.sku")} {product.sku}</p>}
          </div>
        </section>

        <section className="mt-8 grid gap-4 border-y border-zinc-200 py-4 text-sm text-zinc-600 md:grid-cols-3">
          <div className="panel-surface p-4">{t("product.shipping")}</div>
          <div className="panel-surface p-4">{t("product.returns")}</div>
          <div className="panel-surface p-4">{t("product.securePayment")}</div>
        </section>

        <section className="mt-8 border border-zinc-200 bg-[#F8F4F3] p-6 md:p-8">
          <h2 className="brand-serif text-2xl tracking-[0.1em] text-[#1A1A1A]">{t("product.description")}</h2>
          {product.description ? (
            <div className="prose prose-slate mt-4 max-w-none text-zinc-600" dangerouslySetInnerHTML={{ __html: product.description }} />
          ) : (
            <p className="mt-4 leading-7 text-zinc-600">
              {t("product.fallbackDescription")}
            </p>
          )}
        </section>

        <RecentlyViewedTracker
          product={{
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            categorySlug,
            imageUrl: product.images?.[0]?.url,
          }}
        />

        <RecentlyViewed />

        <ProductRow
          title={t("product.related")}
          products={relatedProducts.data.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            price: p.price,
            categorySlug: p.category?.slug,
            imageUrl: p.images?.[0]?.url,
          }))}
        />
      </div>
    </div>
  );
}
