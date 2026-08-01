import { NextResponse } from "next/server";
import { getCategories } from "@/lib/woocommerce";

export async function GET() {
  try {
    const categories = await getCategories({ per_page: 100 });
    const formatted = categories
      .filter((cat) => cat.slug !== "uncategorized")
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        count: cat.count,
      }));

    return NextResponse.json({ success: true, categories: formatted });
  } catch (error) {
    console.error("Error fetching WooCommerce categories:", error);
    return NextResponse.json(
      {
        success: false,
        categories: [
          { id: 1, name: "Rigid Boxes", slug: "rigid-boxes" },
          { id: 2, name: "Magnetic Closure Boxes", slug: "magnetic-closure-boxes" },
          { id: 3, name: "Drawer Boxes", slug: "drawer-boxes" },
          { id: 4, name: "Product Packaging", slug: "product-packaging" },
          { id: 5, name: "Flexible Pouches", slug: "flexible-pouches" },
          { id: 6, name: "Paper Shopping Bags", slug: "paper-shopping-bags" },
          { id: 7, name: "Corrugated Boxes", slug: "corrugated-boxes" },
          { id: 8, name: "Mailer Boxes", slug: "mailer-boxes" },
          { id: 9, name: "Poly Mailers", slug: "poly-mailers" },
          { id: 10, name: "Kraft Boxes", slug: "kraft-boxes" },
          { id: 11, name: "Cosmetic Packaging", slug: "cosmetic-packaging" },
          { id: 12, name: "Restaurant Packaging", slug: "restaurant-packaging" },
          { id: 13, name: "Bakery Packaging", slug: "bakery-packaging" },
          { id: 14, name: "Candle Packaging", slug: "candle-packaging" },
          { id: 15, name: "Food & Beverage", slug: "food-beverage" },
          { id: 16, name: "Retail Packaging", slug: "retail-packaging" },
          { id: 17, name: "Jewelry Packaging", slug: "jewelry-packaging" },
          { id: 18, name: "Gift Packaging", slug: "gift-packaging" },
        ],
      },
      { status: 200 }
    );
  }
}
