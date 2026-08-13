import type { WCCategory, WCProduct } from "./types";

const BASE_URL = (
  process.env.NEXT_PUBLIC_WC_URL || "https://purple-manatee-256891.hostingersite.com"
).replace(/\/$/, "");

const GRAPHQL_URL = `${BASE_URL}/graphql`;

/**
 * Execute a GraphQL query against the WordPress / WPGraphQL endpoint.
 */
export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`GraphQL HTTP Error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors && json.errors.length > 0) {
    throw new Error(`GraphQL Execution Error: ${json.errors[0].message}`);
  }

  return json.data;
}

// ─── GraphQL Queries ─────────────────────────────────────────────────

export const GET_CATEGORIES_QUERY = `
  query GetCategories {
    productCategories(first: 100) {
      nodes {
        databaseId
        id
        name
        slug
        description
        count
        parentDatabaseId
        image {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export const GET_PRODUCTS_QUERY = `
  query GetProducts($category: String, $first: Int = 100) {
    products(where: { category: $category }, first: $first) {
      nodes {
        databaseId
        id
        name
        slug
        sku
        featured
        shortDescription
        description
        image {
          sourceUrl
          altText
        }
        productCategories {
          nodes {
            databaseId
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG_QUERY = `
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      databaseId
      id
      name
      slug
      sku
      featured
      shortDescription
      description
      image {
        sourceUrl
        altText
      }
      productCategories {
        nodes {
          databaseId
          name
          slug
        }
      }
    }
  }
`;

// ─── GraphQL Data Mapping Helpers ────────────────────────────────────

export async function getGraphQLCategories(): Promise<WCCategory[]> {
  try {
    const data = await fetchGraphQL<{
      productCategories: {
        nodes: Array<{
          databaseId: number;
          id: string;
          name: string;
          slug: string;
          description: string;
          count: number;
          parentDatabaseId: number;
          image?: { sourceUrl: string; altText: string };
        }>;
      };
    }>(GET_CATEGORIES_QUERY);

    return data.productCategories.nodes.map((node) => ({
      id: node.databaseId,
      name: node.name,
      slug: node.slug,
      parent: node.parentDatabaseId || 0,
      description: node.description || "",
      display: "default",
      image: node.image
        ? {
            id: 0,
            date_created: "",
            date_modified: "",
            src: node.image.sourceUrl,
            name: node.name,
            alt: node.image.altText || node.name,
          }
        : null,
      menu_order: 0,
      count: node.count || 0,
    }));
  } catch (error) {
    console.error("getGraphQLCategories failed:", error);
    throw error;
  }
}

export async function getGraphQLProducts(categorySlug?: string, limit: number = 100): Promise<WCProduct[]> {
  try {
    const data = await fetchGraphQL<{
      products: {
        nodes: Array<{
          databaseId: number;
          id: string;
          name: string;
          slug: string;
          sku: string;
          featured: boolean;
          shortDescription: string;
          description: string;
          image?: { sourceUrl: string; altText: string };
          productCategories?: {
            nodes: Array<{ databaseId: number; name: string; slug: string }>;
          };
        }>;
      };
    }>(GET_PRODUCTS_QUERY, { category: categorySlug, first: limit });

    return data.products.nodes.map((node) => ({
      id: node.databaseId,
      name: node.name,
      slug: node.slug,
      permalink: `${BASE_URL}/product/${node.slug}`,
      type: "simple",
      status: "publish",
      featured: node.featured || false,
      description: node.description || "",
      short_description: node.shortDescription || "",
      sku: node.sku || "",
      price: "0",
      regular_price: "0",
      sale_price: "0",
      on_sale: false,
      stock_status: "instock",
      categories: node.productCategories?.nodes.map((c) => ({
        id: c.databaseId,
        name: c.name,
        slug: c.slug,
      })) || [],
      images: node.image
        ? [
            {
              id: 0,
              date_created: "",
              date_modified: "",
              src: node.image.sourceUrl,
              name: node.name,
              alt: node.image.altText || node.name,
            },
          ]
        : [],
      attributes: [],
      dimensions: { length: "", width: "", height: "" },
      weight: "",
      meta_data: [],
      date_created: "",
      date_modified: "",
    }));
  } catch (error) {
    console.error("getGraphQLProducts failed:", error);
    throw error;
  }
}
