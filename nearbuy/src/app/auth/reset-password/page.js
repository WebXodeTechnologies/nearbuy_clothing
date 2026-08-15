"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card, { CardBody } from "@/components/ui/Card";
import Image from "next/image";
import { toast } from "react-hot-toast";
import logoImg from "@public/logos/logo2.png";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenParam = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [token, setToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (tokenParam) setToken(tokenParam);
  }, [tokenParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");

    if (!token) {
      setFeedback("Password reset token is missing or invalid.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setFeedback("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: newPassword, // 👈 Fixed: matches backend Zod schema field name
        }),
      });

      // Safely parse text response to prevent JSON parsing crashes on server errors
      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(responseText || "Server returned an invalid response.");
      }

      if (!res.ok) {
        throw new Error(
          data.message || data.error || "Failed to reset password.",
        );
      }

      setIsSuccess(true);
      setFeedback(
        "Your password has been successfully reset! Redirecting to login...",
      );
      toast.success("Password reset successfully!");

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      setFeedback(err.message || "Error resetting password.");
      toast.error(err.message || "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

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

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 relative z-10 px-4">
        {/* Larger, Clean, Glassmorphic Logo Container */}
        <Link
          href="/"
          className="inline-flex flex-col items-center gap-3 group focus:outline-none"
        >
          <div className="flex items-center justify-center px-6 py-3 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md group-hover:scale-105 group-hover:border-purple-300 transition-all duration-300">
            <Image
              src={logoImg}
              alt="Nearbuy Logo"
              width={612}
              height={408}
              priority
              className="h-16 sm:h-20 w-auto object-contain transition-transform duration-300"
            />
          </div>
        </Link>

        <h2 className="text-3xl font-heading font-black text-slate-950 tracking-tight leading-tight">
          Reset Your Password
        </h2>
        <p className="text-xs text-slate-500 font-semibold">
          {emailParam ? (
            <span>
              Setting new password for{" "}
              <strong className="text-slate-700">{emailParam}</strong>
            </span>
          ) : (
            "Enter your secure new password below to regain access."
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <Card className="bg-white/95 backdrop-blur-md border border-slate-100/70 rounded-3xl shadow-xl">
          <CardBody className="p-8 space-y-6">
            {feedback && (
              <div
                className={`p-4 text-xs rounded-2xl border font-bold ${
                  isSuccess
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                    : "text-red-600 bg-red-50 border-red-200"
                }`}
              >
                {feedback}
              </div>
            )}

            {!isSuccess && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-slate-200 focus:border-purple-500 focus:ring-purple-100"
                />

                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-slate-200 focus:border-purple-500 focus:ring-purple-100"
                />

                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  Update Password
                </Button>
              </form>
            )}

            <div className="text-center pt-2">
              <Link
                href="/auth/login"
                className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors"
              >
                ← Back to Sign In
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
