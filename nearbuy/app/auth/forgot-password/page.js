"use client";

import React, { useState } from "react";
import Link from "next/link";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card, { CardBody } from "../../components/ui/Card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    setTimeout(() => {
      setIsLoading(false);
      setMessage("An OTP code and password reset link have been sent to your email. (Simulated OTP: 7420)");
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
          Forgot Your Password?
        </h2>
        <p className="text-xs text-gray-500">
          Enter your registered email address below, and we'll send you an OTP code to reset it.
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
                    href={`/auth/reset-password?email=${encodeURIComponent(email)}`}
                    className="font-bold text-blue-600 hover:text-blue-700 underline"
                  >
                    Proceed to Reset Password Page
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

                <Button type="submit" isLoading={isLoading} className="w-full mt-2">
                  Send Reset Details
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
