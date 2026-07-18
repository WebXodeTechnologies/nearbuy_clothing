"use client";

import React, { useState } from "react";
import Card, { CardBody } from "../ui/Card";
import Badge from "../ui/Badge";

export default function OfferCard({ offer, onEdit, onDelete, isManageMode = false, storeName }) {
  const { id, name, discount, validUntil, status, terms, code } = offer;
  const [copied, setCopied] = useState(false);

  const handleClaim = () => {
    const couponCode = code || `NEARBY${discount.replace(/[^0-9]/g, "") || "OFF"}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(couponCode);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Card className="bg-white border-l-4 border-l-blue-600 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Decorative coupon side notches */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-3.5 h-3.5 bg-gray-50 rounded-full border-r border-gray-200" />
      <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-3.5 h-3.5 bg-gray-50 rounded-full border-l border-gray-200" />

      <CardBody className="py-5 px-6 flex flex-col justify-between h-full">
        <div>
          {/* Top Row: Store Name & Status badge */}
          <div className="flex items-center justify-between">
            {storeName && (
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600">
                {storeName}
              </span>
            )}
            {!storeName && isManageMode && (
              <Badge variant={status === "Active" ? "emerald" : "gray"} pill>
                {status}
              </Badge>
            )}
            <Badge variant="blue" pill className="text-[10px] font-semibold">
              Active Deal
            </Badge>
          </div>

          {/* Discount details */}
          <div className="mt-3">
            <h3 className="font-heading font-extrabold text-2xl text-gray-950 tracking-tight leading-tight">
              {discount}
            </h3>
            <h4 className="font-heading font-bold text-gray-800 text-xs sm:text-sm mt-1">
              {name}
            </h4>
            {terms && (
              <p className="mt-1 text-[11px] text-gray-400 leading-normal">
                * {terms}
              </p>
            )}
          </div>
        </div>

        {/* Valid until and operations */}
        <div className="mt-5 pt-3.5 border-t border-dashed border-gray-150 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Valid Till</span>
            <span className="text-xs text-gray-700 font-semibold">{validUntil}</span>
          </div>

          {isManageMode ? (
            <div className="flex gap-1.5 shrink-0">
              {onEdit && (
                <button
                  onClick={() => onEdit(offer)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                  title="Edit Offer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete Offer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={handleClaim}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                copied
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border border-blue-100"
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Code Copied!</span>
                </>
              ) : (
                <span>Claim Deal</span>
              )}
            </button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
