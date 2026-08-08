import Image from "next/image";
import Link from "next/link";

interface StaticCategoryItem {
  id: string;
  slug: string;
  name: string;
  count: number;
  description: string;
  image: string;
  href: string;
}

export default function ProductsCatalog() {
  const displayGroups = [
    {
      title: "Featured Packaging Categories",
      items: [
        {
          id: "cosmetic-packaging",
          slug: "custom-cosmetic-packaging",
          name: "Custom Cosmetic Packaging",
          count: 43,
          description: "Premium engineered cosmetic boxes, skincare cartons & beauty containers tailored to your brand.",
          image: "/cat_cosmetic_packaging.png",
          href: "/custom-cosmetic-packaging",
        },
        {
          id: "tuck-end-boxes",
          slug: "tuck-end-boxes",
          name: "Tuck End Boxes",
          count: 18,
          description: "Versatile retail folding cartons with straight & reverse tuck closures for products.",
          image: "/cat_tuck_end_boxes.png",
          href: "/custom-cosmetic-packaging",
        },
        {
          id: "woven-bags",
          slug: "woven-bags",
          name: "Woven & Non-Woven Bags",
          count: 12,
          description: "Eco-friendly custom printed tote bags and reusable non-woven retail carriers.",
          image: "/cat_woven_bags.png",
          href: "/custom-cosmetic-packaging",
        },
        {
          id: "mailer-boxes",
          slug: "mailer-boxes",
          name: "Shipping Mailer Boxes",
          count: 15,
          description: "Heavy-duty corrugated e-commerce mailers engineered for safe unboxing experience.",
          image: "/cat_mailer_boxes.png",
          href: "/custom-cosmetic-packaging",
        },
      ] as StaticCategoryItem[],
    },
    {
      title: "Subcategories & Specialized Styles",
      items: [
        {
          id: "best-sellers",
          slug: "best-sellers",
          name: "Best Sellers",
          count: 9,
          description: "Top-performing custom boxes & packaging solutions chosen by leading brands.",
          image: "/cat_best_sellers.png",
          href: "/custom-cosmetic-packaging",
        },
        {
          id: "luxury-boxes",
          slug: "luxury-boxes",
          name: "Luxury Boxes",
          count: 14,
          description: "Premium velvet-lined rigid chipboard boxes with magnetic closures & foil stamping.",
          image: "/cat_luxury_rigid_boxes.png",
          href: "/custom-cosmetic-packaging",
        },
        {
          id: "box-inserts",
          slug: "box-inserts",
          name: "Box Inserts",
          count: 14,
          description: "Precision-cut EVA foam, corrugated dielines & molded pulp protective inserts.",
          image: "/cat_box_inserts.png",
          href: "/custom-cosmetic-packaging",
        },
        {
          id: "labels",
          slug: "labels",
          name: "Labels & Stickers",
          count: 8,
          description: "Custom die-cut stickers, waterproof jar labels & metallic foil sheet labels.",
          image: "/cat_labels_stickers.png",
          href: "/custom-cosmetic-packaging",
        },
      ] as StaticCategoryItem[],
    },
  ];

  return (
    <section className="bg-[#f8f9fb] py-16 font-inter w-full border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div>
            <span className="inline-block font-poppins text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#277a4e] mb-2">
              PACKAGING CATALOG
            </span>
            <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-1">
              Explore Custom Packaging Categories
            </h2>
            <p className="font-inter text-gray-500 text-sm font-normal">
              Browse custom categories and specialized product lines for your B2B packaging needs.
            </p>
          </div>
          <Link
            href="/custom-cosmetic-packaging"
            className="font-poppins flex-shrink-0 bg-[#277a4e] hover:bg-[#1d5338] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 self-start sm:self-auto shadow-sm"
          >
            Cosmetic Packaging Catalog →
          </Link>
        </div>

        {/* Catalog Groups */}
        <div className="space-y-12">
          {displayGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              {/* Group Category Title */}
              <h3 className="font-poppins font-bold text-gray-700 text-xs tracking-widest uppercase mb-5 flex items-center gap-3">
                <span className="inline-block w-6 h-0.5 bg-[#277a4e] rounded-full" />
                {group.title}
              </h3>

              {/* Grid of Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {group.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                    style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)" }}
                  >
                    {/* Image Box */}
                    <div className="relative w-full h-52 overflow-hidden bg-gray-50">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Count Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-[#0f172a]/90 text-white backdrop-blur-xs shadow-xs uppercase tracking-wider">
                          {item.count} Products
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
                    </div>

                    {/* Content Box */}
                    <div className="px-5 pt-4 pb-5 flex-1 flex flex-col justify-between bg-white border-t border-gray-100/80">
                      <div>
                        <h4 className="font-poppins font-bold text-[#111827] text-sm mb-1 group-hover:text-[#277a4e] transition-colors duration-200 leading-snug">
                          {item.name}
                        </h4>
                        <p className="font-inter text-gray-400 text-xs leading-relaxed font-normal line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#277a4e] group-hover:text-[#1d5338] flex items-center gap-1 transition-colors">
                          Explore Category
                          <svg
                            className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="h-0.5 w-0 group-hover:w-full bg-[#277a4e] transition-all duration-300 ease-out" />
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

