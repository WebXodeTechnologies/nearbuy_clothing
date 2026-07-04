import React from "react";
import Card, { CardBody } from "../ui/Card";

export default function StatsCard({ title, value, change, changeType = "increase", icon: Icon }) {
  const trendColor = {
    increase: "text-emerald-600 bg-emerald-50",
    decrease: "text-red-600 bg-red-50",
    neutral: "text-gray-600 bg-gray-50",
  };

  return (
    <Card className="bg-white">
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </span>
          {Icon && (
            <div className="p-2 bg-blue-50/50 rounded-lg text-blue-600 border border-blue-50/20 shrink-0">
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            {value}
          </span>
          {change && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${trendColor[changeType]}`}>
              {change}
            </span>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
