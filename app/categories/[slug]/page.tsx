import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import SingleCategoryBanner from "@/app/components/SingleCategoryBanner";
import SingleCategoryProductsSection, { CategoryProduct } from "@/app/components/SingleCategoryProductsSection";
import CategorySpecsSection from "@/app/components/CategorySpecsSection";
import TestimonialsSection from "@/app/components/TestimonialsSection";
import FAQSection from "@/app/components/FAQSection";
import Footer from "@/app/components/Footer";
import { getCategories, getCategoryBySlug, getProducts, parseWCProductMeta } from "@/lib/woocommerce";

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fallback metadata map for common packaging categories
const categoryFallbackMap: Record<
  string,
  {
    title: string;
    description: string;
    image: string;
    moq: string;
    turnaround: string;
    products: CategoryProduct[];
  }
> = {
  "rigid-boxes": {
    title: "Custom Rigid Boxes & Luxury Packaging",
    description:
      "Engineered with thick rigid chipboard and wrapped in premium specialty paper. Perfect for luxury cosmetics, jewelry, electronics, and high-end gift sets.",
    image: "/rigid_boxes.png",
    moq: "100 Units",
    turnaround: "8-10 Days",
    products: [
      {
        id: "r1",
        slug: "magnetic-rigid-box",
        name: "Magnetic Lid Rigid Box",
        image: "/magnetic_boxes.png",
        moq: "100 Units",
        leadTime: "8-10 Days",
        description: "Concealed magnetic flap closure with custom foam insert cutout options.",
      },
      {
        id: "r2",
        slug: "drawer-rigid-box",
        name: "Custom Drawer Rigid Box",
        image: "/drawer_boxes.png",
        moq: "100 Units",
        leadTime: "8-10 Days",
        description: "Smooth pull-out drawer mechanism with velvet ribbon tab.",
      },
      {
        id: "r3",
        slug: "luxury-rigid-presentation-box",
        name: "Luxury Presentation Rigid Box",
        image: "/rigid_boxes.png",
        moq: "100 Units",
        leadTime: "9-12 Days",
        description: "Two-piece shoulder rigid box for high-end retail and gift presentation.",
      },
    ],
  },
  "corrugated-boxes": {
    title: "Custom Corrugated Shipping & Mailer Boxes",
    description:
      "Heavy-duty fluted corrugated packaging engineered for e-commerce unboxing, subscription boxes, and transit durability.",
    image: "/corrugated_boxes.png",
    moq: "100 Units",
    turnaround: "6-8 Days",
    products: [
      {
        id: "c1",
        slug: "custom-printed-mailer-box",
        name: "Custom Printed Mailer Box",
        image: "/corrugated_boxes.png",
        moq: "100 Units",
        leadTime: "6-8 Days",
        description: "Self-locking roll-end tuck top mailer for safe e-commerce shipping.",
      },
      {
        id: "c2",
        slug: "heavy-duty-shipping-box",
        name: "Heavy Duty Shipping Box",
        image: "/hero_packaging.png",
        moq: "100 Units",
        leadTime: "6-8 Days",
        description: "RSC corrugated shipping box designed for bulk freight transit.",
      },
    ],
  },
  "folding-cartons": {
    title: "Custom Folding Cartons & Retail Product Boxes",
    description:
      "Versatile paperboard retail boxes printed in full CMYK with custom die-cut windows, matte or gloss lamination, and foil accents.",
    image: "/product_packaging.png",
    moq: "100 Units",
    turnaround: "6-8 Days",
    products: [
      {
        id: "f1",
        slug: "straight-tuck-end-box",
        name: "Straight Tuck End Box",
        image: "/product_packaging.png",
        moq: "100 Units",
        leadTime: "6-8 Days",
        description: "Classic retail folding carton for cosmetics, pharmaceuticals, and food products.",
      },
      {
        id: "f2",
        slug: "reverse-tuck-end-box",
        name: "Reverse Tuck End Box",
        image: "/kraft_boxes.png",
        moq: "100 Units",
        leadTime: "6-8 Days",
        description: "Easy assembly paperboard box with top and bottom tuck flaps.",
      },
    ],
  },
  "flexible-pouches": {
    title: "Flexible Pouches & Mylar Bags",
    description:
      "High-barrier food-grade stand-up pouches and flat bags with resealable zippers and child-resistant closures.",
    image: "/flexible_pouches.png",
    moq: "250 Units",
    turnaround: "7-9 Days",
    products: [
      {
        id: "p1",
        slug: "stand-up-zipper-pouch",
        name: "Stand-Up Zipper Pouch",
        image: "/flexible_pouches.png",
        moq: "250 Units",
        leadTime: "7-9 Days",
        description: "Resealable barrier pouch with bottom gusset for retail shelf display.",
      },
    ],
  },
  default: {
    title: "Custom Packaging & Boxes",
    description:
      "High-quality B2B custom printed boxes, mailers, and branded packaging manufactured to your exact specifications.",
    image: "/product_packaging.png",
    moq: "100 Units",
    turnaround: "6-8 Days",
    products: [
      {
        id: "d1",
        slug: "custom-product-box",
        name: "Custom Branded Product Box",
        image: "/product_packaging.png",
        moq: "100 Units",
        leadTime: "6-8 Days",
        description: "Fully custom printed packaging box with custom size, dieline, and finish.",
      },
      {
        id: "d2",
        slug: "custom-rigid-box",
        name: "Custom Rigid Box",
        image: "/rigid_boxes.png",
        moq: "100 Units",
        leadTime: "8-10 Days",
        description: "Premium rigid chipboard box with magnetic closure options.",
      },
      {
        id: "d3",
        slug: "custom-mailer-box",
        name: "Custom Corrugated Mailer Box",
        image: "/corrugated_boxes.png",
        moq: "100 Units",
        leadTime: "6-8 Days",
        description: "Durable fluted mailer box engineered for subscription and e-commerce.",
      },
    ],
  },
};

