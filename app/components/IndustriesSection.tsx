"use client";
import { useState } from "react";
import Link from "next/link";

const industries = [
  {
    name: "Custom Cosmetic Packaging",
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
    name: "Custom CBD Packaging",
    href: "/industries/custom-cbd-cannabis",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8 6 6 10 7 14c1 4 5 6 5 6s4-2 5-6c1-4-1-8-5-12z" />
        <line x1="12" y1="12" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    name: "Custom Food & Beverage",
    href: "/industries/custom-food-beverage",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l19-9-9 19-2-8-8-2z" />
      </svg>
    ),
  },
  {
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
    name: "Custom Jewelry Packaging",
    href: "/industries/custom-jewelry-packaging",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    name: "Custom Apparel Packaging",
    href: "/industries/custom-apparel-packaging",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" />
      </svg>
    ),
  },
  {
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
];

export default function IndustriesSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="bg-white py-16 md:py-20 border-b border-gray-100 w-full font-inter overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block font-poppins text-[11px] font-bold tracking-[0.2em] uppercase text-[#277a4e] mb-3">
            Industries We Serve
          </span>
          <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-3">
            Custom Packaging Solutions by Industry
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            We provide specialized packaging expertise tailored to the unique
            requirements and regulations of your specific industry.
          </p>
        </div>

        {/* Industry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {industries.map((industry, idx) => (
            <Link
              key={idx}
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

        {/* View All CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 font-poppins text-sm font-bold text-[#277a4e] hover:text-[#1d5338] transition-colors duration-200 group"
          >
            View all 20+ industries
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
