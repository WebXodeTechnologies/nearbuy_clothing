"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/navigation/Sidebar";
import Button from "@/components/ui/Button";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Case-insensitive verification for ADMIN role
  const isAdmin = user?.role && user.role.toUpperCase() === "ADMIN";

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center text-gray-300">
        <div className="max-w-md space-y-4">
          <div className="h-12 w-12 bg-red-950/30 text-red-500 border border-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Access Restricted</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            You must be logged in as an Administrator to access the administrative dashboard. Please authenticate to continue.
          </p>
          <div className="pt-4">
            <Button onClick={handleBackToLogin} className="w-full">
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
      <Sidebar type="admin" />

      {/* Main content body */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
