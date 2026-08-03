"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { toast } from "react-hot-toast";
import {
  CreditCard,
  Crown,
  CheckCircle2,
  RefreshCw,
  Search,
  Plus,
  Edit3,
  ShieldCheck,
  Calendar,
} from "lucide-react";

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState("subscribers"); // "subscribers" | "plans"
  const [subscribers, setSubscribers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal & Drawer States
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  // Plan Form State
  const [planName, setPlanName] = useState("");
  const [price, setPlanPrice] = useState("");
  const [billingCycle, setBillingInterval] = useState("Monthly");
  const [description, setPlanDescription] = useState("");
  const [features, setPlanFeatures] = useState("");
  const [isPopular, setIsPopularPlan] = useState(false);

  const fetchSubscriptionsData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscriptions");
      if (!res.ok) throw new Error("Failed to fetch subscriptions data");
      const data = await res.json();

      setSubscribers(data.data?.subscribers || []);
      setPlans(data.data?.plans || []);
    } catch (err) {
      console.warn("Subscriptions fetch fallback active:", err.message);
      setPlans([
        {
          _id: "plan-1",
          name: "Growth Pro",
          price: 2499,
          billingCycle: "Monthly",
          description: "Maximum local visibility with banner placements.",
          features: [
            "Up to 3 Outlet Locations",
            "Unlimited Lookbook Catalogs",
            "Featured Badge",
          ],
          isPopular: true,
          activeCount: 38,
        },
      ]);
      setSubscribers([
        {
          _id: "sub-101",
          businessName: "Kavin Ethnic Boutiques",
          ownerName: "vendor test",
          email: "vendor@test.com",
          planName: "Growth Pro",
          amount: 2499,
          status: "Active",
          startDate: "2026-06-01",
          nextBillingDate: "2026-09-01",
          paymentMethod: "UPI / Razorpay",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSubscriptionsData();
  }, []);

  const handleOpenAddPlan = () => {
    setEditingPlan(null);
    setPlanName("");
    setPlanPrice("");
    setBillingInterval("Monthly");
    setPlanDescription("");
    setPlanFeatures("1 Store Location\n10 Catalog Collections");
    setIsPopularPlan(false);
    setIsPlanModalOpen(true);
  };

  const handleOpenEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanName(plan.name || "");
    setPlanPrice(plan.price || "");
    setBillingInterval(plan.billingCycle || "Monthly");
    setPlanDescription(plan.description || "");
    setPlanFeatures(
      Array.isArray(plan.features)
        ? plan.features.join("\n")
        : plan.features || "",
    );
    setIsPopularPlan(plan.isPopular || false);
    setIsPlanModalOpen(true);
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: planName,
      price: Number(price),
      billingCycle,
      description,
      features: features.split("\n").filter((f) => f.trim() !== ""),
      isPopular,
    };

    try {
      if (editingPlan) {
        const id = editingPlan._id || editingPlan.id;
        await fetch(`/api/admin/plans/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("Plan updated successfully");
      } else {
        await fetch("/api/admin/plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("New subscription plan created");
      }
      setIsPlanModalOpen(false);
      await fetchSubscriptionsData();
    } catch (err) {
      toast.error(err.message || "Failed to save plan");
    }
  };

  const totalMRR = subscribers.reduce(
    (acc, curr) => acc + (curr.amount || 0),
    0,
  );

  const filteredSubscribers = (subscribers || []).filter((sub) => {
    const query = search.toLowerCase();
    return (
      (sub.businessName || "").toLowerCase().includes(query) ||
      (sub.email || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 font-body pb-12">
      <DashboardHeader
        title="Merchant Subscriptions & Revenue"
        description="Monitor active recurring SaaS plans, tier pricing structures, renewal dates, and boutique billing statuses."
        badge={`${subscribers?.length || 0} Subscribed Merchants`}
      >
        <button
          type="button"
          onClick={fetchSubscriptionsData}
          className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-400" : ""}`}
          />
          <span>Refresh Financials</span>
        </button>
      </DashboardHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Monthly Recurring (MRR)
          </span>
          <p className="text-2xl font-heading font-black text-slate-900">
            ₹{totalMRR.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Active Subscribers
          </span>
          <p className="text-2xl font-heading font-black text-slate-900">
            {subscribers.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("subscribers")}
            className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${activeTab === "subscribers"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600"
              }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Subscribers</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("plans")}
            className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${activeTab === "plans"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600"
              }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Tier Plans</span>
          </button>
        </div>

        {activeTab === "subscribers" ? (
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search subscriber..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-2xl"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleOpenAddPlan}
            className="px-4 py-2 rounded-2xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Plan
          </button>
        )}
      </div>

      {activeTab === "subscribers" ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Boutique</th>
                <th className="py-4 px-6">Plan</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Next Renewal</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubscribers.map((sub) => (
                <tr key={sub._id}>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {sub.businessName}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      {sub.email}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="indigo" pill>
                      {sub.planName}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 font-mono">₹{sub.amount}</td>
                  <td className="py-4 px-6 font-mono text-slate-600 flex items-center gap-1.5 pt-5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {sub.nextBillingDate
                      ? new Date(sub.nextBillingDate).toLocaleDateString("en-IN")
                      : "N/A"}
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="emerald" pill>
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedSubscriber(sub)}
                      className="p-1.5 rounded-xl text-slate-500 hover:bg-indigo-50 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-3">
                <h3 className="font-heading font-black text-slate-900 text-base">
                  {p.name}
                </h3>
                <p className="text-3xl font-heading font-black">₹{p.price}</p>
                <ul className="space-y-1 text-xs text-slate-600">
                  {p.features?.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{" "}
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleOpenEditPlan(p)}
                className="mt-6 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Tier
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title={editingPlan ? "Edit Plan" : "Create Plan"}
        size="md"
      >
        <form onSubmit={handlePlanSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1">Plan Name</label>
            <input
              type="text"
              required
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Price (₹)</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPlanPrice(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">
              Features (one per line)
            </label>
            <textarea
              rows={3}
              value={features}
              onChange={(e) => setPlanFeatures(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold cursor-pointer"
            >
              Save Plan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}