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

import BakeryShowcaseBanner from "../components/BakeryShowcaseBanner";

export const metadata: Metadata = {
  title: "Custom Bakery & Cake Packaging | Cake Boxes, Bags & Labels - Parcela®",
  description: "Explore custom bakery and cake packaging solutions including Best Sellers, Product Boxes, Food-Safe Bags, and Custom Labels crafted for bakeries & pastry shops.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomBakeryPackagingPage() {
  let categories: IndustryCategory[] = [
    { id: "all", name: "All Products", slug: "all", description: "All Custom Bakery & Cake Packaging" },
    { id: 652, name: "Best sellers", slug: "best-sellers-bakery-cake", description: "Top performing cake & pastry boxes" },
    { id: 653, name: "Product boxes", slug: "product-boxes-bakery-cake", description: "Custom retail cake & pastry boxes" },
    { id: 654, name: "Bags", slug: "bags", description: "Food-safe kraft bags & window bread pouches" },
    { id: 655, name: "Labels", slug: "labels-bakery-cake", description: "Custom stickers & box sealing labels" },
  ];

  let dynamicProducts: IndustryProduct[] = [];

  try {
    // 1. Fetch WooCommerce categories to get real IDs & counts
    const allWcCats = await getCategories({ per_page: 100 }).catch(() => []);
    const parentCat = allWcCats.find(
      (c) =>
        c.name.toLowerCase() === "bakery & cake" ||
        c.name.toLowerCase() === "bakery packaging" ||
        c.id === 651
    );

    if (parentCat) {
      const subCats = allWcCats.filter((c) => c.parent === parentCat.id);

      if (subCats.length > 0) {
        // Build subcategory list with real WC data
        const wcSubCatList: IndustryCategory[] = [
          { id: "all", name: "All Products", slug: "all", description: "All Custom Bakery & Cake Packaging" },
        ];

        // Maintain specific order requested: Best sellers, Product boxes, Bags, Labels
        const desiredOrder = [
          "best sellers",
          "product boxes",
          "bags",
          "labels",
        ];

        desiredOrder.forEach((orderName) => {
          const matched = subCats.find(
            (sc) =>
              sc.name.toLowerCase() === orderName ||
              sc.slug.toLowerCase().includes(orderName.replace(/\s+/g, "-"))
          );
          if (matched) {
            wcSubCatList.push({
              id: matched.id,
              name: matched.name,
              slug: matched.slug,
              description: matched.description || `Custom ${matched.name} for bakery & cake`,
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

    // 2. Fetch products for all category IDs (parent 651 & subcategories) in parallel
    const catIdsToFetch = Array.from(
      new Set([
        651,
        ...categories.map((c) => c.id).filter((id) => typeof id === "number") as number[],
      ])
    );

    const productBatches = await Promise.all(
      catIdsToFetch.map((catId) => getProducts({ category: catId, per_page: 100 }).catch(() => []))
    );

    const productMap = new Map();
    productBatches.flat().forEach((p) => {
      if (p && p.id && !productMap.has(p.id)) {
        productMap.set(p.id, p);
      }
    });

    const rawProducts = Array.from(productMap.values());

    // 3. Map products to IndustryProduct
    dynamicProducts = rawProducts.map((p) => {
      const parsed = parseWCProductMeta(p);

      // Find primary subcategory name for card pill
      const subCatMatch = categories.find((c) =>
        c.id !== "all" && parsed.categories?.some((pc) => pc.id === c.id || pc.slug === c.slug)
      );

      const categoryName = subCatMatch ? subCatMatch.name : (parsed.categories?.[0]?.name || "Bakery Packaging");

      // Use exact WooCommerce image (dynamic)
      const img = parsed.images?.[0]?.src || "/product_packaging.png";

      return {
        id: parsed.id,
        sku: parsed.sku,
        slug: parsed.slug,
        name: decodeHTMLEntities(parsed.name),
        categorySlug: subCatMatch?.slug || parsed.categories?.[0]?.slug || "bakery",
        categoryName,
        categoryIds: parsed.categories?.map((c) => c.id) ?? [],
        categorySlugs: parsed.categories?.map((c) => c.slug) ?? [],
        image: img,
        moq: parsed.moq || "100 Units",
        leadTime: parsed.lead_time || "7-9 Days",
        description: decodeHTMLEntities(
          parsed.short_description?.replace(/<[^>]*>?/gm, "").trim() ||
          parsed.description?.replace(/<[^>]*>?/gm, "").trim() ||
          `Custom engineered ${parsed.name} for bakeries, pastry shops, and food packaging.`
        ),
        featured: parsed.featured,
      };
    });

  } catch (error) {
    console.error("Error loading WooCommerce bakery packaging data:", error);
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Banner Section */}
        <SingleIndustryBanner
          title="Custom Bakery & Cake Packaging"
          badge="PREMIUM BAKERY MANUFACTURING"
          description="Elevate your bakery brand with custom cake boxes, pastry carriers, food-safe paper bags, cupcake inserts, and personalized labels."
          videoSrc="/bakery.mp4"
        />

        {/* Showcase Banner showcasing Bakery Packaging Range */}
        <BakeryShowcaseBanner />

        {/* Dynamic WooCommerce Products with Bakery Subcategory Tabs */}
        <SingleIndustryProductsSection
          industryName="Custom Bakery & Cake"
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
