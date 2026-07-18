"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function LoginForm({ onSubmit, mode = "login", role = "vendor" }) {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password || (mode === "register" && (!name || !phone))) {
      setError("Please fill out all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      let user;
      if (mode === "login") {
        user = await login(email, password);
      } else {
        user = await register(name, email, password, phone, role);
      }
      
      // Callback to parent for navigation
      if (onSubmit) {
        onSubmit(user);
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please verify your details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl">
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
            className="border-slate-200 focus:border-blue-500 focus:ring-blue-100"
            autoComplete="name"
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border-slate-200 focus:border-blue-500 focus:ring-blue-100"
            autoComplete="tel"
          />
        </>
      )}

      <Input
        label="Email / Username"
        name="email"
        type="text"
        placeholder="you@example.com or username"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border-slate-200 focus:border-blue-500 focus:ring-blue-100"
        autoComplete="username"
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border-slate-200 focus:border-blue-500 focus:ring-blue-100"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
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
        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl cursor-pointer shadow-xs"
      >
        {mode === "login" ? "Sign In" : "Create Account"}
      </Button>
    </form>
  );
}
