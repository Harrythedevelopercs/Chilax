import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import CustomPackagingFormSection from "@/app/components/CustomPackagingFormSection";
import FAQSection from "@/app/components/FAQSection";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Contact Us & Request a Free Custom Packaging Quote | Parcela®",
  description:
    "Get in touch with Parcela packaging experts. Request a custom quote, inquire about wholesale box manufacturing, or get free structural design support.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Contact Banner Header */}
        <div className="bg-[#123524] text-white py-14 font-inter border-b border-[#1d5338]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
            <span className="inline-block font-poppins text-[11px] font-bold tracking-[0.2em] uppercase text-[#4ec388] mb-3">
              CONTACT &amp; QUOTE REQUEST
            </span>
            <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white">
              Let&apos;s Build Your Custom Packaging Solution
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Have questions or ready to request a custom quote? Fill out the form below or reach our packaging specialists for instant assistance and factory-direct pricing.
            </p>
          </div>
        </div>

        {/* Contact / Custom Packaging Form Section */}
        <CustomPackagingFormSection />

        {/* FAQ Section */}
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
