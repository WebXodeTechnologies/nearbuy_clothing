"use client";

import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginForm({ onSubmit, mode = "login", role, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body">
      {mode === "register" && (
        <Input
          label="Full Name"
          name="name"
          type="text"
          placeholder="Akash Sharma"
          required
          value={formData.name}
          onChange={handleChange}
        />
      )}

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
        value={formData.email}
        onChange={handleChange}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        required
        value={formData.password}
        onChange={handleChange}
      />

      <Button
        type="submit"
        isLoading={loading}
        className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold"
      >
        {mode === "register" ? "Create Account" : "Sign In"}
      </Button>
    </form>
  );
}