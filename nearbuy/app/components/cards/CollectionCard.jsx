import React from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export default function CollectionCard({ collection, onEdit, onDelete, isManageMode = false }) {
  const { id, name, description, image, status } = collection;

  return (
    <Card className="flex flex-col h-full bg-white group overflow-hidden border border-gray-100">
      {/* Collection Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 shrink-0">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {status && isManageMode && (
          <div className="absolute top-3 left-3">
            <Badge variant={status === "Active" ? "emerald" : "gray"} pill>
              {status}
            </Badge>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
            {name}
          </h4>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Action Buttons for Vendor Management */}
        {isManageMode && (onEdit || onDelete) && (
          <div className="mt-4 pt-3 border-t border-gray-50 flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs py-1"
                onClick={() => onEdit(collection)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs py-1 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
                onClick={() => onDelete(id)}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
