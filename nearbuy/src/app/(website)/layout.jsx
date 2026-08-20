import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import WhatsAppWidget from "@/components/ui/WhatsappWidget";

export default function WebsiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="w-full flex-1">{children}</main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}