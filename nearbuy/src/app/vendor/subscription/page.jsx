"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "react-hot-toast";
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Download,
  ShieldCheck,
  Calendar,
} from "lucide-react";

export default function VendorSubscription() {
  const [currentTier, setCurrentTier] = useState("Gold Pro Plan");

  const tierPlans = [
    {
      name: "Starter Free",
      price: "₹0",
      period: "forever",
      desc: "Basic store address listing on hyperlocal search map.",
      features: ["1 Store Listing", "Up to 3 Lookbooks", "Basic WhatsApp Button"],
      popular: false,
    },
    {
      name: "Silver Tier",
      price: "₹999",
      period: "per month",
      desc: "Enhanced visibility & active promotion campaigns.",
      features: ["1 Store Listing", "Up to 10 Lookbooks", "3 Active Promotional Coupons", "Google Maps Navigation"],
      popular: false,
    },
    {
      name: "Gold Pro Plan",
      price: "₹2,499",
      period: "per month",
      desc: "Top 5% search rank priority, unlimited lookbooks & featured badge.",
      features: [
        "Priority Top Rank in Neighborhood",
        "Unlimited Lookbook Collections",
        "Unlimited Coupon Promotions",
        "Featured Store Badge on Homepage",
        "Direct Phone & WhatsApp Analytics",
      ],
      popular: true,
    },
  ];

  const invoices = [
    { id: "INV-8742", date: "June 28, 2026", amount: "₹2,499", status: "Paid", plan: "Gold Pro Plan" },
    { id: "INV-7491", date: "May 28, 2026", amount: "₹2,499", status: "Paid", plan: "Gold Pro Plan" },
    { id: "INV-6240", date: "April 28, 2026", amount: "₹2,499", status: "Paid", plan: "Gold Pro Plan" },
  ];

  const handleUpgrade = (planName) => {
    setCurrentTier(planName);
    toast.success(`Subscribed to ${planName}! (Razorpay Simulated)`);
  };

  return (
    <div className="space-y-8 font-body pb-12">
      <DashboardHeader
        title="Subscription & Merchant Billing"
        description="Manage your storefront discovery tier, active billing cycle, plan features, and download past invoices."
        badge="Billing Portal"
      />

      {/* Current Active Plan Banner */}
      <div className="bg-linear-to-br from-slate-900 via-slate-950 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-indigo-500/20">
        <div className="space-y-3 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5 fill-teal-400" /> Active Membership
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-black tracking-tight">{currentTier}</h2>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Top 5% search rank priority in Bandra West • Renews on <span className="text-teal-400 font-bold">August 15, 2026</span>
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 z-10">
          <span className="text-xs font-bold text-slate-300 block">Remaining Access</span>
          <span className="text-2xl font-heading font-black text-teal-400 block mt-0.5">18 Days</span>
          <button
            onClick={() => toast.success("Plan extended!")}
            className="mt-2 px-4 py-1.5 rounded-xl bg-teal-500 text-slate-950 text-xs font-extrabold shadow-md hover:bg-teal-400 transition-colors w-full cursor-pointer"
          >
            Renew Now
          </button>
        </div>
      </div>

      {/* Subscription Plans Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-bold text-slate-900">Select Listing Tier Plan</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tierPlans.map((p) => {
            const isCurrent = currentTier === p.name;

            return (
              <div
                key={p.name}
                className={`bg-white p-6 rounded-3xl border shadow-xs flex flex-col justify-between relative transition-all duration-200 ${
                  p.popular
                    ? "border-indigo-600 ring-2 ring-indigo-600/20 shadow-md"
                    : "border-[#ECECEC]"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                    Most Popular
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-heading font-bold text-slate-900">{p.name}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 min-h-[32px]">{p.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-heading font-black text-slate-900">{p.price}</span>
                    <span className="text-xs text-slate-400 font-bold">{p.period}</span>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    {p.features.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    disabled={isCurrent}
                    onClick={() => handleUpgrade(p.name)}
                    className={`w-full py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                    }`}
                  >
                    {isCurrent ? "Active Tier" : `Upgrade to ${p.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white p-6 rounded-3xl border border-[#ECECEC] shadow-xs space-y-4">
        <h3 className="text-base font-heading font-bold text-slate-900">Recent Payment Invoices</h3>

        <div className="space-y-3">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{inv.id} • {inv.plan}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{inv.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-extrabold text-slate-900">{inv.amount}</span>
                <button
                  onClick={() => toast.success(`Downloading Invoice ${inv.id} PDF...`)}
                  className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
