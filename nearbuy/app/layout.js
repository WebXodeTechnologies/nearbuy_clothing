import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

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
        <AuthProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#0f172a",
                color: "#fff",
                borderRadius: "16px",
                padding: "12px 20px",
                fontSize: "14px",
                fontWeight: "600",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
