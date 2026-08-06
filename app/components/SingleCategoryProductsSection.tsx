"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

export interface CategoryProduct {
  id: number | string;
  slug: string;
  name: string;
  image: string;
  moq: string;
  leadTime: string;
  description: string;
  material?: string;
  printing?: string;
}

interface SingleCategoryProductsSectionProps {
  categoryTitle: string;
  products: CategoryProduct[];
}

export default function SingleCategoryProductsSection({
  categoryTitle,
  products = [],
}: SingleCategoryProductsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "name" | "moq">("featured");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "moq") {
      result.sort((a, b) => {
        const numA = parseInt(a.moq) || 0;
        const numB = parseInt(b.moq) || 0;
        return numA - numB;
      });
    }

    return result;
  }, [products, searchQuery, sortBy]);

  return (
    <section className="py-12 sm:py-16 bg-[#f8fafc] w-full min-h-[500px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight font-poppins">
              Available Styles &amp; Products
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
              Showing {filteredProducts.length} custom product models for {categoryTitle}
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search style or name..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:border-[#02c074] focus:bg-white transition-all"
              />
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "featured" | "name" | "moq")}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:border-[#02c074] cursor-pointer"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="name">Sort by: Name (A-Z)</option>
              <option value="moq">Sort by: Lowest MOQ</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col bg-white border border-gray-200/80 hover:border-[#02c074] rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5"
              >
                {/* Product Image Container */}
                <div className="relative w-full h-56 sm:h-60 bg-gray-50 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-[#0f172a]/90 text-white backdrop-blur-xs shadow-xs">
                      MOQ: {product.moq}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-[#e4f7ee] text-[#00684a] border border-[#c3f0da]">
                      {product.leadTime}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#0f172a] group-hover:text-[#02c074] transition-colors line-clamp-1 mb-2 font-poppins">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-normal leading-relaxed line-clamp-2 mb-4">
                      {product.description}
                    </p>
                  </div>

                  {/* Card Footer CTA */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center text-xs font-bold text-[#02c074] hover:text-[#019a5c] group/link"
                    >
                      View Product Details
                      <svg
                        className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>

                    <Link
                      href={`/products/${product.slug}#quote`}
                      className="px-3 py-1.5 bg-[#02c074] hover:bg-[#019a5c] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-lg mx-auto">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-base font-bold text-[#0f172a]">No product models found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Try adjusting your search criteria or contact us for custom dielines.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
