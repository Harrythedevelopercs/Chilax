"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function IndustriesBanner() {
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

      // Smooth lerp for mouse cursor
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
            // Smoothstep curve for soft natural glow falloff
            const t = rawT * rawT * (3 - 2 * rawT);

            // Interpolate towards Primary Green (#02c074 -> R:2, G:192, B:116)
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
      className="relative w-full bg-[#f1f4f8] py-12 sm:py-20 lg:py-24 overflow-hidden select-none cursor-default"
    >
      {/* Interactive Dot Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-block mb-6">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-md text-[11px] sm:text-xs font-bold tracking-wider uppercase bg-[#e4f7ee] text-[#00684a] border border-[#c3f0da] shadow-xs">
              PREMIUM B2B MANUFACTURING
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-[#0f172a] tracking-tight leading-[1.15] mb-5 font-inter">
            Tailored Packaging for Every <br className="hidden sm:inline" />
            Industry
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#475569] font-normal leading-relaxed max-w-2xl mb-8">
            Engineered precision meet industrial reliability. We design and manufacture custom packaging solutions that protect your product and elevate your brand&apos;s presence in the global supply chain.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-[#00684a] hover:bg-[#00543c] text-white text-sm font-bold rounded-lg transition-colors shadow-xs"
            >
              View Full Catalog
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-transparent border-2 border-[#1e293b] hover:bg-[#1e293b] text-[#1e293b] hover:text-white text-sm font-bold rounded-lg transition-colors"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
