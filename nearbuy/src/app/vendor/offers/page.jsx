"use client";

import React, { useState } from "react";
import OfferCard from "@/components/cards/OfferCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";

const INITIAL_OFFERS = [
  {
    id: "off-1-1",
    name: "End of Season Sale",
    discount: "Flat 20% Off",
    validUntil: "2026-07-31",
    status: "Active",
    terms: "Applicable on a minimum purchase value of ₹2,999."
  },
  {
    id: "off-1-2",
    name: "Monsoon Treat",
    discount: "Buy 2 Get 1 Free",
    validUntil: "2026-07-15",
    status: "Active",
    terms: "Applicable on Selected T-shirts and Shirts."
  }
];

export default function VendorOffers() {
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [terms, setTerms] = useState("");

  const handleOpenAdd = () => {
    setEditingOffer(null);
    setName("");
    setDiscount("");
    setValidUntil("2026-08-31");
    setTerms("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (off) => {
    setEditingOffer(off);
    setName(off.name);
    setDiscount(off.discount);
    setValidUntil(off.validUntil);
    setTerms(off.terms || "");
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this offer coupon?")) {
      setOffers(offers.filter((o) => o.id !== id));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !discount || !validUntil) return;

    if (editingOffer) {
      setOffers(
        offers.map((o) =>
          o.id === editingOffer.id ? { ...o, name, discount, validUntil, terms } : o
        )
      );
    } else {
      const newOff = {
        id: `off-new-${Date.now()}`,
        name,
        discount,
        validUntil,
        status: "Active",
        terms
      };
      setOffers([...offers, newOff]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Promotions & Active Offers"
        description="Launch discount campaigns, flat sales, or buy-one-get-one offers to drive store walk-ins."
      >
        <Button onClick={handleOpenAdd} size="sm">
          Create Offer Coupon
        </Button>
      </DashboardHeader>

      {offers.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-150 rounded-2xl max-w-xl mx-auto shadow-xs">
          <div className="h-12 w-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 text-sm">No Active Offers</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
            Running promo campaigns is the best way to get customers to walk in. Click below to create your first coupon.
          </p>
          <Button onClick={handleOpenAdd} size="sm" className="mt-5">
            Launch Offer
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((off) => (
            <OfferCard
              key={off.id}
              offer={off}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              isManageMode={true}
            />
          ))}
        </div>
      )}

      {/* Offer Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOffer ? "Edit Coupon Offer" : "Create Coupon Offer"}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Offer Name"
            name="name"
            placeholder="e.g. Monsoon Special T-shirts Sale"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Discount Value (Short text)"
            name="discount"
            placeholder="e.g. Flat 20% Off, Buy 1 Get 1 Free"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            required
          />

          <Input
            label="Valid Until Date"
            name="validUntil"
            type="date"
            value={validUntil}
            onChange={(e) => setReverseDateFormat(e.target.value)} // Wait, let's keep it simple: string input or standard date.
            required
          />

          <Input
            label="Terms & Conditions (Optional)"
            name="terms"
            placeholder="e.g. Applicable on shopping bills above ₹2,000"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {editingOffer ? "Save Changes" : "Launch Coupon"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// Simple helper to set date value in state
function setReverseDateFormat(val) {
  return val;
}
