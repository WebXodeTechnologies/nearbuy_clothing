import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    // ==========================================
    // Contact Information
    // ==========================================

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // Enquiry Details
    // ==========================================

    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },

    enquiryType: {
      type: String,
      enum: ["GENERAL", "SUPPORT", "VENDOR", "PARTNERSHIP", "FEEDBACK"],
      default: "GENERAL",
      index: true,
    },

    // ==========================================
    // Status
    // ==========================================

    status: {
      type: String,
      enum: ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "NEW",
      index: true,
    },

    // ==========================================
    // Admin
    // ==========================================

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    adminNotes: {
      type: String,
      default: "",
      trim: true,
    },

    respondedAt: {
      type: Date,
      default: null,
    },

    // ==========================================
    // Tracking
    // ==========================================

    ipAddress: {
      type: String,
      default: "",
    },

    source: {
      type: String,
      enum: ["WEBSITE", "MOBILE_APP", "LANDING_PAGE"],
      default: "WEBSITE",
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Indexes
// ==========================================

ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ enquiryType: 1 });
ContactSchema.index({ createdAt: -1 });

// ==========================================
// Hide Internal Fields
// ==========================================

ContactSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

export default Contact;
