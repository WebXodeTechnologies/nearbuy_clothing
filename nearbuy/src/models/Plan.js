import mongoose from "mongoose";
import { PLAN_TYPES, BILLING_CYCLES } from "../constants/plans.js";

const PlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
      unique: true,
      trim: true,
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
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    billingCycle: {
      type: String,
      enum: ["Monthly", "Annual"],
      default: "Monthly",
    },
    maxStores: { type: Number, default: 1, min: -1 },
    maxCollections: { type: Number, default: 20, min: -1 },
    maxOffers: { type: Number, default: 10, min: -1 },
    maxGalleryImages: { type: Number, default: 20, min: -1 },
    featuredStore: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
    analyticsAccess: { type: Boolean, default: false },
    whatsappInsights: { type: Boolean, default: false },
    promotionalBanners: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 1 },
    features: [{ type: String }],
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true },
);

PlanSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Plan = mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
export default Plan;
