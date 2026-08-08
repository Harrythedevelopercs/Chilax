import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import ProductsCatalog from "@/app/components/ProductsCatalog";
import CustomPackagingFormSection from "@/app/components/CustomPackagingFormSection";
import FAQSection from "@/app/components/FAQSection";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Packaging Catalog & Custom Box Styles | Parcela®",
  description:
    "Explore our complete custom packaging catalog. Premium rigid boxes, corrugated mailers, folding cartons, flexible pouches, and custom branded accessories.",
};

export default function CatalogPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero header for catalog page */}
        <div className="bg-[#123524] text-white py-14 font-inter border-b border-[#1d5338]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
            <span className="inline-block font-poppins text-[11px] font-bold tracking-[0.2em] uppercase text-[#4ec388] mb-3">
              PARCELA® PRODUCT CATALOG
            </span>
            <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white">
              Full Custom Packaging &amp; Box Catalog
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Discover industry-leading custom boxes, eco-friendly mailers, luxury rigid packaging, and flexible barrier pouches manufactured directly for your brand.
            </p>
          </div>
        </div>

        {/* Section 1: Full Catalog Grid */}
        <ProductsCatalog />

        {/* Section 2: Custom Packaging Quote Request Form */}
        <CustomPackagingFormSection />

        {/* Section 3: FAQ */}
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
