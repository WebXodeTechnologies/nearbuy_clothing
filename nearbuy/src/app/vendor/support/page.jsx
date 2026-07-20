"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Modal from "@/components/ui/Modal";
import { toast } from "react-hot-toast";
import {
  HelpCircle,
  MessageSquare,
  FileText,
  Video,
  Send,
  Phone,
  Mail,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function VendorSupport() {
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "How do customers discover my clothing store on Nearbuy?",
      a: "Nearbuy ranks physical stores based on customer distance (hyperlocal GPS), store completeness score, and active lookbook collections. Gold Pro vendors rank in the top 5% of neighborhood search.",
    },
    {
      q: "Do I sell my clothing items directly online through Nearbuy?",
      a: "No! Nearbuy is designed specifically for offline clothing stores. Customers view your lookbooks, check stock availability, click WhatsApp or phone call, and walk into your physical store to purchase.",
    },
    {
      q: "How do promotional coupon codes work?",
      a: "When you launch a promotion (e.g. FLAT 20% OFF), shoppers claim the code on Nearbuy and show the digital coupon on their phone when paying at your store register.",
    },
    {
      q: "How can I change my store address or Google Maps pin location?",
      a: "Navigate to 'My Store' in the sidebar menu and update your full address, opening hours, or contact details.",
    },
  ];

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    setIsTicketOpen(false);
    toast.success("Support ticket #TK-8492 submitted! Our team will call you back within 2 hours.");
  };

  return (
    <div className="space-y-8 font-body pb-12">
      <DashboardHeader
        title="Merchant Support & Help Center"
        description="Get instant assistance, raise support tickets, browse video tutorials, or chat live with our Merchant Growth team."
        badge="Help Desk"
      >
        <button
          onClick={() => setIsTicketOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" /> Raise Support Ticket
        </button>
      </DashboardHeader>

      {/* 3 Support Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#ECECEC] shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xs border border-indigo-100">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-base font-heading font-bold text-slate-900">Live Merchant Chat</h3>
          <p className="text-xs text-slate-500 font-medium">Chat directly with a local Nearbuy merchant advisor.</p>
          <button
            onClick={() => toast.success("Live Chat connected!")}
            className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 pt-2 block cursor-pointer"
          >
            Start Live Chat →
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#ECECEC] shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="h-10 w-10 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center font-bold text-xs border border-teal-100">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-base font-heading font-bold text-slate-900">Video Tutorials</h3>
          <p className="text-xs text-slate-500 font-medium">Learn how to upload lookbooks and boost store footfall.</p>
          <a href="#" className="text-xs font-extrabold text-teal-600 hover:text-teal-700 pt-2 block">
            Watch 2-Min Guides →
          </a>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#ECECEC] shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-bold text-xs border border-purple-100">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-base font-heading font-bold text-slate-900">Priority Phone Call</h3>
          <p className="text-xs text-slate-500 font-medium">Gold Pro vendors get dedicated account call support.</p>
          <a href="tel:+919820012345" className="text-xs font-extrabold text-purple-600 hover:text-purple-700 pt-2 block">
            +91 98200 12345 →
          </a>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECECEC] shadow-xs space-y-4">
        <h3 className="text-lg font-heading font-bold text-slate-900">Frequently Asked Questions</h3>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2 cursor-pointer"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{faq.q}</h4>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? "rotate-180 text-indigo-600" : ""}`} />
              </div>
              {openFaq === idx && (
                <p className="text-xs text-slate-600 font-medium leading-relaxed pt-2 border-t border-slate-200/60">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Raise Ticket Modal */}
      <Modal
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        title="Raise Support Ticket"
        size="md"
      >
        <form onSubmit={handleTicketSubmit} className="space-y-4 font-body">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Issue Category
            </label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none">
              <option>Store Listing & Location</option>
              <option>Promotions & Coupon Claims</option>
              <option>Subscription & Billing</option>
              <option>Other Technical Query</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Describe your issue
            </label>
            <textarea
              rows={4}
              required
              placeholder="Explain how we can help you..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-900 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsTicketOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
