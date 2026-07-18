"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import logoImg from "@/public/logos/nearbuy.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const role = localStorage.getItem("nearbuy_role");
    setUserRole(role);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("nearbuy_role");
    setUserRole(null);
    setIsOpen(false);
    router.push("/");
  };

  const navLinks = [
    {
      label: "Home",
      href: "/",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: "Stores",
      href: "/stores",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      label: "Categories",
      href: "/categories",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      label: "Become a Vendor",
      href: "/become-vendor",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: "About Us",
      href: "/about",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Pricing",
      href: "/pricing",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Contact",
      href: "/contact",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-xl border-b border-gray-100 shadow-2xs transition-all duration-300">
        {/* Top micro gradient line */}
        <div className="h-0.5 w-full bg-linear-to-r from-blue-600 via-indigo-600 to-sky-500" />

        <div className="w-full max-w-7xl 2xl:max-w-[1440px] 3xl:max-w-[1600px] 4xl:max-w-[2000px] 5xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
          <div className="flex justify-between h-16 sm:h-20 items-center gap-2 lg:gap-4 xl:gap-8">

            {/* Logo Section */}
            <div className="shrink-0 flex items-center">
              <Link
                href="/"
                className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none rounded-2xl p-1 -m-1"
              >
                <div className="relative h-9 w-9 sm:h-11 sm:w-11 2xl:h-12 2xl:w-12 rounded-2xl bg-linear-to-tr from-blue-50 via-white to-indigo-50 border border-blue-100/80 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md group-hover:border-blue-300 transition-all duration-300 overflow-hidden shrink-0">
                  <Image
                    src={logoImg}
                    alt="Nearbuy Clothing Logo"
                    width={48}
                    height={48}
                    priority
                    className="h-full w-full object-contain rounded-xl transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-gray-950 tracking-tight text-lg sm:text-xl xl:text-2xl 2xl:text-3xl group-hover:text-blue-600 transition-colors duration-200 leading-none">
                    Nearbuy
                  </span>
                  <span className="text-[9px] xl:text-[10px] 2xl:text-xs font-extrabold tracking-widest text-blue-600/80 uppercase hidden xl:block mt-1">
                    Hyperlocal Fashion
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <nav
              className="hidden lg:flex items-center gap-3 xl:gap-6 2xl:gap-8 4xl:gap-12"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-2 text-xs xl:text-sm 2xl:text-base 4xl:text-lg transition-all duration-200 whitespace-nowrap group ${isActive
                      ? "font-bold text-blue-600"
                      : "font-semibold text-gray-600 hover:text-gray-950"
                      }`}
                  >
                    <span>{link.label}</span>
                    {/* Animated Sliding Underline Line */}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 transition-all duration-300 ease-out ${isActive
                        ? "w-full shadow-xs shadow-blue-500/50"
                        : "w-0 group-hover:w-full opacity-60"
                        }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right Actions & Auth Buttons */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3 2xl:gap-4 shrink-0">
              {mounted && userRole ? (
                <div className="flex items-center gap-2 xl:gap-2.5">
                  <Link
                    href={userRole === "admin" ? "/admin/dashboard" : "/vendor/dashboard"}
                    className="inline-flex items-center gap-1.5 xl:gap-2 text-xs 2xl:text-sm font-bold text-gray-800 hover:text-blue-600 bg-gray-100/80 hover:bg-blue-50 px-3 py-2 xl:px-4 xl:py-2.5 rounded-xl transition-all border border-gray-200/80 shadow-2xs hover:shadow-xs whitespace-nowrap"
                  >
                    <svg className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    {userRole === "admin" ? "Admin Console" : "Vendor Portal"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 text-xs 2xl:text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-3 py-2 xl:px-4 xl:py-2.5 rounded-xl transition-all cursor-pointer border border-red-100 whitespace-nowrap"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 xl:gap-2.5">
                  <Link
                    href="/auth/login"
                    className="text-xs xl:text-sm 2xl:text-base font-bold text-gray-700 hover:text-gray-950 px-3 py-2 xl:px-4 xl:py-2.5 rounded-xl hover:bg-gray-100/80 transition-all whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/become-vendor"
                    className="text-xs xl:text-sm 2xl:text-base font-bold text-white bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 px-4 py-2 xl:px-5 xl:py-2.5 rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap border border-blue-500/20"
                  >
                    Register Shop
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile & Tablet Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsOpen(true)}
                aria-expanded={isOpen}
                aria-label="Open menu"
                className="inline-flex items-center justify-center p-2 sm:p-2.5 rounded-xl text-gray-800 hover:text-blue-600 hover:bg-blue-50/80 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer border border-gray-200/90 transition-all shadow-2xs"
              >
                <svg className="h-5 w-5 sm:h-5.5 sm:w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-over Full Height Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isOpen ? "visible" : "invisible delay-300"
          }`}
      >
        {/* Backdrop Overlay */}
        <div
          className={`fixed inset-0 bg-gray-950/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />

        {/* Sliding Menu Panel */}
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-[85vw] sm:max-w-md md:max-w-lg bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Drawer Top Bar */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100 bg-gray-50/50">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-white p-1 shadow-xs border border-blue-100 shrink-0">
                <Image
                  src={logoImg}
                  alt="Nearbuy Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-sm sm:text-base text-gray-950 leading-tight">
                  Nearbuy<span className="text-blue-600 ml-0.5">Clothing</span>
                </span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  Hyperlocal Market
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation menu"
              className="p-2 sm:p-2.5 rounded-xl text-gray-500 hover:text-gray-950 hover:bg-gray-200/60 focus:outline-none transition-colors border border-gray-200/80 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6 space-y-6">
            <div>
              <p className="text-[11px] font-extrabold tracking-wider text-gray-400 uppercase mb-3 px-1">
                Navigation Menu
              </p>
              <nav className="space-y-1.5 sm:space-y-2" aria-label="Mobile Navigation">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`relative group flex items-center justify-between px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold transition-all duration-200 ${isActive
                        ? "text-blue-600 bg-blue-50/60 border-l-4 border-blue-600 pl-4"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 hover:pl-5 border-l-4 border-transparent"
                        }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-3.5">
                        <span className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600 transition-colors"}>
                          {link.icon}
                        </span>
                        <span>{link.label}</span>
                      </div>

                      {/* Active / Hover Slide Arrow Indicator */}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isActive
                          ? "text-blue-600 translate-x-0"
                          : "text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-blue-600 group-hover:translate-x-1"
                          }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Drawer Footer / Auth Actions */}
          <div className="p-5 sm:p-6 border-t border-gray-100 bg-gray-50/60 space-y-3">
            {mounted && userRole ? (
              <>
                <Link
                  href={userRole === "admin" ? "/admin/dashboard" : "/vendor/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full text-center text-sm font-bold text-gray-900 bg-white hover:bg-gray-100 py-3 sm:py-3.5 rounded-2xl border border-gray-200/90 shadow-2xs transition-colors"
                >
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  {userRole === "admin" ? "Admin Console" : "Vendor Portal"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full text-center text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 py-3 sm:py-3.5 rounded-2xl cursor-pointer border border-red-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/become-vendor"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm font-bold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3 sm:py-3.5 rounded-2xl shadow-md shadow-blue-600/20 transition-all block"
                >
                  Register Shop
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm font-bold text-gray-800 bg-white hover:bg-gray-100 py-3 sm:py-3.5 rounded-2xl border border-gray-200/90 transition-colors block shadow-2xs"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
