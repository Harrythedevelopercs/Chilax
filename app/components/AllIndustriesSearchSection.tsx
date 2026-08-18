"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

interface IndustryItem {
  id: string;
  name: string;
  href: string;
  icon: React.ReactNode;
}

const allIndustriesData: IndustryItem[] = [
  {
    id: "cosmetics",
    name: "Custom Cosmetics",
    href: "/industries/custom-cosmetics",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M8 8c0-2.21 1.79-4 4-4s4 1.79 4 4" />
        <rect x="7" y="12" width="10" height="8" rx="2" />
        <line x1="10" y1="16" x2="14" y2="16" />
      </svg>
    ),
  },
  {
    id: "cannabis",
    name: "Custom CBD & Cannabis",
    href: "/industries/custom-cbd-cannabis",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8 6 6 10 7 14c1 4 5 6 5 6s4-2 5-6c1-4-1-8-5-12z" />
        <line x1="12" y1="12" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    id: "food-beverage",
    name: "Custom Food & Beverage",
    href: "/industries/custom-food-beverage",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l19-9-9 19-2-8-8-2z" />
      </svg>
    ),
  },
  {
    id: "retail",
    name: "Custom Retail Packaging",
    href: "/industries/custom-retail-packaging",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    id: "pharmaceutical",
    name: "Custom Pharmaceutical",
    href: "/industries/custom-pharmaceutical",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    id: "jewelry",
    name: "Custom Jewelry Packaging",
    href: "/custom-jewelry-packaging",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "apparel",
    name: "Custom Apparel Packaging",
    href: "/industries/custom-apparel-packaging",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" />
      </svg>
    ),
  },
  {
    id: "gift",
    name: "Custom Gift Packaging",
    href: "/industries/custom-gift-packaging",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <rect x="5" y="12" width="14" height="9" rx="1" />
        <path d="M12 8v13" />
        <path d="M12 8C12 8 9 5 9 4a3 3 0 016 0c0 1-3 4-3 4z" />
      </svg>
    ),
  },
  {
    id: "bakery",
    name: "Custom Bakery Packaging",
    href: "/custom-bakery-packaging",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 010 8h-1" />
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    id: "candle",
    name: "Custom Candle Packaging",
    href: "/custom-candle-packaging",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="4" />
        <path d="M12 4c0 0-3 3-3 6a3 3 0 006 0c0-3-3-6-3-6z" />
        <rect x="7" y="13" width="10" height="8" rx="1" />
      </svg>
    ),
  },
  {
    id: "soap",
    name: "Custom Soap Packaging",
    href: "/industries/custom-soap-packaging",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h.01M12 12h.01M15 12h.01" />
        <path d="M5 8h14v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" />
        <path d="M9 8V6a3 3 0 016 0v2" />
        <path d="M3 8h18" />
      </svg>
    ),
  },
  {
    id: "electronics",
    name: "Custom Electronics & Tech",
    href: "/industries/custom-electronics-tech",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: "beer-liquor",
    name: "Custom Beer & Liquor",
    href: "/industries/custom-beer-liquor",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6v4H9V3zM7 7h10l1 14H6L7 7zM10 11h4" />
      </svg>
    ),
  },
  {
    id: "beverage",
    name: "Custom Beverage",
    href: "/industries/custom-beverage",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 11v9a2 2 0 01-2 2H7a2 2 0 01-2-2v-9M5 11h14M12 2v4M10 4h4" />
        <rect x="7" y="7" width="10" height="4" rx="1" />
      </svg>
    ),
  },
  {
    id: "candy",
    name: "Custom Candy & Sweets",
    href: "/industries/custom-candy-sweets",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a6 6 0 00-6 6c0 4 6 10 6 10s6-6 6-10a6 6 0 00-6-6z" />
        <circle cx="12" cy="8" r="2" />
      </svg>
    ),
  },
  {
    id: "chocolate",
    name: "Custom Chocolate Packaging",
    href: "/industries/custom-chocolate-packaging",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    ),
  },
  {
    id: "coffee",
    name: "Custom Coffee Packaging",
    href: "/industries/custom-coffee-packaging",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <path d="M6 1v3M10 1v3M14 1v3" />
      </svg>
    ),
  },
  {
    id: "e-commerce",
    name: "Custom E-Commerce",
    href: "/industries/custom-e-commerce",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: "food",
    name: "Custom Food Packaging",
    href: "/industries/custom-food-packaging",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3v8M9 3v8M6 7h3M7 11v10M17 3v18M14 3c0 3 3 4 3 7" />
      </svg>
    ),
  },
  {
    id: "game",
    name: "Custom Game & Toy",
    href: "/industries/custom-game-toy",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" />
        <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" />
        <circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" />
        <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "presentation",
    name: "Custom Presentation Boxes",
    href: "/industries/custom-presentation-boxes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M12 11l-3-3m3 3l3-3m-3 3V7" />
      </svg>
    ),
  },
  {
    id: "restaurant",
    name: "Custom Restaurant Packaging",
    href: "/custom-restaurant-packaging",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M5 10V6a1 1 0 011-1h12a1 1 0 011 1v4M9 14h6v7H9z" />
      </svg>
    ),
  },
  {
    id: "shipping",
    name: "Custom Shipping & Transit",
    href: "/industries/custom-shipping-transit",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="6" width="14" height="10" rx="1" />
        <path d="M15 9h4l3 3v4h-7V9z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="17.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    id: "tea",
    name: "Custom Tea Packaging",
    href: "/industries/custom-tea-packaging",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <path d="M9 3c1-1 3-1 4 0" />
      </svg>
    ),
  },
  {
    id: "wine",
    name: "Custom Wine & Spirits",
    href: "/industries/custom-wine-spirits",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15v6M9 21h6M8 3h8l1 7a5 5 0 01-10 0L8 3z" />
      </svg>
    ),
  },
];

