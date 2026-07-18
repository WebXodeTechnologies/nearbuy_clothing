"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/navigation/Sidebar";
import Button from "../components/ui/Button";

export default function VendorLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  // Verify that a user is logged in AND is a vendor
  if (!user || user.role !== "vendor") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-300">
        <div className="max-w-md space-y-4">
          <div className="h-12 w-12 bg-red-950/30 text-red-500 border border-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Access Restricted</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold">
            You must be logged in as a Merchant Vendor to access the merchant dashboard. Please authenticate to view your store listings.
          </p>
          <div className="pt-4">
            <Button onClick={handleBackToLogin} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl py-2.5">
              Proceed to Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar type="vendor" />

      {/* Main content body */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
