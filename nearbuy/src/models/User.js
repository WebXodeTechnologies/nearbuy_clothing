import mongoose from "mongoose";
import { ROLES } from "../constants/roles.js";

const UserSchema = new mongoose.Schema(
  {
    // ==========================================
    // Basic Information
    // ==========================================
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    designation: {
      type: String,
      trim: true,
      default: "Merchant Owner",
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    // ==========================================
    // Authentication
    // ==========================================
    provider: {
      type: String,
      enum: ["google", "credentials"],
      default: "credentials",
    },

    providerId: {
      type: String,
      default: "",
      index: true,
    },

    emailVerified: {
      type: Boolean,
      default: true,
    },

    // ==========================================
    // Role & Permissions
    // ==========================================
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
      index: true,
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
      index: true,
    },

    // ==========================================
    // Account Status
    // ==========================================
    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // Activity
    // ==========================================
    loginCount: {
      type: Number,
      default: 0,
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },

    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Indexes
// ==========================================

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ providerId: 1 });
UserSchema.index({ vendorId: 1 });

// ==========================================
// Hide Internal Fields
// ==========================================

UserSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
