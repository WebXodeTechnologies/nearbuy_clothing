"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/forms/LoginForm";
import Card, { CardBody } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [selectedRole, setSelectedRole] = useState("vendor"); // customer, vendor, admin
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle(selectedRole);
    } catch (err) {
      setError(err.message || "Failed to sign in with Google.");
    }
  };

  const handleLoginSubmit = (user) => {
    if (user) {
      const finalRole = user.role || selectedRole;
      if (finalRole === "admin") {
        router.push("/admin/dashboard");
      } else if (finalRole === "vendor") {
        router.push("/vendor/dashboard");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background dot patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_2px)] bg-size-[24px_24px] opacity-75 pointer-events-none" />

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
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-10 left-1/4 w-[350px] h-[350px] bg-indigo-200/40 blur-3xl pointer-events-none rounded-full"
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 relative z-10 font-body">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 group justify-center">
          <div className="h-10 w-10 rounded-2xl bg-linear-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-purple-600/10">
            N
          </div>
          <span className="font-heading font-black text-slate-900 text-2xl tracking-tight leading-none">
            Nearby<span className="text-purple-600">Clothing</span>
          </span>
        </Link>
        <h2 className="text-3xl font-heading font-black text-slate-950 tracking-tight leading-tight">
          Sign In to Your Account
        </h2>
        <p className="text-xs text-slate-500 font-semibold">
          Or{" "}
          <Link href="/auth/register" className="font-bold text-purple-600 hover:text-purple-700 underline">
            register your shop today
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="bg-white/95 backdrop-blur-md border border-slate-100/70 rounded-3xl shadow-xl">
          <CardBody className="p-8 space-y-6">
            {/* Quick Testing Role Switcher */}
            <div className="bg-purple-50/50 border border-purple-100/30 rounded-2xl p-4 space-y-2.5 font-body">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 block">
                Choose Sign In Role
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
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
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

            {error && (
              <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl">
                {error}
              </div>
            )}

            {/* Email/Password Login Form */}
            <LoginForm onSubmit={handleLoginSubmit} mode="login" role={selectedRole} />

            {/* Social Separator */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-white px-2.5 text-slate-400">Or continue with</span>
              </div>
            </div>

            {/* Native NextAuth Google OAuth Action Button */}
            <div className="w-full">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center gap-2.5 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all cursor-pointer shadow-xs active:scale-[0.98] select-none"
              >
                {/* SVG Google Logo */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.09 14.99 0 12 0 7.354 0 3.307 2.67 1.242 6.544l4.024 3.221z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.64 12.273c0-.818-.073-1.609-.208-2.373H12v4.582h6.536a5.57 5.57 0 0 1-2.42 3.655l3.87 3a7.042 7.042 0 0 0 4.148-6.273z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.266 14.235L1.242 17.456A11.979 11.979 0 0 0 12 24c3.082 0 5.864-1.018 7.986-2.764l-3.87-3a7.08 7.08 0 0 1-4.116 1.155c-3.145 0-5.836-2.127-6.79-5.156z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 19.391c-1.69 0-3.218-.6-4.418-1.582l-3.51 3.51C6.358 22.91 9.01 24 12 24c4.646 0 8.693-2.67 10.758-6.544l-4.024-3.221c-.954 3.03-3.645 5.156-6.79 5.156z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

          </CardBody>
        </Card>
      </div>
    </div>
  );
}
