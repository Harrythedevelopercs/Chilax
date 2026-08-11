"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/app/components/DashboardLayout";

interface OrderSummary {
  id: number;
  number: string;
  status: {
    label: string;
    color: string;
    bg: string;
  };
  rawStatus: string;
  date: string;
  itemCount: number;
  firstItem: string;
  country?: string;
}

interface UserInfo {
  email: string;
  name: string;
  company?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch session user info if available, or extract from page fetch
        const ordersRes = await fetch("/api/dashboard/orders");
        if (!ordersRes.ok) {
          if (ordersRes.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to fetch orders");
        }
        const data = await ordersRes.json();
        setOrders(data);

        // Try getting user profile details
        const meRes = await fetch("/api/auth/me").catch(() => null);
        if (meRes && meRes.ok) {
          const meData = await meRes.json();
          setUser(meData.user);
        } else {
          // Fallback if /api/auth/me is not present
          setUser({ email: "Client", name: "Valued Customer" });
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load orders. Please refresh or log in again.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center font-inter">
        <div className="flex items-center gap-3 text-sm text-gray-500 font-bold">
          <div className="w-5 h-5 border-2 border-[#277a4e] border-t-transparent rounded-full animate-spin" />
          Loading Your Client Portal...
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user || { email: "", name: "Client" }}>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-[#123524] to-[#277a4e] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white/15 text-[#a7f3d0] mb-3">
              Dashboard Overview
            </span>
            <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold mb-2">
              Welcome back, {user?.name.split(" ")[0]}!
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
              Track your custom packaging quote requests, production status, and communications directly from your portal.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-6 translate-y-6">
            <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">
              Total Quotes & Orders
            </span>
            <span className="font-poppins text-2xl font-extrabold text-[#0f172a]">
              {orders.length}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">
              Active Enquiries
            </span>
            <span className="font-poppins text-2xl font-extrabold text-[#277a4e]">
              {orders.filter((o) => o.rawStatus === "on-hold" || o.rawStatus === "processing" || o.rawStatus === "pending").length}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">
              Completed Orders
            </span>
            <span className="font-poppins text-2xl font-extrabold text-blue-600">
              {orders.filter((o) => o.rawStatus === "completed").length}
            </span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Order History Header */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="font-poppins text-lg font-extrabold text-[#0f172a]">
            Recent Quote & Order Requests
          </h2>
          <Link
            href="/custom-cosmetic-packaging"
            className="text-xs font-bold text-[#277a4e] hover:underline flex items-center gap-1"
          >
            + New Quote Request
          </Link>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#eaf6f0] text-[#277a4e] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-poppins font-bold text-[#0f172a] text-base mb-1">No orders found yet</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
              When you submit a packaging quote request on our store, it will automatically appear here for tracking and sales updates.
            </p>
            <Link
              href="/custom-cosmetic-packaging"
              className="inline-flex items-center gap-2 font-poppins bg-[#277a4e] hover:bg-[#1d5338] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#277a4e]/20"
            >
              Explore Products & Request Quote
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-poppins font-extrabold text-[#0f172a] text-sm sm:text-base">
                      Quote #{order.number || order.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${order.status.bg} ${order.status.color}`}
                    >
                      {order.status.label}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-gray-700">
                    {order.firstItem}
                    {order.itemCount > 1 && (
                      <span className="text-gray-400 font-normal"> (+{order.itemCount - 1} more)</span>
                    )}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                    <span>Date: {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    {order.country && <span>• Destination: {order.country}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#eaf6f0] hover:bg-[#277a4e] text-[#277a4e] hover:text-white text-xs font-bold transition-all"
                  >
                    View Status & Replies
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
