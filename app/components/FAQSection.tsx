"use client";
import { useState } from "react";
import Image from "next/image";

const faqs = [
  {
    question: "What is your minimum order quantities (MOQ)?",
    answer:
      "Our minimum order quantity (MOQ) depends on the specific product line and customization requirements. Standard custom boxes start at 100 units, while specialized rigid boxes or mailers may differ.\n\nWe strive to accommodate orders of various sizes to meet our customers' diverse needs, so don't hesitate to contact us for a custom quote!",
  },
  {
    question: "Can you produce less than your minimum order quantities (MOQ)?",
    answer:
      "In many cases we can accommodate smaller prototype runs or short production batches. Reach out to our packaging specialists and we'll do our best to find a tailored solution that fits your exact budget and timeline.",
  },
  {
    question: "How long is your typical production & turnaround time?",
    answer:
      "Typical production takes 10–18 business days after digital dieline & proof approval. Express shipping and rush production options are also available if you have an upcoming product launch deadline.",
  },
  {
    question: "Are all your packaging products eco-friendly and recyclable?",
    answer:
      "Yes! We offer a full range of FSC-certified, 100% recyclable kraft paperboard, biodegradable mailers, and non-toxic soy-based ink printing. Ask your specialist about our green packaging line.",
  },
  {
    question: "Will I receive a proof before my custom packaging goes into production?",
    answer:
      "Absolutely. You will receive a 2D/3D digital dieline proof for review and approval before any physical manufacturing begins. Physical pre-production prototypes can also be produced upon request.",
  },
  {
    question: "How do you ensure structural quality & print accuracy?",
    answer:
      "Every order undergoes multi-stage ISO 9001 certified quality control, including color calibration checks and structural load testing, ensuring perfect results on every batch.",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="bg-[#f8f9fb] py-16 md:py-24 border-b border-gray-100 font-inter w-full overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* ── Left Column: FAQs Title + Book Call Card ── */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              {/* Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#277a4e] animate-pulse" />
                <span className="font-poppins text-xs font-bold text-[#277a4e] tracking-wider uppercase">
                  FAQs
                </span>
              </div>

              {/* Title */}
              <h2 className="font-poppins text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[#111827] tracking-tight leading-[1.15] mb-8">
                Frequently Asked<br />Questions
              </h2>
            </div>

            {/* Book a 15 min call card */}
            <div className="bg-white rounded-3xl p-7 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
              {/* Subtle background glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#277a4e]/10 blur-2xl pointer-events-none" />

              {/* Avatar */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden mb-5 border-2 border-white shadow-md ring-4 ring-[#277a4e]/15">
                <Image
                  src="/expert_avatar.png"
                  alt="Packaging Consultant"
                  fill
                  className="object-cover object-center"
                />
              </div>

              {/* Card Title & Desc */}
              <h3 className="font-poppins font-bold text-[#111827] text-xl sm:text-2xl mb-2">
                Book a 15 min call
              </h3>
              <p className="font-inter text-gray-500 text-xs sm:text-sm leading-relaxed mb-6">
                If you have any questions, just book a 15-minute call with us before ordering.
              </p>

              {/* Call CTA Button */}
              <a
                href="/contact"
                className="inline-block w-full text-center bg-[#277a4e] hover:bg-[#1d5338] text-white font-poppins font-bold text-sm py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                Book a Free Call
              </a>
            </div>
          </div>

          {/* ── Right Column: Accordion Items ── */}
          <div className="lg:col-span-7 space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "border-gray-200 shadow-sm"
                      : "border-gray-100/90 hover:border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer group"
                    aria-expanded={isOpen}
                  >
                    <span className="font-poppins font-semibold text-[#111827] text-base md:text-[1.05rem] pr-4 leading-snug">
                      {faq.question}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-lg transition-all flex-shrink-0 ${
                        isOpen
                          ? "bg-[#eaf6f0] text-[#277a4e] font-bold"
                          : "text-gray-400 group-hover:text-gray-700"
                      }`}
                    >
                      {isOpen ? "×" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 md:px-6 md:pb-6 text-gray-600 text-xs sm:text-sm font-normal leading-relaxed border-t border-gray-100 pt-4 whitespace-pre-line">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
