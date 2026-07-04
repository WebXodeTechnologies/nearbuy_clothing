"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginForm from "../../components/forms/LoginForm";
import Card, { CardBody } from "../../components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("vendor"); // customer, vendor, admin

  const handleLoginSubmit = (formData) => {
    // Set simulated authentication details
    localStorage.setItem("nearbuy_role", selectedRole);
    
    if (selectedRole === "admin") {
      router.push("/admin/dashboard");
    } else if (selectedRole === "vendor") {
      router.push("/vendor/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 group justify-center">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            N
          </div>
          <span className="font-bold text-gray-900 text-xl tracking-tight">
            Nearby<span className="text-blue-600">Clothing</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-gray-950 tracking-tight">
          Sign In to Your Account
        </h2>
        <p className="text-xs text-gray-500">
          Or{" "}
          <Link href="/auth/register" className="font-semibold text-blue-600 hover:text-blue-700">
            register your shop today
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white">
          <CardBody className="p-8 space-y-6">
            {/* Quick Testing Role Switcher */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 block">
                Simulate Account Testing
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "customer", label: "Customer" },
                  { value: "vendor", label: "Merchant" },
                  { value: "admin", label: "Admin" }
                ].map((role) => {
                  const isSelected = selectedRole === role.value;
                  return (
                    <button
                      type="button"
                      key={role.value}
                      onClick={() => setSelectedRole(role.value)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border cursor-pointer select-none ${
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

            {/* Login form */}
            <LoginForm onSubmit={handleLoginSubmit} mode="login" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
