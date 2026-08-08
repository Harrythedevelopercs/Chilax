import Image from "next/image";

const features = [
  {
    title: "Global Supply Chain",
    desc: "Get access to any custom packaging, boxes and additional materials using our global packaging supply chain.",
  },
  {
    title: "50+ Certified Facilities",
    desc: "Benefit from certified custom packaging sourced from over 50 certified facilities world wide.",
  },
  {
    title: "Manufacturing Excellence",
    desc: "Add a higher perceived value to your products with reliable custom packaging engineered to deliver quality assurance.",
  },
];

export default function ManufacturerSection() {
  return (
    <section className="bg-white py-16 md:py-20 border-b border-gray-200/60 w-full font-inter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-end w-full">
          {/* Left Content */}
          <div>
            <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#1a1a2e] mb-4 tracking-tight">
              Your ultimate packaging manufacturer
            </h2>
            <p className="font-inter text-gray-500 text-sm mb-8 leading-relaxed font-medium">
              Parcela is your go-to destination for everything custom boxes and custom packaging — by delivering support at every step of the custom packaging journey from concept to reality, our customers are able to achieve the packaging of their dreams with ease.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feat, idx) => (
                <div key={idx} className="bg-[#f4f6f8] p-5 rounded-xl border border-gray-200/60">
                  <h3 className="font-poppins font-bold text-[#1a1a2e] text-sm mb-1.5">{feat.title}</h3>
                  <p className="font-inter text-gray-500 text-xs leading-relaxed">{feat.desc}</p>
                </div>
              ))}

              {/* CTA Card — primary color */}
              <div className="bg-[#277a4e] p-5 rounded-xl flex flex-col justify-between gap-4 group">
                <div>
                  <h3 className="font-poppins font-bold text-white text-sm mb-1.5 leading-snug">
                    Ready to start your packaging journey?
                  </h3>
                  <p className="font-inter text-white/80 text-xs leading-relaxed">
                    Get a free quote in minutes and work with our packaging specialists today.
                  </p>
                </div>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-[#277a4e] font-poppins font-bold text-xs px-4 py-2.5 rounded-lg self-start hover:bg-white/90 transition-all duration-200 shadow-sm group-hover:gap-3"
                >
                  Get a Free Quote
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-72 md:h-full min-h-[360px] md:min-h-[420px] rounded-2xl overflow-hidden shadow-md border border-gray-200/60 w-full">
            <Image
              src="/manufacturing_team.png"
              alt="Parcela manufacturing team"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
