import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    planName: {
      type: String,
      required: [true, "Plan name is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    billingCycle: {
      type: String,
      enum: ["Monthly", "Yearly"],
      default: "Monthly",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentId: {
      type: String,
      default: "",
    },
    orderId: {
      type: String,
      default: "",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
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

const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;
