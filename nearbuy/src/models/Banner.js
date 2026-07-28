import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    // ==========================================
    // Banner Information
    // ==========================================

    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
      maxlength: 150,
    },

    subtitle: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // Images
    // ==========================================

    image: {
      type: String,
      required: [true, "Banner image is required"],
    },

    mobileImage: {
      type: String,
      default: "",
    },

    // ==========================================
    // CTA
    // ==========================================

    buttonText: {
      type: String,
      default: "",
    },

    buttonLink: {
      type: String,
      default: "",
    },

    // ==========================================
    // Banner Type
    // ==========================================

    bannerType: {
      type: String,
      enum: ["HOME_HERO", "CATEGORY", "PROMOTION", "SEASONAL", "ADVERTISEMENT"],
      default: "HOME_HERO",
      index: true,
    },

    // ==========================================
    // Target Audience
    // ==========================================

    targetAudience: {
      type: String,
      enum: ["ALL", "MEN", "WOMEN", "KIDS", "VENDORS"],
      default: "ALL",
    },

    // ==========================================
    // Display Settings
    // ==========================================

    displayOrder: {
      type: Number,
      default: 1,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ==========================================
    // Schedule
    // ==========================================

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      default: null,
    },

    // ==========================================
    // Analytics
    // ==========================================

    totalViews: {
      type: Number,
      default: 0,
    },

    totalClicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Indexes
// ==========================================

BannerSchema.index({ bannerType: 1 });
BannerSchema.index({ isActive: 1 });
BannerSchema.index({ displayOrder: 1 });

// ==========================================
// Hide Internal Fields
// ==========================================

BannerSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);

export default Banner;
