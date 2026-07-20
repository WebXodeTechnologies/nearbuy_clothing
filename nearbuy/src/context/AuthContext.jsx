"use client";

import React, { createContext, useContext, useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import useAuthStore from "@/store/authStore";

const AuthContext = createContext(null);

function AuthProviderContent({ children }) {
  const { data: session, status, update } = useSession();
  const { login, register, loginWithGoogle, logout, setUser, setLoading } = useAuthStore();

  const loading = status === "loading";
  const user = session?.user || null;

  useEffect(() => {
    setUser(user);
    setLoading(loading);
  }, [user, loading, setUser, setLoading]);

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
  if (context) {
    return context;
  }
  // Fallback directly to Zustand store if invoked outside Provider
  const store = useAuthStore();
  return {
    user: store.user,
    loading: store.loading,
    login: store.login,
    register: store.register,
    loginWithGoogle: store.loginWithGoogle,
    logout: store.logout,
  };
}
