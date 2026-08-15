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
import JewelryShowcaseBanner from "../components/JewelryShowcaseBanner";

export const metadata: Metadata = {
  title: "Custom Jewelry & Accessories Packaging | Luxury Rigid Boxes, Pouches & Inserts - Parcela®",
  description: "Explore bespoke custom jewelry packaging solutions including Best Sellers, Luxury Rigid Boxes, Shipping Packaging, Velvet Pouches & Bags, Custom Box Inserts, and Anti-Tarnish Labels.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomJewelryPackagingPage() {
  let categories: IndustryCategory[] = [
    { id: "all", name: "All Products", slug: "all", description: "All Custom Jewelry & Accessories Packaging" },
    { id: 666, name: "Best sellers", slug: "best-sellers-custom-jewelry-accessories-packaging", description: "Top performing luxury jewelry boxes & packaging" },
    { id: 667, name: "Luxury boxes", slug: "luxury-boxes-custom-jewelry-accessories-packaging", description: "Custom rigid drawer slide boxes & magnetic closure gift boxes" },
    { id: 668, name: "Shipping packaging", slug: "shipping-packaging", description: "Tamper-evident corrugated e-commerce jewelry mailers" },
    { id: 669, name: "Bags", slug: "bags-custom-jewelry-accessories-packaging", description: "Microfiber drawstring pouches & luxury paper gift bags" },
    { id: 670, name: "Box inserts", slug: "box-inserts-custom-jewelry-accessories-packaging", description: "Anti-tarnish velvet foam & precision slotted cushion inserts" },
    { id: 671, name: "Labels", slug: "labels-custom-jewelry-accessories-packaging", description: "Gold foil stamped seal stickers & earring display cards" },
  ];

  let dynamicProducts: IndustryProduct[] = [];

  try {
    // 1. Fetch WooCommerce categories to get real IDs & counts
    const allWcCats = await getCategories({ per_page: 100 }).catch(() => []);
    const parentCat = allWcCats.find(
      (c) =>
        c.name.toLowerCase() === "custom jewelry & accessories packaging" ||
        c.name.toLowerCase() === "custom jewelry packaging" ||
        c.slug === "custom-jewelry-accessories-packaging" ||
        c.id === 665
    );

    if (parentCat) {
      const subCats = allWcCats.filter((c) => c.parent === parentCat.id);

      if (subCats.length > 0) {
        const wcSubCatList: IndustryCategory[] = [
          { id: "all", name: "All Products", slug: "all", description: "All Custom Jewelry & Accessories Packaging" },
        ];

        // Specific subcategory order requested:
        // Best sellers, Luxury boxes, Shipping packaging, Bags, Box inserts, Labels
        const desiredOrder = [
          "best sellers",
          "luxury boxes",
          "shipping packaging",
          "bags",
          "box inserts",
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
              description: matched.description || `Custom ${matched.name} for jewelry and accessories`,
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

    // 2. Fetch products for parent category 665 (which includes all subcategories)
    let rawProducts = await getProducts({ category: 665, per_page: 100 }).catch((e) => {
      console.error("getProducts for 665 failed:", e);
      return [];
    });

    // Fallback: If category 665 returns 0 products, try fetching all products and filter
    if (!rawProducts || rawProducts.length === 0) {
      const allProds = await getProducts({ per_page: 100 }).catch(() => []);
      rawProducts = allProds.filter((p) =>
        p.categories?.some(
          (c) => c.id === 665 || c.name.toLowerCase().includes("jewelry") || c.name.toLowerCase().includes("accessories")
        )
      );
    }

    // 3. Map products to IndustryProduct
    dynamicProducts = rawProducts.map((p) => {
      const parsed = parseWCProductMeta(p);

      const subCatMatch = categories.find((c) =>
        c.id !== "all" && parsed.categories?.some((pc) => pc.id === c.id || pc.slug === c.slug)
      );

      const categoryName = subCatMatch ? subCatMatch.name : (parsed.categories?.[0]?.name || "Jewelry Packaging");

      const img = parsed.images?.[0]?.src || "/jewelry/jewelry_luxury_rigid.png";

      return {
        id: parsed.id,
        sku: parsed.sku,
        slug: parsed.slug,
        name: decodeHTMLEntities(parsed.name),
        categorySlug: subCatMatch?.slug || parsed.categories?.[0]?.slug || "jewelry",
        categoryName,
        categoryIds: parsed.categories?.map((c) => c.id) ?? [],
        categorySlugs: parsed.categories?.map((c) => c.slug) ?? [],
        image: img,
        moq: parsed.moq || "100 Units",
        leadTime: parsed.lead_time || "7-9 Days",
        description: decodeHTMLEntities(
          parsed.short_description?.replace(/<[^>]*>?/gm, "").trim() ||
          parsed.description?.replace(/<[^>]*>?/gm, "").trim() ||
          `Custom engineered ${parsed.name} for jewelry brands, luxury accessories, and gift sets.`
        ),
        featured: parsed.featured,
      };
    });

  } catch (error) {
    console.error("Error loading WooCommerce jewelry packaging data:", error);
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Banner Section */}
        <SingleIndustryBanner
          title="Custom Jewelry & Accessories Packaging"
          badge="PREMIUM JEWELRY MANUFACTURING"
          description="Elevate your jewelry brand with bespoke rigid gift boxes, soft velvet drawstring pouches, anti-tarnish foam inserts, earring display cards, and tamper-proof mailers."
          videoSrc="/candle.mp4"
        />

        {/* Showcase Banner showcasing Jewelry Packaging Range */}
        <JewelryShowcaseBanner />

        {/* Dynamic WooCommerce Products with Jewelry Subcategory Tabs */}
        <SingleIndustryProductsSection
          industryName="Custom Jewelry & Accessories"
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
