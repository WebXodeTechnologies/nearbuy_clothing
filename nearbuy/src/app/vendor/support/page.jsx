"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Modal from "@/components/ui/Modal";
import useSupportStore from "@/store/useSupportStore";
import { toast } from "react-hot-toast";
import {
  MessageCircle,
  Video,
  Phone,
  Send,
  ChevronDown,
  UploadCloud,
  X,
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

export default function VendorSupport() {
  const { tickets, loading, fetchTickets, createTicket } = useSupportStore();
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  // Form State
  const [category, setCategory] = useState("Store Listing & Location");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

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

  // Cloudinary / Image Upload Handler
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "nearbuy_preset"); // Replace with your Cloudinary preset

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );

        if (res.ok) {
          const fileData = await res.json();
          uploadedUrls.push(fileData.secure_url);
        }
      }
      setAttachments((prev) => [...prev, ...uploadedUrls]);
      toast.success("Screenshot(s) attached successfully!");
    } catch (err) {
      toast.error("Failed to upload screenshot");
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicket({
        category,
        subject,
        description,
        attachments,
      });

      setIsTicketOpen(false);
      setSubject("");
      setDescription("");
      setAttachments([]);
    } catch (err) {
      // Handled in store
    }
  };

  const openWhatsAppSupport = () => {
    const phone = "919820012345"; // Replace with Nearbuy Admin Support Phone Number
    const text = encodeURIComponent(
      "Hello Nearbuy Support! I need assistance with my merchant store account."
    );
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-8 font-body pb-12 max-w-6xl mx-auto">
      <DashboardHeader
        title="Merchant Support & Help Center"
        description="Get instant assistance, raise support tickets with screenshots, or chat live with our Merchant Growth team."
        badge="Help Desk"
      >
        <button
          onClick={() => setIsTicketOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" /> Raise Support Ticket
        </button>
      </DashboardHeader>

      {/* 3 Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp Support */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-xs border border-emerald-100">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">WhatsApp Merchant Chat</h3>
          <p className="text-xs text-slate-500 font-medium">
            Connect directly with your dedicated local Nearbuy account advisor.
          </p>
          <button
            onClick={openWhatsAppSupport}
            className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 pt-2 block cursor-pointer"
          >
            Chat on WhatsApp →
          </button>
        </div>

        {/* Video Guides */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="h-10 w-10 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center font-bold text-xs border border-teal-100">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Video Tutorials</h3>
          <p className="text-xs text-slate-500 font-medium">
            Learn how to upload lookbooks and boost offline store footfall.
          </p>
          <a href="#" className="text-xs font-extrabold text-teal-600 hover:text-teal-700 pt-2 block">
            Watch 2-Min Guides →
          </a>
        </div>

        {/* Priority Phone Call */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-bold text-xs border border-purple-100">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Priority Phone Line</h3>
          <p className="text-xs text-slate-500 font-medium">
            Gold Pro vendors get priority call support between 9 AM - 9 PM.
          </p>
          <a href="tel:+919820012345" className="text-xs font-extrabold text-purple-600 hover:text-purple-700 pt-2 block">
            +91 98200 12345 →
          </a>
        </div>
      </div>

      {/* Ticket History Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-indigo-600" />
            Your Recent Tickets
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {tickets.length} Submitted
          </span>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <p className="text-xs text-slate-500 font-medium">
              No support tickets submitted yet. Click above to open one if you need help!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((t) => (
              <div
                key={t._id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600">{t.ticketId}</span>
                    <span className="text-slate-300">•</span>
                    <h4 className="text-xs font-bold text-slate-900">{t.subject}</h4>
                  </div>
                  <p className="text-xs text-slate-600 font-medium line-clamp-1">{t.description}</p>
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 pt-1">
                    <Clock className="w-3 h-3" />
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {t.attachments?.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> {t.attachments.length} Image(s)
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border ${t.status === "OPEN"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : t.status === "RESOLVED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                  >
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Frequently Asked Questions</h3>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2 cursor-pointer"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{faq.q}</h4>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? "rotate-180 text-indigo-600" : ""
                    }`}
                />
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

      {/* Raise Ticket Modal with Image Attachments */}
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
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
            >
              <option>Store Listing & Location</option>
              <option>Promotions & Coupon Claims</option>
              <option>Subscription & Billing</option>
              <option>Other Technical Query</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Subject
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Need help updating store opening hours"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Describe your issue
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain how we can help you..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Screenshot Upload Box */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Attach Screenshots / Images
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                id="ticket-screenshots"
                className="hidden"
              />
              <label htmlFor="ticket-screenshots" className="cursor-pointer space-y-1 block">
                <UploadCloud className="w-6 h-6 text-indigo-600 mx-auto" />
                <p className="text-xs font-bold text-slate-700">
                  {uploading ? "Uploading Image..." : "Click to attach screenshots"}
                </p>
                <p className="text-[10px] text-slate-400">PNG, JPG up to 5MB</p>
              </label>
            </div>

            {/* Uploaded Previews */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3">
                {attachments.map((url, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 group">
                    <Image src={url} alt="Attachment" fill className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeAttachment(i)}
                      className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              disabled={loading || uploading}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}