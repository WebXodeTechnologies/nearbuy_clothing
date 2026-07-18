import { Manrope, Space_Grotesk } from "next/font/google";
import "../globals.css";

import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata = {
  title: "Nearbuy Clothing | Hyperlocal Fashion Discovery Platform",
  description:
    "Discover local clothing collections, boutique offers, and fashion stores in your neighborhood. Explore nearby fashion, exclusive offers, and support local businesses.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body
        className="w-full min-h-screen bg-white text-gray-900 antialiased flex flex-col selection:bg-blue-600 selection:text-white"
        suppressHydrationWarning
      >
        <Navbar />

        <main className="w-full flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
