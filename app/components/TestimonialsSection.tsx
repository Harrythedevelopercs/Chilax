"use client";

const row1 = [
  {
    name: "Sarah M.",
    company: "Bloom Beauty Co.",
    rating: 5,
    text: "Parcela completely transformed our packaging. The quality of our custom boxes exceeded all expectations. Our customers constantly comment on how premium our packaging feels!",
    avatar: "S",
    color: "bg-[#02c074]",
    role: "Verified Buyer",
  },
  {
    name: "James R.",
    company: "Artisan Coffee Roasters",
    rating: 5,
    text: "We've tried multiple packaging suppliers, but Parcela is by far the best. Their team guided us through the entire process and the end result was absolutely perfect.",
    avatar: "J",
    color: "bg-emerald-600",
    role: "Verified Buyer",
  },
  {
    name: "Emily K.",
    company: "The Candle Studio",
    rating: 5,
    text: "From consultation to delivery, the entire experience was seamless. The eco-friendly pouches we ordered are stunning and our sales have increased by 30% since the rebrand!",
    avatar: "E",
    color: "bg-[#007a48]",
    role: "Verified Buyer",
  },
  {
    name: "Michael T.",
    company: "Urban Snacks Brand",
    rating: 5,
    text: "Incredible quality and fast turnaround time. The flexible pouches are exactly what we needed for our food products. Highly recommend Parcela to any brand!",
    avatar: "M",
    color: "bg-teal-600",
    role: "Verified Buyer",
  },
];

const row2 = [
  {
    name: "Laura B.",
    company: "Wellness Essentials",
    rating: 5,
    text: "Parcela helped us launch our brand with custom rigid boxes that look absolutely luxurious. The 360 approach they offer covers every detail we needed.",
    avatar: "L",
    color: "bg-[#02c074]",
    role: "Verified Buyer",
  },
  {
    name: "David H.",
    company: "Apex Tech Accessories",
    rating: 5,
    text: "Outstanding customer service and precise structural design. Our electronics packaging fits like a glove and looks retail-ready out of the box.",
    avatar: "D",
    color: "bg-[#007a48]",
    role: "Verified Buyer",
  },
  {
    name: "Jessica P.",
    company: "Pure Organic Botanicals",
    rating: 5,
    text: "Switching to Parcela's biodegradable kraft packaging was the best decision for our sustainable brand values. Top notch print clarity!",
    avatar: "J",
    color: "bg-[#157a47]",
    role: "Verified Buyer",
  },
  {
    name: "Alex V.",
    company: "Vanguard Apparel",
    rating: 5,
    text: "The poly mailers and tissue paper custom prints elevated our unboxing experience immensely. 10/10 service and fast global shipping.",
    avatar: "A",
    color: "bg-[#02c074]",
    role: "Verified Buyer",
  },
];

// Duplicate arrays to make seamless infinite loop
const doubleRow1 = [...row1, ...row1, ...row1, ...row1];
const doubleRow2 = [...row2, ...row2, ...row2, ...row2];

export default function TestimonialsSection() {
  return (
    <section className="bg-[#f8f9fb] py-16 md:py-24 border-b border-gray-100 w-full font-inter overflow-hidden relative">
      
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mb-14">
        <span className="inline-block font-poppins text-[11px] font-bold tracking-[0.2em] uppercase text-[#02c074] mb-3">
          Customer Reviews
        </span>
        <h2 className="font-poppins text-2xl sm:text-3xl md:text-[2.25rem] font-extrabold text-[#111827] tracking-tight mb-3">
          See what our customers say
        </h2>
        <p className="font-inter text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
          Don&apos;t let what we say influence you — take it from 3,000+ brands big and small who trust Parcela.
        </p>
      </div>

      {/* Full-width Marquee Container */}
      <div className="w-full relative">
        {/* Left & Right Gradient Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#f8f9fb] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#f8f9fb] to-transparent z-10 pointer-events-none" />

        {/* Row 1: Scroll LEFT */}
        <div className="mb-6 flex overflow-hidden">
          <div className="animate-marquee-left flex gap-6">
            {doubleRow1.map((item, idx) => (
              <div
                key={idx}
                className="w-[340px] sm:w-[380px] flex-shrink-0 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars + Verified Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#02c074] bg-[#e8f5ee] px-2.5 py-0.5 rounded-full">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item.role}
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="font-inter text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className={`w-9 h-9 rounded-full ${item.color} text-white font-poppins font-bold text-sm flex items-center justify-center shadow-xs`}>
                    {item.avatar}
                  </div>
                  <div>
                    <h4 className="font-poppins font-bold text-[#111827] text-xs sm:text-sm">{item.name}</h4>
                    <p className="font-inter text-gray-400 text-[11px] font-medium">{item.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Scroll RIGHT */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee-right flex gap-6">
            {doubleRow2.map((item, idx) => (
              <div
                key={idx}
                className="w-[340px] sm:w-[380px] flex-shrink-0 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars + Verified Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#02c074] bg-[#e8f5ee] px-2.5 py-0.5 rounded-full">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item.role}
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="font-inter text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className={`w-9 h-9 rounded-full ${item.color} text-white font-poppins font-bold text-sm flex items-center justify-center shadow-xs`}>
                    {item.avatar}
                  </div>
                  <div>
                    <h4 className="font-poppins font-bold text-[#111827] text-xs sm:text-sm">{item.name}</h4>
                    <p className="font-inter text-gray-400 text-[11px] font-medium">{item.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}
