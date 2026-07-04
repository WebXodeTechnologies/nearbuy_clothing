"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "../../components/forms/LoginForm";
import Card, { CardBody } from "../../components/ui/Card";
import Select from "../../components/ui/Select";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") || "Starter";

  const [selectedRole, setSelectedRole] = useState("vendor");
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);

  const handleRegisterSubmit = (formData) => {
    // Set simulated authentication details
    localStorage.setItem("nearbuy_role", selectedRole);
    
    if (selectedRole === "admin") {
      router.push("/admin/dashboard");
    } else if (selectedRole === "vendor") {
      // Simulate going to store profile creation step in vendor portal
      router.push("/vendor/dashboard?setup=store");
    } else {
      router.push("/");
    }
  };

  const planOptions = [
    { value: "Starter", label: "Starter (Free)" },
    { value: "Silver", label: "Grow (Silver - ₹999/mo)" },
    { value: "Gold", label: "Enterprise (Gold - ₹2,499/mo)" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 justify-center">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            N
          </div>
          <span className="font-bold text-gray-900 text-xl tracking-tight">
            Nearby<span className="text-blue-600">Clothing</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-gray-950 tracking-tight">
          Create Your Account
        </h2>
        <p className="text-xs text-gray-500">
          Or{" "}
          <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-700">
            sign in to your existing portal
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white">
          <CardBody className="p-8 space-y-6">
            {/* Account Role Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Register as:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "vendor", label: "Merchant Vendor" },
                  { value: "customer", label: "Regular Customer" }
                ].map((role) => {
                  const isSelected = selectedRole === role.value;
                  return (
                    <button
                      type="button"
                      key={role.value}
                      onClick={() => setSelectedRole(role.value)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border cursor-pointer select-none ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {role.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedRole === "vendor" && (
              <Select
                label="Subscription Plan"
                name="plan"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                options={planOptions}
                placeholder={null}
              />
            )}

            {/* Registration fields form wrapper */}
            <LoginForm onSubmit={handleRegisterSubmit} mode="register" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
