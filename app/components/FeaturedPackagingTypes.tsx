"use client";

import Image from "next/image";
import Link from "next/link";

const packagingTypes = [
  {
    title: "Rigid Boxes",
    description: "Premium structural integrity for luxury goods.",
    image: "/rigid_boxes.png",
    href: "/catalog?category=rigid-boxes",
  },
  {
    title: "Corrugated",
    description: "Durable shipping solutions for heavy-duty transit.",
    image: "/corrugated_boxes.png",
    href: "/catalog?category=corrugated",
  },
  {
    title: "Folding Cartons",
    description: "Versatile retail-ready secondary packaging.",
    image: "/product_packaging.png",
    href: "/catalog?category=folding-cartons",
  },
  {
    title: "Mailer Bags",
    description: "Lightweight, sustainable mailers for e-commerce.",
    image: "/mailer_bags.png",
    href: "/catalog?category=mailer-bags",
  },
  {
    title: "Pouches",
    description: "Flexible, barrier-protected solutions for snacks and dry goods.",
    image: "/flexible_pouches.png",
    href: "/catalog?category=pouches",
  },
];

export default function FeaturedPackagingTypes() {
  return (
    <section className="w-full bg-white py-12 sm:py-16 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight font-inter">
              Key Packaging Types
            </h2>
            <p className="text-sm sm:text-base text-[#64748b] mt-1.5 font-normal">
              Our most sought-after structural designs for professional applications.
            </p>
          </div>

          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#277a4e] hover:text-[#1d5338] transition-colors group flex-shrink-0"
          >
            <span>Explore all products</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
          {packagingTypes.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex flex-col cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-3.5 border border-gray-100/80 shadow-2xs group-hover:shadow-md transition-all duration-300">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>

              {/* Title & Description */}
              <h3 className="text-base sm:text-lg font-bold text-[#0f172a] group-hover:text-[#277a4e] transition-colors leading-snug">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748b] mt-1 leading-relaxed">
                {item.description}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
