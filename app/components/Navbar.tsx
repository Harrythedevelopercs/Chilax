"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const bottomIndustries = [
  {
    label: "Cosmetic Packaging",
    href: "#",
    icon: (
      <svg className="w-4 h-4 text-gray-500 group-hover:text-[#02c074] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="8" r="4" />
        <rect x="7" y="12" width="10" height="8" rx="2" />
      </svg>
    ),
  },
  {
    label: "Restaurant Packaging",
    href: "#",
    icon: (
      <svg className="w-4 h-4 text-gray-500 group-hover:text-[#02c074] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3z" />
      </svg>
    ),
  },
  {
    label: "Bakery Packaging",
    href: "#",
    icon: (
      <svg className="w-4 h-4 text-gray-500 group-hover:text-[#02c074] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 010 8h-1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
      </svg>
    ),
  },
  {
    label: "Candle Packaging",
    href: "#",
    icon: (
      <svg className="w-4 h-4 text-gray-500 group-hover:text-[#02c074] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <line x1="12" y1="2" x2="12" y2="4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4c0 0-3 3-3 6a3 3 0 006 0c0-3-3-6-3-6z" />
        <rect x="7" y="13" width="10" height="8" rx="1" />
      </svg>
    ),
  },
  {
    label: "Food & Beverage",
    href: "#",
    icon: (
      <svg className="w-4 h-4 text-gray-500 group-hover:text-[#02c074] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 11l19-9-9 19-2-8-8-2z" />
      </svg>
    ),
  },
  {
    label: "Retail Packaging",
    href: "#",
    icon: (
      <svg className="w-4 h-4 text-gray-500 group-hover:text-[#02c074] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    label: "Jewelry Packaging",
    href: "#",
    icon: (
      <svg className="w-4 h-4 text-gray-500 group-hover:text-[#02c074] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    label: "Gift Packaging",
    href: "#",
    icon: (
      <svg className="w-4 h-4 text-gray-500 group-hover:text-[#02c074] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <rect x="5" y="12" width="14" height="9" rx="1" />
        <path d="M12 8v13" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState("All");
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (e) {
        console.error("Error loading categories:", e);
      }
    }
    loadCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200/80 shadow-xs w-full font-inter">
      {/* ── Top Main Header ── */}
      <div className="bg-white py-3 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 md:gap-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="relative h-10 w-36 sm:w-44 flex items-center">
              <Image
                src="/site_logo.png"
                alt="Parcela Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Search Box (Centered) */}
          <div className="flex-1 max-w-2xl hidden md:flex items-center">
            <div className="relative flex items-center w-full bg-[#f8f9fb] border border-gray-200 rounded-xl focus-within:border-[#02c074] focus-within:bg-white transition-all shadow-2xs overflow-hidden">
              {/* Search Icon */}
              <div className="pl-3.5 text-gray-400 flex items-center pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Input */}
              <input
                type="text"
                placeholder="Search products, packaging styles, or industries..."
                className="w-full py-2.5 px-3 text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none font-normal"
              />

              {/* WordPress / WooCommerce Dynamic Category Select Dropdown */}
              <div className="flex items-center border-l border-gray-200 px-3 flex-shrink-0 bg-transparent">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="text-xs font-semibold text-gray-600 bg-transparent focus:outline-none cursor-pointer pr-1 max-w-[130px] truncate"
                >
                  <option value="All">All Categories</option>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat.id || cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="rigid-boxes">Rigid Boxes</option>
                      <option value="product-packaging">Product Packaging</option>
                      <option value="flexible-pouches">Flexible Pouches</option>
                      <option value="corrugated-boxes">Corrugated Boxes</option>
                      <option value="cosmetic-packaging">Cosmetic Packaging</option>
                      <option value="food-beverage">Food &amp; Beverage</option>
                      <option value="retail-packaging">Retail Packaging</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="hidden md:flex items-center gap-5 flex-shrink-0">
            {/* Store Icon */}
            <Link
              href="#"
              className="p-2 text-gray-600 hover:text-[#02c074] hover:bg-gray-50 rounded-xl transition-all"
              title="Store"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>

            {/* Wishlist Heart Icon */}
            <Link
              href="#"
              className="p-2 text-gray-600 hover:text-[#02c074] hover:bg-gray-50 rounded-xl transition-all relative"
              title="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {/* Cart Icon */}
            <Link
              href="#"
              className="p-2 text-gray-600 hover:text-[#02c074] hover:bg-gray-50 rounded-xl transition-all relative"
              title="Cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute top-1 right-1 bg-[#02c074] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User Profile Avatar / Sign In */}
            <Link
              href="#"
              className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-xl transition-all border border-gray-100"
            >
              <div className="w-7 h-7 rounded-full bg-[#111827] text-white font-bold text-xs flex items-center justify-center font-poppins">
                U
              </div>
              <span className="text-xs font-semibold text-gray-700 font-poppins pr-1">Account</span>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-[#02c074]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Bottom Sub-Bar: Industries Navigation with View All at the End ── */}
      <nav className="hidden md:block bg-white py-2.5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Horizontal Industries List */}
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-0.5">
            {bottomIndustries.map((ind) => (
              <Link
                key={ind.label}
                href={ind.href}
                className="flex items-center gap-2 font-poppins text-xs font-semibold text-gray-600 hover:text-[#02c074] transition-colors whitespace-nowrap group"
              >
                {ind.icon}
                <span>{ind.label}</span>
              </Link>
            ))}
          </div>

          {/* CRITICAL REQUIREMENT: View All / View All Industries Link at the far right */}
          <Link
            href="#"
            className="flex items-center gap-1.5 font-poppins text-xs font-bold text-[#02c074] hover:text-[#019a5c] transition-colors whitespace-nowrap pl-4 border-l border-gray-100 flex-shrink-0 group"
          >
            <span>View All</span>
            <svg
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-6 pt-3 space-y-4">
          <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products & industries..."
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {bottomIndustries.map((ind) => (
              <Link
                key={ind.label}
                href={ind.href}
                className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-50 p-2.5 rounded-xl hover:bg-[#e8f5ee] hover:text-[#02c074]"
              >
                {ind.icon}
                <span>{ind.label}</span>
              </Link>
            ))}
          </div>

          <Link
            href="#"
            className="flex items-center justify-center gap-2 font-poppins text-xs font-bold text-white bg-[#02c074] py-3 rounded-xl shadow-xs"
          >
            <span>View All Industries</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </header>
  );
}
