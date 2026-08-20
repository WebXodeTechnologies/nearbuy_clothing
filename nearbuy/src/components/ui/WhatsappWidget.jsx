"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import logoImg from "@public/logos/logo2.png";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(false);

  useEffect(() => {
    // Show attention badge after 3 seconds on page load
    const timer = setTimeout(() => {
      setShowNotificationBadge(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowNotificationBadge(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body">
      {/* Chat Window Popup Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden mb-2"
          >
            {/* Header */}
            <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-inner overflow-hidden p-1">
                  <Image
                    src={logoImg}
                    alt="Streetunics Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Streetunics Support</h4>
                  <span className="text-[10px] text-emerald-200 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />{" "}
                    Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body Message Bubble */}
            <div className="p-4 bg-[#efeae2] h-48 flex flex-col justify-end space-y-3">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-xs text-slate-800 space-y-1">
                <p className="font-bold text-emerald-800">
                  Welcome to Streetunics! 👋
                </p>
                <p>
                  Explore the newest collections and multi-tenant stores we have
                  curated for you today.
                </p>
                <span className="text-[9px] text-slate-400 block text-right">
                  Just now
                </span>
              </div>
            </div>

            {/* Action Footer Button */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <a
                href="https://wa.me/918015801205" // Replace with client's actual WhatsApp business number
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-600/20"
              >
                {/* Official WhatsApp SVG Icon inside button */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button with WhatsApp Brand Logo & Ping Badge */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenChat}
        className="relative bg-[#25d366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Open WhatsApp Welcome Chat"
      >
        {/* Official WhatsApp SVG Logo */}
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
        {showNotificationBadge && !isOpen && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
            1
          </span>
        )}
      </motion.button>
    </div>
  );
}
