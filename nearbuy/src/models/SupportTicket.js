import mongoose from "mongoose";

const SupportTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: [
        "Store Listing & Location",
        "Promotions & Coupon Claims",
        "Subscription & Billing",
        "Other Technical Query",
      ],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: [
      {
        type: String, // Cloudinary or S3 Image URLs
      },
    ],
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "OPEN",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

SupportTicketSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const SupportTicket =
  mongoose.models.SupportTicket ||
  mongoose.model("SupportTicket", SupportTicketSchema);

export default SupportTicket;
