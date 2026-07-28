import mongoose from "mongoose";

const CMSSchema = new mongoose.Schema(
  {
    // ==========================================
    // Page Information
    // ==========================================

    title: {
      type: String,
      required: [true, "Page title is required"],
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    pageType: {
      type: String,
      enum: ["PAGE", "LEGAL", "HELP", "LANDING", "HOME_SECTION"],
      default: "PAGE",
      index: true,
    },

    // ==========================================
    // Content
    // ==========================================

    content: {
      type: String,
      default: "",
    },

    excerpt: {
      type: String,
      default: "",
      trim: true,
    },

    featuredImage: {
      type: String,
      default: "",
    },

    // ==========================================
    // SEO
    // ==========================================

    seoTitle: {
      type: String,
      default: "",
    },

    seoDescription: {
      type: String,
      default: "",
    },

    seoKeywords: {
      type: [String],
      default: [],
    },

    ogImage: {
      type: String,
      default: "",
    },

    // ==========================================
    // Publishing
    // ==========================================

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    // ==========================================
    // Display
    // ==========================================

    displayOrder: {
      type: Number,
      default: 1,
    },

    isHomePageSection: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // Analytics
    // ==========================================

    totalViews: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // Version Control
    // ==========================================

    version: {
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

CMSSchema.index({ slug: 1 });
CMSSchema.index({ pageType: 1 });
CMSSchema.index({ isPublished: 1 });
CMSSchema.index({ displayOrder: 1 });

// ==========================================
// Hide Internal Fields
// ==========================================

CMSSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const CMS = mongoose.models.CMS || mongoose.model("CMS", CMSSchema);

export default CMS;
