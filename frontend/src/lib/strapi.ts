const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

export async function fetchAPI(
  endpoint: string,
  options?: RequestInit & { params?: Record<string, string> }
) {
  const url = new URL(`/api${endpoint}`, STRAPI_URL);
  
  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const res = await fetch(url.toString(), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Types pentru Strapi responses
export interface StrapiResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta?: object;
}

// Category types (Strapi v5 — flat structure)
export interface Category {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description?: string;
  image?: {
    url?: string;
    alternativeText?: string;
  } | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Product types (Strapi v5 — flat structure)
export interface Product {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  oldPrice?: number;
  stockQuantity: number;
  images?: {
    url?: string;
    alternativeText?: string;
  }[] | null;
  category?: Category | null;
  sku?: string;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Cart item for localStorage
export interface CartItem {
  productId: number;
  quantity: number;
  titleSnapshot: string;
  priceSnapshot: number;
  slug: string;
  categorySlug?: string;
  imageUrl?: string;
}
