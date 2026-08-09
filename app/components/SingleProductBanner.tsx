"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface SingleProductBannerData {
  id?: number | string;
  slug?: string;
  name: string;
  categoryName: string;
  categorySlug: string;
  industrySlug?: string;
  image: string;
  images?: string[];
  shortDescription: string;
  moq: string;
  leadTime: string;
  material?: string;
  printing?: string;
  additionalOptions?: string[];
  addons?: string[];
}

interface SingleProductBannerProps {
  product: SingleProductBannerData;
}

export default function SingleProductBanner({ product }: SingleProductBannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, currX: -1000, currY: -1000, isHovered: false });

  const mainImage = product.image || "/product_packaging.png";
  const galleryImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [mainImage];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [product.image]);

  useEffect(() => {
    if (isPaused || galleryImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, galleryImages.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

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
          <Link href="/" className="hover:text-[#277a4e] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-[#277a4e] transition-colors">
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/catalog?category=${product.categorySlug}`}
            className="hover:text-[#277a4e] transition-colors"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-[#0f172a] font-bold line-clamp-1">{product.name}</span>
        </nav>

        {/* 2-Column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Product Image Showcase */}
          <div
            className="lg:col-span-5 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Main Image Container */}
            <div className="relative w-full h-80 sm:h-96 md:h-[400px] bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-lg group">
              {galleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    currentIndex === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              ))}

              {/* Badges on Image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 pointer-events-none">
                <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1e293b]/90 text-white backdrop-blur-xs shadow-xs">
                  MOQ: {product.moq}
                </span>
                <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#277a4e] text-white shadow-xs">
                  100% Customisable
                </span>
              </div>

              {/* Prev / Next Carousel Controls */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous Image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next Image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Indicator Dots */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentIndex === idx ? "w-6 bg-[#277a4e]" : "w-1.5 bg-white/70 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* E-Commerce Multiple Image Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white cursor-pointer ${
                      currentIndex === idx
                        ? "border-[#277a4e] ring-2 ring-[#277a4e]/25 scale-105 shadow-sm"
                        : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.name} thumbnail view ${idx + 1}`}
                      fill
                      className="object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Hero Product Details */}
          <div className="lg:col-span-7">
            {/* Category Tag */}
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#eaf6f0] text-[#1d5338] border border-[#c3f0da] shadow-xs">
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-gray-200/80 mb-6">
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
                  {product.material || "Custom Cardstock / Board"}
                </span>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                  Printing
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#0f172a] truncate block">
                  {product.printing || "Full CMYK / Foil Stamping"}
                </span>
              </div>
            </div>

            {/* Product Specification Customization Form */}
            <ProductSpecificationForm
              additionalOptions={product.additionalOptions}
              addons={product.addons}
            />

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-gray-200/80">
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="inline-flex items-center justify-center px-7 py-4 bg-[#277a4e] hover:bg-[#1d5338] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-[#277a4e]/20 group"
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

function ProductSpecificationForm({
  additionalOptions = [],
  addons = [],
}: {
  additionalOptions?: string[];
  addons?: string[];
}) {
  const [dimensions, setDimensions] = useState({ length: "", width: "", depth: "" });
  const [material, setMaterial] = useState("Need Consultation");
  const [print, setPrint] = useState("Need Consultation");
  const [finishing, setFinishing] = useState("Need Consultation");

  const [selectedAdditional, setSelectedAdditional] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const toggleAdditional = (option: string) => {
    setSelectedAdditional((prev: string[]) =>
      prev.includes(option) ? prev.filter((item: string) => item !== option) : [...prev, option]
    );
  };

  const toggleAddon = (option: string) => {
    setSelectedAddons((prev: string[]) =>
      prev.includes(option) ? prev.filter((item: string) => item !== option) : [...prev, option]
    );
  };

  const hasAdditional = Array.isArray(additionalOptions) && additionalOptions.length > 0;
  const hasAddons = Array.isArray(addons) && addons.length > 0;

  return (
    <div className="space-y-6 pt-2 pb-2 font-inter">
      {/* Dimensions Inputs (Row 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#1e293b] mb-1.5">
            Length (inch) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder=""
            value={dimensions.length}
            onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-[#0f172a] focus:outline-none focus:border-[#277a4e] focus:ring-2 focus:ring-[#277a4e]/20 transition-all shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1e293b] mb-1.5">
            Width (inch) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder=""
            value={dimensions.width}
            onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-[#0f172a] focus:outline-none focus:border-[#277a4e] focus:ring-2 focus:ring-[#277a4e]/20 transition-all shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1e293b] mb-1.5">
            Depth (inch) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder=""
            value={dimensions.depth}
            onChange={(e) => setDimensions({ ...dimensions, depth: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-[#0f172a] focus:outline-none focus:border-[#277a4e] focus:ring-2 focus:ring-[#277a4e]/20 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Select Dropdowns (Row 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#1e293b] mb-1.5">
            Material <span className="text-red-500">*</span>
          </label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-[#0f172a] focus:outline-none focus:border-[#277a4e] focus:ring-2 focus:ring-[#277a4e]/20 transition-all shadow-2xs cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10"
          >
            <option value="Need Consultation">Need Consultation</option>
            <option value="14pt Cardstock">14pt Cardstock</option>
            <option value="18pt Cardstock">18pt Cardstock</option>
            <option value="24pt Cardstock">24pt Cardstock</option>
            <option value="Kraft Paper">Kraft Paper</option>
            <option value="Rigid Board">Rigid Board</option>
            <option value="Corrugated E-Flute">Corrugated E-Flute</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1e293b] mb-1.5">
            Print <span className="text-red-500">*</span>
          </label>
          <select
            value={print}
            onChange={(e) => setPrint(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-[#0f172a] focus:outline-none focus:border-[#277a4e] focus:ring-2 focus:ring-[#277a4e]/20 transition-all shadow-2xs cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10"
          >
            <option value="Need Consultation">Need Consultation</option>
            <option value="No Printing (Plain)">No Printing (Plain)</option>
            <option value="1 Color Printing">1 Color Printing</option>
            <option value="Full Color CMYK">Full Color CMYK</option>
            <option value="CMYK + PMS Spot Color">CMYK + PMS Spot Color</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1e293b] mb-1.5">
            Finishing <span className="text-red-500">*</span>
          </label>
          <select
            value={finishing}
            onChange={(e) => setFinishing(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-[#0f172a] focus:outline-none focus:border-[#277a4e] focus:ring-2 focus:ring-[#277a4e]/20 transition-all shadow-2xs cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10"
          >
            <option value="Need Consultation">Need Consultation</option>
            <option value="Matte Lamination">Matte Lamination</option>
            <option value="Gloss Lamination">Gloss Lamination</option>
            <option value="Soft Touch / Velvet">Soft Touch / Velvet</option>
            <option value="Aqueous Coating">Aqueous Coating</option>
            <option value="Spot UV">Spot UV</option>
          </select>
        </div>
      </div>

      {/* Additional Options Chips - Only shown if product has additional options */}
      {hasAdditional && (
        <div>
          <label className="block text-xs font-semibold text-[#1e293b] mb-2.5">
            Additional Options
          </label>
          <div className="flex flex-wrap gap-2.5">
            {additionalOptions.map((opt) => {
              const isSelected = selectedAdditional.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleAdditional(opt)}
                  className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#277a4e] text-white shadow-xs"
                      : "bg-[#eaeaea] text-[#334155] hover:bg-[#dfdfdf]"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add-on Chips - Only shown if product has add-ons */}
      {hasAddons && (
        <div>
          <label className="block text-xs font-semibold text-[#1e293b] mb-2.5">
            Add-on
          </label>
          <div className="flex flex-wrap gap-2.5">
            {addons.map((opt) => {
              const isSelected = selectedAddons.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleAddon(opt)}
                  className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#277a4e] text-white shadow-xs"
                      : "bg-[#eaeaea] text-[#334155] hover:bg-[#dfdfdf]"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
