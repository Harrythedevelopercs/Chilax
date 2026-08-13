import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import SingleIndustryBanner from "../../components/SingleIndustryBanner";
import type { IndustryCategory } from "../../components/SingleIndustryCategoriesSection";
import SingleIndustryProductsSection, { IndustryProduct } from "../../components/SingleIndustryProductsSection";
import Footer from "../../components/Footer";
import { getWPIndustries, getCategories, getProducts, parseWCProductMeta } from "@/lib/woocommerce";
import type { WCProduct } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Default fallback categories if WP/WC data is loading or empty
function formatSlugToTitle(slug: string): string {
  const formatted = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  if (!formatted.toLowerCase().startsWith("custom")) {
    return `Custom ${formatted} Packaging`;
  }
  return formatted.toLowerCase().includes("packaging") ? formatted : `${formatted} Packaging`;
}

function normalizeSlug(slug: string = ""): string {
  return slug
    .toLowerCase()
    .replace(/^custom-/, "")
    .replace(/-and-/g, "-")
    .replace(/&/g, "")
    .replace(/\band\b/g, "")
    .replace(/ies$/g, "y")
    .replace(/es$/g, "")
    .replace(/s$/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = formatSlugToTitle(slug);
  return {
    title: `${title} | Custom Packaging Solutions - Parcela®`,
    description: `Tailored ${title} solutions. Custom packaging engineered for precision, durability, and brand elevation.`,
  };
}

export default async function SingleIndustryPage({ params }: PageProps) {
  const { slug } = await params;

  let title = formatSlugToTitle(slug);
  let description = `Engineered precision meets industrial reliability. We design and manufacture ${title.toLowerCase()} solutions that protect your product and elevate your brand's presence in the global supply chain.`;
  let badge = `${title.toUpperCase()}`;
  let categories: IndustryCategory[] = [];
  let dynamicProducts: IndustryProduct[] = [];

  try {
    const [terms, wcCategories] = await Promise.all([
      getWPIndustries(),
      getCategories({ per_page: 100 }).catch(() => []),
    ]);

    const matchedTerm = terms.find((t) => t.slug === slug || t.slug.includes(slug) || slug.includes(t.slug));

    const isCosmeticSlug =
      slug.toLowerCase().includes("cosmetic") ||
      slug.toLowerCase() === "custom-cosmetics";

    const isBakerySlug =
      slug.toLowerCase().includes("bakery") ||
      slug.toLowerCase().includes("cake");

    if (isCosmeticSlug) {
      const parentCat = wcCategories.find(
        (c) => c.name.toLowerCase() === "custom cosmetic packaging" || c.id === 644
      );

      if (parentCat) {
        title = "Custom Cosmetic Packaging";
        badge = "PREMIUM COSMETIC MANUFACTURING";
        const subCats = wcCategories.filter((c) => c.parent === parentCat.id);

        if (subCats.length > 0) {
          const list: IndustryCategory[] = [
            { id: "all", name: "All Products", slug: "all", description: "All Custom Cosmetic Packaging" },
          ];

          const desiredOrder = [
            "best sellers",
            "product boxes",
            "luxury boxes",
            "shipping mailer boxes",
            "box inserts",
            "labels",
          ];

          desiredOrder.forEach((name) => {
            const matched = subCats.find((sc) => sc.name.toLowerCase() === name);
            if (matched) {
              list.push({
                id: matched.id,
                name: matched.name,
                slug: matched.slug,
                description: matched.description || `Custom ${matched.name}`,
                count: matched.count,
              });
            }
          });

          categories = list;
        }
      }
    } else if (isBakerySlug) {
      const parentCat = wcCategories.find(
        (c) =>
          c.name.toLowerCase() === "bakery & cake" ||
          c.name.toLowerCase() === "bakery packaging" ||
          c.id === 651
      );

      if (parentCat) {
        title = "Custom Bakery & Cake Packaging";
        badge = "PREMIUM BAKERY MANUFACTURING";
        description = "Elevate your bakery brand with custom cake boxes, pastry carriers, food-safe paper bags, cupcake inserts, and personalized labels.";
        const subCats = wcCategories.filter((c) => c.parent === parentCat.id);

        if (subCats.length > 0) {
          const list: IndustryCategory[] = [
            { id: "all", name: "All Products", slug: "all", description: "All Custom Bakery & Cake Packaging" },
          ];

          const desiredOrder = [
            "best sellers",
            "product boxes",
            "bags",
            "labels",
          ];

          desiredOrder.forEach((name) => {
            const matched = subCats.find(
              (sc) =>
                sc.name.toLowerCase() === name ||
                sc.slug.toLowerCase().includes(name.replace(/\s+/g, "-"))
            );
            if (matched) {
              list.push({
                id: matched.id,
                name: matched.name,
                slug: matched.slug,
                description: matched.description || `Custom ${matched.name} for bakery & cake`,
                count: matched.count,
              });
            }
          });

          subCats.forEach((sc) => {
            if (!list.some((c) => c.id === sc.id)) {
              list.push({
                id: sc.id,
                name: sc.name,
                slug: sc.slug,
                description: sc.description,
                count: sc.count,
              });
            }
          });

          categories = list;
        }
      }
    } else if (matchedTerm) {
      title = matchedTerm.name;
      if (matchedTerm.description && matchedTerm.description.trim()) {
        description = matchedTerm.description;
      }
      badge = "PREMIUM B2B MANUFACTURING";

      // Check if term has linked ACF select_categories
      const acfObj = (matchedTerm as unknown as { acf?: { select_categories?: number[] } }).acf;
      if (acfObj && Array.isArray(acfObj.select_categories) && acfObj.select_categories.length > 0) {
        const linkedIds = acfObj.select_categories;
        const mappedCats = wcCategories.filter((c) => linkedIds.includes(c.id));

        if (mappedCats.length > 0) {
          categories = mappedCats.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            image: c.image?.src,
            description: c.description || `Custom ${c.name} for ${title}`,
            count: c.count,
          }));
        }
      }
    }

    // Fetch real WooCommerce products for ALL linked categories
    const numericCatIds = categories
      .map((c) => c.id)
      .filter((id) => typeof id === "number") as number[];

    if (numericCatIds.length > 0) {
      const productBatches = await Promise.all(
        numericCatIds.map(async (catId) => {
          const catObj = categories.find((c) => c.id === catId);
          // WooCommerce already returns child-category products when querying by parent catId.
          // We include all of them — the tab component uses stored categoryIds for accurate filtering.
          const rawProds = await getProducts({ category: catId, per_page: 50 }).catch(() => []);
          return rawProds.map((p) => ({ p, catObj }));
        })
      );

      const flatList = productBatches.flat();

      // Deduplicate by product ID — first occurrence wins for primary category label
      const productMap = new Map<number | string, IndustryProduct>();

      flatList.forEach(({ p, catObj }) => {
        if (!p || !p.id) return;
        if (!productMap.has(p.id)) {
          const parsed = parseWCProductMeta(p);

          // Check if this product directly belongs to any of the tab categories (exact ID or slug match)
          const directTabMatch = categories.find((c) =>
            parsed.categories?.some(
              (pc) => pc.id === c.id || pc.slug === c.slug
            )
          );

          // Use direct tab match for label; fall back to the batch's parent category
          const matchedCat = directTabMatch || catObj;

          productMap.set(p.id, {
            id: parsed.id,
            slug: parsed.slug,
            name: parsed.name,
            categorySlug: matchedCat?.slug || parsed.categories?.[0]?.slug || "packaging",
            categoryName: matchedCat?.name || parsed.categories?.[0]?.name || "Packaging",
            // Store ALL WC category IDs + slugs — used by tab component for accurate counting & filtering
            categoryIds: parsed.categories?.map((c) => c.id) ?? [],
            categorySlugs: parsed.categories?.map((c) => c.slug) ?? [],
            image: parsed.images?.[0]?.src || "/product_packaging.png",
            moq: parsed.moq || "100 Units",
            leadTime: parsed.lead_time || "7-9 Days",
            description:
              parsed.short_description?.replace(/<[^>]*>?/gm, "").trim() ||
              parsed.description?.replace(/<[^>]*>?/gm, "").trim() ||
              `Custom ${parsed.name} for ${title}`,
          });
        }
      });

      dynamicProducts = Array.from(productMap.values());
    }

  } catch (error) {
    console.error("Error fetching industry term/categories/products in page:", error);
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Section 1: Single Industry Banner */}
        <SingleIndustryBanner
          title={title}
          badge={badge}
          description={description}
        />

        {/* Section 2: Dynamic WooCommerce Products with Category Filter Tabs */}
        <SingleIndustryProductsSection
          industryName={title}
          categories={categories}
          initialProducts={dynamicProducts}
        />
      </main>
      <Footer />
    </>
  );
}
