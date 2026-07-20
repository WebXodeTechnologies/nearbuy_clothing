import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Offer title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    banner: {
      type: String,
      default: "",
    },
    discountType: {
      type: String,
      enum: ["Percentage", "Flat"],
      default: "Percentage",
    },
    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Expired"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Offer = mongoose.models.Offer || mongoose.model("Offer", OfferSchema);

export default Offer;
