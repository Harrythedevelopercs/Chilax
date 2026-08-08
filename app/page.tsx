import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SolutionSection from "./components/SolutionSection";
import IndustriesSection from "./components/IndustriesSection";
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
        <IndustriesSection />
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
