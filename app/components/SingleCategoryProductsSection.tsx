"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "name" | "moq">("featured");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 8;

  // Reset page when searchQuery or sortBy changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

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

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 bg-[#f8fafc] w-full min-h-[500px]">
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
            <div className="relative">
              <input
                type="text"
                placeholder="Search styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#0f172a] focus:bg-white focus:outline-none focus:border-[#277a4e] focus:ring-2 focus:ring-[#277a4e]/20 transition-all w-48 sm:w-60"
              />
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
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
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "featured" | "name" | "moq")}
                className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#277a4e] cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="name">Product Name (A-Z)</option>
                <option value="moq">Lowest MOQ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white border border-gray-200/80 hover:border-[#277a4e] rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1"
                >
                  {/* Image & Badges */}
                  <div className="relative w-full h-48 bg-gray-50 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0f172a]/90 text-white backdrop-blur-xs shadow-xs">
                        MOQ: {product.moq}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-[#277a4e] backdrop-blur-xs border border-gray-100 shadow-xs">
                        {product.leadTime}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#0f172a] group-hover:text-[#277a4e] transition-colors line-clamp-1 mb-2 font-poppins">
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
                        className="inline-flex items-center text-xs font-bold text-[#277a4e] hover:text-[#1d5338] group/link"
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
                        className="px-3 py-1.5 bg-[#277a4e] hover:bg-[#1d5338] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                      >
                        Get Quote
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls Bar */}
            {totalPages > 1 && (
              <div className="mt-12 pt-6 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-gray-500 font-medium">
                  Showing{" "}
                  <span className="font-bold text-[#0f172a]">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-[#0f172a]">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                  </span>{" "}
                  of <span className="font-bold text-[#0f172a]">{filteredProducts.length}</span> products
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Prev Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200/60"
                        : "bg-white text-gray-700 hover:bg-[#277a4e] hover:text-white border border-gray-200 shadow-xs"
                    }`}
                  >
                    ‹ Prev
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                        currentPage === pageNum
                          ? "bg-[#277a4e] text-white shadow-md shadow-[#277a4e]/20"
                          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200/60"
                        : "bg-white text-gray-700 hover:bg-[#277a4e] hover:text-white border border-gray-200 shadow-xs"
                    }`}
                  >
                    Next ›
                  </button>
                </div>
              </div>
            )}
          </>
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
