"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { IndustryCategory } from "./SingleIndustryCategoriesSection";

export interface IndustryProduct {
  id: number | string;
  slug?: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  categorySlugs?: string[];
  categoryIds?: (number | string)[];
  image: string;
  moq: string;
  leadTime: string;
  description: string;
  featured?: boolean;
}

interface SingleIndustryProductsSectionProps {
  industryName: string;
  categories: IndustryCategory[];
  initialProducts?: IndustryProduct[];
}

// Sample industry products mapped to categories
const sampleProductsMap: Record<string, IndustryProduct[]> = {
  "custom-cosmetics": [
    {
      id: "cos-1",
      name: "Custom Magnetic Cosmetic Rigid Box",
      categorySlug: "rigid",
      categoryName: "Rigid Boxes",
      image: "/magnetic_boxes.png",
      moq: "100 Units",
      leadTime: "8-10 Days",
      description: "Premium velvet-lined magnetic flap box for skincare & perfume sets.",
      featured: true,
    },
    {
      id: "cos-2",
      name: "Custom Lipstick Tuck End Folding Carton",
      categorySlug: "folding-carton",
      categoryName: "Folding Cartons",
      image: "/product_packaging.png",
      moq: "250 Units",
      leadTime: "5-7 Days",
      description: "Eco-friendly printed folding cartons for lipsticks, glosses & serums.",
    },
    {
      id: "cos-3",
      name: "Custom High-Density Foam Dropper Inserts",
      categorySlug: "inserts",
      categoryName: "Custom Inserts",
      image: "/box_inserts.png",
      moq: "100 Units",
      leadTime: "6-8 Days",
      description: "Precision-cut EVA foam inserts for glass dropper bottles & jars.",
    },
    {
      id: "cos-4",
      name: "Custom Embossed Metallic Jar Labels",
      categorySlug: "stickers-and-labels",
      categoryName: "Stickers & Labels",
      image: "/stickers_labels.png",
      moq: "500 Units",
      leadTime: "3-5 Days",
      description: "Waterproof foil-stamped die-cut labels for cosmetic bottles.",
    },
    {
      id: "cos-5",
      name: "Custom Printed Logo Tissue Paper",
      categorySlug: "accessories",
      categoryName: "Custom Accessories",
      image: "/tissue_paper.png",
      moq: "500 Sheets",
      leadTime: "4-6 Days",
      description: "Soft acid-free tissue paper with step-and-repeat logo printing.",
    },
    {
      id: "cos-6",
      name: "Custom Drawer Slider Skincare Box",
      categorySlug: "rigid",
      categoryName: "Rigid Boxes",
      image: "/drawer_boxes.png",
      moq: "100 Units",
      leadTime: "8-10 Days",
      description: "Luxury ribbon-pull drawer box for serum bottles & face oils.",
    },
    {
      id: "cos-7",
      name: "Custom Kraft Cosmetic Outer Packaging",
      categorySlug: "folding-carton",
      categoryName: "Folding Cartons",
      image: "/kraft_boxes.png",
      moq: "250 Units",
      leadTime: "5-7 Days",
      description: "100% recyclable unbleached kraft boxes for organic cosmetics.",
    },
    {
      id: "cos-8",
      name: "Custom Branded Sealing Tape",
      categorySlug: "accessories",
      categoryName: "Custom Accessories",
      image: "/packing_tape.png",
      moq: "5 Rolls",
      leadTime: "3-5 Days",
      description: "Water-activated reinforced gummed paper tape with custom logo.",
    },
  ],
  default: [
    {
      id: "def-1",
      name: "Custom Printed Corrugated Mailer Box",
      categorySlug: "corrugated",
      categoryName: "Corrugated Boxes",
      image: "/corrugated_boxes.png",
      moq: "100 Units",
      leadTime: "6-8 Days",
      description: "Durable e-commerce shipping mailer with full interior & exterior print.",
      featured: true,
    },
    {
      id: "def-2",
      name: "Custom Magnetic Lid & Base Rigid Box",
      categorySlug: "rigid",
      categoryName: "Rigid Boxes",
      image: "/rigid_boxes.png",
      moq: "100 Units",
      leadTime: "8-10 Days",
      description: "Luxury presentation box engineered for high-end retail products.",
    },
    {
      id: "def-3",
      name: "Custom Matte Stand-Up Zipper Pouch",
      categorySlug: "flexible-pouches",
      categoryName: "Flexible Pouches",
      image: "/flexible_pouches.png",
      moq: "500 Units",
      leadTime: "7-9 Days",
      description: "High-barrier pouch with tear notch and resealable press zipper.",
    },
    {
      id: "def-4",
      name: "Custom Kraft Paper Shipping Bag",
      categorySlug: "mailer-shipping-bags",
      categoryName: "Mailer Shipping Bags",
      image: "/mailer_bags.png",
      moq: "300 Units",
      leadTime: "4-6 Days",
      description: "Eco-friendly padded paper mailer for lightweight retail transit.",
    },
    {
      id: "def-5",
      name: "Custom Embossed Metal Tin Box",
      categorySlug: "tin-containers",
      categoryName: "Tin Containers",
      image: "/tin_containers.png",
      moq: "250 Units",
      leadTime: "10-12 Days",
      description: "Seamless tinplate container with custom embossed lid branding.",
    },
    {
      id: "def-6",
      name: "Custom Molded Pulp Protective Inserts",
      categorySlug: "inserts",
      categoryName: "Custom Inserts",
      image: "/box_inserts.png",
      moq: "200 Units",
      leadTime: "6-8 Days",
      description: "100% biodegradable molded fiber trays tailored to exact dimensions.",
    },
    {
      id: "def-7",
      name: "Custom Euro Tote Paper Shopping Bag",
      categorySlug: "paper-bags",
      categoryName: "Paper Bags",
      image: "/paper_bags.png",
      moq: "250 Units",
      leadTime: "5-7 Days",
      description: "Heavyweight paper tote with cotton rope handles and reinforced card base.",
    },
    {
      id: "def-8",
      name: "Custom Vinyl Product Label Sheet",
      categorySlug: "stickers-and-labels",
      categoryName: "Stickers & Labels",
      image: "/stickers_labels.png",
      moq: "500 Units",
      leadTime: "3-5 Days",
      description: "Durable scratch-proof kiss-cut vinyl stickers for product packaging.",
    },
  ],
};

