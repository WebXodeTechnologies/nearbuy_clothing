"use client";

import React, { useState, useEffect } from "react";
import Link from "next/navigation"; // Wait, Next.js use Link from 'next/link'. Let's use 'next/link' instead of 'next/navigation' for the link component.
import LinkComponent from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  // Simple simulated authentication check
  useEffect(() => {
    const role = localStorage.getItem("nearbuy_role");
    setUserRole(role);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("nearbuy_role");
    setUserRole(null);
    router.push("/");
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Stores", href: "/stores" },
    { label: "Categories", href: "/categories" },
    { label: "Become a Vendor", href: "/become-vendor" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <LinkComponent href="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-blue-700 transition-colors">
                N
              </div>
              <span className="font-bold text-gray-900 tracking-tight text-lg">
                Nearby<span className="text-blue-600">Clothing</span>
              </span>
            </LinkComponent>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <LinkComponent
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </LinkComponent>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {userRole ? (
              <>
                <LinkComponent
                  href={userRole === "admin" ? "/admin/dashboard" : "/vendor/dashboard"}
                  className="text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-lg transition-all"
                >
                  {userRole === "admin" ? "Admin Console" : "Vendor Portal"}
                </LinkComponent>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/70 px-3.5 py-2 rounded-lg transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <LinkComponent
                  href="/auth/login"
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors"
                >
                  Login
                </LinkComponent>
                <LinkComponent
                  href="/become-vendor"
                  className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  Register Shop
                </LinkComponent>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none cursor-pointer"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-gray-150 bg-white px-4 pt-2 pb-4 space-y-1 shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <LinkComponent
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.label}
              </LinkComponent>
            );
          })}
          
          <div className="pt-4 pb-2 border-t border-gray-100 flex flex-col gap-2 px-3">
            {userRole ? (
              <>
                <LinkComponent
                  href={userRole === "admin" ? "/admin/dashboard" : "/vendor/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 py-2.5 rounded-lg"
                >
                  {userRole === "admin" ? "Admin Console" : "Vendor Portal"}
                </LinkComponent>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 py-2.5 rounded-lg cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <LinkComponent
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm font-semibold text-gray-600 hover:bg-gray-100 py-2 rounded-lg"
                >
                  Login
                </LinkComponent>
                <LinkComponent
                  href="/become-vendor"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg"
                >
                  Become a Vendor
                </LinkComponent>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
