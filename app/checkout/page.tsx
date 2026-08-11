"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import Image from "next/image";

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "United Arab Emirates", "Saudi Arabia", "Pakistan", "India", "China", "Japan",
  "Singapore", "Netherlands", "Italy", "Spain", "Mexico", "Brazil", "South Africa",
  "Other",
];

export default function CheckoutPage() {
  const { items, count, clearCart } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    orderNotes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });

      if (!res.ok) throw new Error("Failed to send");

      setSubmitted(true);
      clearCart();
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ─────────────────────────────────────────────────
  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#f8f9fb] flex items-center justify-center px-4 py-20 font-inter">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl max-w-lg w-full p-10 text-center">
            {/* Checkmark animation */}
            <div className="w-20 h-20 rounded-full bg-[#eaf6f0] flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="inline-block font-poppins text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#277a4e] mb-3">
              QUOTE SUBMITTED
            </span>
            <h1 className="font-poppins text-2xl font-extrabold text-[#0f172a] mb-3">
              Thank you, {form.fullName.split(" ")[0]}!
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Your quote request has been received. Our sales team will review your selected
              products and get back to you at{" "}
              <strong className="text-[#277a4e]">{form.email}</strong> within{" "}
              <strong>24–48 business hours</strong>.
            </p>

            {/* What happens next */}
            <div className="bg-[#f8f9fb] rounded-2xl p-5 text-left space-y-3 mb-8">
              {[
                { step: "1", text: "Sales team reviews your product selection" },
                { step: "2", text: "Custom pricing & lead time confirmation sent" },
                { step: "3", text: "Free dieline & design support offered" },
                { step: "4", text: "Sample approval before bulk production" },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#277a4e] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {s.step}
                  </div>
                  <span className="text-xs text-gray-600">{s.text}</span>
                </div>
              ))}
            </div>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 font-poppins bg-[#277a4e] hover:bg-[#1d5338] text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-[#277a4e]/20"
            >
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Main Checkout ──────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8f9fb] font-inter">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium mb-3">
              <Link href="/" className="hover:text-[#277a4e] transition-colors">Home</Link>
              <span>›</span>
              <Link href="/cart" className="hover:text-[#277a4e] transition-colors">Cart</Link>
              <span>›</span>
              <span className="text-[#277a4e] font-bold">Checkout</span>
            </div>
            <span className="inline-block font-poppins text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#277a4e] mb-1">
              ENQUIRY CHECKOUT
            </span>
            <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Submit Your Quote Request
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Fill in your details and we&apos;ll send a customized quote to your email — no payment required.
            </p>
          </div>
        </div>

        {/* Empty cart redirect hint */}
        {items.length === 0 && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link href="/cart" className="font-poppins text-sm font-bold text-[#277a4e] hover:underline">
              ← Go back to cart
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

              {/* ── Left: Form ── */}
              <div className="lg:col-span-3">
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Contact Information */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                    <h2 className="font-poppins font-extrabold text-[#0f172a] text-base mb-1 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#277a4e] text-white text-xs font-bold flex items-center justify-center">1</span>
                      Contact Information
                    </h2>
                    <p className="text-xs text-gray-400 mb-6 ml-9">We&apos;ll use this to send your quote.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Sarah Johnson"
                          className="w-full px-4 py-3 bg-[#f8f9fb] border border-gray-200 rounded-xl text-sm text-[#0f172a] placeholder-gray-400 focus:bg-white focus:border-[#277a4e] focus:outline-none focus:ring-2 focus:ring-[#277a4e]/10 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Company / Brand
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          placeholder="e.g. Bloom Beauty Co."
                          className="w-full px-4 py-3 bg-[#f8f9fb] border border-gray-200 rounded-xl text-sm text-[#0f172a] placeholder-gray-400 focus:bg-white focus:border-[#277a4e] focus:outline-none focus:ring-2 focus:ring-[#277a4e]/10 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="you@company.com"
                          className="w-full px-4 py-3 bg-[#f8f9fb] border border-gray-200 rounded-xl text-sm text-[#0f172a] placeholder-gray-400 focus:bg-white focus:border-[#277a4e] focus:outline-none focus:ring-2 focus:ring-[#277a4e]/10 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Phone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-4 py-3 bg-[#f8f9fb] border border-gray-200 rounded-xl text-sm text-[#0f172a] placeholder-gray-400 focus:bg-white focus:border-[#277a4e] focus:outline-none focus:ring-2 focus:ring-[#277a4e]/10 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Country <span className="text-red-400">*</span>
                        </label>
                        <select
                          name="country"
                          value={form.country}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-[#f8f9fb] border border-gray-200 rounded-xl text-sm text-[#0f172a] focus:bg-white focus:border-[#277a4e] focus:outline-none focus:ring-2 focus:ring-[#277a4e]/10 transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select country...</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                    <h2 className="font-poppins font-extrabold text-[#0f172a] text-base mb-1 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#277a4e] text-white text-xs font-bold flex items-center justify-center">2</span>
                      Shipping / Business Address
                    </h2>
                    <p className="text-xs text-gray-400 mb-6 ml-9">For shipping estimates in your quote.</p>

                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Street address, City, State/Province, ZIP code"
                      className="w-full px-4 py-3 bg-[#f8f9fb] border border-gray-200 rounded-xl text-sm text-[#0f172a] placeholder-gray-400 focus:bg-white focus:border-[#277a4e] focus:outline-none focus:ring-2 focus:ring-[#277a4e]/10 transition-all resize-none"
                    />
                  </div>

                  {/* Special Notes */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                    <h2 className="font-poppins font-extrabold text-[#0f172a] text-base mb-1 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#277a4e] text-white text-xs font-bold flex items-center justify-center">3</span>
                      Special Requirements / Notes
                    </h2>
                    <p className="text-xs text-gray-400 mb-6 ml-9">
                      Dimensions, materials, print finish, Pantone colors, samples needed, etc.
                    </p>

                    <textarea
                      name="orderNotes"
                      value={form.orderNotes}
                      onChange={handleChange}
                      rows={5}
                      placeholder="e.g. Need 5,000 units of cosmetic boxes 10×5×3cm, matte lamination, 1 Pantone spot color. Requesting 3 samples before bulk order..."
                      className="w-full px-4 py-3 bg-[#f8f9fb] border border-gray-200 rounded-xl text-sm text-[#0f172a] placeholder-gray-400 focus:bg-white focus:border-[#277a4e] focus:outline-none focus:ring-2 focus:ring-[#277a4e]/10 transition-all resize-none"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-medium">
                      ⚠️ {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || items.length === 0}
                    className="w-full flex items-center justify-center gap-2 font-poppins bg-[#277a4e] hover:bg-[#1d5338] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#277a4e]/25"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending Quote Request...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Submit Quote Request — {count} Item{count > 1 ? "s" : ""}
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-gray-400 text-center">
                    🔒 Your information is secure and will only be used to prepare your custom packaging quote.
                  </p>
                </form>
              </div>

              {/* ── Right: Order Summary ── */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-28">
                  <h2 className="font-poppins font-extrabold text-[#0f172a] text-base mb-5 flex items-center justify-between">
                    Order Summary
                    <span className="text-xs font-bold text-[#277a4e] bg-[#eaf6f0] px-2.5 py-1 rounded-lg">
                      {items.length} product{items.length > 1 ? "s" : ""}
                    </span>
                  </h2>

                  {/* Items */}
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-5">
                    {items.map((item) => (
                      <div key={String(item.id)} className="flex gap-3 items-start">
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                          <Image
                            src={item.image || "/product_packaging.png"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/product_packaging.png";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#0f172a] line-clamp-2 leading-snug">{item.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{item.categoryName} · MOQ: {item.moq}</p>
                        </div>
                        <span className="text-xs font-bold text-[#277a4e] bg-[#eaf6f0] px-2 py-0.5 rounded-md flex-shrink-0">
                          ×{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-5 space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Products</span>
                      <span className="font-bold text-[#0f172a]">{items.length} SKU{items.length > 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Payment</span>
                      <span className="font-bold text-emerald-600">No payment required</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Quote delivery</span>
                      <span className="font-bold text-[#0f172a]">24–48 hrs via email</span>
                    </div>
                  </div>

                  {/* Process steps */}
                  <div className="bg-[#f8f9fb] rounded-xl p-4 space-y-2.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-2">What happens next</p>
                    {[
                      "Sales team reviews your selection",
                      "Custom quote emailed within 48hrs",
                      "Free samples available on request",
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-[11px] text-gray-600">
                        <span className="w-5 h-5 rounded-full bg-[#277a4e] text-white flex items-center justify-center font-bold text-[9px] flex-shrink-0">
                          {i + 1}
                        </span>
                        {s}
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/cart"
                    className="mt-4 flex items-center justify-center gap-1 text-xs font-bold text-gray-400 hover:text-[#277a4e] transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Edit cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
