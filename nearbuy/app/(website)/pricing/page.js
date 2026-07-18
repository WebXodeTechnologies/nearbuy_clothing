"use client";

import React from "react";
import PricingSection from "../../components/home/PricingSection";
import { plans } from "../../data/dummy-data";

export default function PricingPage() {
  return (
    <div className="pt-16 min-h-screen bg-white">
      <PricingSection plans={plans} />
    </div>
  );
}
