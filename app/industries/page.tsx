import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import IndustriesBanner from "../components/IndustriesBanner";
import FeaturedPackagingTypes from "../components/FeaturedPackagingTypes";
import AllIndustriesSearchSection from "../components/AllIndustriesSearchSection";
import CustomPackagingFormSection from "../components/CustomPackagingFormSection";
import ManufacturerSection from "../components/ManufacturerSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "All Industries | Custom Packaging Solutions - Parcela®",
  description:
    "Tailored packaging for every industry. Custom packaging solutions engineered for precision and industrial reliability.",
};

export default function AllIndustriesPage() {
  return (
    <>
      <Navbar />
      <main>
        <IndustriesBanner />
        <FeaturedPackagingTypes />
        <AllIndustriesSearchSection />
        <CustomPackagingFormSection />
        <ManufacturerSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
