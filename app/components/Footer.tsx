"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white text-[#111827] w-full font-inter border-t border-gray-100 relative">
      {/* ── Top Primary Green Accent Bar ── */}
      <div className="h-1.5 w-full bg-[#02c074]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-12 w-full">
        
        {/* ── Newsletter Row ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-12">
          <div>
            <h3 className="font-poppins font-bold text-xl sm:text-2xl text-[#111827] tracking-tight">
              Sign up to our newsletter
            </h3>
            <p className="font-inter text-gray-500 text-sm mt-1 font-normal">
              Stay up to date with the latest packaging news, announcements, and articles.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#02c074] transition-colors w-full sm:w-72 shadow-2xs font-normal"
            />
            <button
              type="submit"
              className="bg-[#02c074] hover:bg-[#00a863] text-white font-poppins font-bold text-sm px-6 py-2.5 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-4" />

        {/* ── Main Links Section ── */}
        <div className="pt-10 pb-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="col-span-2 lg:col-span-2 space-y-4 pr-4">
            <Link href="/" className="inline-block">
              <div className="relative h-14 sm:h-16 w-56 sm:w-64">
                <Image
                  src="/site_logo.png"
                  alt="Parcela Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="font-inter text-gray-500 text-xs sm:text-sm leading-relaxed max-w-sm font-normal">
              Design amazing custom packaging experiences that elevate your brand in the world. Engineered for quality, speed, and sustainability.
            </p>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 className="font-poppins font-semibold text-xs text-gray-400 uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-3 font-poppins text-xs font-semibold text-gray-700">
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Overview</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Features</Link>
              </li>
              <li className="flex items-center gap-2">
                <Link href="#" className="hover:text-[#02c074] transition-colors">Solutions</Link>
                <span className="text-[10px] font-bold text-[#02c074] bg-[#e8f5ee] px-2 py-0.5 rounded-full border border-[#02c074]/30">
                  New
                </span>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Tutorials</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Pricing</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Releases</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="font-poppins font-semibold text-xs text-gray-400 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3 font-poppins text-xs font-semibold text-gray-700">
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">About us</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Careers</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Press</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">News</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Media kit</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div>
            <h4 className="font-poppins font-semibold text-xs text-gray-400 uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-3 font-poppins text-xs font-semibold text-gray-700">
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Newsletter</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Events</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Help centre</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Tutorials</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Support</Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal */}
          <div>
            <h4 className="font-poppins font-semibold text-xs text-gray-400 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3 font-poppins text-xs font-semibold text-gray-700">
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Terms</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Privacy</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Cookies</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Licenses</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Settings</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#02c074] transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Bottom Copyright & Social Row ── */}
        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-inter text-xs text-gray-400 font-normal">
            &copy; 2026 Parcela&reg;. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-5 text-gray-400">
            <Link href="#" aria-label="Twitter" className="hover:text-[#02c074] transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </Link>

            <Link href="#" aria-label="LinkedIn" className="hover:text-[#02c074] transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 012.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>

            <Link href="#" aria-label="Facebook" className="hover:text-[#02c074] transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Link>

            <Link href="#" aria-label="GitHub" className="hover:text-[#02c074] transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </Link>

            <Link href="#" aria-label="Dribbble" className="hover:text-[#02c074] transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm9.73 11.23a9.89 9.89 0 01-6.19 8.01c-.13-.91-.53-2.58-1.57-4.32a32.9 32.9 0 007.76-3.69zm-9.35 9.07c-2.43 0-4.63-.9-6.3-2.39 2.05-1.9 4.97-3.23 8.35-3.32 1.05 1.75 1.44 3.4 1.56 4.3-.53.94-1.25 1.41-3.61 1.41zM3.87 16.32a9.92 9.92 0 01-1.81-5.11c.92.05 3.92.17 7.02-.91-1.39 2.91-2.91 5.09-5.21 6.02zm-1.81-7.85c.61-.13 3.99-.78 7.37.53-2.07 3.52-3.8 5.75-5.56 6.55A9.95 9.95 0 012.06 8.47zm11.75-6.28a9.92 9.92 0 015.65 4.63c-2.18 1.13-4.99 2.37-7.79 2.65-.67-1.74-1.53-3.61-2.57-5.46 1.63-1.07 3.23-1.82 4.71-1.82zm-6.68 1.12c.98 1.75 1.83 3.51 2.47 5.16-3.41-1.31-6.84-.65-7.46-.51a9.96 9.96 0 014.99-4.65z" />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
