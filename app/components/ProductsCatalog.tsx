import Image from "next/image";
import Link from "next/link";

interface CatalogItem {
  title: string;
  desc: string;
  img: string;
  href?: string;
}

interface CatalogGroup {
  categoryTitle: string;
  items: CatalogItem[];
}

const catalogGroups: CatalogGroup[] = [
  {
    categoryTitle: "Premium & Rigid Packaging",
    items: [
      {
        title: "Rigid Boxes",
        desc: "Luxurious packaging made from thick, durable chipboard for premium products.",
        img: "/rigid_boxes.png",
      },
      {
        title: "Magnetic Closure Boxes",
        desc: "High-end presentation boxes featuring a satisfying snap closure.",
        img: "/magnetic_boxes.png",
      },
      {
        title: "Drawer Boxes",
        desc: "Elegant slide-out style rigid boxes perfect for jewelry and cosmetics.",
        img: "/drawer_boxes.png",
      },
      {
        title: "Tin Containers",
        desc: "Durable and reusable custom printed tin packaging for specialty goods.",
        img: "/tin_containers.png",
      },
    ],
  },
  {
    categoryTitle: "Retail & Product Packaging",
    items: [
      {
        title: "Product Packaging",
        desc: "Standard cardstock boxes made from thin, flexible paperboard.",
        img: "/product_packaging.png",
      },
      {
        title: "Flexible Pouches",
        desc: "Keep food and products fresh with custom printed stand-up pouches.",
        img: "/flexible_pouches.png",
      },
      {
        title: "POP Displays",
        desc: "Point of purchase retail display boxes to catch customer attention.",
        img: "/pop_displays.png",
      },
      {
        title: "Paper Shopping Bags",
        desc: "Custom branded paper bags for retail stores and boutiques.",
        img: "/paper_bags.png",
      },
    ],
  },
  {
    categoryTitle: "Shipping & Mailers",
    items: [
      {
        title: "Corrugated Boxes",
        desc: "Durable 3-layer corrugated cardboard boxes for shipping and storage.",
        img: "/corrugated_boxes.png",
      },
      {
        title: "Mailer Boxes",
        desc: "Sturdy e-commerce packaging that provides a premium unboxing experience.",
        img: "/mailer_boxes.png",
      },
      {
        title: "Poly Mailers",
        desc: "Lightweight, weather-resistant shipping bags for apparel and soft goods.",
        img: "/poly_mailers.png",
      },
      {
        title: "Kraft Boxes",
        desc: "Eco-friendly, natural looking boxes for a rustic or sustainable brand image.",
        img: "/kraft_boxes.png",
      },
    ],
  },
  {
    categoryTitle: "Packaging Accessories",
    items: [
      {
        title: "Box Inserts",
        desc: "Keep your loose products nicely tucked, presented, and protected.",
        img: "/box_inserts.png",
      },
      {
        title: "Stickers & Labels",
        desc: "Custom printed rolls or die-cut stickers to brand your plain packaging.",
        img: "/stickers_labels.png",
      },
      {
        title: "Tissue Paper",
        desc: "Custom printed wrapping tissue for that extra unboxing touch.",
        img: "/tissue_paper.png",
      },
      {
        title: "Packing Tape",
        desc: "Secure your shipments with branded water-activated or poly tape.",
        img: "/packing_tape.png",
      },
    ],
  },
];

export default function ProductsCatalog() {
  return (
    <section className="bg-[#f8f9fb] py-16 font-inter w-full border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div>
            <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-2">
              Explore our custom packaging catalog
            </h2>
            <p className="font-inter text-gray-500 text-sm font-normal">
              Find the perfect custom printed packaging solutions for your business needs.
            </p>
          </div>
          <Link
            href="#"
            className="font-poppins flex-shrink-0 border border-[#2b303a] text-[#111827] px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-[#111827] hover:text-white transition-all duration-200 self-start sm:self-auto shadow-xs"
          >
            View All Products
          </Link>
        </div>

        {/* Catalog Groups */}
        <div className="space-y-12">
          {catalogGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              {/* Group Category Title */}
              <h3 className="font-poppins font-bold text-gray-700 text-xs tracking-widest uppercase mb-5 flex items-center gap-3">
                <span className="inline-block w-6 h-0.5 bg-[#02c074] rounded-full" />
                {group.categoryTitle}
              </h3>

              {/* Grid of 4 Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {group.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    href={item.href || "#"}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                    style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)" }}
                  >
                    {/* Image Box */}
                    <div className="relative w-full h-52 overflow-hidden bg-gray-50">
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Bottom gradient overlay */}
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
                      {/* Green accent top-right corner badge on hover */}
                      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#02c074] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md" />
                    </div>

                    {/* Content Box */}
                    <div className="px-5 pt-4 pb-5 flex-1 flex flex-col justify-start bg-white border-t border-gray-100/80">
                      <h4 className="font-poppins font-bold text-[#111827] text-sm mb-1 group-hover:text-[#02c074] transition-colors duration-200 leading-snug">
                        {item.title}
                      </h4>
                      <p className="font-inter text-gray-400 text-xs leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                    {/* Green bottom accent line on hover */}
                    <div className="h-0.5 w-0 group-hover:w-full bg-[#02c074] transition-all duration-300 ease-out" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
