import Link from "next/link";
import Image from "next/image";

const instagramImages = [
  { src: "/product_packaging.png", alt: "Custom packaging" },
  { src: "/stickers_labels.png", alt: "Labels and stickers" },
  { src: "/mailer_bags.png", alt: "Mailer packaging" },
  { src: "/rigid_boxes.png", alt: "Rigid gift boxes" },
  { src: "/flexible_pouches.png", alt: "Flexible pouches" },
  { src: "/manufacturing_team.png", alt: "Our team at work", hasPlay: true },
  { src: "/paper_bags.png", alt: "Paper bags" },
];

export default function InstagramSection() {
  return (
    <section className="bg-white py-16 border-b border-gray-200/60 w-full font-inter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Link href="#" className="block text-center mb-10 max-w-2xl mx-auto group">
          <h2 className="font-poppins text-xl md:text-2xl font-bold text-[#1a1a2e] group-hover:text-[#277a4e] transition-colors underline decoration-gray-300 underline-offset-4">
            Find our works on Instagram or tag us @Parcela to inspire others.
          </h2>
        </Link>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 w-full">
          {instagramImages.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-xl overflow-hidden group shadow-xs hover:shadow-md transition-all duration-200"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              {img.hasPlay && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-[#1a1a2e] fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
