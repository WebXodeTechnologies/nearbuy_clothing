import mongoose from "mongoose";
import "@/models/Vendor";
import "@/models/Store";

const OfferSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Offer must belong to a Vendor profile"],
      // 🔄 Removed inline index: true
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      default: null,
      // 🔄 Removed inline index: true
    },

    title: {
      type: String,
      required: [true, "Offer title is required"],
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      // 🔄 Removed inline index: true
    },

    couponCode: {
      type: String,
      required: [true, "Coupon code is required"],
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["Percentage", "Flat", "BOGO"],
      default: "Percentage",
    },

    discountValue: {
      type: Number,
      default: 0,
    },

    minPurchaseAmount: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: [true, "Offer valid until date is required"],
    },

    banner: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Paused", "Expired"],
      default: "Active",
      // 🔄 Removed inline index: true
    },

    views: {
      type: Number,
      default: 0,
    },

    claims: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Pre-validate Hook to auto-generate slug before saving!
OfferSchema.pre("validate", function (next) {
  if (!this.slug || this.slug.trim() === "") {
    const baseName = this.title || "offer";
    this.slug =
      baseName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Math.floor(Math.random() * 10000);
  }
  next();
});

// ==========================================
// Indexes (Single Source of Truth)
// ==========================================
OfferSchema.index({ vendorId: 1 });
OfferSchema.index({ storeId: 1 });
OfferSchema.index({ slug: 1 });
OfferSchema.index({ status: 1 });

OfferSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Offer = mongoose.models.Offer || mongoose.model("Offer", OfferSchema);
export default Offer;
