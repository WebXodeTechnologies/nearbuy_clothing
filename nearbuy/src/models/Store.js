import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema(
  {
    // ==========================================
    // Relationships
    // ==========================================

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Store must belong to an active Vendor profile"],
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

    tagline: {
      type: String,
      default: "",
      trim: true,
    },

    storeSlug: {
      type: String,
      required: [true, "Store slug is required"],
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

    // Facilities & Tags (Sarees, AC, Parking, Trial Room)
    facilities: {
      type: [String],
      default: [],
    },

    // ==========================================
    // Address & Location
    // ==========================================

    address: {
      type: String,
      required: [true, "Physical address is required"],
      trim: true,
    },

    area: {
      type: String,
      default: "Salem Road",
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      default: "Namakkal",
      trim: true,
      index: true,
    },

    state: {
      type: String,
      default: "Tamil Nadu",
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    pincode: {
      type: String,
      default: "637001",
      trim: true,
    },

    // GeoJSON Point for GPS Location Searching
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [78.1674, 11.2189], // Namakkal Default Coords
      },
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
    // Status & Visibility
    // ==========================================

    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Active",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    profileCompleted: {
      type: Boolean,
      default: true,
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
// Auto-Generate Slug Pre-Validate Hook
// ==========================================

StoreSchema.pre("validate", function (next) {
  if (!this.storeSlug || this.storeSlug.trim() === "") {
    const baseName = this.storeName || "store";
    this.storeSlug =
      baseName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Math.floor(Math.random() * 10000);
  }
});
// ==========================================
// Compound Indexes
// ==========================================

StoreSchema.index({ vendorId: 1 });
StoreSchema.index({ city: 1, area: 1 });
StoreSchema.index({ storeSlug: 1 });
StoreSchema.index({ location: "2dsphere" });
StoreSchema.index({ isFeatured: 1, isActive: 1 });

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
