import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import SingleIndustryBanner from "../../components/SingleIndustryBanner";
import Footer from "../../components/Footer";
import { getWPIndustries } from "@/lib/woocommerce";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatSlugToTitle(slug: string): string {
  const formatted = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  if (!formatted.toLowerCase().startsWith("custom")) {
    return `Custom ${formatted} Packaging`;
  }
  return formatted.toLowerCase().includes("packaging") ? formatted : `${formatted} Packaging`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = formatSlugToTitle(slug);
  return {
    title: `${title} | Custom Packaging Solutions - Parcela®`,
    description: `Tailored ${title} solutions. Custom packaging engineered for precision, durability, and brand elevation.`,
  };
}

export default async function SingleIndustryPage({ params }: PageProps) {
  const { slug } = await params;

  // Try fetching WP taxonomy term by slug
  let title = formatSlugToTitle(slug);
  let description = `Engineered precision meets industrial reliability. We design and manufacture ${title.toLowerCase()} solutions that protect your product and elevate your brand's presence in the global supply chain.`;
  let badge = `${title.toUpperCase()}`;

  try {
    const terms = await getWPIndustries();
    const matchedTerm = terms.find(
      (t) => t.slug.toLowerCase() === slug.toLowerCase() || t.id.toString() === slug
    );

    if (matchedTerm) {
      title = matchedTerm.name;
      if (matchedTerm.description && matchedTerm.description.trim()) {
        description = matchedTerm.description;
      }
      badge = "PREMIUM B2B MANUFACTURING";
    }
  } catch (error) {
    console.error("Error fetching industry term in page:", error);
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Section 1: Single Industry Banner */}
        <SingleIndustryBanner
          title={title}
          badge={badge}
          description={description}
        />
      </main>
      <Footer />
    </>
  );
}
