import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema(
  {
    // ==========================================
    // Relationships
    // ==========================================

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },

    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      default: null,
      index: true,
    },

    // ==========================================
    // Offer Information
    // ==========================================

    title: {
      type: String,
      required: [true, "Offer title is required"],
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

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // Media
    // ==========================================

    bannerImage: {
      type: String,
      default: "",
    },

    gallery: {
      type: [String],
      default: [],
    },

    // ==========================================
    // Discount
    // ==========================================

    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FLAT"],
      default: "PERCENTAGE",
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    minimumPurchase: {
      type: Number,
      default: 0,
    },

    maximumDiscount: {
      type: Number,
      default: null,
    },

    // ==========================================
    // Validity
    // ==========================================

    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: true,
    },

    // ==========================================
    // Visibility
    // ==========================================

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
    // Analytics
    // ==========================================

    totalViews: {
      type: Number,
      default: 0,
    },

    totalWhatsappClicks: {
      type: Number,
      default: 0,
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
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Indexes
// ==========================================

OfferSchema.index({ vendorId: 1 });
OfferSchema.index({ storeId: 1 });
OfferSchema.index({ collectionId: 1 });
OfferSchema.index({ slug: 1 });
OfferSchema.index({ startDate: 1 });
OfferSchema.index({ endDate: 1 });
OfferSchema.index({ isActive: 1 });
OfferSchema.index({ isFeatured: 1 });

// ==========================================
// Hide Internal Fields
// ==========================================

OfferSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Offer = mongoose.models.Offer || mongoose.model("Offer", OfferSchema);

export default Offer;
