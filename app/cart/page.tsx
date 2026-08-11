"use client";

import { useCart } from "@/app/context/CartContext";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, count, removeItem, updateQty, clearCart } = useCart();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8f9fb] font-inter">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="inline-block font-poppins text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#277a4e]">
                QUOTE BASKET
              </span>
            </div>
            <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Your Quote Cart
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {count > 0
                ? `${count} item${count > 1 ? "s" : ""} ready for quoting — proceed to checkout to send your enquiry.`
                : "Your cart is empty. Browse our catalog to add products."}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {items.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-[#eaf6f0] flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="font-poppins text-xl font-bold text-[#0f172a] mb-2">Your cart is empty</h2>
              <p className="text-gray-500 text-sm max-w-sm mb-8">
                Add products from our catalog to build your custom packaging quote request.
              </p>
              <Link
                href="/custom-cosmetic-packaging"
                className="font-poppins bg-[#277a4e] hover:bg-[#1d5338] text-white px-7 py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-[#277a4e]/20"
              >
                Browse Catalog →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-4">
                {/* Clear Cart button */}
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-poppins font-bold text-sm text-gray-700 uppercase tracking-wide">
                    Products ({items.length})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear All
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={String(item.id)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 items-start hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                      <Image
                        src={item.image || "/product_packaging.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/product_packaging.png";
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#277a4e] bg-[#eaf6f0] px-2 py-0.5 rounded-md">
                        {item.categoryName}
                      </span>
                      <h3 className="font-poppins font-bold text-[#0f172a] text-sm mt-1.5 mb-1 leading-snug line-clamp-2">
                        {item.name}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-[11px] text-gray-500 font-medium">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          MOQ: <strong className="text-gray-700">{item.moq}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-[#277a4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <circle cx="12" cy="12" r="10" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                          </svg>
                          Lead: <strong className="text-gray-700">{item.leadTime}</strong>
                        </span>
                      </div>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1 bg-[#f8f9fb] border border-gray-200 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-600 hover:bg-white hover:text-[#277a4e] disabled:opacity-30 transition-all text-sm font-bold"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-[#0f172a]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-600 hover:bg-white hover:text-[#277a4e] transition-all text-sm font-bold"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[11px] text-gray-400">× quantity (for your reference)</span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Continue Shopping */}
                <Link
                  href="/custom-cosmetic-packaging"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#277a4e] hover:text-[#1d5338] mt-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Continue Browsing
                </Link>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-28">
                  <h2 className="font-poppins font-extrabold text-[#0f172a] text-base mb-5">
                    Quote Summary
                  </h2>

                  {/* Items summary */}
                  <div className="space-y-3 mb-5">
                    {items.map((item) => (
                      <div key={String(item.id)} className="flex items-start justify-between gap-2">
                        <span className="text-xs text-gray-600 flex-1 leading-snug line-clamp-2">{item.name}</span>
                        <span className="text-xs font-bold text-[#277a4e] flex-shrink-0 bg-[#eaf6f0] px-2 py-0.5 rounded-md">
                          ×{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-5 space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Total Products</span>
                      <span className="font-bold text-[#0f172a]">{items.length} SKU{items.length > 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Total Units (reference)</span>
                      <span className="font-bold text-[#0f172a]">{count}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Pricing</span>
                      <span className="font-bold text-amber-600">Custom Quote</span>
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="space-y-2 mb-6">
                    {[
                      { icon: "✓", text: "Factory-direct pricing" },
                      { icon: "✓", text: "Free dieline & design support" },
                      { icon: "✓", text: "Low MOQ from 100 units" },
                      { icon: "✓", text: "Dedicated sales manager" },
                    ].map((b) => (
                      <div key={b.text} className="flex items-center gap-2 text-[11px] text-gray-600">
                        <span className="w-4 h-4 rounded-full bg-[#eaf6f0] text-[#277a4e] flex items-center justify-center font-bold text-[9px]">
                          {b.icon}
                        </span>
                        {b.text}
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 font-poppins bg-[#277a4e] hover:bg-[#1d5338] text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-[#277a4e]/20"
                  >
                    Proceed to Checkout
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <p className="text-[10px] text-gray-400 text-center mt-3">
                    No payment required — we&apos;ll send you a custom quote by email.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
