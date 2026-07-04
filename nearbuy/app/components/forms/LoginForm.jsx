"use client";

import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function LoginForm({ onSubmit, mode = "login" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password || (mode === "register" && (!name || !phone))) {
      setError("Please fill out all required fields.");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      onSubmit({ email, password, name, phone });
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg">
          {error}
        </div>
      )}

      {mode === "register" && (
        <>
          <Input
            label="Full Name"
            name="name"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </>
      )}

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {mode === "login" && (
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center space-x-2 text-gray-600 select-none cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" />
            <span>Remember me</span>
          </label>
          <a href="/auth/forgot-password" className="font-semibold text-blue-600 hover:text-blue-700">
            Forgot password?
          </a>
        </div>
      )}

      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full mt-2"
      >
        {mode === "login" ? "Sign In" : "Create Account"}
      </Button>
    </form>
  );
}
