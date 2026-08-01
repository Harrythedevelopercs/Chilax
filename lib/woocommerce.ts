import type {
  WCCategory,
  WCCategoryTree,
  WCCategoryParams,
  WCProduct,
  WCProductParams,
} from "./types";

// ─── Config ──────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_WC_URL!;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET!;

const WC_API = `${BASE_URL}/wp-json/wc/v3`;

// ─── Helpers ─────────────────────────────────────────────────────────

function buildUrl(endpoint: string, params: Record<string, unknown> = {}): string {
  const url = new URL(`${WC_API}/${endpoint}`);
  url.searchParams.set("consumer_key", CONSUMER_KEY);
  url.searchParams.set("consumer_secret", CONSUMER_SECRET);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function fetchWC<T>(endpoint: string, params: Record<string, unknown> = {}): Promise<T> {
  const url = buildUrl(endpoint, params);

  const res = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour on server
  });

  if (!res.ok) {
    throw new Error(`WooCommerce API Error: ${res.status} ${res.statusText} — ${endpoint}`);
  }

  return res.json();
}

// ─── Categories ──────────────────────────────────────────────────────

/**
 * Fetch all product categories (handles pagination automatically).
 */
export async function getCategories(params?: WCCategoryParams): Promise<WCCategory[]> {
  const allCategories: WCCategory[] = [];
  let page = 1;
  const perPage = params?.per_page ?? 100;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const batch = await fetchWC<WCCategory[]>("products/categories", {
      ...params,
      per_page: perPage,
      page,
    });

    allCategories.push(...batch);

    if (batch.length < perPage) break;
    page++;
  }

  return allCategories;
}

/**
 * Fetch only parent (top-level) categories.
 */
export async function getParentCategories(): Promise<WCCategory[]> {
  const all = await getCategories({ per_page: 100 });
  return all
    .filter((cat) => cat.parent === 0 && cat.slug !== "uncategorized")
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Fetch subcategories for a given parent category ID.
 */
export async function getSubcategories(parentId: number): Promise<WCCategory[]> {
  return fetchWC<WCCategory[]>("products/categories", {
    parent: parentId,
    per_page: 100,
  });
}

/**
 * Build a full category tree (parents with nested children).
 */
export async function getCategoryTree(): Promise<WCCategoryTree[]> {
  const all = await getCategories({ per_page: 100 });

  const parentCategories = all.filter(
    (cat) => cat.parent === 0 && cat.slug !== "uncategorized"
  );

  const tree: WCCategoryTree[] = parentCategories
    .map((parent) => ({
      ...parent,
      children: all
        .filter((child) => child.parent === parent.id)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((child) => ({ ...child, children: [] })),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return tree;
}

/**
 * Fetch a single category by ID.
 */
export async function getCategoryById(id: number): Promise<WCCategory> {
  return fetchWC<WCCategory>(`products/categories/${id}`);
}

/**
 * Fetch a single category by slug.
 */
export async function getCategoryBySlug(slug: string): Promise<WCCategory | null> {
  const results = await fetchWC<WCCategory[]>("products/categories", { slug } as Record<string, unknown>);
  return results.length > 0 ? results[0] : null;
}

// ─── Products ────────────────────────────────────────────────────────

/**
 * Fetch products with optional filters.
 */
export async function getProducts(params?: WCProductParams): Promise<WCProduct[]> {
  return fetchWC<WCProduct[]>("products", {
    per_page: 20,
    ...params,
  });
}

/**
 * Fetch all products for a specific category.
 */
export async function getProductsByCategory(
  categoryId: number,
  params?: Omit<WCProductParams, "category">
): Promise<WCProduct[]> {
  return getProducts({ ...params, category: categoryId });
}

/**
 * Fetch a single product by ID.
 */
export async function getProductById(id: number): Promise<WCProduct> {
  return fetchWC<WCProduct>(`products/${id}`);
}

/**
 * Fetch a single product by slug.
 */
export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  const results = await fetchWC<WCProduct[]>("products", { slug } as Record<string, unknown>);
  return results.length > 0 ? results[0] : null;
}

/**
 * Fetch featured products.
 */
export async function getFeaturedProducts(limit: number = 8): Promise<WCProduct[]> {
  return getProducts({ featured: true, per_page: limit });
}

/**
 * Search products by keyword.
 */
export async function searchProducts(query: string, limit: number = 20): Promise<WCProduct[]> {
  return getProducts({ search: query, per_page: limit });
}

// ─── Industries Taxonomy ────────────────────────────────────────────────

/**
 * Fetch all terms from custom WP taxonomy `industry`.
 */
export async function getWPIndustries(): Promise<import("./types").WPIndustryTerm[]> {
  try {
    const url = `${BASE_URL}/wp-json/wp/v2/industry?per_page=100`;
    const res = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      console.warn(`getWPIndustries error: ${res.status} ${res.statusText}`);
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch industries taxonomy:", error);
    return [];
  }
}

