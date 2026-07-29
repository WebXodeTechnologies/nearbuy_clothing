// models/Offer.js
import mongoose from "mongoose";
import "@/models/Vendor";
import "@/models/Store";

const OfferSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Offer must belong to a Vendor profile"],
      index: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      default: null,
      index: true,
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
      index: true,
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
      enum: ["Percentage", "Flat", "BOGO"], // 🟢 Allows 'Flat'
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
      index: true,
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

// 🟢 Pre-validate Hook to auto-generate slug before saving!
OfferSchema.pre("validate", function () {
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
});

// Indexes
OfferSchema.index({ vendorId: 1 });
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
