import React from "react";
import Card, { CardBody } from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export default function OfferCard({ offer, onEdit, onDelete, isManageMode = false, storeName }) {
  const { id, name, discount, validUntil, status, terms } = offer;

  return (
    <Card className="bg-white border-l-4 border-l-blue-600 relative overflow-hidden group">
      {/* Decorative coupon dots */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-3.5 h-3.5 bg-gray-50 rounded-full border-r border-gray-150" />
      <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-3.5 h-3.5 bg-gray-50 rounded-full border-l border-gray-150" />
      
      <CardBody className="py-4 px-6 flex flex-col justify-between h-full">
        <div>
          {/* Top Row: Store Name (if available) & Status badge */}
          <div className="flex items-center justify-between">
            {storeName && (
              <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-600">
                {storeName}
              </span>
            )}
            {!storeName && isManageMode && (
              <Badge variant={status === "Active" ? "emerald" : "gray"} pill>
                {status}
              </Badge>
            )}
            <Badge variant="blue" pill className="text-[10px]">
              Active Deal
            </Badge>
          </div>

          {/* Discount details */}
          <div className="mt-2.5">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
              {discount}
            </h3>
            <h4 className="font-semibold text-gray-800 text-xs mt-0.5">
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
        <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Valid Till</span>
            <span className="text-xs text-gray-600 font-medium">{validUntil}</span>
          </div>

          {isManageMode ? (
            <div className="flex gap-1.5 shrink-0">
              {onEdit && (
                <button
                  onClick={() => onEdit(offer)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => alert("Show this coupon at checkout to claim the discount!")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Claim Deal
            </button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
