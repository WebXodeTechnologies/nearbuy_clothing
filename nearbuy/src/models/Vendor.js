import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema(
  {
    // ==========================================
    // Owner Information
    // ==========================================

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      required: true,
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
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
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
      default: "Pending",
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verifiedAt: {
      type: Date,
      default: null,
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
      default: false,
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
