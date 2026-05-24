import { getStrapiUrl, getToken } from "@/lib/auth";

export interface WishlistItem {
  productId: number;
  title: string;
  slug: string;
  categorySlug?: string;
  price?: number;
  imageUrl?: string;
}

const GUEST_KEY = "wishlist:guest";
const CACHE_KEY = "wishlist:cache";
export const wishlistEventName = "wishlistUpdated";

function isClient() {
  return typeof window !== "undefined";
}

function readArrayFromStorage(key: string) {
  if (!isClient()) {
    return [] as WishlistItem[];
  }

  const raw = localStorage.getItem(key);
  if (!raw) {
    return [] as WishlistItem[];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WishlistItem[]) : [];
  } catch {
    return [] as WishlistItem[];
  }
}

function writeArrayToStorage(key: string, value: WishlistItem[]) {
  if (!isClient()) {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

function mapServerItem(item: {
  product?: {
    id: number;
    title: string;
    slug: string;
    price?: number;
    category?: { slug?: string } | null;
    images?: Array<{ url?: string }> | null;
  };
}) {
  if (!item.product) {
    return null;
  }

  return {
    productId: item.product.id,
    title: item.product.title,
    slug: item.product.slug,
    categorySlug: item.product.category?.slug,
    price: item.product.price,
    imageUrl: item.product.images?.[0]?.url,
  } as WishlistItem;
}

export function getWishlistCountSync() {
  const token = getToken();
  return readArrayFromStorage(token ? CACHE_KEY : GUEST_KEY).length;
}

export async function getWishlistItems() {
  const token = getToken();

  if (!token) {
    return readArrayFromStorage(GUEST_KEY);
  }

  const res = await fetch(`${getStrapiUrl()}/api/wishlist/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return readArrayFromStorage(CACHE_KEY);
  }

  const payload = (await res.json()) as {
    data?: Array<{
      product?: {
        id: number;
        title: string;
        slug: string;
        price?: number;
        category?: { slug?: string } | null;
        images?: Array<{ url?: string }> | null;
      };
    }>;
  };

  const items = (payload.data || []).map(mapServerItem).filter(Boolean) as WishlistItem[];
  writeArrayToStorage(CACHE_KEY, items);
  return items;
}

export async function isWishlisted(productId: number) {
  const items = await getWishlistItems();
  return items.some((item) => item.productId === productId);
}

export async function toggleWishlist(item: WishlistItem) {
  const token = getToken();

  if (!token) {
    const current = readArrayFromStorage(GUEST_KEY);
    const index = current.findIndex((entry) => entry.productId === item.productId);

    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(item);
    }

    writeArrayToStorage(GUEST_KEY, current);
    window.dispatchEvent(new Event(wishlistEventName));
    return index < 0;
  }

  const res = await fetch(`${getStrapiUrl()}/api/wishlist/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId: item.productId }),
  });

  if (!res.ok) {
    throw new Error("Nu am putut actualiza wishlist-ul");
  }

  const payload = (await res.json()) as { data?: { active?: boolean } };
  const serverItems = await getWishlistItems();
  writeArrayToStorage(CACHE_KEY, serverItems);
  window.dispatchEvent(new Event(wishlistEventName));

  return Boolean(payload.data?.active);
}

export function clearWishlistCache() {
  if (!isClient()) {
    return;
  }

  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(GUEST_KEY);
}
