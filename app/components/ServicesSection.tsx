"use client";
import { useState } from "react";
import Image from "next/image";

const services = [
  {
    key: "Consultation",
    label: "Consultation",
    step: "01",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: "Expert Packaging Consultation",
    subtitle: "Your journey starts with a conversation",
    desc: "Our packaging specialists work one-on-one with you to understand your brand, product requirements, budget, and timeline. We translate your vision into a clear, actionable packaging roadmap.",
    points: [
      "Dedicated packaging specialist assigned to you",
      "Free, no-obligation consultation session",
      "In-depth brand & product analysis",
      "Custom recommendations & cost estimates",
    ],
    image: "/manufacturing_team.png",
    stat: { value: "10K+", label: "Brands Consulted" },
  },
  {
    key: "Design",
    label: "Design",
    step: "02",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    title: "Professional Packaging Design",
    subtitle: "Stunning artwork that sells on the shelf",
    desc: "Our in-house design team creates visually striking packaging that captures attention and communicates your brand story. Every pixel is crafted with purpose — from typography to color grading.",
    points: [
      "Experienced senior graphic designers",
      "Unlimited revisions until perfection",
      "Print-ready, dieline-accurate artwork",
      "Full brand consistency across all SKUs",
    ],
    image: "/stickers_labels.png",
    stat: { value: "50K+", label: "Designs Delivered" },
  },
  {
    key: "Prototype",
    label: "Prototype",
    step: "03",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: "Physical Prototype Creation",
    subtitle: "Touch and feel before you commit",
    desc: "Before investing in a full production run, we create accurate physical samples so you can validate the look, feel, dimensions, and print quality. Zero surprises at scale.",
    points: [
      "Accurate physical sample in real materials",
      "Precise structural dimensions & tolerances",
      "Real print quality preview",
      "Express 5-day prototype turnaround",
    ],
    image: "/rigid_boxes.png",
    stat: { value: "99%", label: "Approval Rate" },
  },
  {
    key: "Production",
    label: "Production",
    step: "04",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: "Certified Manufacturing",
    subtitle: "Quality control at every stage",
    desc: "Your packaging is manufactured in ISO-certified facilities with multi-stage quality assurance. Our global network of 50+ vetted factories ensures scalable, consistent production.",
    points: [
      "ISO 9001 certified manufacturing facilities",
      "Multi-stage quality assurance checks",
      "50+ vetted global factory network",
      "MOQ from 100 units to mass production",
    ],
    image: "/manufacturing_team.png",
    stat: { value: "50+", label: "Certified Factories" },
  },
  {
    key: "Logistic",
    label: "Logistic",
    step: "05",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0v10l-8 4M4 7v10l8 4" />
      </svg>
    ),
    title: "Global Logistics & Shipping",
    subtitle: "From our factories to your door, seamlessly",
    desc: "We manage end-to-end shipping logistics — from factory floor to your warehouse. Real-time tracking, customs clearance, and damage protection are included as standard.",
    points: [
      "Worldwide shipping to 120+ countries",
      "Real-time order & shipment tracking",
      "Full customs clearance handling",
      "Packaging damage protection guarantee",
    ],
    image: "/corrugated_boxes.png",
    stat: { value: "120+", label: "Countries Served" },
  },
  {
    key: "Optimize",
    label: "Optimize",
    step: "06",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "Continuous Optimization",
    subtitle: "Always improving, always saving",
    desc: "Our partnership doesn't end at delivery. We analyze performance data, identify cost-saving opportunities, and continuously refine your packaging strategy for long-term success.",
    points: [
      "Quarterly cost & performance reviews",
      "Data-driven packaging improvements",
      "Sustainable materials upgrade path",
      "Dedicated account manager support",
    ],
    image: "/eco_packaging.png",
    stat: { value: "30%", label: "Avg Cost Savings" },
  },
];

const benefits = [
  {
    icon: (
      <svg className="w-5 h-5 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Save cost & time",
    desc: "Expertly engineered solutions designed to maximise time and cost efficiency.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "More reliability",
    desc: "Certified manufacturers for consistent, reliable results every single time.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
      </svg>
    ),
    title: "More brand impact",
    desc: "Packaging designed to leave a lasting impression and drive brand recognition.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: "Become sustainable",
    desc: "Eco-certified packaging options that are sustainably sourced and recyclable.",
  },
];

