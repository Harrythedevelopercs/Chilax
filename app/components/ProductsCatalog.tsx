import Image from "next/image";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/woocommerce";

export const revalidate = 60; // Revalidate data every minute

interface CatalogItem {
  slug: string;
  title: string;
  desc: string;
  defaultImg: string;
  href: string;
}

interface CatalogGroup {
  categoryTitle: string;
  items: CatalogItem[];
}

const defaultGroups: CatalogGroup[] = [
  {
    categoryTitle: "Premium & Rigid Packaging",
    items: [
      {
        slug: "rigid-boxes",
        title: "Rigid Boxes",
        desc: "Luxurious packaging made from thick, durable chipboard for premium products.",
        defaultImg: "/rigid_boxes.png",
        href: "/categories/rigid-boxes",
      },
      {
        slug: "magnetic-closure-boxes",
        title: "Magnetic Closure Boxes",
        desc: "High-end presentation boxes featuring a satisfying snap closure.",
        defaultImg: "/magnetic_boxes.png",
        href: "/categories/magnetic-closure-boxes",
      },
      {
        slug: "drawer-boxes",
        title: "Drawer Boxes",
        desc: "Elegant slide-out style rigid boxes perfect for jewelry and cosmetics.",
        defaultImg: "/drawer_boxes.png",
        href: "/categories/drawer-boxes",
      },
      {
        slug: "tin-containers",
        title: "Tin Containers",
        desc: "Durable and reusable custom printed tin packaging for specialty goods.",
        defaultImg: "/tin_containers.png",
        href: "/categories/tin-containers",
      },
    ],
  },
  {
    categoryTitle: "Retail & Product Packaging",
    items: [
      {
        slug: "product-packaging",
        title: "Product Packaging",
        desc: "Standard cardstock boxes made from thin, flexible paperboard.",
        defaultImg: "/product_packaging.png",
        href: "/categories/product-packaging",
      },
      {
        slug: "flexible-pouches",
        title: "Flexible Pouches",
        desc: "Keep food and products fresh with custom printed stand-up pouches.",
        defaultImg: "/flexible_pouches.png",
        href: "/categories/flexible-pouches",
      },
      {
        slug: "pop-displays",
        title: "POP Displays",
        desc: "Point of purchase retail display boxes to catch customer attention.",
        defaultImg: "/pop_displays.png",
        href: "/categories/pop-displays",
      },
      {
        slug: "paper-shopping-bags",
        title: "Paper Shopping Bags",
        desc: "Custom branded paper bags for retail stores and boutiques.",
        defaultImg: "/paper_bags.png",
        href: "/categories/paper-shopping-bags",
      },
    ],
  },
  {
    categoryTitle: "Shipping & Mailers",
    items: [
      {
        slug: "corrugated-boxes",
        title: "Corrugated Boxes",
        desc: "Durable 3-layer corrugated cardboard boxes for shipping and storage.",
        defaultImg: "/corrugated_boxes.png",
        href: "/categories/corrugated-boxes",
      },
      {
        slug: "mailer-boxes",
        title: "Mailer Boxes",
        desc: "Sturdy e-commerce packaging that provides a premium unboxing experience.",
        defaultImg: "/mailer_boxes.png",
        href: "/categories/mailer-boxes",
      },
      {
        slug: "poly-mailers",
        title: "Poly Mailers",
        desc: "Lightweight, weather-resistant shipping bags for apparel and soft goods.",
        defaultImg: "/poly_mailers.png",
        href: "/categories/poly-mailers",
      },
      {
        slug: "kraft-boxes",
        title: "Kraft Boxes",
        desc: "Eco-friendly, natural looking boxes for a rustic or sustainable brand image.",
        defaultImg: "/kraft_boxes.png",
        href: "/categories/kraft-boxes",
      },
    ],
  },
  {
    categoryTitle: "Packaging Accessories",
    items: [
      {
        slug: "box-inserts",
        title: "Box Inserts",
        desc: "Keep your loose products nicely tucked, presented, and protected.",
        defaultImg: "/box_inserts.png",
        href: "/categories/box-inserts",
      },
      {
        slug: "stickers-and-labels",
        title: "Stickers & Labels",
        desc: "Custom printed rolls or die-cut stickers to brand your plain packaging.",
        defaultImg: "/stickers_labels.png",
        href: "/categories/stickers-and-labels",
      },
      {
        slug: "tissue-paper",
        title: "Tissue Paper",
        desc: "Custom printed wrapping tissue for that extra unboxing touch.",
        defaultImg: "/tissue_paper.png",
        href: "/categories/tissue-paper",
      },
      {
        slug: "packing-tape",
        title: "Packing Tape",
        desc: "Secure your shipments with branded water-activated or poly tape.",
        defaultImg: "/packing_tape.png",
        href: "/categories/packing-tape",
      },
    ],
  },
];

