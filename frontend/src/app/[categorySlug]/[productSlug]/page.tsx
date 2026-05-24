import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/app/product/[slug]/AddToCartButton";
import WishlistButton from "@/app/components/WishlistButton";
import ProductRow from "@/app/components/ProductRow";
import RecentlyViewed from "@/app/components/RecentlyViewed";
import RecentlyViewedTracker from "@/lib/recentlyViewed";
import { getCategoryPath } from "@/lib/routes";
import { fetchAPI, Product, StrapiResponse } from "@/lib/strapi";
import ProductGallery from "./ProductGallery";

async function getProduct(categorySlug: string, productSlug: string) {
  try {
    const res = await fetchAPI("/products", {
      params: {
        "filters[slug][$eq]": productSlug,
        "filters[category][slug][$eq]": categorySlug,
        "populate[0]": "category",
        "populate[1]": "images",
      },
    });

    const data = res as StrapiResponse<Product>;
    return data.data[0] || null;
  } catch {
    return null;
  }
}

async function getRelatedProducts(categorySlug: string, excludeSlug: string) {
  try {
    const res = await fetchAPI("/products", {
      params: {
        "filters[category][slug][$eq]": categorySlug,
        "filters[slug][$ne]": excludeSlug,
        "pagination[limit]": "10",
        "populate[0]": "category",
        "populate[1]": "images",
      },
    });

    return res as StrapiResponse<Product>;
  } catch {
    return { data: [] } as StrapiResponse<Product>;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}) {
  const { categorySlug, productSlug } = await params;
  const product = await getProduct(categorySlug, productSlug);
  const relatedProducts = await getRelatedProducts(categorySlug, productSlug);

  if (!product) {
    notFound();
  }

  const inStock = product.stockQuantity > 0;

  return (
    <div className="bg-[#09090c] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Acasa</Link>
          <span className="mx-2">/</span>
          <Link href={`/search?category=${categorySlug}`} className="hover:text-white">
            {product.category?.title || categorySlug}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-200">{product.title}</span>
        </nav>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <ProductGallery images={product.images || []} productTitle={product.title} />

          <div className="panel-surface p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d7b4bb]">COLORI LAB</p>
            <h1 className="brand-serif mt-3 text-4xl tracking-[0.08em] text-white md:text-5xl">{product.title}</h1>

            <div className="mt-6 flex items-baseline gap-4">
              <p className="text-3xl font-semibold text-white md:text-4xl">{product.price.toFixed(2)} MDL</p>
              {product.oldPrice && <p className="text-lg text-zinc-500 line-through">{product.oldPrice.toFixed(2)} MDL</p>}
            </div>

            <p className={`mt-3 text-sm ${inStock ? "text-emerald-400" : "text-red-400"}`}>
              {inStock ? `In stoc (${product.stockQuantity} buc.)` : "Stoc epuizat"}
            </p>

            <div className="mt-6 space-y-3 text-sm text-zinc-300">
              <p>• Aderenta ridicata si rezistenta maxima.</p>
              <p>• Formula testata pentru lucru profesional in salon.</p>
              <p>• Textura uniforma pentru aplicare rapida.</p>
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
                label="Adauga la wishlist"
                product={{
                  productId: product.id,
                  title: product.title,
                  slug: product.slug,
                  categorySlug,
                  price: product.price,
                }}
              />
            </div>

            {product.sku && <p className="mt-6 text-xs uppercase tracking-[0.12em] text-zinc-500">SKU: {product.sku}</p>}
          </div>
        </section>

        <section className="mt-8 grid gap-4 border-y border-zinc-800 py-4 text-sm text-zinc-300 md:grid-cols-3">
          <div className="panel-surface p-4">Livrare rapida 24/48h</div>
          <div className="panel-surface p-4">Retur simplu in 14 zile</div>
          <div className="panel-surface p-4">Plati securizate 100%</div>
        </section>

        <section className="mt-8 border border-zinc-800 bg-[#0d0d12] p-6 md:p-8">
          <h2 className="brand-serif text-2xl tracking-[0.1em] text-white">Descriere</h2>
          {product.description ? (
            <div className="prose prose-invert mt-4 max-w-none text-zinc-300" dangerouslySetInnerHTML={{ __html: product.description }} />
          ) : (
            <p className="mt-4 leading-7 text-zinc-300">
              Acest produs este ideal pentru tehnicienele care cauta performanta constanta si finisaj premium.
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
          title="Din aceeasi categorie"
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
