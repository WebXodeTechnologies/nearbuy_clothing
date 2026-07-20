"use client";

import React, { createContext, useContext } from "react";
import { SessionProvider, useSession, signIn, signOut, getSession } from "next-auth/react";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

function AuthProviderContent({ children }) {
  const { data: session, status, update } = useSession();
  const loading = status === "loading";
  const user = session?.user || null;

  const login = async (email, password) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        throw new Error(res.error || "Login failed");
      }

      const freshSession = await getSession();
      toast.success("Welcome back!");
      return freshSession?.user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const register = async (name, email, password, phone, role) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Automatically sign in the registered user
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error || "Login failed after registration");
      }

      const freshSession = await getSession();
      toast.success("Account created successfully!");
      return freshSession?.user || data.user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const loginWithGoogle = async (role = "vendor") => {
    try {
      // Redirect to Google via NextAuth, passing role in callback URL
      await signIn("google", { callbackUrl: `/auth/callback?role=${role}` });
    } catch (error) {
      toast.error("Google Sign-in failed");
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateSession: update,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }) {
  return (
    <SessionProvider>
      <AuthProviderContent>{children}</AuthProviderContent>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
