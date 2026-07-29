import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema(
  {
    // ==========================================
    // Owner Information
    // ==========================================

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner ID is required"],
      index: true,
    },

    // ==========================================
    // Business Information
    // ==========================================

    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      maxlength: 150,
    },

    businessSlug: {
      type: String,
      required: [true, "Business slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    businessType: {
      type: String,
      default: "Clothing Store",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // Contact Information
    // ==========================================

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    alternatePhone: {
      type: String,
      default: "",
      trim: true,
    },

    whatsappNumber: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
    },

    // ==========================================
    // Branding
    // ==========================================

    logo: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      default: null,
    },

    // ==========================================
    // Business Details
    // ==========================================

    gstNumber: {
      type: String,
      default: "",
      trim: true,
    },

    panNumber: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // Social Media
    // ==========================================

    instagram: {
      type: String,
      default: "",
    },

    facebook: {
      type: String,
      default: "",
    },

    // ==========================================
    // Subscription
    // ==========================================

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null,
      index: true,
    },

    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
      index: true,
    },

    // ==========================================
    // Approval
    // ==========================================

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Suspended"],
      default: "Approved",
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    verifiedAt: {
      type: Date,
      default: Date.now,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ==========================================
    // Statistics
    // ==========================================

    totalStores: {
      type: Number,
      default: 0,
    },

    totalCollections: {
      type: Number,
      default: 0,
    },

    totalOffers: {
      type: Number,
      default: 0,
    },

    totalWhatsappClicks: {
      type: Number,
      default: 0,
    },

    totalViews: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // Status
    // ==========================================

    profileCompleted: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Pre-Validate Hook for Auto Slug
// ==========================================

VendorSchema.pre("validate", function (next) {
  if (!this.businessSlug || this.businessSlug.trim() === "") {
    const baseName = this.businessName || "boutique-vendor";
    this.businessSlug =
      baseName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Math.floor(Math.random() * 10000);
  }
});

// ==========================================
// Indexes
// ==========================================

VendorSchema.index({ ownerId: 1 });
VendorSchema.index({ businessSlug: 1 });
VendorSchema.index({ status: 1 });
VendorSchema.index({ planId: 1 });

// ==========================================
// Hide Internal Fields
// ==========================================

VendorSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);

export default Vendor;
