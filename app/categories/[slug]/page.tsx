import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import SingleCategoryBanner from "@/app/components/SingleCategoryBanner";
import SingleCategoryProductsSection, { CategoryProduct } from "@/app/components/SingleCategoryProductsSection";
import CategorySpecsSection from "@/app/components/CategorySpecsSection";
import TestimonialsSection from "@/app/components/TestimonialsSection";
import FAQSection from "@/app/components/FAQSection";
import Footer from "@/app/components/Footer";
import { getCategories, getCategoryBySlug, getProducts, parseWCProductMeta, decodeHTMLEntities } from "@/lib/woocommerce";

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatSlugToTitle(slug: string): string {
  const formatted = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  if (
    !formatted.toLowerCase().includes("box") &&
    !formatted.toLowerCase().includes("packaging") &&
    !formatted.toLowerCase().includes("pouch") &&
    !formatted.toLowerCase().includes("bag")
  ) {
    return `Custom ${formatted} Boxes & Packaging`;
  }
  return `Custom ${formatted}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = formatSlugToTitle(slug);
  return {
    title: `${title} | Custom Packaging Manufacturer - Parcela®`,
    description: `Order ${title} with low MOQ, fast turnaround, free design support, and factory-direct pricing.`,
  };
}

export default async function SingleCategoryPage({ params }: PageProps) {
  const { slug } = await params;

  let title = formatSlugToTitle(slug);
  let description = `Custom precision-manufactured ${title.toLowerCase()} tailored to your brand specifications. Designed for maximum structural durability and elevated retail unboxing.`;
  let bannerImage = "/product_packaging.png";
  let moq = "100 Units";
  let turnaround = "7-9 Days";
  let categoryProducts: CategoryProduct[] = [];

  try {
    // Attempt fetching live category from WooCommerce
    const wcCategory = await getCategoryBySlug(slug);

    if (wcCategory) {
      title = wcCategory.name.toLowerCase().startsWith("custom")
        ? decodeHTMLEntities(wcCategory.name)
        : `Custom ${decodeHTMLEntities(wcCategory.name)}`;
      if (wcCategory.description && wcCategory.description.trim()) {
        description = decodeHTMLEntities(wcCategory.description.replace(/<[^>]*>?/gm, "").trim());
      }
      // Fetch live products for this category ID
      const rawProducts = await getProducts({ category: wcCategory.id, per_page: 50 }).catch(() => []);

      if (wcCategory.image?.src) {
        bannerImage = wcCategory.image.src;
      } else if (rawProducts && rawProducts.length > 0 && rawProducts[0].images?.[0]?.src) {
        bannerImage = rawProducts[0].images[0].src;
      }

      if (rawProducts && rawProducts.length > 0) {
        categoryProducts = rawProducts.map((p) => {
          const parsed = parseWCProductMeta(p);
          return {
            id: parsed.id,
            slug: parsed.slug,
            name: decodeHTMLEntities(parsed.name),
            image: parsed.images[0]?.src || bannerImage,
            moq: parsed.moq || "100 Units",
            leadTime: parsed.lead_time || "7-9 Days",
            description: decodeHTMLEntities(
              parsed.short_description?.replace(/<[^>]*>?/gm, "").trim() ||
              parsed.description?.replace(/<[^>]*>?/gm, "").trim() ||
              `Custom ${parsed.name} box style`
            ),
          };
        });
      }
    } else {
      // If direct slug match is not found in WC, fetch all categories to see if any slug ends with/contains the term
      const allCats = await getCategories({ per_page: 100 }).catch(() => []);
      const matched = allCats.find(
        (c) => c.slug.toLowerCase() === slug.toLowerCase() || c.slug.includes(slug) || slug.includes(c.slug)
      );

      if (matched) {
        title = matched.name.toLowerCase().startsWith("custom")
          ? decodeHTMLEntities(matched.name)
          : `Custom ${decodeHTMLEntities(matched.name)}`;
        if (matched.description) description = decodeHTMLEntities(matched.description.replace(/<[^>]*>?/gm, "").trim());

        const rawProducts = await getProducts({ category: matched.id, per_page: 50 }).catch(() => []);

        if (matched.image?.src) {
          bannerImage = matched.image.src;
        } else if (rawProducts && rawProducts.length > 0 && rawProducts[0].images?.[0]?.src) {
          bannerImage = rawProducts[0].images[0].src;
        }

        if (rawProducts && rawProducts.length > 0) {
          categoryProducts = rawProducts.map((p) => {
            const parsed = parseWCProductMeta(p);
            return {
              id: parsed.id,
              slug: parsed.slug,
              name: decodeHTMLEntities(parsed.name),
              image: parsed.images[0]?.src || bannerImage,
              moq: parsed.moq || "100 Units",
              leadTime: parsed.lead_time || "7-9 Days",
              description: decodeHTMLEntities(
                parsed.short_description?.replace(/<[^>]*>?/gm, "").trim() ||
                parsed.description?.replace(/<[^>]*>?/gm, "").trim() ||
                `Custom ${parsed.name} box style`
              ),
            };
          });
        }
      }
    }
  } catch (error) {
    console.error("Error loading single category page dynamic data:", error);
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Category Hero Banner */}
        <SingleCategoryBanner
          title={title}
          description={description}
          image={bannerImage}
          moq={moq}
          turnaround={turnaround}
        />

        {/* Category Products Showcase */}
        <SingleCategoryProductsSection
          categoryTitle={title}
          products={categoryProducts}
        />

        {/* Specs & Customization Breakdown */}
        <CategorySpecsSection categoryTitle={title} />

        {/* Social Proof */}
        <TestimonialsSection />

        {/* FAQs */}
        <FAQSection />
      </main>

      <Footer />
    </>
  );
}
