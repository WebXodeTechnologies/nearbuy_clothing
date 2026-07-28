import mongoose from "mongoose";
import { PLAN_TYPES, BILLING_CYCLES } from "@/constants/plans";

const PlanSchema = new mongoose.Schema(
  {
    // ==========================================
    // Basic Information
    // ==========================================

    name: {
      type: String,
      required: [true, "Plan name is required"],
      unique: true,
      trim: true,
      enum: Object.values(PLAN_TYPES),
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // Pricing
    // ==========================================

    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    billingCycle: {
      type: String,
      enum: Object.values(BILLING_CYCLES),
      default: BILLING_CYCLES.MONTHLY,
    },

    // ==========================================
    // Plan Limits
    // ==========================================

    maxStores: {
      type: Number,
      default: 1,
      min: 1,
    },

    maxCollections: {
      type: Number,
      default: 20,
      min: 0,
    },

    maxOffers: {
      type: Number,
      default: 10,
      min: 0,
    },

    maxGalleryImages: {
      type: Number,
      default: 20,
      min: 0,
    },

    // ==========================================
    // Feature Access
    // ==========================================

    featuredStore: {
      type: Boolean,
      default: false,
    },

    prioritySupport: {
      type: Boolean,
      default: false,
    },

    analyticsAccess: {
      type: Boolean,
      default: false,
    },

    whatsappInsights: {
      type: Boolean,
      default: false,
    },

    promotionalBanners: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // Status
    // ==========================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    displayOrder: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Indexes
// ==========================================

PlanSchema.index({ slug: 1 });
PlanSchema.index({ name: 1 });
PlanSchema.index({ isActive: 1 });

// ==========================================
// Hide Internal Fields
// ==========================================

PlanSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Plan = mongoose.models.Plan || mongoose.model("Plan", PlanSchema);

export default Plan;
