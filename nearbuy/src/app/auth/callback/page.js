"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, updateSession } = useAuth();
  const hasTriggered = useRef(false);

  useEffect(() => {
    // Only run this synchronization once
    if (loading || !user || hasTriggered.current) return;
    hasTriggered.current = true;

    const syncRoleAndRedirect = async () => {
      const urlRole = searchParams.get("role");
      let activeRole = user.role ? user.role.toUpperCase() : "USER";

      if (urlRole) {
        try {
          // Sync role update with backend API
          const res = await fetch("/api/auth/update-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: urlRole }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.role) {
              activeRole = data.role.toUpperCase();
              // Update NextAuth local session state to reflect uppercase role
              await updateSession({ role: activeRole });
            }
          }
        } catch (err) {
          console.error("Failed to sync role:", err);
        }
      }

      // Route user to appropriate portal
      if (activeRole === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (activeRole === "VENDOR") {
        router.push("/vendor/dashboard");
      } else {
        router.push("/");
      }
    };

    syncRoleAndRedirect();
  }, [user, loading, searchParams, router, updateSession]);

  return (
    <div className="min-h-screen bg-slate-50/40 flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Completing Sign-In</h2>
        <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto leading-relaxed">
          Establishing your secure session and setting up your vendor dashboard...
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50/40 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
