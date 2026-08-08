"use client";
import { useState, useEffect } from "react";

interface SolutionSlide {
  title: string;
  features: {
    title: string;
    desc: string;
    icon: React.ReactNode;
  }[];
}

const slides: SolutionSlide[] = [
  {
    title: "Retail Packaging",
    features: [
      {
        title: "Managed manufacturing",
        desc: "Get the best manufacturing with stringent processes as well as transparency on your production.",
        icon: (
          <svg className="w-7 h-7 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      },
      {
        title: "Hassle-free logistics",
        desc: "Have us manage your logistics to get the best prices and turnaround time for shipping.",
        icon: (
          <svg className="w-7 h-7 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM4 9h11v6H4V9zm11 2h4l3 3v3h-7v-6z" />
          </svg>
        ),
      },
      {
        title: "Sustainability",
        desc: "Easily become a more sustainable brand with our range of eco-friendly products and options.",
        icon: (
          <svg className="w-7 h-7 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
        ),
      },
      {
        title: "Meticulous proofing",
        desc: "All orders go through our meticulous proofing system before going into production.",
        icon: (
          <svg className="w-7 h-7 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Custom Packaging",
    features: [
      {
        title: "Dedicated expert support",
        desc: "Make more informed decisions with unlimited support from our team of product specialists.",
        icon: (
          <svg className="w-7 h-7 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
        ),
      },
      {
        title: "End-to-end solution",
        desc: "From concept to your door, we simplify your project by handling everything for you.",
        icon: (
          <svg className="w-7 h-7 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
        ),
      },
      {
        title: "Custom sizing",
        desc: "Fully control the size of your packaging with no limitations to tailor to your product.",
        icon: (
          <svg className="w-7 h-7 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        ),
      },
      {
        title: "The Parcela Promise",
        desc: "We guarantee the highest quality product and customer experience with every order!",
        icon: (
          <svg className="w-7 h-7 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        ),
      },
    ],
  },
];

export default function SolutionSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const changeSlide = (newIndex: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentSlide(newIndex);
      setAnimating(false);
    }, 250);
  };

  const handleNext = () => {
    changeSlide((currentSlide + 1) % slides.length);
  };

  const handlePrev = () => {
    changeSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[currentSlide];

  return (
    <section className="bg-white py-14 md:py-18 border-b border-gray-100 font-inter w-full overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row with Title + Navigation Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-poppins font-bold text-2xl sm:text-3xl md:text-[2rem] text-[#111827] tracking-tight leading-tight">
              We are your best solution for{" "}
              <span
                className={`text-[#277a4e] inline-block transition-all duration-300 ${
                  !animating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                {activeSlide.title}
              </span>
            </h2>
            <p className="font-inter text-gray-500 text-sm mt-2 font-normal">
              Never worry about going to multiple sources to get your dream packaging.
            </p>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-[#277a4e] hover:text-[#277a4e] hover:shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Slide Indicator Dots */}
            <div className="flex items-center gap-1.5 px-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => changeSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === i ? "w-6 bg-[#277a4e]" : "w-2 bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-[#277a4e] hover:text-[#277a4e] hover:shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* 4 Cards Grid with Carousel Slide Transition */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300 ${
            !animating ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
          }`}
        >
          {activeSlide.features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-[#f8f9fb] rounded-2xl p-7 border border-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4"
            >
              {/* Green line art icon in soft green circle container */}
              <div className="w-14 h-14 rounded-2xl bg-[#eaf6f0] flex items-center justify-center flex-shrink-0">
                {feat.icon}
              </div>

              <div>
                <h3 className="font-poppins font-bold text-[#111827] text-base mb-2">
                  {feat.title}
                </h3>
                <p className="font-inter text-gray-500 text-xs sm:text-sm leading-relaxed font-normal">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
