"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card, { CardBody } from "@/components/ui/Card";
import Image from "next/image";
import { toast } from "react-hot-toast";

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
      setFeedback("Password reset token is required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setIsSuccess(true);
      setFeedback(
        "Your password has been successfully reset! Redirecting to login in 2 seconds...",
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
          Reset Your Password
        </h2>
        <p className="text-xs text-gray-500">
          Enter your reset token and new secure password below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white">
          <CardBody className="p-8 space-y-6">
            {feedback && (
              <div
                className={`p-3 text-xs rounded-lg border ${
                  isSuccess
                    ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                    : "text-red-600 bg-red-50 border-red-100"
                }`}
              >
                {feedback}
              </div>
            )}

            {!isSuccess && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Reset Token"
                  name="token"
                  placeholder="Paste reset token here"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />

                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full mt-2"
                >
                  Update Password
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
