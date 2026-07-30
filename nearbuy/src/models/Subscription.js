import mongoose from "mongoose";
import { BILLING_CYCLES } from "../constants/plans.js";
import { PAYMENT_STATUS, SUBSCRIPTION_STATUS } from "../constants/status.js";

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

    planName: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    billingCycle: {
      type: String,
      enum: Object.values(
        BILLING_CYCLES || { MONTHLY: "Monthly", YEARLY: "Yearly" },
      ),
      default: "Monthly",
    },

    razorpayOrderId: {
      type: String,
      default: "",
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      default: "",
      index: true,
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      enum: ["UPI", "CARD", "NETBANKING", "WALLET", "CASH", "UNKNOWN"],
      default: "UNKNOWN",
    },

    paymentStatus: {
      type: String,
      enum: Object.values(
        PAYMENT_STATUS || {
          PENDING: "Pending",
          PAID: "Paid",
          FAILED: "Failed",
        },
      ),
      default: "Pending",
      index: true,
    },

    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    renewedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(
        SUBSCRIPTION_STATUS || {
          ACTIVE: "Active",
          EXPIRED: "Expired",
          INACTIVE: "Inactive",
        },
      ),
      default: "Active",
      index: true,
    },

    autoRenew: {
      type: Boolean,
      default: false,
    },

    invoiceNumber: {
      type: String,
      default: "",
    },

    invoiceUrl: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

SubscriptionSchema.index({ vendorId: 1 });
SubscriptionSchema.index({ planId: 1 });
SubscriptionSchema.index({ paymentStatus: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ expiryDate: 1 });

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
