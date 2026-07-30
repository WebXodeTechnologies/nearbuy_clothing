import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["APPROVAL", "OFFER", "BILLING", "ANNOUNCEMENT", "LEAD", "SYSTEM"],
      default: "SYSTEM",
      index: true,
    },
    unread: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for fast retrieval of unread notifications
NotificationSchema.index({ vendorId: 1, unread: 1, createdAt: -1 });

NotificationSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);

export default Notification;
