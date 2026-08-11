import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SolutionSection from "./components/SolutionSection";
import ProductsCatalog from "./components/ProductsCatalog";
import BakeryShowcaseBanner from "./components/BakeryShowcaseBanner";
import CandleShowcaseBanner from "./components/CandleShowcaseBanner";

import SustainabilitySection from "./components/SustainabilitySection";
import ServicesSection from "./components/ServicesSection";
import ManufacturerSection from "./components/ManufacturerSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FAQSection from "./components/FAQSection";
import InstagramSection from "./components/InstagramSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SolutionSection />
        <ProductsCatalog />
        <BakeryShowcaseBanner />
        <CandleShowcaseBanner />

        <SustainabilitySection />
        <ServicesSection />
        <ManufacturerSection />
        <TestimonialsSection />
        <FAQSection />
        <InstagramSection />
      </main>
      <Footer />
    </>
  );
}
