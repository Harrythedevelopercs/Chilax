"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export interface SingleProductBannerData {
  id?: number | string;
  name: string;
  categoryName: string;
  categorySlug: string;
  image: string;
  shortDescription: string;
  moq: string;
  leadTime: string;
  material?: string;
  printing?: string;
}

interface SingleProductBannerProps {
  product: SingleProductBannerData;
}

export default function SingleProductBanner({ product }: SingleProductBannerProps) {
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

    const gap = 22;
    const hoverRadius = 130;

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
          let alpha = 0.35;
          let radius = 1.3;

          if (dist < hoverRadius && mouseRef.current.isHovered) {
            const rawT = 1 - dist / hoverRadius;
            const t = rawT * rawT * (3 - 2 * rawT);

            r = Math.round(148 + (2 - 148) * t);
            g = Math.round(163 + (192 - 163) * t);
            b = Math.round(184 + (116 - 184) * t);
            alpha = 0.35 + 0.65 * t;
            radius = 1.3 + 2.2 * t;
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
      className="relative w-full bg-[#f1f4f8] py-10 sm:py-16 lg:py-20 overflow-hidden select-none cursor-default"
    >
      {/* Interactive Dot Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-8">
          <Link href="/" className="hover:text-[#02c074] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-[#02c074] transition-colors">
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/catalog?category=${product.categorySlug}`}
            className="hover:text-[#02c074] transition-colors"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-[#0f172a] font-bold line-clamp-1">{product.name}</span>
        </nav>

        {/* 2-Column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Product Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full h-80 sm:h-96 md:h-[420px] bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-lg group">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />

              {/* Badges on Image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1e293b]/90 text-white backdrop-blur-xs shadow-xs">
                  MOQ: {product.moq}
                </span>
                <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#02c074] text-white shadow-xs">
                  100% Customisable
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Product Details */}
          <div className="lg:col-span-7">
            {/* Category Tag */}
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#e4f7ee] text-[#00684a] border border-[#c3f0da] shadow-xs">
                {product.categoryName}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-extrabold text-[#0f172a] tracking-tight leading-[1.18] mb-4 font-inter">
              {product.name}
            </h1>

            {/* Rating / Review Badge */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex text-amber-400 text-sm">
                {"★".repeat(5)}
              </div>
              <span className="text-xs font-bold text-gray-700">4.9/5</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-medium">120+ B2B Client Reviews</span>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed mb-6 max-w-2xl">
              {product.shortDescription}
            </p>

            {/* Specs Quick Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-gray-200/80 mb-8">
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                  Min. Order
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#0f172a]">
                  {product.moq}
                </span>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                  Turnaround
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#0f172a]">
                  {product.leadTime}
                </span>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                  Material
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#0f172a] truncate block">
                  {product.material || "Premium Cardboard"}
                </span>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                  Printing
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#0f172a] truncate block">
                  {product.printing || "Full CMYK / Foil"}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/industries#custom-packaging-form`}
                className="inline-flex items-center justify-center px-7 py-4 bg-[#00684a] hover:bg-[#00543c] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-[#00684a]/20 group"
              >
                Get Instant Quote
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
                href={`/contact?type=sample&product=${encodeURIComponent(product.name)}`}
                className="inline-flex items-center justify-center px-6 py-4 bg-transparent border-2 border-[#1e293b] hover:bg-[#1e293b] text-[#1e293b] hover:text-white text-sm font-bold rounded-xl transition-colors"
              >
                Request Sample Kit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
