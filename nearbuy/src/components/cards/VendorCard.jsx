"use client";

import React from "react";
import Badge from "../ui/Badge";
import Card, { CardBody } from "../ui/Card";
import Button from "../ui/Button";

export default function VendorCard({ vendor, onApprove, onReject, onSuspend }) {
  const { id, name, email, storeName, date, status, plan } = vendor;

  const planColors = {
    Free: "gray",
    Silver: "blue",
    Gold: "indigo",
    Platinum: "emerald"
  };

  const statusColors = {
    Pending: "yellow",
    Approved: "emerald",
    Suspended: "red"
  };

  return (
    <Card className="bg-white">
      <CardBody className="flex flex-col h-full justify-between">
        <div>
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">{name}</h4>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
            <Badge variant={planColors[plan] || "gray"} pill>
              {plan}
            </Badge>
          </div>

          {/* Details */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Store:</span>
              <span className="font-medium text-gray-800">{storeName || "Not Created"}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Registered:</span>
              <span className="text-gray-600">{date}</span>
            </div>
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-400">Status:</span>
              <Badge variant={statusColors[status] || "gray"}>{status}</Badge>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-2">
          {status === "Pending" && (
            <>
              <Button
                variant="success"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => onApprove(id)}
              >
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                onClick={() => onReject(id)}
              >
                Reject
              </Button>
            </>
          )}

          {status === "Approved" && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-300"
              onClick={() => onSuspend(id)}
            >
              Suspend Account
            </Button>
          )}

          {status === "Suspended" && (
            <Button
              variant="success"
              size="sm"
              className="w-full text-xs"
              onClick={() => onApprove(id)}
            >
              Re-Approve
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
