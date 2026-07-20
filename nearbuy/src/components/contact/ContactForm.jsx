"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import Input from "../ui/Input";

const CATEGORIES = [
  "Ethnic Wear Boutique",
  "Footwear & Shoes Store",
  "Kids Fashion Hub",
  "Designer Studio & Bridal",
  "Men's Casuals & Suits",
  "Unisex Department Store"
];

// Zod validation schemas
const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const onboardingSchema = z.object({
  name: z.string().min(2, "Contact person name must be at least 2 characters"),
  email: z.string().email("Invalid business email address"),
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  storeCategory: z.string().min(1, "Please select a boutique category"),
  storeLocation: z.string().min(5, "Store address must be at least 5 characters"),
  message: z.string().min(10, "Introduction details must be at least 10 characters"),
});

export default function ContactForm() {
  const [formType, setFormType] = useState("enquiry"); // enquiry, onboarding

  // General Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Onboarding Fields
  const [storeName, setStoreName] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [storeLocation, setStoreLocation] = useState("");

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const formRef = useRef(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!formRef.current) return;
    const rect = formRef.current.getBoundingClientRect();
    setHoverPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleInputChange = (field, val, setter) => {
    setter(val);
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleTypeChange = (type) => {
    setFormType(type);
    setFeedback("");
    setErrors({});
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setStoreName("");
    setStoreCategory("");
    setStoreLocation("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback("");
    setErrors({});

    const schema = formType === "enquiry" ? enquirySchema : onboardingSchema;
    const payload = formType === "enquiry"
      ? { name, email, subject, message }
      : { name, email, storeName, storeCategory, storeLocation, message };

    const result = schema.safeParse(payload);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (formType === "enquiry") {
        setFeedback("Thank you! Your message has been sent successfully. We will get back to you shortly.");
      } else {
        setFeedback("Onboarding request submitted! Our vendor support team will review your business credentials and contact you within 12-24 hours.");
      }

      // Reset all
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setStoreName("");
      setStoreCategory("");
      setStoreLocation("");
    }, 1200);
  };

  return (
    <motion.div
      ref={formRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/95 max-w-7xl mx-auto backdrop-blur-md border border-slate-100/70 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden w-full"
    >
      {/* Spotlight cursor inner light-orb glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(130px circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(168, 85, 247, 0.05), transparent 80%)`,
        }}
      />

      {/* Clean glowing border overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl border transition-all duration-300 z-20"
        style={{
          borderColor: isHovering ? "rgba(168, 85, 247, 0.2)" : "transparent",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">

        {/* Left Side Content - Informational Pitch */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-8 font-body">
          <div className="space-y-4">
            <div className="flex bg-slate-100/80 backdrop-blur-xs p-1 rounded-2xl text-[10px] font-bold border border-slate-200/40 w-fit">
              <button
                type="button"
                onClick={() => handleTypeChange("enquiry")}
                className={`px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 font-heading tracking-tight ${formType === "enquiry"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                Enquiry
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("onboarding")}
                className={`px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 font-heading tracking-tight ${formType === "onboarding"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                Onboarding
              </button>
            </div>

            <h3 className="font-heading font-black text-slate-900 text-2xl tracking-tight leading-tight">
              {formType === "onboarding" ? "List Your Store On Nearbuy" : "General Questions & Assistance"}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
              {formType === "onboarding"
                ? "Join Namakkal's fastest growing hyperlocal clothing discovery network. Connect physical racks with search intent."
                : "Need support, API keys, custom listings, or corporate alliances? Reach out using the builder and we'll reply shortly."}
            </p>
          </div>

          {/* Quick specs lists */}
          <div className="space-y-4.5 bg-slate-50/50 border border-slate-100 p-5 rounded-2xl">
            <h4 className="font-heading font-black text-[11px] uppercase tracking-wider text-slate-400">Onboarding Highlights</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <div className="h-5 w-5 bg-purple-50 text-purple-600 rounded-md flex items-center justify-center border border-purple-100/40 shrink-0">
                  ✓
                </div>
                <span className="font-semibold">0% Sales Commission</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <div className="h-5 w-5 bg-purple-50 text-purple-600 rounded-md flex items-center justify-center border border-purple-100/40 shrink-0">
                  ✓
                </div>
                <span className="font-semibold">Fast 12-24h verification review</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <div className="h-5 w-5 bg-purple-50 text-purple-600 rounded-md flex items-center justify-center border border-purple-100/40 shrink-0">
                  ✓
                </div>
                <span className="font-semibold">Unlimited catalog discovery views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Content - Actual Input Fields */}
        <div className="lg:col-span-8 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 mb-4 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2.5"
              >
                <svg className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{feedback}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={formType === "onboarding" ? "Contact Person Name" : "Your Name"}
                name="name"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => handleInputChange("name", e.target.value, setName)}
                error={errors.name}
                className="border-slate-200 focus:border-purple-500 focus:ring-purple-200"
              />
              <Input
                label={formType === "onboarding" ? "Business Email Address" : "Email Address"}
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => handleInputChange("email", e.target.value, setEmail)}
                error={errors.email}
                className="border-slate-200 focus:border-purple-500 focus:ring-purple-200"
              />
            </div>

            <AnimatePresence mode="wait">
              {formType === "onboarding" ? (
                <motion.div
                  key="onboarding-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Store Name"
                      name="storeName"
                      placeholder="E.g., Elegance Boutique"
                      required
                      value={storeName}
                      onChange={(e) => handleInputChange("storeName", e.target.value, setStoreName)}
                      error={errors.storeName}
                      className="border-slate-200 focus:border-purple-500 focus:ring-purple-200"
                    />
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Boutique Category *</label>
                      <select
                        value={storeCategory}
                        onChange={(e) => handleInputChange("storeCategory", e.target.value, setStoreCategory)}
                        className={`w-full text-sm block border rounded-lg pl-3 pr-8 py-2.5 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white/50 backdrop-blur-xs transition-all font-semibold text-slate-800
                          ${errors.storeCategory ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <option value="">Select category...</option>
                        {CATEGORIES.map((cat, idx) => (
                          <option key={idx} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {errors.storeCategory && <p className="text-[11px] text-red-600 font-semibold">{errors.storeCategory}</p>}
                    </div>
                  </div>

                  <Input
                    label="Physical Store Address"
                    name="storeLocation"
                    placeholder="E.g., Salem Road Main Crossing, Namakkal"
                    required
                    value={storeLocation}
                    onChange={(e) => handleInputChange("storeLocation", e.target.value, setStoreLocation)}
                    error={errors.storeLocation}
                    className="border-slate-200 focus:border-purple-500 focus:ring-purple-200"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="enquiry-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <Input
                    label="Subject"
                    name="subject"
                    placeholder="Inquiry about vendor registration, listing issues..."
                    required
                    value={subject}
                    onChange={(e) => handleInputChange("subject", e.target.value, setSubject)}
                    error={errors.subject}
                    className="border-slate-200 focus:border-purple-500 focus:ring-purple-200"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {formType === "onboarding" ? "Introduce Your Store / Brands Carried *" : "Message / Comments *"}
              </label>
              <textarea
                rows={4}
                placeholder={formType === "onboarding" ? "Describe your dress styles, brand offerings, or registration questions..." : "Explain your queries or support request in detail..."}
                value={message}
                onChange={(e) => handleInputChange("message", e.target.value, setMessage)}
                className={`w-full text-sm block border rounded-lg pl-3 pr-3 py-2.5 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white/50 backdrop-blur-xs transition-all placeholder:text-slate-400 font-semibold text-slate-800
                  ${errors.message ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500" : "border-gray-200 hover:border-gray-300"}`}
              />
              {errors.message && <p className="text-[11px] text-red-600 font-semibold">{errors.message}</p>}
            </div>

            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg shadow-purple-600/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 select-none"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  formType === "onboarding" ? "Submit Registration Request" : "Send Enquiry"
                )}
              </motion.button>
            </div>
          </form>
        </div>

      </div>
    </motion.div>
  );
}
