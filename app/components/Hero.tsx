"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <section className="relative overflow-hidden bg-[#2c3d4e] min-h-[460px] md:min-h-[520px] w-full font-sans">
      {/* Full-width Edge-to-Edge Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bannerNew.png"
          alt="Custom packaging and box collection"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Soft gradient overlay for text readability while keeping banner image clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e293b]/95 via-[#1e293b]/75 to-transparent md:w-3/5" />
      </div>

      {/* Hero Content aligned within container */}
      <div className="relative z-10 container mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-20 flex items-center w-full min-h-[440px]">
        <div className="max-w-xl text-white">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-[2.25rem] lg:text-[2.5rem] text-white leading-[1.18] mb-4 tracking-tight">
            Create custom boxes &amp;<br />packaging of your dreams
          </h1>

          <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6 max-w-lg font-normal">
            Order personalized, high-quality custom printed packaging and branded boxes your customers will love, all in one place.
          </p>

          {/* Integrated Search Input Box */}
          <form onSubmit={handleSearch} className="mb-7 w-full max-w-xl">
            <div className="relative flex items-center bg-white rounded-xl sm:rounded-2xl p-1.5 shadow-lg border border-white/20">
              <div className="pl-4 pr-2 text-gray-500 flex items-center pointer-events-none shrink-0">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, industries, or styles..."
                className="w-full py-2.5 px-2 text-sm sm:text-base text-gray-800 placeholder:text-gray-500 bg-transparent focus:outline-none font-normal"
              />
              <button
                type="submit"
                style={{ backgroundColor: '#007a48', color: '#ffffff' }}
                className="bg-[#007a48] hover:bg-[#00663c] text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* CTA Buttons - Side by Side in 1 line on mobile */}
          <div className="flex flex-row items-center gap-2 sm:gap-3.5 w-full max-w-md">
            <Link
              href="#quote"
              className="flex-1 text-center whitespace-nowrap bg-[#007a48] hover:bg-[#00643b] text-white px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-base font-bold shadow-sm transition-colors"
            >
              Request a Quote
            </Link>
            <Link
              href="#styles"
              className="flex-1 text-center whitespace-nowrap bg-transparent hover:bg-white/10 text-white border border-white/80 px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-base font-bold transition-colors"
            >
              Choose Style
            </Link>
          </div>
        </div>
      </div>

      {/* Social Proof & Brand Logos Bar Below Hero */}
      <div className="relative z-10 bg-[#f8fafc] border-t border-gray-200/80 py-3.5 px-4 sm:px-6 w-full">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Left: Google rating & reviews */}
          <div className="flex items-center gap-2 text-gray-800 flex-wrap">
            <span className="font-bold">3,000+ brands big and small love us!</span>
            <div className="flex items-center gap-0.5 ml-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-3.5 h-3.5 text-[#007a48] fill-[#007a48]" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 font-semibold underline ml-1 cursor-pointer">4.6 Google Reviews</span>
          </div>

          {/* Right: Partner brand logos */}
          <div className="flex items-center gap-6 text-gray-400 font-bold text-xs tracking-wider opacity-70 flex-wrap">
            <span>HEELE</span>
            <span>NBALAB</span>
            <span>FOUR SEASONS</span>
            <span>REVLON</span>
            <span>native pet</span>
          </div>
        </div>
      </div>
    </section>
  );
}

