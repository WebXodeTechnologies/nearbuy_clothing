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
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                N
              </div>
              <span className="font-bold text-white text-base tracking-tight">
                Nearby<span className="text-blue-500">Clothing</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed">
              Discover local clothing collections, check active offers, and walk in to support independent boutiques in your city. Not e-commerce, but hyperlocal fashion discovery.
            </p>
            <div className="flex space-x-3 pt-2">
              {/* Instagram Icon */}
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.008 3.81.055 1 .045 1.54.212 1.9.351.48.186.82.408 1.18.769.36.36.582.7.768 1.18.14.36.307.9.351 1.9.047 1.026.055 1.38.055 3.81s-.008 2.784-.055 3.81c-.045 1-.212 1.54-.351 1.9-.186.48-.408.82-.769 1.18-.36.36-.7.582-1.18.768-.36.14-.9.307-1.9.351-1.026.047-1.38.055-3.81.055s-2.784-.008-3.81-.055c-1-.045-1.54-.212-1.9-.351-.48-.186-.82-.408-1.18-.769-.36-.36-.582-.7-.768-1.18-.14-.36-.307-.9-.351-1.9C2.008 14.814 2 14.46 2 12.315s.008-2.784.055-3.81c.045-1 .212-1.54.351-1.9.186-.48.408-.82.769-1.18.36-.36.7-.582 1.18-.768.36-.14.9-.307 1.9-.351 1.026-.047 1.38-.055 3.81-.055zm0 2.232c-2.41 0-2.695.009-3.646.052-.878.04-1.353.186-1.67.31-.421.163-.722.359-1.039.676-.317.317-.513.618-.676 1.039-.124.317-.27.792-.31 1.67-.043.951-.052 1.236-.052 3.646s.009 2.695.052 3.646c.04.878.186 1.353.31 1.67.163.421.359.722.676 1.039.317.317.618.513 1.039.676.317.124.792.27 1.67.31.951.043 1.236.052 3.646.052s2.695-.009 3.646-.052c.878-.04 1.353-.186 1.67-.31.421-.163.722-.359 1.039-.676.317-.317.513-.618.676-1.039.124-.317.27-.792.31-1.67.043-.951.052-1.236.052-3.646s-.009-2.695-.052-3.646c-.04-.878-.186-1.353-.31-1.67-.163-.421-.359-.722-.676-1.039-.317-.317-.618-.513-1.039-.676-.317-.124-.792-.27-1.67-.31-.951-.043-1.236-.052-3.646-.052zm0 2.784a5.03 5.03 0 100 10.06 5.03 5.03 0 000-10.06zm0 7.828a2.798 2.798 0 110-5.596 2.798 2.798 0 010 5.596zm5.884-7.856a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" clipRule="evenodd" />
                </svg>
              </a>
              {/* Twitter Icon */}
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.702v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div>
            <h5 className="font-semibold text-white mb-4 text-xs tracking-wider uppercase">Discover Store</h5>
            <ul className="space-y-2.5">
              {links.explore.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-4 text-xs tracking-wider uppercase">Apparel Categories</h5>
            <ul className="space-y-2.5">
              {links.categories.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-4 text-xs tracking-wider uppercase">Grow Business</h5>
            <ul className="space-y-2.5">
              {links.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <span>&copy; {currentYear} Nearby Clothing Platform. All rights reserved.</span>
          <div className="flex space-x-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
