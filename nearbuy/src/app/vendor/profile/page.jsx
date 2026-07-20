"use client";

import React, { useState } from "react";
import VendorForm from "@/components/forms/VendorForm";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Alert from "@/components/ui/Alert";

export default function VendorProfile() {
  const [feedback, setFeedback] = useState(null);

  const handleProfileSubmit = (formData) => {
    setFeedback({
      type: "success",
      title: "Profile Updated",
      message: "Your personal profile account settings have been saved successfully."
    });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Owner Account Settings"
        description="Configure your personal registration details, login credentials, and notification settings."
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

      <div className="max-w-3xl">
        <VendorForm onSubmit={handleProfileSubmit} />
      </div>
    </div>
  );
}
