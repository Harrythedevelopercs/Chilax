import type {
  WCCategory,
  WCCategoryTree,
  WCCategoryParams,
  WCProduct,
  WCProductParams,
} from "./types";

// ─── Config ──────────────────────────────────────────────────────────

const BASE_URL = (
  process.env.NEXT_PUBLIC_WC_URL || "https://purple-manatee-256891.hostingersite.com"
).replace(/\/$/, "");

const CONSUMER_KEY =
  process.env.WC_CONSUMER_KEY || "ck_862f4228314615430415451f1d591c887ca2b4ff";

const CONSUMER_SECRET =
  process.env.WC_CONSUMER_SECRET || "cs_59d29edc3695f437573e0711134b79275e7e7af2";

const WC_API = `${BASE_URL}/wp-json/wc/v3`;

// ─── Helpers ─────────────────────────────────────────────────────────

function buildUrl(endpoint: string, params: Record<string, unknown> = {}, includeAuthInUrl: boolean = false): string {
  const url = new URL(`${WC_API}/${endpoint.replace(/^\//, "")}`);
  
  if (includeAuthInUrl) {
    url.searchParams.set("consumer_key", CONSUMER_KEY);
    url.searchParams.set("consumer_secret", CONSUMER_SECRET);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function fetchWC<T>(endpoint: string, params: Record<string, unknown> = {}, options?: { noCache?: boolean }): Promise<T> {
  const auth = typeof Buffer !== "undefined"
    ? Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")
    : btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);

  // Attempt 1: Standard HTTPS with Basic Authorization Header ONLY (cleanest & safest for Hostinger WAF)
  try {
    const cleanUrl = buildUrl(endpoint, params, false);
    const res = await fetch(cleanUrl, {
      cache: "no-store",
      next: { revalidate: 0 },
      headers: {
        Authorization: `Basic ${auth}`,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Basic Auth Header fetch failed for ${endpoint}, trying query params fallback:`, err);
  }

  // Attempt 2: Fallback with URL Query Parameters ONLY (for hosts where Basic Header is stripped by Nginx proxy)
  const urlWithAuth = buildUrl(endpoint, params, true);
  const res = await fetch(urlWithAuth, {
    cache: "no-store",
    next: { revalidate: 0 },
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json",
    },
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
 * Fetch a single product by ID — always fresh, no cache.
 */
export async function getProductById(id: number): Promise<WCProduct> {
  return fetchWC<WCProduct>(`products/${id}`, {}, { noCache: true });
}

/**
 * Fetch a single product by slug — always fresh, no cache.
 */
export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  const results = await fetchWC<WCProduct[]>("products", { slug } as Record<string, unknown>, { noCache: true });
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
      cache: "no-store",
      next: { revalidate: 0 },
    });

    return res.json();
  } catch (error) {
    console.error("Failed to fetch industries taxonomy:", error);
    return [];
  }
}

/**
 * Helper to decode HTML entities like &amp;, &#039;, &quot;
 */
export function decodeHTMLEntities(str: string = ""): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Helper to parse WooCommerce product meta_data (moq, lead_time).
 */
export function parseWCProductMeta(product: WCProduct): WCProduct & { additionalOptions?: string[]; addons?: string[] } {
  let moq = "100 Units";
  let lead_time = "7-9 Days";
  let additionalOptions: string[] = [];
  let addons: string[] = [];

  if (Array.isArray(product.meta_data)) {
    const moqMeta = product.meta_data.find((m) => m.key === "moq" || m.key === "_moq");
    if (moqMeta && moqMeta.value) moq = String(moqMeta.value);

    const leadMeta = product.meta_data.find((m) => m.key === "lead_time" || m.key === "_lead_time");
    if (leadMeta && leadMeta.value) lead_time = String(leadMeta.value);

    const addOptMeta = product.meta_data.find((m) => m.key === "additional_options" || m.key === "_additional_options");
    if (addOptMeta && addOptMeta.value) {
      if (Array.isArray(addOptMeta.value)) additionalOptions = addOptMeta.value.map(String);
      else if (typeof addOptMeta.value === "string") additionalOptions = addOptMeta.value.split(",").map((s) => s.trim());
    }

    const addonMeta = product.meta_data.find((m) => m.key === "addons" || m.key === "_addons" || m.key === "add_ons");
    if (addonMeta && addonMeta.value) {
      if (Array.isArray(addonMeta.value)) addons = addonMeta.value.map(String);
      else if (typeof addonMeta.value === "string") addons = addonMeta.value.split(",").map((s) => s.trim());
    }
  }

  if (Array.isArray(product.attributes)) {
    const addOptAttr = product.attributes.find((a) => a.name.toLowerCase().includes("additional option"));
    if (addOptAttr && Array.isArray(addOptAttr.options) && addOptAttr.options.length > 0) {
      additionalOptions = addOptAttr.options;
    }

    const addonAttr = product.attributes.find((a) => a.name.toLowerCase().includes("add-on") || a.name.toLowerCase().includes("addon"));
    if (addonAttr && Array.isArray(addonAttr.options) && addonAttr.options.length > 0) {
      addons = addonAttr.options;
    }
  }

  return {
    ...product,
    name: decodeHTMLEntities(product.name),
    moq,
    lead_time,
    additionalOptions,
    addons,
  };
}


