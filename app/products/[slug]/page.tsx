import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import SingleProductBanner, { SingleProductBannerData } from "../../components/SingleProductBanner";
import Footer from "../../components/Footer";
import { getProductById, getProductBySlug, parseWCProductMeta } from "@/lib/woocommerce";
import type { WCProduct } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fallback sample product map
const sampleProducts: Record<string, SingleProductBannerData> = {
  "custom-magnetic-rigid-box": {
    name: "Custom Magnetic Cosmetic Rigid Box",
    categoryName: "Rigid Boxes",
    categorySlug: "rigid",
    image: "/magnetic_boxes.png",
    shortDescription:
      "Engineered with premium rigid chipboard and concealed magnetic flap closures. Fully customizable in size, artwork printing, foil stamping, and protective interior inserts.",
    moq: "100 Units",
    leadTime: "8-10 Days",
    material: "1200 GSM Rigid Board",
    printing: "Full CMYK + Foil Stamping",
  },
  "custom-corrugated-mailer-box": {
    name: "Custom Printed Corrugated Mailer Box",
    categoryName: "Corrugated Boxes",
    categorySlug: "corrugated",
    image: "/corrugated_boxes.png",
    shortDescription:
      "Heavy-duty E-flute corrugated mailer engineered for e-commerce unboxing experiences. 100% recyclable with high structural strength for transit safety.",
    moq: "100 Units",
    leadTime: "6-8 Days",
    material: "E-Flute Corrugated",
    printing: "Full Surface Offset Print",
  },
  default: {
    name: "Custom Branded Packaging Box",
    categoryName: "Custom Packaging",
    categorySlug: "packaging",
    image: "/product_packaging.png",
    shortDescription:
      "Precision-manufactured custom packaging box tailored to your brand specifications. Designed for maximum structural durability and elevated retail unboxing.",
    moq: "100 Units",
    leadTime: "7-9 Days",
    material: "350 GSM Cardstock",
    printing: "CMYK Matte / Gloss",
  },
};

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

  let productData: SingleProductBannerData =
    sampleProducts[slug.toLowerCase()] || {
      ...sampleProducts.default,
      name: formatSlugToTitle(slug),
    };

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
      productData = {
        id: parsed.id,
        name: parsed.name,
        categoryName: parsed.categories[0]?.name || "Custom Packaging",
        categorySlug: parsed.categories[0]?.slug || "packaging",
        image: parsed.images[0]?.src || "/product_packaging.png",
        shortDescription:
          parsed.short_description?.replace(/<[^>]*>?/gm, "").trim() ||
          parsed.description?.replace(/<[^>]*>?/gm, "").trim() ||
          productData.shortDescription,
        moq: parsed.moq || "100 Units",
        leadTime: parsed.lead_time || "7-9 Days",
        material: "Custom Cardstock / Board",
        printing: "Full CMYK / Foil Stamping",
      };
    }
  } catch (error) {
    console.error("Error fetching dynamic WooCommerce product:", error);
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Section 1: Single Product Hero Banner */}
        <SingleProductBanner product={productData} />
      </main>
      <Footer />
    </>
  );
}
