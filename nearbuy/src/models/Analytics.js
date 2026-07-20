import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: [
        "website_visit",
        "store_view",
        "whatsapp_click",
        "phone_click",
        "maps_click",
        "category_view",
        "vendor_login",
      ],
      index: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      index: true,
      default: null,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      index: true,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Analytics = mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);

export default Analytics;
