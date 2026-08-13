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

import CandleShowcaseBanner from "../components/CandleShowcaseBanner";

import { FALLBACK_CANDLE_PRODUCTS } from "@/lib/fallbackProducts";

export const metadata: Metadata = {
  title: "Custom Candle Packaging | Candle Boxes, Mailers, Inserts & Labels - Parcela®",
  description: "Explore custom candle packaging solutions including Best Sellers, Product Boxes, Luxury Rigid Boxes, Shipping Mailers, Foam Inserts, Bags, Packing Paper, and Heat Resistant Labels.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomCandlePackagingPage() {
  let categories: IndustryCategory[] = [
    { id: "all", name: "All Products", slug: "all", description: "All Custom Candle Packaging Products" },
    { id: 657, name: "Best sellers", slug: "best-sellers-custom-candle-packaging", description: "Top performing candle boxes & packaging" },
    { id: 658, name: "Product boxes", slug: "product-boxes-custom-candle-packaging", description: "Custom folding cartons & auto-lock candle boxes" },
    { id: 659, name: "Luxury boxes", slug: "luxury-boxes-custom-candle-packaging", description: "Rigid magnetic gift boxes & round paper tubes" },
    { id: 660, name: "Shipping mailer boxes", slug: "shipping-mailer-boxes-custom-candle-packaging", description: "Heavy-duty corrugated e-commerce candle mailers" },
    { id: 661, name: "Box inserts", slug: "box-inserts-custom-candle-packaging", description: "Precision EVA foam & eco-friendly molded pulp inserts" },
    { id: 662, name: "Bags", slug: "bags-custom-candle-packaging", description: "Custom retail kraft bags & gift pouches" },
    { id: 663, name: "Packing paper", slug: "packing-paper", description: "Custom printed tissue & protective cushioning paper" },
    { id: 664, name: "Labels", slug: "labels-custom-candle-packaging", description: "Waterproof vinyl & foil stamped warning labels" },
  ];

  let dynamicProducts: IndustryProduct[] = [];

  try {
    // 1. Fetch WooCommerce categories to get real IDs & counts
    const allWcCats = await getCategories({ per_page: 100 }).catch(() => []);
    const parentCat = allWcCats.find(
      (c) =>
        c.name.toLowerCase() === "custom candle packaging" ||
        c.name.toLowerCase() === "candle packaging" ||
        c.id === 656
    );

    if (parentCat) {
      const subCats = allWcCats.filter((c) => c.parent === parentCat.id);

      if (subCats.length > 0) {
        const wcSubCatList: IndustryCategory[] = [
          { id: "all", name: "All Products", slug: "all", description: "All Custom Candle Packaging Products" },
        ];

        // Maintain specific subcategory order requested by user:
        // Best sellers, Product boxes, Luxury boxes, Shipping mailer boxes, Box inserts, Bags, Packing paper, Labels
        const desiredOrder = [
          "best sellers",
          "product boxes",
          "luxury boxes",
          "shipping mailer boxes",
          "box inserts",
          "bags",
          "packing paper",
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
              description: matched.description || `Custom ${matched.name} for candle packaging`,
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

    // 2. Fetch products for parent category 656 (which includes all subcategories)
    let rawProducts = await getProducts({ category: 656, per_page: 100 }).catch((e) => {
      console.error("getProducts for 656 failed:", e);
      return [];
    });

    // Fallback: If category 656 returns 0 products, try fetching all products
    if (!rawProducts || rawProducts.length === 0) {
      const allProds = await getProducts({ per_page: 100 }).catch(() => []);
      rawProducts = allProds.filter((p) =>
        p.categories?.some((c) => c.id === 656 || c.name.toLowerCase().includes("candle"))
      );
    }

    // 3. Map products to IndustryProduct
    dynamicProducts = rawProducts.map((p) => {
      const parsed = parseWCProductMeta(p);

      const subCatMatch = categories.find((c) =>
        c.id !== "all" && parsed.categories?.some((pc) => pc.id === c.id || pc.slug === c.slug)
      );

      const categoryName = subCatMatch ? subCatMatch.name : (parsed.categories?.[0]?.name || "Candle Packaging");

      const img = parsed.images?.[0]?.src || "/candle/candle_boxes.png";

      return {
        id: parsed.id,
        sku: parsed.sku,
        slug: parsed.slug,
        name: decodeHTMLEntities(parsed.name),
        categorySlug: subCatMatch?.slug || parsed.categories?.[0]?.slug || "candle",
        categoryName,
        categoryIds: parsed.categories?.map((c) => c.id) ?? [],
        categorySlugs: parsed.categories?.map((c) => c.slug) ?? [],
        image: img,
        moq: parsed.moq || "100 Units",
        leadTime: parsed.lead_time || "7-9 Days",
        description: decodeHTMLEntities(
          parsed.short_description?.replace(/<[^>]*>?/gm, "").trim() ||
          parsed.description?.replace(/<[^>]*>?/gm, "").trim() ||
          `Custom engineered ${parsed.name} for candle brands, gift sets, and retail packaging.`
        ),
        featured: parsed.featured,
      };
    });

  } catch (error) {
    console.error("Error loading WooCommerce candle packaging data:", error);
  }

  // Guaranteed fallback if API fails or returns empty on serverless production
  if (!dynamicProducts || dynamicProducts.length === 0) {
    dynamicProducts = FALLBACK_CANDLE_PRODUCTS;
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Banner Section */}
        <SingleIndustryBanner
          title="Custom Candle Packaging"
          badge="PREMIUM CANDLE MANUFACTURING"
          description="Elevate your candle brand with custom folding boxes, rigid luxury gift boxes, protective foam inserts, tissue paper, and heat-resistant labels."
          videoSrc="/cosmatic.mp4"
        />

        {/* Showcase Banner showcasing Candle Packaging Range */}
        <CandleShowcaseBanner />

        {/* Dynamic WooCommerce Products with Candle Subcategory Tabs */}
        <SingleIndustryProductsSection
          industryName="Custom Candle"
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
