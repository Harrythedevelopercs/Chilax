"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

interface DashboardLayoutProps {
  user: {
    email: string;
    name: string;
    company?: string;
  };
  children: React.ReactNode;
}

export default function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    {
      label: "My Orders & Quotes",
      href: "/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      label: "Request New Quote",
      href: "/custom-cosmetic-packaging",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb] font-inter flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-32">
                <Image
                  src="/site_logo.png"
                  alt="Parcela"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#eaf6f0] text-[#277a4e] uppercase tracking-wider">
              Client Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#0f172a]">{user.name}</p>
              <p className="text-[11px] text-gray-400 truncate max-w-[180px]">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-bold transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs sticky top-24 space-y-1">
            <div className="px-3 py-2 mb-2">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Navigation</p>
            </div>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? "bg-[#277a4e] text-white shadow-sm"
                      : "text-gray-600 hover:bg-[#eaf6f0] hover:text-[#277a4e]"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-gray-100">
              <div className="bg-[#f8f9fb] rounded-xl p-3.5 border border-gray-100">
                <p className="text-xs font-bold text-[#0f172a] mb-1">Need Assistance?</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Have questions about custom dielines, print specs, or shipping?
                </p>
                <a
                  href="mailto:hello@parcela.studio"
                  className="mt-2.5 inline-flex items-center text-[11px] font-bold text-[#277a4e] hover:underline"
                >
                  Email Sales Team →
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
