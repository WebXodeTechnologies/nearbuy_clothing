import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
      index: true,
    },
    planName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    billingCycle: { type: String, default: "Monthly" },
    paymentMethod: { type: String, default: "UPI" },
    paymentStatus: { type: String, default: "Paid", index: true },
    startDate: { type: Date, required: true, default: Date.now },
    expiryDate: { type: Date, required: true },
    status: { type: String, default: "Active", index: true },
    autoRenew: { type: Boolean, default: false },
  },
  { timestamps: true },
);

SubscriptionSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;
