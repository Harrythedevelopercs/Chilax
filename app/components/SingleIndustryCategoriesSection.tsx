"use client";

import Image from "next/image";
import Link from "next/link";

export interface IndustryCategory {
  id: number | string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  count?: number;
}

interface SingleIndustryCategoriesSectionProps {
  industryName: string;
  categories: IndustryCategory[];
}

// Fallback images map for categories
const fallbackImages: Record<string, string> = {
  "folding-carton": "/product_packaging.png",
  rigid: "/rigid_boxes.png",
  corrugated: "/corrugated_boxes.png",
  "mailer-shipping-bags": "/mailer_bags.png",
  "flexible-pouches": "/flexible_pouches.png",
  inserts: "/box_inserts.png",
  "paper-bags": "/paper_bags.png",
  "reusable-shopping-bags": "/reusable_bags.png",
  "tin-containers": "/tin_containers.png",
  displays: "/pop_displays.png",
  "stickers-and-labels": "/stickers_labels.png",
  accessories: "/packing_tape.png",
};

export default function SingleIndustryCategoriesSection({
  industryName,
  categories,
}: SingleIndustryCategoriesSectionProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-white py-16 sm:py-20 border-b border-gray-100 w-full font-inter overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="inline-block font-poppins text-[11px] font-bold tracking-[0.2em] uppercase text-[#02c074] mb-3">
            RECOMMENDED PACKAGING STYLES
          </span>
          <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f172a] tracking-tight mb-3">
            Packaging Types for {industryName}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Explore our precision-engineered structural packaging formats tailored specifically for {industryName}.
          </p>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const imgSrc =
              cat.image ||
              fallbackImages[cat.slug] ||
              fallbackImages[cat.slug.split("-")[0]] ||
              "/product_packaging.png";

            return (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className="group relative flex flex-col bg-[#f8f9fb] hover:bg-white border border-gray-200/80 hover:border-[#02c074] rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5"
              >
                {/* Image Container */}
                <div className="relative w-full h-40 sm:h-44 bg-gray-100 overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Category Details */}
                <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-white">
                  <div>
                    <h3 className="font-poppins text-sm sm:text-base font-bold text-[#0f172a] group-hover:text-[#00684a] transition-colors leading-snug mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {cat.description || `Custom ${cat.name.toLowerCase()} for ${industryName}`}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-bold text-[#02c074] group-hover:text-[#00684a] transition-colors flex items-center gap-1">
                      Explore Products
                      <svg
                        className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200"
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
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
