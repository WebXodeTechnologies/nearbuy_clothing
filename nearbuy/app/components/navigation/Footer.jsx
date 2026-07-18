import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    explore: [
      { label: "Search Stores", href: "/stores" },
      { label: "All Categories", href: "/categories" },
      { label: "Become a Merchant", href: "/become-vendor" },
      { label: "Browse Offers", href: "/stores" },
    ],
    support: [
      { label: "About Our Story", href: "/about" },
      { label: "Contact Support", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms" },
    ],
    categories: [
      { label: "Men's Fashion", href: "/categories" },
      { label: "Women's Styles", href: "/categories" },
      { label: "Kids Wardrobe", href: "/categories" },
      { label: "Boutiques & Designers", href: "/categories" },
    ]
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs sm:text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="font-heading font-bold text-white text-lg tracking-tight">
                Nearbuy<span className="text-blue-500 ml-0.5">Clothing</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              Discover nearby apparel lookbooks, claim walk-in coupons, and support independent boutiques in your city. Modern SaaS hyperlocal fashion platform.
            </p>
          </div>

          {/* Links Grid */}
          <div>
            <h5 className="font-heading font-bold text-white mb-4 text-xs tracking-wider uppercase">Discover Stores</h5>
            <ul className="space-y-2.5 font-body">
              {links.explore.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-heading font-bold text-white mb-4 text-xs tracking-wider uppercase">Categories</h5>
            <ul className="space-y-2.5 font-body">
              {links.categories.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-heading font-bold text-white mb-4 text-xs tracking-wider uppercase">Company & Support</h5>
            <ul className="space-y-2.5 font-body">
              {links.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-body">
          <span>&copy; {currentYear} Nearbuy Clothing Platform. All rights reserved.</span>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
