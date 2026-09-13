import mongoose from "mongoose";
import { ROLES } from "../constants/roles.js";

const UserSchema = new mongoose.Schema(
  {
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

    password: {
      type: String,
      select: false, // Hidden by default in queries
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

    // Authentication Strategy
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

    // 🚀 Email Verification Fields (Resend Support)
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      default: null,
      select: false,
    },

    verificationTokenExpiry: {
      type: Date,
      default: null,
      select: false,
    },

    resetPasswordToken: {
      type: String,
      default: null,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
      select: false,
    },

    // Role & Permissions
    role: {
      type: String,
      enum: Object.values(
        ROLES || { USER: "USER", VENDOR: "VENDOR", ADMIN: "ADMIN" },
      ),
      default: "USER",
      index: true,
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
      index: true,
    },

    // 🚀 UploadThing Storage Quota Tracking (1GB base allocation + add-ons)
    storageUsedBytes: {
      type: Number,
      default: 0,
    },

    storageLimitBytes: {
      type: Number,
      default: 1 * 1024 * 1024 * 1024, // 1 GB default base limit
    },

    extraStorageGBAllocated: {
      type: Number,
      default: 0, // Tracks purchased extra storage packs (+2GB / +3GB)
    },

    // Account Status
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

    // Activity
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

UserSchema.virtual("totalStorageLimitBytes").get(function () {
  const base = 1 * 1024 * 1024 * 1024;
  const extra = (this.extraStorageGBAllocated || 0) * 1024 * 1024 * 1024;
  return Math.max(this.storageLimitBytes || base, base + extra);
});

UserSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    delete ret.verificationToken;
    delete ret.verificationTokenExpiry;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