function formatSlugToTitle(slug: string): string {
  const formatted = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  if (!formatted.toLowerCase().includes("box") && !formatted.toLowerCase().includes("packaging") && !formatted.toLowerCase().includes("pouch") && !formatted.toLowerCase().includes("bag")) {
    return `Custom ${formatted} Boxes & Packaging`;
  }
  return `Custom ${formatted}`;
}

function normalizeSlugKey(slug: string): string {
  const s = slug.toLowerCase();
  if (s.includes("rigid")) return "rigid-boxes";
  if (s.includes("corrugated") || s.includes("mailer")) return "corrugated-boxes";
  if (s.includes("folding") || s.includes("carton")) return "folding-cartons";
  if (s.includes("pouch") || s.includes("mylar")) return "flexible-pouches";
  return s;
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

  const normalizedKey = normalizeSlugKey(slug);
  const fallback = categoryFallbackMap[normalizedKey] || categoryFallbackMap.default;

  let title = formatSlugToTitle(slug);
  let description = fallback.description;
  let bannerImage = fallback.image;
  let moq = fallback.moq;
  let turnaround = fallback.turnaround;
  let categoryProducts: CategoryProduct[] = fallback.products;

  try {
    // Attempt fetching live category from WooCommerce
    const wcCategory = await getCategoryBySlug(slug);

    if (wcCategory) {
      title = wcCategory.name.toLowerCase().startsWith("custom")
        ? wcCategory.name
        : `Custom ${wcCategory.name}`;
      if (wcCategory.description && wcCategory.description.trim()) {
        description = wcCategory.description.replace(/<[^>]*>?/gm, "").trim();
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
            name: parsed.name,
            image: parsed.images[0]?.src || bannerImage,
            moq: parsed.moq || "100 Units",
            leadTime: parsed.lead_time || "7-9 Days",
            description:
              parsed.short_description?.replace(/<[^>]*>?/gm, "").trim() ||
              parsed.description?.replace(/<[^>]*>?/gm, "").trim() ||
              `Custom ${parsed.name} box style`,
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
        title = matched.name.toLowerCase().startsWith("custom") ? matched.name : `Custom ${matched.name}`;
        if (matched.description) description = matched.description.replace(/<[^>]*>?/gm, "").trim();

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
              name: parsed.name,
              image: parsed.images[0]?.src || bannerImage,
              moq: parsed.moq || "100 Units",
              leadTime: parsed.lead_time || "7-9 Days",
              description:
                parsed.short_description?.replace(/<[^>]*>?/gm, "").trim() ||
                parsed.description?.replace(/<[^>]*>?/gm, "").trim() ||
                `Custom ${parsed.name} box style`,
            };
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching single category page data:", error);
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Section 1: Single Category Hero Banner */}
        <SingleCategoryBanner
          title={title}
          badge="FACTORY DIRECT PACKAGING"
          description={description}
          image={bannerImage}
          moq={moq}
          turnaround={turnaround}
        />

        {/* Section 2: Products / Styles Catalog Grid */}
        <SingleCategoryProductsSection
          categoryTitle={title}
          products={categoryProducts}
        />

        {/* Section 3: Technical Specifications, Inserts, & Process */}
        <CategorySpecsSection categoryTitle={title} />

        {/* Section 4: Customer Testimonials */}
        <TestimonialsSection />

        {/* Section 5: Frequently Asked Questions */}
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
