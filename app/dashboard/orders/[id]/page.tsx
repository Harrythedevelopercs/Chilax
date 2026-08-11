"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import DashboardLayout from "@/app/components/DashboardLayout";

interface OrderDetail {
  id: number;
  number: string;
  status: {
    label: string;
    color: string;
    bg: string;
  };
  rawStatus: string;
  date: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company: string;
    country: string;
    address_1: string;
  };
  items: Array<{
    name: string;
    categoryName: string;
    moq: string;
    leadTime: string;
    quantity: number;
  }>;
  customerNote: string;
  replies: Array<{
    id: number;
    date: string;
    message: string;
    author: string;
  }>;
}

interface UserInfo {
  email: string;
  name: string;
  company?: string;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [user, setUser] = useState<UserInfo | null>(null);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/dashboard/orders?id=${orderId}`);
        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Order not found or permission denied");
        }
        const data = await res.json();
        setOrder(data);

        // Load user profile
        const meRes = await fetch("/api/auth/me").catch(() => null);
        if (meRes && meRes.ok) {
          const meData = await meRes.json();
          setUser(meData.user);
        } else {
          setUser({ email: data.billing.email, name: `${data.billing.first_name} ${data.billing.last_name}` });
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load order details.");
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center font-inter">
        <div className="flex items-center gap-3 text-sm text-gray-500 font-bold">
          <div className="w-5 h-5 border-2 border-[#277a4e] border-t-transparent rounded-full animate-spin" />
          Loading Quote #{orderId}...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <DashboardLayout user={user || { email: "", name: "Client" }}>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <h2 className="font-poppins font-extrabold text-lg text-red-600 mb-2">Quote Not Found</h2>
          <p className="text-xs text-gray-500 mb-6">{error || "The requested quote does not exist or belongs to another account."}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 font-poppins bg-[#277a4e] text-white px-5 py-2.5 rounded-xl text-xs font-bold"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Determine timeline progress steps
  const steps = [
    { key: "on-hold", label: "Quote Submitted", desc: "Enquiry received by sales" },
    { key: "pending", label: "Spec Review", desc: "Dieline & print check" },
    { key: "processing", label: "In Production", desc: "Factory manufacturing" },
    { key: "completed", label: "Delivered", desc: "Shipped & delivered" },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "on-hold":
        return 0;
      case "pending":
        return 1;
      case "processing":
        return 2;
      case "completed":
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.rawStatus);

  return (
    <DashboardLayout user={user || { email: order.billing.email, name: `${order.billing.first_name} ${order.billing.last_name}` }}>
      <div className="space-y-6">
        {/* Back breadcrumb */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#277a4e] transition-colors"
          >
            ← Back to All Orders
          </Link>
        </div>

        {/* Order Header Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#277a4e] block mb-1">
                Order & Quote Tracking
              </span>
              <h1 className="font-poppins text-2xl font-extrabold text-[#0f172a]">
                Quote #{order.number || order.id}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Submitted on {new Date(order.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-full border ${order.status.bg} ${order.status.color}`}
              >
                ● {order.status.label}
              </span>
            </div>
          </div>

          {/* Visual Order Progress Tracking Timeline */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-6 font-poppins">
              Order Progress Status
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
              {steps.map((step, idx) => {
                const isDone = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div
                    key={step.key}
                    className={`rounded-2xl p-4 border transition-all ${
                      isCurrent
                        ? "bg-[#eaf6f0] border-[#277a4e] shadow-xs"
                        : isDone
                        ? "bg-emerald-50/50 border-emerald-200"
                        : "bg-gray-50 border-gray-100 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                          isDone
                            ? "bg-[#277a4e] text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {isDone ? "✓" : idx + 1}
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          isDone ? "text-[#0f172a]" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2 Column Layout: Left Products & Specs, Right Sales Replies */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Items & Customer Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Items Requested */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
              <h3 className="font-poppins font-extrabold text-sm text-[#0f172a] mb-4 uppercase tracking-wide">
                Requested Products ({order.items.length})
              </h3>
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-[#f8f9fb] border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#277a4e] bg-white px-2 py-0.5 rounded-md border border-gray-200/60">
                        {item.categoryName || "Custom Packaging"}
                      </span>
                      <h4 className="font-poppins font-bold text-[#0f172a] text-sm mt-1.5">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        MOQ: <span className="font-bold text-gray-700">{item.moq}</span> · Turnaround: <span className="font-bold text-gray-700">{item.leadTime}</span>
                      </p>
                    </div>
                    <div className="text-right sm:text-right text-xs font-bold text-[#277a4e] bg-[#eaf6f0] px-3 py-1.5 rounded-xl border border-[#c3f0da] self-start sm:self-auto">
                      Qty: {item.quantity} units
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Requirements Note */}
              {order.customerNote && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2 font-poppins">
                    Your Requirements & Notes
                  </h4>
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs text-amber-900 leading-relaxed font-medium">
                    {order.customerNote}
                  </div>
                </div>
              )}
            </div>

            {/* Client Info Summary */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
              <h3 className="font-poppins font-extrabold text-sm text-[#0f172a] mb-4 uppercase tracking-wide">
                Delivery & Contact Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block font-medium">Contact Name</span>
                  <span className="font-bold text-[#0f172a]">{order.billing.first_name} {order.billing.last_name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Company / Brand</span>
                  <span className="font-bold text-[#0f172a]">{order.billing.company || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Email</span>
                  <span className="font-bold text-[#0f172a]">{order.billing.email}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Phone</span>
                  <span className="font-bold text-[#0f172a]">{order.billing.phone || "N/A"}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-400 block font-medium">Shipping Address</span>
                  <span className="font-bold text-[#0f172a]">{order.billing.address_1 || "N/A"}, {order.billing.country}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sales Team Replies & Communication Log */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs sticky top-24 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="font-poppins font-extrabold text-sm text-[#0f172a] uppercase tracking-wide">
                  Sales Team Messages ({order.replies.length})
                </h3>
                <span className="w-2.5 h-2.5 rounded-full bg-[#277a4e] animate-pulse" />
              </div>

              {order.replies.length === 0 ? (
                <div className="py-8 text-center bg-[#f8f9fb] rounded-2xl p-4 border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#eaf6f0] text-[#277a4e] flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-[#0f172a] mb-1">Awaiting Sales Review</p>
                  <p className="text-[11px] text-gray-500">
                    Our sales engineering team is preparing your custom quote. Any updates or dieline files will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {order.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="p-4 rounded-2xl bg-[#eaf6f0]/70 border border-[#c3f0da] text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1d5338] flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#277a4e] text-white flex items-center justify-center text-[10px]">
                            P
                          </span>
                          {reply.author}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {new Date(reply.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <div
                        className="text-gray-700 leading-relaxed font-medium prose prose-xs"
                        dangerouslySetInnerHTML={{ __html: reply.message }}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-gray-100">
                <a
                  href={`mailto:harrykennedy.cs@gmail.com?subject=Inquiry regarding Quote %23${order.number || order.id}`}
                  className="w-full flex items-center justify-center gap-2 font-poppins bg-[#277a4e] hover:bg-[#1d5338] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Reply to Sales Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
