import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import SingleProductBanner, { SingleProductBannerData } from "../../components/SingleProductBanner";
import CustomPackagingFormSection from "../../components/CustomPackagingFormSection";
import ProductReviewsSection from "../../components/ProductReviewsSection";
import FAQSection from "../../components/FAQSection";
import Footer from "../../components/Footer";
import { getProductById, getProductBySlug, parseWCProductMeta, decodeHTMLEntities } from "@/lib/woocommerce";
import type { WCProduct } from "@/lib/types";

// Force dynamic rendering — no static generation, always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatSlugToTitle(slug: string): string {
  const formatted = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  if (!formatted.toLowerCase().startsWith("custom")) {
    return `Custom ${formatted}`;
  }
  return formatted;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = formatSlugToTitle(slug);
  return {
    title: `${title} | Custom Packaging Manufacturer - Parcela®`,
    description: `Order ${title} with low MOQ, fast turnaround, and free design support. Fully customizable structural B2B packaging.`,
  };
}

export default async function SingleProductPage({ params }: PageProps) {
  const { slug } = await params;

  let productData: SingleProductBannerData | null = null;

  try {
    let rawProduct: WCProduct | null = null;

    // Check if slug is a numeric WooCommerce Product ID or slug string
    if (!isNaN(Number(slug))) {
      rawProduct = await getProductById(Number(slug));
    } else {
      rawProduct = await getProductBySlug(slug);
    }

    if (rawProduct) {
      const parsed = parseWCProductMeta(rawProduct);
      const allImages = Array.isArray(parsed.images) && parsed.images.length > 0
        ? parsed.images.map((i) => i.src)
        : [parsed.images?.[0]?.src || "/product_packaging.png"];

      productData = {
        id: parsed.id,
        name: decodeHTMLEntities(parsed.name),
        categoryName: parsed.categories[0]?.name || "Custom Packaging",
        categorySlug: parsed.categories[0]?.slug || "packaging",
        image: allImages[0] || "/product_packaging.png",
        images: allImages,
        shortDescription: decodeHTMLEntities(
          parsed.short_description?.replace(/<[^>]*>?/gm, "").trim() ||
          parsed.description?.replace(/<[^>]*>?/gm, "").trim() ||
          `Custom engineered ${parsed.name} for beauty, retail and B2B packaging.`
        ),
        moq: parsed.moq || "100 Units",
        leadTime: parsed.lead_time || "7-9 Days",
        material: "Custom Cardstock / Board",
        printing: "Full CMYK / Foil Stamping",
        additionalOptions: parsed.additionalOptions,
        addons: parsed.addons,
      };
    }
  } catch (error) {
    console.error("Error fetching dynamic WooCommerce product:", error);
  }

  // Fallback to title formatted object if rawProduct not found
  if (!productData) {
    productData = {
      name: formatSlugToTitle(slug),
      categoryName: "Custom Packaging",
      categorySlug: "packaging",
      image: "/product_packaging.png",
      shortDescription: `Custom manufactured ${formatSlugToTitle(slug)} tailored to your specifications.`,
      moq: "100 Units",
      leadTime: "7-9 Days",
    };
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Section 1: Single Product Hero Banner */}
        <SingleProductBanner product={productData} />

        {/* Section 2: Custom Packaging Quote & Sample Form */}
        <CustomPackagingFormSection />

        {/* Section 3: Verified Customer Reviews */}
        <ProductReviewsSection productName={productData.name} />

        {/* Section 4: Frequently Asked Questions */}
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}

