"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import LoginForm from "@/components/forms/LoginForm";
import Card, { CardBody } from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Image from "next/image";
import { toast } from "react-hot-toast";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") || "Starter";

  const [selectedRole, setSelectedRole] = useState("vendor");
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);

  const handleRegisterSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole === "vendor" ? "VENDOR" : "USER",
        plan: selectedRole === "vendor" ? selectedPlan : undefined,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      toast.success("Account created successfully!");

      const userRole = data.data?.role || payload.role;
      if (userRole === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (userRole === "VENDOR") {
        router.push("/vendor/dashboard?setup=store");
      } else {
        router.push("/");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const planOptions = [
    { value: "Starter", label: "Starter (Free)" },
    { value: "Silver", label: "Grow (Silver - ₹999/mo)" },
    { value: "Gold", label: "Enterprise (Gold - ₹2,499/mo)" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-body">
      {/* Decorative Background dot patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_2px)] bg-[size:24px_24px] opacity-75 pointer-events-none" />

      {/* Floating Ambient Mesh Glows */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.22, 0.15],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-purple-200/40 blur-3xl pointer-events-none rounded-full"
      />
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-10 left-1/4 w-[350px] h-[350px] bg-indigo-200/40 blur-3xl pointer-events-none rounded-full"
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 relative z-10">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 group justify-center"
        >
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src="/logos/nearbuy.png"
              alt="Nearbuy Logo"
              width={40}
              height={40}
              priority
              className="h-full w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="font-heading font-black text-slate-900 text-2xl tracking-tight leading-none">
            Nearby<span className="text-purple-600">Clothing</span>
          </span>
        </Link>
        <h2 className="text-3xl font-heading font-black text-slate-950 tracking-tight leading-tight">
          Create Your Account
        </h2>
        <p className="text-xs text-slate-500 font-semibold">
          Or{" "}
          <Link
            href="/auth/login"
            className="font-bold text-purple-600 hover:text-purple-700 underline"
          >
            sign in to your existing portal
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="bg-white/95 backdrop-blur-md border border-slate-100/70 rounded-3xl shadow-xl">
          <CardBody className="p-8 space-y-6">
            {/* Account Role Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Register as:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "vendor", label: "Merchant Vendor" },
                  { value: "customer", label: "Regular Customer" },
                ].map((role) => {
                  const isSelected = selectedRole === role.value;
                  return (
                    <button
                      type="button"
                      key={role.value}
                      onClick={() => setSelectedRole(role.value)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
                        isSelected
                          ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
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
                className="border-slate-200 focus:border-purple-500 focus:ring-purple-100"
              />
            )}

            {/* Registration fields form wrapper */}
            <LoginForm
              onSubmit={handleRegisterSubmit}
              mode="register"
              role={selectedRole}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
