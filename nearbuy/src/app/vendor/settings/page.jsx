"use client";

import React, { useState } from "react";
import StoreForm from "@/components/forms/StoreForm";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Alert from "@/components/ui/Alert";

export default function VendorStoreSettings() {
  const [feedback, setFeedback] = useState(null);

  const handleStoreSubmit = (formData) => {
    setFeedback({
      type: "success",
      title: "Store Profile Updated",
      message: "Your shop catalog details have been saved successfully and sent for review check."
    });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Store Listing Details"
        description="Update your business hours, address coordinate map iframe link, brand logos and categories."
      />

      {feedback && (
        <Alert
          type={feedback.type}
          title={feedback.title}
          onClose={() => setFeedback(null)}
        >
          {feedback.message}
        </Alert>
      )}

      <div className="max-w-4xl">
        <StoreForm onSubmit={handleStoreSubmit} />
      </div>
    </div>
  );
}
