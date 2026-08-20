"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card, { CardBody } from "@/components/ui/Card";
import Image from "next/image";
import { toast } from "react-hot-toast";
import logoImg from "@public/logos/logo2.png";

function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(responseText || "Server returned an invalid response.");
      }

      if (!res.ok) {
        throw new Error(
          data.message || data.error || "Failed to process request.",
        );
      }

      setMessage(
        "Password reset email sent successfully via Resend! Check your inbox.",
      );
      if (data.data?.token || data.token) {
        setResetToken(data.data?.token || data.token);
      }
      toast.success("Reset email sent successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-body">
      {/* Decorative Background dot patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_2px)] bg-size-[24px_24px] opacity-75 pointer-events-none" />

      {/* Floating Ambient Mesh Glows */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.22, 0.15],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-1/4 w-100 h-100 bg-purple-200/40 blur-3xl pointer-events-none rounded-full"
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
        className="absolute bottom-10 left-1/4 w-87.5 h-87.5 bg-indigo-200/40 blur-3xl pointer-events-none rounded-full"
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
              alt="Streetunics Logo"
              width={612}
              height={408}
              priority
              className="h-16 sm:h-20 w-auto object-contain transition-transform duration-300"
            />
          </div>
        </Link>

        <h2 className="text-3xl font-heading font-black text-slate-950 tracking-tight leading-tight">
          Forgot Your Password?
        </h2>
        <p className="text-xs text-slate-500 font-semibold">
          Enter your registered email address below, and we&apos;ll send a
          password reset link via Resend.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <Card className="bg-white/95 backdrop-blur-md border border-slate-100/70 rounded-3xl shadow-xl">
          <CardBody className="p-8 space-y-6">
            {message && (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-100 space-y-2">
                <p className="font-bold">{message}</p>
                <div className="pt-2">
                  <Link
                    href={
                      resetToken
                        ? `/auth/reset-password?token=${resetToken}`
                        : `/auth/reset-password?email=${encodeURIComponent(email)}`
                    }
                    className="font-bold text-purple-600 hover:text-purple-700 underline"
                  >
                    Proceed to Reset Password Page →
                  </Link>
                </div>
              </div>
            )}

            {!message && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-slate-200 focus:border-purple-500 focus:ring-purple-100"
                />

                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  Send Reset Details
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

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}