function normalizeCategorySlug(slug: string = ""): string {
  // Soft normalization: only strip separators and special chars, don't strip word endings
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function productMatchesCategory(product: IndustryProduct, cat: IndustryCategory): boolean {
  // 1. Direct slug match
  if (product.categorySlug === cat.slug) return true;

  // 2. Normalized slug match (soft)
  if (normalizeCategorySlug(product.categorySlug) === normalizeCategorySlug(cat.slug)) return true;

  // 3. Category ID match (if product has categoryIds array)
  if (product.categoryIds && product.categoryIds.includes(cat.id)) return true;

  // 4. Category slug array match
  if (product.categorySlugs && product.categorySlugs.includes(cat.slug)) return true;

  // 5. Normalized name match
  if (normalizeCategorySlug(product.categoryName) === normalizeCategorySlug(cat.name)) return true;

  return false;
}

export default function SingleIndustryProductsSection({
  industryName,
  categories,
  initialProducts,
}: SingleIndustryProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Determine product list
  const allProducts = useMemo(() => {
    if (initialProducts && initialProducts.length > 0) return initialProducts;
    const slugKey = industryName.toLowerCase().replace(/\s+/g, "-");
    return sampleProductsMap[slugKey] || sampleProductsMap.default;
  }, [initialProducts, industryName]);

  // Filter products by selected category tab and search input
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        categories.some(
          (cat) => cat.slug === selectedCategory && productMatchesCategory(product, cat)
        );

      const matchesSearch =
        !searchTerm.trim() ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        product.categoryName.toLowerCase().includes(searchTerm.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });
  }, [allProducts, selectedCategory, searchTerm, categories]);

  return (
    <section className="bg-[#f8f9fb] py-16 sm:py-20 border-b border-gray-100 w-full font-inter overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="inline-block font-poppins text-[11px] font-bold tracking-[0.2em] uppercase text-[#02c074] mb-3">
              INDUSTRY CATALOG PRODUCTS
            </span>
            <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f172a] tracking-tight">
              Featured {industryName} Products
            </h2>
          </div>

          {/* Search Input Filter */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              placeholder="Filter products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#02c074] focus:ring-2 focus:ring-[#02c074]/20 transition-all"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills (Horizontal Tabs) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#02c074] text-white shadow-md shadow-[#02c074]/20"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-[#02c074]/50"
            }`}
          >
            All Products ({allProducts.length})
          </button>

          {categories.map((cat) => {
            const count = allProducts.filter((p) => productMatchesCategory(p, cat)).length;

            const displayCount = count;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  selectedCategory === cat.slug
                    ? "bg-[#02c074] text-white shadow-md shadow-[#02c074]/20"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-[#02c074]/50"
                }`}
              >
                {cat.name}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    selectedCategory === cat.slug
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {displayCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products 4-Column Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col bg-white border border-gray-200/80 hover:border-[#02c074] rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5"
              >
                {/* Product Image */}
                <Link href={`/products/${product.slug || product.id}`} className="relative w-full h-52 bg-gray-50 overflow-hidden block">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#1e293b]/90 text-white backdrop-blur-xs shadow-xs">
                      MOQ: {product.moq}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#e4f7ee] text-[#00684a] border border-[#c3f0da] shadow-xs">
                      {product.categoryName}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <Link href={`/products/${product.slug || product.id}`}>
                      <h3 className="font-poppins text-base font-bold text-[#0f172a] group-hover:text-[#00684a] transition-colors leading-snug mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
                      {product.description}
                    </p>
                  </div>

                  {/* Specifications & CTA */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-3 border-t border-gray-100 mb-4">
                      <span className="flex items-center gap-1 font-medium">
                        <svg className="w-3.5 h-3.5 text-[#02c074]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {product.leadTime}
                      </span>
                      <span className="text-[#00684a] font-bold uppercase tracking-wider text-[10px]">
                        Customizable
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/contact"
                        className="py-2.5 px-3 bg-[#00684a] hover:bg-[#00543c] text-white text-xs font-bold rounded-xl text-center transition-colors shadow-xs"
                      >
                        Request Quote
                      </Link>
                      <Link
                        href={`/products/${product.slug || product.id}`}
                        className="py-2.5 px-3 bg-gray-50 hover:bg-gray-100 text-[#0f172a] border border-gray-200 text-xs font-bold rounded-xl text-center transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-poppins text-base font-bold text-[#0f172a] mb-1">No products found</h3>
            <p className="text-xs text-gray-500 mb-4">Try selecting another category or clearing your search filter.</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchTerm("");
              }}
              className="px-4 py-2 bg-[#02c074] text-white text-xs font-bold rounded-lg hover:bg-[#019a5c] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
