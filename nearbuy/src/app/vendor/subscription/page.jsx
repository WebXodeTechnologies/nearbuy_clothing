"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { plans } from "@/data/dummy-data";

export default function VendorSubscription() {
  const [currentPlan, setCurrentPlan] = useState("Gold Plan");
  const [isChanging, setIsChanging] = useState(false);

  const billingHistory = [
    { id: "INV-8742", date: "June 28, 2026", amount: "₹2,499", status: "Paid" },
    { id: "INV-7491", date: "May 28, 2026", amount: "₹2,499", status: "Paid" },
    { id: "INV-6240", date: "April 28, 2026", amount: "₹2,499", status: "Paid" }
  ];

  const handlePlanChange = (planName) => {
    setIsChanging(true);
    setTimeout(() => {
      setCurrentPlan(planName);
      setIsChanging(false);
      alert(`Subscription successfully changed to ${planName}! (Simulated)`);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Listing Subscription & Billing"
        description="Monitor your active visibility subscription plan, billing cycle, and payment history."
      />

      {/* Active Subscription Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white">
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Active Subscription</h3>
              <Badge variant="blue" pill>Active</Badge>
            </CardHeader>
            <CardBody className="p-6 space-y-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h4 className="text-xl font-extrabold text-gray-950 tracking-tight">{currentPlan}</h4>
                  <p className="text-xs text-gray-500 mt-1">Premium hyperlocal discovery listing visibility tier.</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">
                    {currentPlan === "Gold Plan" ? "₹2,499" : currentPlan === "Silver Plan" ? "₹999" : "Free"}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold"> / month</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 font-semibold block">Billing Cycle</span>
                  <span className="font-bold text-gray-800 mt-0.5 block">Monthly</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block">Next Invoice Date</span>
                  <span className="font-bold text-gray-800 mt-0.5 block">July 28, 2026</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block">Payment Method</span>
                  <span className="font-bold text-gray-800 mt-0.5 block">UPI / Credit Card Ending 4022</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Action Panel */}
        <div>
          <Card className="bg-white h-full">
            <CardHeader>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Subscription Actions</h3>
            </CardHeader>
            <CardBody className="p-6 space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                Upgrading your plan increases your neighborhood search visibility, allows uploading more collections, and lists active coupons on the platform homepage.
              </p>
              <div className="pt-2 space-y-2">
                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50" onClick={() => alert("Cancel subscription request submitted (simulated)")}>
                  Cancel Subscription
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Available plans selection */}
      <Card className="bg-white">
        <CardHeader>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Change Listing Tier</h3>
        </CardHeader>
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((p) => {
              const isCurrent = currentPlan.toLowerCase().includes(p.name.split(" ")[0].toLowerCase());
              return (
                <div key={p.name} className={`p-5 rounded-xl border flex flex-col justify-between ${isCurrent ? "border-blue-500 bg-blue-50/20" : "border-gray-200"}`}>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900 text-sm">{p.name}</span>
                      {isCurrent && <Badge variant="blue">Current Plan</Badge>}
                    </div>
                    <span className="text-xs font-bold text-gray-900 block mt-2">{p.price}</span>
                    <p className="text-[11px] text-gray-500 mt-1 min-h-[32px]">{p.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-55">
                    <Button
                      size="sm"
                      className="w-full text-[10px]"
                      variant={isCurrent ? "outline" : "solid"}
                      disabled={isCurrent || isChanging}
                      onClick={() => handlePlanChange(p.name)}
                    >
                      {isCurrent ? "Active Tier" : `Switch to ${p.name.split(" ")[0]}`}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Billing history table */}
      <Card className="bg-white">
        <CardHeader>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Billing History</h3>
        </CardHeader>
        <CardBody className="p-0 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-150 text-xs">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {billingHistory.map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-4 font-semibold text-gray-900">{row.id}</td>
                  <td className="px-6 py-4 text-gray-500">{row.date}</td>
                  <td className="px-6 py-4 text-gray-900 font-bold">{row.amount}</td>
                  <td className="px-6 py-4">
                    <Badge variant="success" pill>{row.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => alert(`Downloading Invoice PDF ${row.id}...`)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Download Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
