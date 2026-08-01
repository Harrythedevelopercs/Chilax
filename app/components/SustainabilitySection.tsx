import Image from "next/image";
import Link from "next/link";

export default function SustainabilitySection() {
  return (
    <section className="bg-white py-16 md:py-24 border-b border-gray-100 font-inter w-full overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Image Showcase */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 min-h-[380px] md:min-h-[460px] w-full group">
            <Image
              src="/eco_packaging.png"
              alt="Sustainable eco-friendly packaging"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Floating Eco Badge */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center text-[#02c074] flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <div>
                <h4 className="font-poppins font-bold text-[#111827] text-xs sm:text-sm">
                  100% Recyclable &amp; Biodegradable
                </h4>
                <p className="font-inter text-gray-500 text-[11px]">
                  Zero compromise on durability or print quality.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex flex-col items-start justify-center">
            
            {/* Pill Badge */}
            <span className="inline-block font-poppins text-[11px] font-bold tracking-wider uppercase text-[#007a48] bg-[#e8f5ee] px-4 py-1.5 rounded-full mb-4">
              Eco-Friendly Packaging
            </span>

            {/* Main Title */}
            <h2 className="font-poppins font-bold text-2xl sm:text-3xl lg:text-[2.25rem] text-[#111827] leading-tight mb-4 tracking-tight">
              Let&apos;s create a sustainable future together
            </h2>

            {/* Description */}
            <p className="font-inter text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
              Grow your business with eco-friendly alternatives to packaging. We are committed to helping you transition to responsible materials that don&apos;t compromise on quality.
            </p>

            {/* Sub-heading */}
            <h3 className="font-poppins font-bold text-[#111827] text-base sm:text-lg mb-4">
              Go green with sustainably responsible packaging
            </h3>

            {/* Feature Bullet Points */}
            <ul className="space-y-3 mb-8 w-full">
              <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <span className="w-5 h-5 rounded-full bg-[#e8f5ee] flex items-center justify-center flex-shrink-0 text-[#007a48]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                FSC-certified sustainably sourced paperboard &amp; craft
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <span className="w-5 h-5 rounded-full bg-[#e8f5ee] flex items-center justify-center flex-shrink-0 text-[#007a48]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                Non-toxic water-based &amp; soy inks for custom printing
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <span className="w-5 h-5 rounded-full bg-[#e8f5ee] flex items-center justify-center flex-shrink-0 text-[#007a48]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                Reduced carbon footprint across global supply chain
              </li>
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#"
                className="font-poppins bg-[#007a48] hover:bg-[#00663c] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-sm transition-all duration-200"
              >
                Browse products
              </Link>
              <Link
                href="#"
                className="font-poppins bg-white hover:bg-gray-50 text-[#007a48] border border-[#007a48] px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200"
              >
                Learn how we do it
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
