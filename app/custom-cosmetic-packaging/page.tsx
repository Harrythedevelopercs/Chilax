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

import CosmeticsShowcaseBanner from "../components/CosmeticsShowcaseBanner";

export const metadata: Metadata = {
  title: "Custom Cosmetic Packaging | Best Sellers, Boxes & Labels - Parcela®",
  description: "Explore custom cosmetic packaging solutions including Best Sellers, Product Boxes, Luxury Boxes, Mailers, Inserts, and Labels crafted for premium cosmetics.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomCosmeticPackagingPage() {
  let categories: IndustryCategory[] = [
    { id: "all", name: "All Products", slug: "all", description: "All Custom Cosmetic Packaging" },
    { id: 645, name: "Best sellers", slug: "best-sellers", description: "Top performing cosmetic boxes" },
    { id: 646, name: "Product boxes", slug: "product-boxes", description: "Custom retail cosmetic boxes" },
    { id: 647, name: "Luxury boxes", slug: "luxury-boxes", description: "Premium rigid & magnetic boxes" },
    { id: 648, name: "Shipping mailer boxes", slug: "shipping-mailer-boxes", description: "Corrugated e-commerce mailers" },
    { id: 649, name: "Box inserts", slug: "box-inserts", description: "Foam, paperboard & molded inserts" },
    { id: 650, name: "Labels", slug: "labels", description: "Custom stickers & product labels" },
  ];

  let dynamicProducts: IndustryProduct[] = [];

  try {
    // 1. Fetch WooCommerce categories to get real IDs & counts
    const allWcCats = await getCategories({ per_page: 100 }).catch(() => []);
    const parentCat = allWcCats.find(
      (c) => c.name.toLowerCase() === "custom cosmetic packaging" || c.id === 644
    );

    if (parentCat) {
      const subCats = allWcCats.filter((c) => c.parent === parentCat.id);

      if (subCats.length > 0) {
        // Build subcategory list with real WC data
        const wcSubCatList: IndustryCategory[] = [
          { id: "all", name: "All Products", slug: "all", description: "All Custom Cosmetic Packaging" },
        ];

        // Maintain specific order requested
        const desiredOrder = [
          "best sellers",
          "product boxes",
          "luxury boxes",
          "shipping mailer boxes",
          "box inserts",
          "labels",
        ];

        desiredOrder.forEach((orderName) => {
          const matched = subCats.find((sc) => sc.name.toLowerCase() === orderName);
          if (matched) {
            wcSubCatList.push({
              id: matched.id,
              name: matched.name,
              slug: matched.slug,
              description: matched.description || `Custom ${matched.name} for cosmetics`,
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

    // 2. Fetch products for all category IDs (parent & subcategories) in parallel
    const catIdsToFetch = categories
      .map((c) => c.id)
      .filter((id) => typeof id === "number") as number[];

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

      const categoryName = subCatMatch ? subCatMatch.name : (parsed.categories?.[0]?.name || "Cosmetic Packaging");

      // Image selection fallback
      let img = parsed.images?.[0]?.src || "/product_packaging.png";
      const nameLower = parsed.name.toLowerCase();
      if (!parsed.images || parsed.images.length === 0) {
        if (nameLower.includes("label") || nameLower.includes("sticker")) img = "/stickers_labels.png";
        else if (nameLower.includes("insert") || nameLower.includes("foam")) img = "/box_inserts.png";
        else if (nameLower.includes("rigid") || nameLower.includes("magnetic") || nameLower.includes("luxury")) img = "/rigid_boxes.png";
        else if (nameLower.includes("mailer") || nameLower.includes("corrugated")) img = "/corrugated_boxes.png";
        else if (nameLower.includes("sleeve") || nameLower.includes("drawer")) img = "/drawer_boxes.png";
      }

      return {
        id: parsed.id,
        sku: parsed.sku,
        slug: parsed.slug,
        name: decodeHTMLEntities(parsed.name),
        categorySlug: subCatMatch?.slug || parsed.categories?.[0]?.slug || "cosmetics",
        categoryName,
        categoryIds: parsed.categories?.map((c) => c.id) ?? [],
        categorySlugs: parsed.categories?.map((c) => c.slug) ?? [],
        image: img,
        moq: parsed.moq || "100 Units",
        leadTime: parsed.lead_time || "7-9 Days",
        description: decodeHTMLEntities(
          parsed.short_description?.replace(/<[^>]*>?/gm, "").trim() ||
          parsed.description?.replace(/<[^>]*>?/gm, "").trim() ||
          `Custom engineered ${parsed.name} for skincare, cosmetics and beauty packaging.`
        ),
        featured: parsed.featured,
      };
    });

  } catch (error) {
    console.error("Error loading WooCommerce cosmetic packaging data:", error);
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Banner Section */}
        <SingleIndustryBanner
          title="Custom Cosmetic Packaging"
          badge="PREMIUM COSMETIC MANUFACTURING"
          description="Elevate your beauty brand with tailored cosmetic boxes, luxury rigid packaging, e-commerce mailers, custom foam inserts, and waterproof product labels."
          videoSrc="/cosmatic.mp4"
        />

        {/* Showcase Banner showcasing Cosmetic Packaging Range */}
        <CosmeticsShowcaseBanner />

        {/* Dynamic WooCommerce Products with Cosmetic Subcategory Tabs */}
        <SingleIndustryProductsSection
          industryName="Custom Cosmetics"
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
