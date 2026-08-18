import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import SingleIndustryBanner from "../components/SingleIndustryBanner";
import SingleIndustryProductsSection, { IndustryProduct } from "../components/SingleIndustryProductsSection";
import CategorySpecsSection from "../components/CategorySpecsSection";
import CustomPackagingFormSection from "../components/CustomPackagingFormSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import { getCategories, getProducts, parseWCProductMeta, decodeHTMLEntities } from "@/lib/woocommerce";
import type { IndustryCategory } from "../components/SingleIndustryCategoriesSection";
import RestaurantShowcaseBanner from "../components/RestaurantShowcaseBanner";

export const metadata: Metadata = {
  title: "Custom Restaurant Packaging & Boxes | Takeout Containers, Pizza Boxes & Bags - Parcela®",
  description: "Explore custom restaurant packaging solutions including Pizza Boxes, Take Out Containers, Biodegradable Containers, Clamshell Boxes, Food Trays, Paper Bags, Beverage Carriers, and Branded Sleeves.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomRestaurantPackagingPage() {
  let categories: IndustryCategory[] = [
    { id: "all", name: "All Products", slug: "all", description: "All Custom Restaurant Packaging & Boxes" },
    { id: 673, name: "Pizza Boxes", slug: "pizza-boxes", description: "Perfect box for pizza and flat bread foods." },
    { id: 674, name: "One Piece Take Out Boxes", slug: "one-piece-take-out-boxes", description: "Versatile container for entrees, sides and desserts." },
    { id: 675, name: "Two Piece Take Out Boxes", slug: "two-piece-take-out-boxes", description: "Tray and lid boxes for sushi bentos and other entrees." },
    { id: 676, name: "Biodegradable Containers", slug: "biodegradable-containers", description: "Made from renewable cornstarch and sugarcane." },
    { id: 677, name: "Chinese Take Out Boxes", slug: "chinese-take-out-boxes", description: "Classic chinese boxes to hold noodles and rice." },
    { id: 678, name: "Clamshell Boxes", slug: "clamshell-boxes", description: "Hinged containers to easily serve sandwiches." },
    { id: 679, name: "Catering Transport Trays", slug: "catering-transport-trays", description: "Convenient transport trays for large food orders." },
    { id: 680, name: "Carrier Boxes", slug: "carrier-boxes", description: "Easy to carry boxes for baked goods and cakes." },
    { id: 681, name: "Food Trays", slug: "food-trays", description: "Easily serve finger foods and freshly made foods." },
    { id: 682, name: "Beverage Carriers", slug: "beverage-carriers", description: "Sturdy, multi-compartment beverage carriers." },
    { id: 683, name: "Paper Cups & Bowls", slug: "paper-cups-bowls", description: "Round containers to carry liquids and soups." },
    { id: 684, name: "Paper Bags", slug: "paper-bags", description: "Various paper bags to hold food and take out boxes." },
    { id: 685, name: "Paper Sleeves", slug: "paper-sleeves", description: "Heat resistant cup sleeves and securing box sleeves." },
    { id: 686, name: "Labels & Stickers", slug: "labels-stickers", description: "Personalize your boxes with branded stickers." },
    { id: 687, name: "Food Wrap & Liners", slug: "food-wrap-liners", description: "Complete brand experience with printed wraps and liners." },
    { id: 688, name: "Straws & Utensils", slug: "straws-utensils", description: "Custom branded utensils, straws and stirers." },
  ];

  let dynamicProducts: IndustryProduct[] = [];

  try {
    // 1. Fetch WooCommerce categories to get real IDs & counts
    const allWcCats = await getCategories({ per_page: 100 }).catch(() => []);
    const parentCat = allWcCats.find(
      (c) =>
        c.name.toLowerCase() === "custom restaurant packaging & boxes" ||
        c.name.toLowerCase() === "custom restaurant packaging" ||
        c.name.toLowerCase() === "restaurant packaging" ||
        c.slug === "custom-restaurant-packaging" ||
        c.id === 672
    );

    if (parentCat) {
      const subCats = allWcCats.filter((c) => c.parent === parentCat.id);

      if (subCats.length > 0) {
        const wcSubCatList: IndustryCategory[] = [
          { id: "all", name: "All Products", slug: "all", description: "All Custom Restaurant Packaging & Boxes" },
        ];

        // Specific subcategory order requested:
        const desiredOrder = [
          "pizza boxes",
          "one piece take out boxes",
          "two piece take out boxes",
          "biodegradable containers",
          "chinese take out boxes",
          "clamshell boxes",
          "catering transport trays",
          "carrier boxes",
          "food trays",
          "beverage carriers",
          "paper cups & bowls",
          "paper bags",
          "paper sleeves",
          "labels & stickers",
          "food wrap & liners",
          "straws & utensils",
        ];

        desiredOrder.forEach((orderName) => {
          const matched = subCats.find(
            (sc) =>
              sc.name.toLowerCase() === orderName ||
              sc.slug.toLowerCase().includes(orderName.replace(/&/g, "and").replace(/\s+/g, "-")) ||
              sc.slug.toLowerCase().includes(orderName.replace(/\s+/g, "-"))
          );
          if (matched) {
            wcSubCatList.push({
              id: matched.id,
              name: matched.name,
              slug: matched.slug,
              description: matched.description || `Custom ${matched.name} for restaurant packaging`,
              count: matched.count,
            });
          }
        });

        // Add any remaining subcategories not in desired order list
        subCats.forEach((sc) => {
          if (!wcSubCatList.some((c) => c.id === sc.id)) {
            wcSubCatList.push({
              id: sc.id,
              name: sc.name,
              slug: sc.slug,
              description: sc.description,
              count: sc.count,
            });
          }
        });

        categories = wcSubCatList;
      }
    }

    // 2. Fetch products for parent category 672 (which includes all subcategories)
    let rawProducts = await getProducts({ category: 672, per_page: 100 }).catch((e) => {
      console.error("getProducts for 672 failed:", e);
      return [];
    });

    // Fallback: If category 672 returns 0 products, search products by restaurant keywords or all
    if (!rawProducts || rawProducts.length === 0) {
      const allProds = await getProducts({ per_page: 100 }).catch(() => []);
      rawProducts = allProds.filter((p) =>
        p.categories?.some(
          (c) =>
            c.id === 672 ||
            c.name.toLowerCase().includes("restaurant") ||
            c.name.toLowerCase().includes("pizza") ||
            c.name.toLowerCase().includes("take out")
        )
      );
    }

    // 3. Map products to IndustryProduct
    dynamicProducts = rawProducts.map((p) => {
      const parsed = parseWCProductMeta(p);

      const subCatMatch = categories.find((c) =>
        c.id !== "all" && parsed.categories?.some((pc) => pc.id === c.id || pc.slug === c.slug)
      );

      const categoryName = subCatMatch ? subCatMatch.name : (parsed.categories?.[0]?.name || "Restaurant Packaging");

      const img = parsed.images?.[0]?.src || "/product_packaging.png";

      return {
        id: parsed.id,
        sku: parsed.sku,
        slug: parsed.slug,
        name: decodeHTMLEntities(parsed.name),
        categorySlug: subCatMatch?.slug || parsed.categories?.[0]?.slug || "restaurant-packaging",
        categoryName,
        categoryIds: parsed.categories?.map((c) => c.id) ?? [],
        categorySlugs: parsed.categories?.map((c) => c.slug) ?? [],
        image: img,
        moq: parsed.moq || "100 Units",
        leadTime: parsed.lead_time || "7-9 Days",
        description: decodeHTMLEntities(
          parsed.short_description?.replace(/<[^>]*>?/gm, "").trim() ||
          parsed.description?.replace(/<[^>]*>?/gm, "").trim() ||
          `Custom engineered ${parsed.name} for restaurants, food chains, and takeout services.`
        ),
        featured: parsed.featured,
      };
    });

  } catch (error) {
    console.error("Error loading WooCommerce restaurant packaging data:", error);
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Banner Section */}
        <SingleIndustryBanner
          title="Custom Restaurant Packaging & Boxes"
          badge="PREMIUM FOOD & RESTAURANT MANUFACTURING"
          description="Elevate your food brand with custom pizza boxes, biodegradable containers, takeout clamshells, paper cups, beverage carriers, food wraps, and custom printed stickers."
          videoSrc="/restaurant.mp4"
        />

        {/* Showcase Banner showcasing Restaurant Packaging Range */}
        <RestaurantShowcaseBanner />

        {/* Dynamic WooCommerce Products with Restaurant Subcategory Tabs */}
        <SingleIndustryProductsSection
          industryName="Custom Restaurant Packaging & Boxes"
          categories={categories}
          initialProducts={dynamicProducts}
        />

        {/* Specifications & Packaging Features */}
        <CategorySpecsSection />

        {/* Custom Quote Form */}
        <CustomPackagingFormSection />

        {/* FAQ Section */}
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
