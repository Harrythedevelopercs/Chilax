"use client";

import Image from "next/image";
import Link from "next/link";

const cosmeticHighlights = [
  {
    title: "Skincare & Serum Cartons",
    subtitle: "Folding Cartons & Auto-Bottom Boxes",
    image: "/cosmetics/skincare_cartons.png",
    tag: "Custom Sizes",
    description: "Precision-cut folding cartons with auto-locking bottoms tailored for glass droppers & lotions.",
  },
  {
    title: "Luxury Fragrance & Rigid Sets",
    subtitle: "Velvet-Lined Magnetic Boxes",
    image: "/cosmetics/luxury_rigid_box.png",
    tag: "Luxury Finish",
    description: "Rigid chipboard boxes featuring magnetic closures and custom EVA foam protective inserts.",
  },
  {
    title: "E-Commerce Beauty Mailers",
    subtitle: "Printed Shipping Mailers",
    image: "/cosmetics/beauty_mailer.png",
    tag: "Transit Proof",
    description: "Heavy-duty corrugated mailer boxes with custom full-color interior & exterior branding.",
  },
  {
    title: "Waterproof Jar & Bottle Labels",
    subtitle: "Foil Stamped Vinyl Stickers",
    image: "/cosmetics/bottle_labels.png",
    tag: "Oil & Water Resistant",
    description: "Metallic foil-stamped die-cut labels engineered to resist moisture, oils, and friction.",
  },
];

export default function CosmeticsShowcaseBanner() {
  return (
    <section className="bg-gradient-to-b from-white via-[#f4f9f6] to-[#f8f9fb] py-12 sm:py-16 border-b border-gray-200/60 font-inter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#277a4e]/10 text-[#277a4e] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#277a4e] animate-pulse"></span>
              COSMETIC PACKAGING RANGE
            </span>
            <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f172a] tracking-tight leading-tight">
              Packaging Built Specifically for Beauty Brands
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 leading-relaxed">
              Explore custom cosmetic packaging styles crafted to elevate your unboxing experience and protect fragile beauty products.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#277a4e] hover:bg-[#1d5338] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-[#277a4e]/20 hover:shadow-lg whitespace-nowrap self-start md:self-auto"
          >
            Get Custom Dieline & Quote
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* 4-Card Feature Banner Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cosmeticHighlights.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col bg-white border border-gray-200/90 hover:border-[#277a4e] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5"
            >
              {/* Image Container */}
              <div className="relative w-full h-48 bg-gray-50 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                
                {/* Overlay Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-[#0f172a]/85 text-white backdrop-blur-xs shadow-xs">
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-grow justify-between bg-white">
                <div>
                  <span className="text-[11px] font-bold text-[#277a4e] uppercase tracking-wider block mb-1">
                    {item.subtitle}
                  </span>
                  <h3 className="font-poppins text-base font-bold text-[#0f172a] group-hover:text-[#277a4e] transition-colors leading-snug mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Highlights Strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eaf6f0] flex items-center justify-center text-[#277a4e]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0f172a]">5-7 Days Production</h4>
              <p className="text-[11px] text-gray-500">Fast turnaround times</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eaf6f0] flex items-center justify-center text-[#277a4e]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0f172a]">Low MOQ (100 Units)</h4>
              <p className="text-[11px] text-gray-500">Ideal for small & large lines</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eaf6f0] flex items-center justify-center text-[#277a4e]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0f172a]">Free 3D Proof & Dieline</h4>
              <p className="text-[11px] text-gray-500">Pre-production approval</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eaf6f0] flex items-center justify-center text-[#277a4e]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V7.055M11 20.945V19a2 2 0 00-2-2h-1a2 2 0 01-2-2v-1a2 2 0 00-2-2H3.055" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0f172a]">100% Recyclable Options</h4>
              <p className="text-[11px] text-gray-500">Eco-conscious packaging</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
