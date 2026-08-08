"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export interface SingleCategoryBannerProps {
  title: string;
  badge?: string;
  description: string;
  image?: string;
  moq?: string;
  turnaround?: string;
}

export default function SingleCategoryBanner({
  title,
  badge = "WHOLESALE CUSTOM PACKAGING",
  description,
  image = "/product_packaging.png",
  moq = "100 Units",
  turnaround = "6-8 Business Days",
}: SingleCategoryBannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, currX: -1000, currY: -1000, isHovered: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      const rect = section.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const gap = 24;
    const hoverRadius = 140;

    const render = () => {
      const rect = section.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      mouseRef.current.currX += (mouseRef.current.x - mouseRef.current.currX) * 0.15;
      mouseRef.current.currY += (mouseRef.current.y - mouseRef.current.currY) * 0.15;

      const mX = mouseRef.current.currX;
      const mY = mouseRef.current.currY;

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / gap);
      const rows = Math.ceil(height / gap);

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * gap;
          const y = j * gap;

          const dist = Math.hypot(x - mX, y - mY);

          let r = 148;
          let g = 163;
          let b = 184;
          let alpha = 0.25;
          let radius = 1.2;

          if (dist < hoverRadius && mouseRef.current.isHovered) {
            const rawT = 1 - dist / hoverRadius;
            const t = rawT * rawT * (3 - 2 * rawT);

            r = Math.round(148 + (2 - 148) * t);
            g = Math.round(163 + (192 - 163) * t);
            b = Math.round(184 + (116 - 184) * t);
            alpha = 0.25 + 0.65 * t;
            radius = 1.2 + 2.2 * t;
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.isHovered = true;
  };

  const handleMouseLeave = () => {
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
    mouseRef.current.isHovered = false;
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-[#f1f4f8] py-10 sm:py-14 lg:py-16 overflow-hidden select-none cursor-default"
    >
      {/* Interactive Dot Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-6">
          <Link href="/" className="hover:text-[#277a4e] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-[#277a4e] transition-colors">
            Categories
          </Link>
          <span>/</span>
          <span className="text-[#0f172a] font-bold">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Category Content */}
          <div className="lg:col-span-7">
            {/* Category Badge */}
            <div className="inline-block mb-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-md text-[11px] font-extrabold tracking-wider uppercase bg-[#eaf6f0] text-[#1d5338] border border-[#c3f0da] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#277a4e] animate-pulse" />
                {badge}
              </span>
            </div>

            {/* H1 Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0f172a] tracking-tight leading-[1.15] mb-4 font-poppins">
              {title}
            </h1>

            {/* Category Description */}
            <p className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed mb-6 max-w-2xl">
              {description}
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-gray-200/80 mb-6">
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-gray-200/60 shadow-2xs">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                  Min. Order (MOQ)
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#0f172a]">
                  {moq}
                </span>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-gray-200/60 shadow-2xs">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                  Production Speed
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#0f172a]">
                  {turnaround}
                </span>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-gray-200/60 shadow-2xs">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                  Design Support
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#277a4e]">
                  100% Free 3D Proof
                </span>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-gray-200/60 shadow-2xs">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                  Customization
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#0f172a]">
                  Size, Print & Style
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                href={`#quote`}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#277a4e] hover:bg-[#1d5338] text-white text-xs sm:text-sm font-bold rounded-lg transition-all shadow-md shadow-[#277a4e]/20 group"
              >
                Get Wholesale Quote
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href={`/contact?type=sample`}
                className="inline-flex items-center justify-center px-5 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-[#0f172a] text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-2xs"
              >
                Request Free Sample Kit
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Category Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full h-72 sm:h-88 md:h-[380px] bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-xl group">
              <Image
                src={image}
                alt={title}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#277a4e] uppercase tracking-wider block">
                    Factory Direct Pricing
                  </span>
                  <span className="text-xs text-gray-700 font-medium">
                    High precision manufacturing &amp; global delivery
                  </span>
                </div>
                <div className="flex text-amber-400 text-xs">
                  {"★".repeat(5)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
