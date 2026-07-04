"use client";

import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function VendorForm({ initialData = {}, onSubmit }) {
  const [name, setName] = useState(initialData.name || "Vikram R.");
  const [email, setEmail] = useState(initialData.email || "vikram@urbanthreads.com");
  const [phone, setPhone] = useState(initialData.phone || "+91 98765 43210");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage("");
    
    setTimeout(() => {
      setIsSavingProfile(false);
      setProfileMessage("Profile updated successfully!");
      if (onSubmit) onSubmit({ name, email, phone });
    }, 800);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordMessage("");

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      setIsChangingPassword(false);
      return;
    }

    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* Profile Details Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-4 bg-white border border-gray-150 p-6 rounded-xl shadow-xs">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
          <p className="text-xs text-gray-500">Update your personal contact details as the business owner.</p>
        </div>

        {profileMessage && (
          <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg">
            {profileMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" isLoading={isSavingProfile} size="sm">
            Save Profile
          </Button>
        </div>
      </form>

      {/* Password Change Form */}
      <form onSubmit={handlePasswordSubmit} className="space-y-4 bg-white border border-gray-150 p-6 rounded-xl shadow-xs">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Change Password</h3>
          <p className="text-xs text-gray-500">Ensure your vendor account is using a secure password.</p>
        </div>

        {passwordMessage && (
          <div className={`p-3 text-xs rounded-lg border ${
            passwordMessage.includes("success") 
              ? "text-emerald-700 bg-emerald-50 border-emerald-100" 
              : "text-red-600 bg-red-50 border-red-100"
          }`}>
            {passwordMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" isLoading={isChangingPassword} size="sm">
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
