"use client";

import { useState } from "react";
import Link from "next/link";

interface CategorySpecsSectionProps {
  categoryTitle: string;
}

export default function CategorySpecsSection({ categoryTitle }: CategorySpecsSectionProps) {
  const [activeTab, setActiveTab] = useState<"materials" | "finishing" | "addons" | "process">("materials");

  const materialsList = [
    { title: "Rigid Chipboard", desc: "1000 to 1800 GSM heavy-duty cardboard for luxury gift boxes.", tag: "Luxury B2B" },
    { title: "Folding Cardstock", desc: "14pt to 24pt premium SBS paperboard for product retail boxes.", tag: "Retail Standard" },
    { title: "Corrugated E/B Flute", desc: "Durable fluted cardboard engineered for e-commerce shipping.", tag: "High Strength" },
    { title: "Eco Kraft Board", desc: "100% recycled unbleached kraft paperboard for sustainable brands.", tag: "Eco Friendly" },
  ];

  const finishingList = [
    { title: "Matte & Gloss Lamination", desc: "Smooth protective film coating that enhances color depth and water resistance." },
    { title: "Soft Touch / Velvet Coating", desc: "Ultra-luxurious tactile velvet feel ideal for high-end cosmetic & gift packaging." },
    { title: "Hot Foil Stamping", desc: "Metallic gold, silver, rose gold, or holographic foil accents on logos." },
    { title: "Spot UV Coating", desc: "High-gloss raised coating applied to specific design areas for striking contrast." },
  ];

  const addonsList = [
    { title: "Custom EVA Foam Inserts", desc: "Precision die-cut foam lined with velvet for ultimate product protection." },
    { title: "Cardboard Dividers", desc: "Eco-friendly compartmentalization for multi-item sets." },
    { title: "Magnetic Closures", desc: "Concealed heavy-duty magnets for snap-shut lid experience." },
    { title: "Ribbon & Pull Tabs", desc: "Satin ribbon pulls and handles for luxury drawer boxes." },
  ];

  const steps = [
    { step: "01", title: "Select Style & Dimensions", desc: "Choose your box style or request a custom size dieline from our engineers." },
    { step: "02", title: "Free 3D Proof & Dieline", desc: "Receive a exact 2D dieline template and 3D digital proof before production." },
    { step: "03", title: "Precision Manufacturing", desc: "High-speed offset printing, die-cutting, and automated assembly." },
    { step: "04", title: "Fast Global Delivery", desc: "Quality inspection, flat or pre-assembled packing, and doorstep shipping." },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-t border-gray-200/80 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          <span className="inline-block font-poppins text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#277a4e] mb-3">
            TECHNICAL SPECIFICATIONS &amp; OPTIONS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a] tracking-tight font-poppins">
            Tailor Every Detail of Your {categoryTitle}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-normal mt-3 leading-relaxed">
            From structural board thickness to premium foil embellishments and custom inserts, customize your packaging down to the exact millimeter.
          </p>

          {/* Navigation Tabs */}
          <div className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 sm:gap-2 mt-6 bg-gray-100 p-1.5 rounded-xl max-w-full overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("materials")}
              className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === "materials"
                  ? "bg-white text-[#0f172a] shadow-xs"
                  : "text-gray-600 hover:text-[#0f172a]"
              }`}
            >
              Material Stocks
            </button>
            <button
              onClick={() => setActiveTab("finishing")}
              className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === "finishing"
                  ? "bg-white text-[#0f172a] shadow-xs"
                  : "text-gray-600 hover:text-[#0f172a]"
              }`}
            >
              Finishing &amp; Printing
            </button>
            <button
              onClick={() => setActiveTab("addons")}
              className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === "addons"
                  ? "bg-white text-[#0f172a] shadow-xs"
                  : "text-gray-600 hover:text-[#0f172a]"
              }`}
            >
              Inserts &amp; Add-ons
            </button>
            <button
              onClick={() => setActiveTab("process")}
              className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === "process"
                  ? "bg-white text-[#0f172a] shadow-xs"
                  : "text-gray-600 hover:text-[#0f172a]"
              }`}
            >
              Process Flow
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          {activeTab === "materials" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {materialsList.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#f8fafc] border border-gray-200/80 hover:border-[#277a4e] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-bold text-[#0f172a] font-poppins">{item.title}</h4>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#eaf6f0] text-[#1d5338]">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "finishing" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {finishingList.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#f8fafc] border border-gray-200/80 hover:border-[#277a4e] transition-colors">
                  <h4 className="text-base font-bold text-[#0f172a] font-poppins mb-2">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "addons" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addonsList.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#f8fafc] border border-gray-200/80 hover:border-[#277a4e] transition-colors">
                  <h4 className="text-base font-bold text-[#0f172a] font-poppins mb-2">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "process" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#f8fafc] border border-gray-200/80 relative">
                  <span className="text-3xl font-extrabold text-[#277a4e]/30 block mb-3 font-poppins">{s.step}</span>
                  <h4 className="text-base font-bold text-[#0f172a] font-poppins mb-2">{s.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Quote Banner */}
        <div className="mt-14 max-w-5xl mx-auto p-8 rounded-3xl bg-[#123524] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl" id="quote">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4ec388] block mb-1">
              READY TO ORDER CUSTOM PACKAGING?
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-poppins">
              Get an Instant Wholesale Price Quote
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-normal mt-1">
              Speak with our packaging specialists or submit your specs for a free quote within 2 hours.
            </p>
          </div>
          <Link
            href="/contact"
            className="whitespace-nowrap px-7 py-3.5 bg-[#277a4e] hover:bg-[#1d5338] text-white text-xs sm:text-sm font-bold rounded-lg transition-all shadow-md shrink-0"
          >
            Submit Custom Specifications
          </Link>
        </div>
      </div>
    </section>
  );
}
