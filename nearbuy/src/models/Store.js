import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema(
  {
    // ==========================================
    // Relationships
    // ==========================================

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    categoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    // ==========================================
    // Store Information
    // ==========================================

    storeName: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
      maxlength: 150,
    },

    storeSlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // Store Branding
    // ==========================================

    logo: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    gallery: {
      type: [String],
      default: [],
    },

    // ==========================================
    // Address
    // ==========================================

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    pincode: {
      type: String,
      default: "",
      trim: true,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    googleMapUrl: {
      type: String,
      default: "",
    },

    // ==========================================
    // Contact Information
    // ==========================================

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    whatsapp: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    website: {
      type: String,
      default: "",
    },

    // ==========================================
    // Social Media
    // ==========================================

    instagram: {
      type: String,
      default: "",
    },

    facebook: {
      type: String,
      default: "",
    },

    youtube: {
      type: String,
      default: "",
    },

    // ==========================================
    // Business Hours
    // ==========================================

    openingTime: {
      type: String,
      default: "10:00 AM",
    },

    closingTime: {
      type: String,
      default: "09:00 PM",
    },

    workingDays: {
      type: [String],
      default: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },

    // ==========================================
    // Visibility
    // ==========================================

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // Analytics
    // ==========================================

    totalViews: {
      type: Number,
      default: 0,
    },

    totalWhatsappClicks: {
      type: Number,
      default: 0,
    },

    totalPhoneClicks: {
      type: Number,
      default: 0,
    },

    totalMapClicks: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // SEO
    // ==========================================

    seoTitle: {
      type: String,
      default: "",
    },

    seoDescription: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Indexes
// ==========================================

StoreSchema.index({ vendorId: 1 });
StoreSchema.index({ city: 1 });
StoreSchema.index({ storeSlug: 1 });
StoreSchema.index({ isFeatured: 1 });
StoreSchema.index({ isActive: 1 });

// ==========================================
// Hide Internal Fields
// ==========================================

StoreSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Store = mongoose.models.Store || mongoose.model("Store", StoreSchema);

export default Store;
