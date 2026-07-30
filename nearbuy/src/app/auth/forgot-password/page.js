"use client";

import React, { useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card, { CardBody } from "@/components/ui/Card";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to process request.");
      }

      setMessage("Password reset instructions generated successfully!");
      if (data.data?.token) {
        setResetToken(data.data.token);
      }
      toast.success("Reset link generated!");
    } catch (err) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-body">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 justify-center"
        >
          <Image
            src="/logos/nearbuy.png"
            alt="Nearbuy Logo"
            width={40}
            height={40}
            priority
            className="h-full w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
          />
          <span className="font-bold text-gray-900 text-xl tracking-tight">
            Nearby<span className="text-blue-600">Clothing</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-gray-950 tracking-tight">
          Forgot Your Password?
        </h2>
        <p className="text-xs text-gray-500">
          Enter your registered email address below, and we&apos;ll issue a
          password reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white">
          <CardBody className="p-8 space-y-6">
            {message && (
              <div className="p-4 rounded-lg bg-blue-50 text-blue-800 text-xs border border-blue-100 space-y-2">
                <p className="font-medium">{message}</p>
                <div className="pt-2">
                  <Link
                    href={
                      resetToken
                        ? `/auth/reset-password?token=${resetToken}`
                        : `/auth/reset-password?email=${encodeURIComponent(email)}`
                    }
                    className="font-bold text-blue-600 hover:text-blue-700 underline"
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
                />

                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full mt-2"
                >
                  Send Reset Details
                </Button>
              </form>
            )}

            <div className="text-center pt-2">
              <Link
                href="/auth/login"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Back to Sign In
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