export default function AllIndustriesSearchSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hovered, setHovered] = useState<number | null>(null);
  const [industriesList, setIndustriesList] = useState<IndustryItem[]>(allIndustriesData);

  useEffect(() => {
    async function loadDynamicIndustries() {
      try {
        const res = await fetch("/api/industries");
        const data = await res.json();
        if (data.success && data.industries && data.industries.length > 0) {
          const mapped: IndustryItem[] = data.industries.map((term: { id: number; name: string; slug: string }) => {
            const matchedFallback = allIndustriesData.find(i => i.id === term.slug || i.name.toLowerCase().includes(term.slug.toLowerCase()));
            return {
              id: String(term.id || term.slug),
              name: term.name.startsWith("Custom") ? term.name : `Custom ${term.name}`,
              href: `/industries/${term.slug}`,
              icon: matchedFallback ? matchedFallback.icon : (
                <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M8 8c0-2.21 1.79-4 4-4s4 1.79 4 4" />
                  <rect x="7" y="12" width="10" height="8" rx="2" />
                </svg>
              ),
            };
          });
          setIndustriesList(mapped);
        }
      } catch (e) {
        console.error("Failed to load dynamic industries:", e);
      }
    }
    loadDynamicIndustries();
  }, []);

  const filteredIndustries = useMemo(() => {
    if (!searchTerm.trim()) return industriesList;
    return industriesList.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [searchTerm, industriesList]);

  return (
    <section className="bg-white py-16 md:py-20 border-b border-gray-100 w-full font-inter overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Header - Matches Homepage IndustriesSection Header exactly */}
        <div className="text-center mb-10">
          <span className="inline-block font-poppins text-[11px] font-bold tracking-[0.2em] uppercase text-[#277a4e] mb-3">
            Industries We Serve
          </span>
          <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-3">
            Custom Packaging Solutions by Industry
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            We provide specialized custom packaging expertise tailored to the unique
            requirements and regulations of your specific industry.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="max-w-md mx-auto mb-10 sm:mb-12">
          <div className="relative flex items-center bg-[#f8f9fb] border border-gray-200 rounded-2xl shadow-2xs focus-within:bg-white focus-within:border-[#277a4e] focus-within:ring-2 focus-within:ring-[#277a4e]/20 transition-all overflow-hidden px-4 py-3">
            {/* Search Icon */}
            <svg
              className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0"
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

            {/* Input Field */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search custom industries (e.g. Cosmetics, Bakery)..."
              className="w-full text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none font-normal"
            />

            {/* Clear Button */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                title="Clear search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Results Counter */}
          {searchTerm && (
            <div className="text-center mt-3 text-xs text-gray-500">
              Found <span className="font-bold text-[#277a4e]">{filteredIndustries.length}</span> {filteredIndustries.length === 1 ? "industry" : "industries"} matching &quot;{searchTerm}&quot;
            </div>
          )}
        </div>

        {/* Industry Cards Grid */}
        {filteredIndustries.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredIndustries.map((industry, idx) => (
              <Link
                key={industry.id}
                href={industry.href}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                className={`relative flex flex-col items-start justify-between gap-6 p-5 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer group ${
                  hovered === idx
                    ? "bg-[#277a4e] border-[#277a4e] text-white shadow-xl -translate-y-1"
                    : "bg-[#f8f9fb] border-gray-100 text-[#111827] hover:border-[#277a4e]/40 hover:shadow-md"
                }`}
              >
                {/* Decorative bg circle */}
                <div
                  className={`absolute -top-5 -right-5 w-20 h-20 rounded-full transition-all duration-300 ${
                    hovered === idx ? "bg-white/10" : "bg-[#277a4e]/5"
                  }`}
                />

                {/* Icon */}
                <div
                  className={`relative z-10 p-2.5 rounded-xl transition-all duration-300 ${
                    hovered === idx
                      ? "bg-white/20 text-white"
                      : "bg-white text-[#277a4e] shadow-sm border border-gray-100"
                  }`}
                >
                  {industry.icon}
                </div>

                {/* Name + Arrow */}
                <div className="relative z-10 w-full">
                  <p
                    className={`font-poppins text-xs font-bold leading-snug mb-2 transition-colors duration-200 ${
                      hovered === idx ? "text-white" : "text-[#111827]"
                    }`}
                  >
                    {industry.name}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold font-inter transition-all duration-200 ${
                      hovered === idx ? "text-white/80" : "text-[#277a4e]"
                    }`}
                  >
                    Explore Products
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${
                        hovered === idx ? "translate-x-0.5" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 bg-[#f8f9fb] rounded-2xl border border-gray-100 max-w-lg mx-auto">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-base font-bold text-gray-800 font-poppins">No industries found</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-4">
              We couldn&apos;t find any industry matching &quot;{searchTerm}&quot;
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="inline-flex items-center px-4 py-2 bg-[#277a4e] text-white text-xs font-bold rounded-xl hover:bg-[#1d5338] transition-colors font-poppins shadow-xs"
            >
              Show all industries
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