export default function ServicesSection() {
  const [activeKey, setActiveKey] = useState("Consultation");
  const current = services.find((s) => s.key === activeKey)!;

  return (
    <section className="bg-[#f4f6f8] py-16 md:py-24 border-b border-gray-200/60 w-full font-inter overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* ── Header ── */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="inline-block font-poppins text-[11px] font-bold tracking-[0.2em] uppercase text-[#277a4e] mb-3">
            Our 360° Approach
          </span>
          <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#111827] mb-4 tracking-tight leading-tight">
            Services that meet your packaging needs
          </h2>
          <p className="font-inter text-gray-500 text-sm leading-relaxed">
            Our <strong className="text-[#111827]">360 approach</strong> delivers everything you need — from first concept to final delivery — to achieve{" "}
            <strong className="text-[#111827]">total packaging success</strong>.
          </p>
        </div>

        {/* ── Main Tabs + Content ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="flex flex-col lg:flex-row min-h-[480px]">

            {/* ── LEFT: Vertical Tab List ── */}
            <div className="lg:w-64 xl:w-72 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-center py-6">
              {services.map((svc) => {
                const isActive = svc.key === activeKey;
                return (
                  <button
                    key={svc.key}
                    onClick={() => setActiveKey(svc.key)}
                    className={`relative flex items-center gap-3.5 px-7 py-4 text-left transition-all duration-200 group ${
                      isActive ? "bg-[#eaf6f0]" : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Active left border bar */}
                    <span
                      className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full transition-all duration-300 ${
                        isActive ? "bg-[#277a4e]" : "bg-transparent"
                      }`}
                    />

                    {/* Icon */}
                    <span
                      className={`flex-shrink-0 transition-colors duration-200 ${
                        isActive ? "text-[#277a4e]" : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    >
                      {svc.icon}
                    </span>

                    {/* Label */}
                    <span
                      className={`font-poppins text-sm font-semibold transition-colors duration-200 ${
                        isActive ? "text-[#277a4e]" : "text-gray-600 group-hover:text-gray-800"
                      }`}
                    >
                      {svc.label}
                    </span>

                    {/* Step number on active */}
                    {isActive && (
                      <span className="ml-auto font-poppins text-[10px] font-bold text-[#277a4e]/60 tracking-wider">
                        {svc.step}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── RIGHT: Content Panel ── */}
            <div className="flex-1 flex flex-col lg:flex-row">

              {/* Text Content */}
              <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">
                {/* Step badge */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#277a4e] text-white text-[10px] font-bold font-poppins">
                    {current.step}
                  </span>
                  <span className="font-inter text-xs text-gray-400 font-medium">{current.subtitle}</span>
                </div>

                <h3 className="font-poppins text-xl lg:text-2xl font-extrabold text-[#111827] mb-4 leading-tight">
                  {current.title}
                </h3>
                <p className="font-inter text-gray-500 text-sm leading-relaxed mb-7">
                  {current.desc}
                </p>

                {/* Points */}
                <ul className="space-y-3 mb-8">
                  {current.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#eaf6f0] flex items-center justify-center">
                        <svg className="w-3 h-3 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="font-inter text-sm text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Stat pill */}
                <div className="inline-flex items-center gap-3 bg-[#eaf6f0] border border-[#277a4e]/20 rounded-xl px-5 py-3 self-start">
                  <span className="font-poppins text-2xl font-extrabold text-[#277a4e]">
                    {current.stat.value}
                  </span>
                  <span className="font-inter text-xs text-gray-500 leading-tight max-w-[80px]">
                    {current.stat.label}
                  </span>
                </div>
              </div>

              {/* Image Panel */}
              <div className="lg:w-80 xl:w-96 relative overflow-hidden">
                <div className="relative w-full h-64 lg:h-full min-h-[260px]">
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    className="object-cover object-center transition-opacity duration-500"
                    sizes="(max-width: 1024px) 100vw, 400px"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent lg:block hidden" />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Video Player Section (Full Width) ── */}
        <div className="mb-14 w-full rounded-3xl overflow-hidden shadow-md border border-gray-200/80 bg-black relative group">
          <video
            src="/videoMeTwo.mp4"
            controls
            autoPlay
            muted
            loop
            playsInline
            className="w-full aspect-[16/9] object-cover"
          />
          {/* Gradient Overlay & Caption */}
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none flex items-end justify-between">
            <p className="font-poppins font-bold text-white text-base sm:text-lg tracking-wide drop-shadow-md">
              Watch: The Parcela Manufacturing Process
            </p>
          </div>
        </div>

        {/* ── 360° Benefits Row ── */}
        <div className="text-center mb-8">
          <p className="font-poppins text-[#277a4e] font-bold text-xs tracking-widest uppercase mb-1">
            Total packaging success
          </p>
          <h3 className="font-poppins text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
            with 360° approach
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#eaf6f0] flex items-center justify-center flex-shrink-0">
                {benefit.icon}
              </div>
              <div>
                <h4 className="font-poppins font-bold text-[#111827] text-sm mb-1.5">{benefit.title}</h4>
                <p className="font-inter text-gray-500 text-xs leading-relaxed">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