export default async function ProductsCatalog() {
  // Map of category slug/id to dynamic WooCommerce image URL
  const wcImageMap: Record<string, string> = {};

  try {
    const wcCategories = await getCategories({ per_page: 100 }).catch(() => []);

    if (wcCategories && wcCategories.length > 0) {
      // 1. Map category images directly from wcCategories
      await Promise.all(
        wcCategories.map(async (cat) => {
          let imageUrl = cat.image?.src || "";

          // 2. If category doesn't have an explicit image, fetch its first product image from WooCommerce
          if (!imageUrl && cat.id) {
            const products = await getProducts({ category: cat.id, per_page: 1 }).catch(() => []);
            if (products.length > 0 && products[0].images?.[0]?.src) {
              imageUrl = products[0].images[0].src;
            }
          }

          if (imageUrl) {
            wcImageMap[cat.slug.toLowerCase()] = imageUrl;
            wcImageMap[cat.id.toString()] = imageUrl;

            // Also map key variants (e.g. "rigid" -> "rigid-boxes")
            const key = cat.slug.toLowerCase().replace(/-and-/g, "-");
            wcImageMap[key] = imageUrl;
          }
        })
      );
    }
  } catch (error) {
    console.error("Error fetching WooCommerce category images for home catalog:", error);
  }

  return (
    <section className="bg-[#f8f9fb] py-16 font-inter w-full border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div>
            <span className="inline-block font-poppins text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#277a4e] mb-2">
              PACKAGING CATEGORIES
            </span>
            <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-1">
              Explore Our Custom Packaging Categories
            </h2>
            <p className="font-inter text-gray-500 text-sm font-normal">
              Browse by packaging category to find tailored B2B solutions for your products.
            </p>
          </div>
          <Link
            href="/categories/rigid-boxes"
            className="font-poppins flex-shrink-0 bg-[#277a4e] hover:bg-[#1d5338] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 self-start sm:self-auto shadow-sm"
          >
            Browse All Categories
          </Link>
        </div>

        {/* Catalog Groups */}
        <div className="space-y-12">
          {defaultGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              {/* Group Category Title */}
              <h3 className="font-poppins font-bold text-gray-700 text-xs tracking-widest uppercase mb-5 flex items-center gap-3">
                <span className="inline-block w-6 h-0.5 bg-[#277a4e] rounded-full" />
                {group.categoryTitle}
              </h3>

              {/* Grid of 4 Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {group.items.map((item, itemIdx) => {
                  const s = item.slug.toLowerCase();
                  // Match dynamic WooCommerce image
                  const liveWcImg =
                    wcImageMap[s] ||
                    wcImageMap[s.replace(/-boxes$/, "")] ||
                    wcImageMap[s.replace(/-cartons$/, "")] ||
                    wcImageMap[s.replace(/-bags$/, "")];

                  const displayImg = liveWcImg || item.defaultImg;

                  return (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                      style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)" }}
                    >
                      {/* Image Box */}
                      <div className="relative w-full h-52 overflow-hidden bg-gray-50">
                        <Image
                          src={displayImg}
                          alt={item.title}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        {/* Category Badge overlay */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-[#0f172a]/90 text-white backdrop-blur-xs shadow-xs uppercase tracking-wider">
                            Category
                          </span>
                        </div>
                        {/* Bottom gradient overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
                        {/* Green accent top-right corner badge on hover */}
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#277a4e] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md" />
                      </div>

                      {/* Content Box */}
                      <div className="px-5 pt-4 pb-5 flex-1 flex flex-col justify-between bg-white border-t border-gray-100/80">
                        <div>
                          <h4 className="font-poppins font-bold text-[#111827] text-sm mb-1 group-hover:text-[#277a4e] transition-colors duration-200 leading-snug">
                            {item.title}
                          </h4>
                          <p className="font-inter text-gray-400 text-xs leading-relaxed font-normal">
                            {item.desc}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#277a4e] group-hover:text-[#1d5338] flex items-center gap-1 transition-colors">
                            Explore Category
                            <svg
                              className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                      {/* Green bottom accent line on hover */}
                      <div className="h-0.5 w-0 group-hover:w-full bg-[#277a4e] transition-all duration-300 ease-out" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
