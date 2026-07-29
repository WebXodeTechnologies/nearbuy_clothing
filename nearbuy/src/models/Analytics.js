import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: [
        "WEBSITE_VISIT",
        "STORE_VIEW",
        "COLLECTION_VIEW",
        "OFFER_VIEW",
        "CATEGORY_VIEW",
        "WHATSAPP_CLICK",
        "PHONE_CLICK",
        "MAP_CLICK",
        "WEBSITE_CLICK",
        "VENDOR_LOGIN",
        "CUSTOMER_LOGIN",
        "CONTACT_FORM_SUBMIT",
      ],
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
      index: true,
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      default: null,
      index: true,
    },

    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      default: null,
    },

    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      default: null,
    },

    ipAddress: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
      index: true,
    },

    state: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    device: {
      type: String,
      enum: ["DESKTOP", "MOBILE", "TABLET", "UNKNOWN"],
      default: "UNKNOWN",
    },

    browser: {
      type: String,
      default: "",
    },

    os: {
      type: String,
      default: "",
    },

    referrer: {
      type: String,
      default: "",
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Synchronous pre-validate hook (No `next` parameter)
AnalyticsSchema.pre("validate", function () {
  if (this.eventType) {
    this.eventType = this.eventType.toUpperCase();
  }
});

// Indexes
AnalyticsSchema.index({ eventType: 1, vendorId: 1, createdAt: -1 });
AnalyticsSchema.index({ vendorId: 1, createdAt: -1 });

AnalyticsSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Analytics =
  mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);

export default Analytics;
