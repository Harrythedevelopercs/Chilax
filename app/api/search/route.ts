import { NextResponse } from "next/server";
import { getProducts, getCategories, parseWCProductMeta, decodeHTMLEntities } from "@/lib/woocommerce";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    if (!query.trim()) {
      return NextResponse.json({ products: [], categories: [] });
    }

    const qLower = query.toLowerCase().trim();

    // 1. Fetch matching products from WooCommerce
    const rawProducts = await getProducts({ search: query, per_page: 20 }).catch(() => []);

    // 2. Fetch categories matching query
    const allCats = await getCategories({ per_page: 100 }).catch(() => []);
    const matchedCats = allCats
      .filter((c) => c.name.toLowerCase().includes(qLower) || c.slug.toLowerCase().includes(qLower))
      .slice(0, 4)
      .map((c) => ({
        id: c.id,
        name: decodeHTMLEntities(c.name),
        slug: c.slug,
        count: c.count || 0,
      }));

    // 3. Format product results
    const formattedProducts = rawProducts.map((p) => {
      const parsed = parseWCProductMeta(p);
      return {
        id: parsed.id,
        sku: parsed.sku,
        slug: parsed.slug,
        name: decodeHTMLEntities(parsed.name),
        categoryName: parsed.categories[0]?.name || "Custom Packaging",
        categorySlug: parsed.categories[0]?.slug || "packaging",
        image: parsed.images[0]?.src || "/product_packaging.png",
        moq: parsed.moq || "100 Units",
        leadTime: parsed.lead_time || "7-9 Days",
      };
    });

    return NextResponse.json({
      products: formattedProducts,
      categories: matchedCats,
    });
  } catch (error) {
    console.error("Error in live search API:", error);
    return NextResponse.json({ products: [], categories: [], error: "Search failed" }, { status: 500 });
  }
}
