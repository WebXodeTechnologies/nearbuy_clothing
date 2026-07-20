"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card, { CardBody } from "@/components/ui/Card";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback("");

    // Simulate OTP validation
    if (otp !== "7420") {
      setFeedback("Invalid OTP code. Please check your verification code (Tip: Simulated OTP is 7420).");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setFeedback("Your password has been successfully reset! Redirecting to login in 2 seconds...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 justify-center">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            N
          </div>
          <span className="font-bold text-gray-900 text-xl tracking-tight">
            Nearby<span className="text-blue-600">Clothing</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-gray-950 tracking-tight">
          Reset Your Password
        </h2>
        <p className="text-xs text-gray-500">
          Enter the OTP code sent to <span className="font-bold text-gray-800">{emailParam || "your email"}</span>.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white">
          <CardBody className="p-8 space-y-6">
            {feedback && (
              <div className={`p-3 text-xs rounded-lg border ${
                isSuccess 
                  ? "text-emerald-700 bg-emerald-50 border-emerald-100" 
                  : "text-red-600 bg-red-50 border-red-100"
              }`}>
                {feedback}
              </div>
            )}

            {!isSuccess && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="OTP Code (Simulated: 7420)"
                  name="otp"
                  placeholder="e.g. 7420"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
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

                <Button type="submit" isLoading={isLoading} className="w-full mt-2">
                  Update Password
                </Button>
              </form>
            )}

            <div className="text-center pt-2">
              <Link href="/auth/login" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
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
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
