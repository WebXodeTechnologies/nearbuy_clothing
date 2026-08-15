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

    storeName: {
      type: String,
      trim: true,
    },

    businessSlug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
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

    tagline: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
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

    businessPhone: {
      type: String,
      default: "",
      trim: true,
    },

    alternatePhone: {
      type: String,
      default: "",
      trim: true,
    },

    whatsapp: {
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
    // Location Details
    // ==========================================
    address: { type: String, default: "" },
    area: { type: String, default: "Salem Road" },
    city: { type: String, default: "Namakkal" },
    state: { type: String, default: "Tamil Nadu" },
    pincode: { type: String, default: "" },
    googleMapUrl: { type: String, default: "" },

    // ==========================================
    // Branding & Media
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
    // Cloud Storage Tracking (UploadThing 2GB Limit)
    // ==========================================
    storageUsedBytes: {
      type: Number,
      default: 0,
    },

    storageLimitBytes: {
      type: Number,
      default: 2 * 1024 * 1024 * 1024, // 2 GB default limit in bytes
    },

    storagePlan: {
      type: String,
      default: "Free Tier (2GB)",
    },

    // ==========================================
    // Operating Schedule & Amenities
    // ==========================================
    openingTime: { type: String, default: "09:30 AM" },
    closingTime: { type: String, default: "09:00 PM" },
    workingDays: {
      type: [String],
      default: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    facilities: { type: [String], default: [] },

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
    },

    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },

    // ==========================================
    // Approval
    // ==========================================
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Suspended"],
      default: "Pending",
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    verifiedAt: {
      type: Date,
      default: () => Date.now(),
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
    // Status Toggles
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
// Pre-Validate Hook for Auto Slug Creation
// ==========================================
VendorSchema.pre("validate", function () {
  if (this.businessName && !this.storeName) {
    this.storeName = this.businessName;
  } else if (this.storeName && !this.businessName) {
    this.businessName = this.storeName;
  }

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
// Clean Indexes (Defined Once)
// ==========================================
VendorSchema.index({ ownerId: 1 });
VendorSchema.index({ businessSlug: 1 });
VendorSchema.index({ status: 1 });
VendorSchema.index({ planId: 1 });
VendorSchema.index({ subscriptionId: 1 });

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
